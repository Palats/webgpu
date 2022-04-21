// Load gltf models.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../../src';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as models from '../models';


export const demo = {
    id: "viewer",
    caption: "A gltf viewer",

    async init(params: demotypes.InitParams) {
        const d = new Demo(params);
        return (f: demotypes.FrameInfo) => d.draw(f);
    }
}

// Basic parameters provided to all the shaders.
const uniformsDesc = new wg.StructType({
    elapsedMs: { idx: 0, type: wg.F32 },
    deltaMs: { idx: 1, type: wg.F32 },
    renderWidth: { idx: 2, type: wg.F32 },
    renderHeight: { idx: 3, type: wg.F32 },
    rngSeed: { idx: 4, type: wg.F32 },
    camera: { idx: 5, type: wg.Mat4x4F32 },
    modelTransform: { idx: 6, type: wg.Mat4x4F32 },
})

const depthFormat = "depth24plus";

function loadToGPU(u: string): (params: demotypes.InitParams) => Promise<models.GPUMesh> {
    return async params => {
        const mesh = await models.loadGLTF(u);
        return new models.GPUMesh(params, mesh);
    }
}

const allModels: { [k: string]: (params: demotypes.InitParams) => Promise<models.GPUMesh> } = {
    "sphere/builtin": async params => new models.GPUMesh(params, models.sphereMesh()),
    "cube/builtin": async params => new models.GPUMesh(params, models.cubeMesh()),
    "cube/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf'),
    "triangle/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Triangle/glTF/Triangle.gltf'),
    "avocado/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf'),
    "suzanne/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Suzanne/glTF/Suzanne.gltf'),
    "duck/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf'),
    "shaderball/glb": loadToGPU('https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/material-balls/material_ball_v2.glb'),
}

class Demo {
    params: demotypes.InitParams;
    depthTextureView: GPUTextureView;
    uniformsBuffer: GPUBuffer;
    camera: cameras.ArcBall;
    modelBundle?: GPURenderBundle;
    renderPipeline: GPURenderPipeline;
    renderBindGroup: GPUBindGroup;
    showBasis = true;
    basisBundle: GPURenderBundle;
    modelTransform: glmatrix.mat4;

    _model = "shaderball/glb"
    get model(): string { return this._model; }
    set model(s: string) {
        this._model = s;
        allModels[s](this.params).then(mesh => this.setMesh(mesh));
    }

    constructor(params: demotypes.InitParams) {
        this.params = params;
        this.modelTransform = glmatrix.mat4.create();
        params.gui.add(this, 'model', Object.keys(allModels));
        params.gui.add(this, 'showBasis');

        this.uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // -- Render pipeline.
        const shader = params.device.createShaderModule(new wg.WGSLModule({
            label: "vertex shader",
            code: wg.wgsl`
                @group(0) @binding(0) var<uniform> uniforms: ${uniformsDesc.typename()};

                struct Vertex {
                    @builtin(position) pos: vec4<f32>,
                    @location(0) color: vec4<f32>,
                    @location(1) world: vec4<f32>,
                    @location(2) normal: vec4<f32>,
                };

                @stage(vertex)
                fn vertex(inp: ${models.vertexDesc.vertexType()}) -> Vertex {
                    let TAU = 6.283185;
                    let c = (uniforms.elapsedMs / 1000.0) % TAU;
                    let r = vec3<f32>(c, c, c);

                    let tr = ${shaderlib.tr.ref("rotateZ")}(r.z)
                        * ${shaderlib.tr.ref("rotateY")}(r.y)
                        * ${shaderlib.tr.ref("rotateX")}(r.z)
                        * uniforms.modelTransform;

                    var out : Vertex;
                    out.pos = uniforms.camera * tr * vec4<f32>(inp.pos, 1.0);
                    out.world = tr * vec4<f32>(inp.pos, 1.0);
                    out.normal = normalize(tr * vec4<f32>(inp.normal, 0.0));

                    let modelPos = uniforms.modelTransform * vec4<f32>(inp.pos, 1.0);
                    out.color = vec4<f32>(0.5 * (modelPos.xyz + vec3<f32>(1., 1., 1.)), 1.0);
                    return out;
                }

                let light = vec4<f32>(4.0, 4.0, 10.0, 1.0);

                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    let ray = normalize(light - vert.world);
                    let lum = clamp(dot(ray, vert.normal), .0, 1.0);
                    return lum * vert.color;
                }
            `,
        }).toDesc());

        this.renderPipeline = params.device.createRenderPipeline({
            label: "Rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout",
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                                buffer: { type: 'uniform' },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'vertex',
                module: shader,
                buffers: [models.vertexDesc.vertexBufferLayout()],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: depthFormat,
            },
            fragment: {
                entryPoint: 'fragment',
                module: shader,
                targets: [{
                    format: params.renderFormat,
                }],
            },
        });

        this.renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformsBuffer }
                },
            ]
        });

        this.depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        // Orthonormals.
        this.basisBundle = shaderlib.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: shaderlib.ortholines,
            mod: uniformsDesc,
            buffer: this.uniformsBuffer,
        });

        // Configuring camera.
        this.camera = new cameras.ArcBall(glmatrix.vec3.fromValues(0, 0, 4));
        params.setCamera(this.camera);

        // Force loading the initial model.
        this.model = this.model;
    }

    setMesh(gpuMesh: models.GPUMesh) {
        const renderBundleEncoder = this.params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [this.params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(this.renderPipeline);
        renderBundleEncoder.setBindGroup(0, this.renderBindGroup);
        gpuMesh.draw(renderBundleEncoder);
        this.modelBundle = renderBundleEncoder.finish();

        if (gpuMesh.min && gpuMesh.max) {
            const diff = glmatrix.vec3.sub(glmatrix.vec3.create(), gpuMesh.max, gpuMesh.min);
            const maxDiff = Math.max(diff[0], diff[1], diff[2]);
            // Make it of size 2 - i.e., fitting it in a box from -1 to +1, as
            // it is rotating around the origin.
            const scale = 2 / maxDiff;
            const scaleVec = glmatrix.vec3.fromValues(scale, scale, scale);

            const tr = glmatrix.vec3.clone(gpuMesh.min);
            glmatrix.vec3.scaleAndAdd(tr, tr, diff, 0.5);
            glmatrix.vec3.scale(tr, tr, -1);

            glmatrix.mat4.fromScaling(this.modelTransform, scaleVec);
            glmatrix.mat4.translate(this.modelTransform, this.modelTransform, tr);
        } else {
            glmatrix.mat4.identity(this.modelTransform);
        }
    }

    // -- Single frame rendering.
    async draw(info: demotypes.FrameInfo) {
        const viewproj = glmatrix.mat4.perspective(
            glmatrix.mat4.create(),
            2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
            this.params.renderWidth / this.params.renderHeight, // aspect
            1.0, // near
            100.0, // far
        );
        this.camera.transform(viewproj, info.cameraMvt);

        this.params.device.queue.writeBuffer(this.uniformsBuffer, 0, uniformsDesc.createArray({
            elapsedMs: info.elapsedMs,
            deltaMs: info.deltaMs,
            renderWidth: this.params.renderWidth,
            renderHeight: this.params.renderHeight,
            rngSeed: info.rng,
            camera: Array.from(viewproj),
            modelTransform: Array.from(this.modelTransform),
        }));

        const commandEncoder = this.params.device.createCommandEncoder();
        commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');

        // -- Frame rendering.
        commandEncoder.pushDebugGroup('Render cubes');
        const renderEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.params.context.getCurrentTexture().createView(),
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }],
            depthStencilAttachment: {
                view: this.depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });

        const bundles = [];
        if (this.modelBundle) { bundles.push(this.modelBundle); }
        if (this.showBasis) { bundles.push(this.basisBundle); }
        renderEncoder.executeBundles(bundles);
        renderEncoder.end();
        commandEncoder.popDebugGroup();

        // Submit all the work.
        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}

