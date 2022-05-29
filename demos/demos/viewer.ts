// Load gltf models.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../../src';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as models from '../models';

// ---- Demo parameter

export const demo = {
    id: "viewer",
    caption: "A gltf viewer",

    async init(params: demotypes.InitParams) {
        const d = new Demo(params);
        return (f: demotypes.FrameInfo) => d.draw(f);
    }
}


// ---- Rendering setup & UI

const depthFormat = "depth24plus";

function loadToGPU(u: string): (params: demotypes.InitParams) => Promise<models.GPUMesh[]> {
    return async params => {
        const meshes = await models.loadGLTF(u);
        return Promise.all(meshes.map(m => models.buildGPUMesh(params, m)));
    }
}

const allModels: { [k: string]: (params: demotypes.InitParams) => Promise<models.GPUMesh[]> } = {
    "sphere/builtin": async params => Promise.all([models.buildGPUMesh(params, models.sphereMesh())]),
    "cube/builtin": async params => Promise.all([models.buildGPUMesh(params, models.cubeMesh())]),
    "cube/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf'),
    "triangle/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Triangle/glTF/Triangle.gltf'),
    "avocado/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf'),
    "suzanne/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Suzanne/glTF/Suzanne.gltf'),
    "duck/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf'),
    "boxvertexcolors/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxVertexColors/glTF/BoxVertexColors.gltf'),
    "shaderball/glb": loadToGPU('https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/material-balls/material_ball_v2.glb'),
}

interface GPUMeshInfo {
    bundle: GPURenderBundle;
}

class Demo {
    params: demotypes.InitParams;
    demoBuffer: shaderlib.DemoBuffer;
    modelRenderer: ModelRenderer;

    camera: cameras.ArcBall;
    showBasis = true;
    basisBundle: GPURenderBundle;
    depthTextureView: GPUTextureView;

    _model = "duck/gltf"
    get model(): string { return this._model; }
    set model(s: string) {
        this._model = s;
        allModels[s](this.params).then(meshes => this.modelRenderer.setMeshes(meshes));
    }

    constructor(params: demotypes.InitParams) {
        this.params = params;
        this.demoBuffer = new shaderlib.DemoBuffer(params);
        this.modelRenderer = new ModelRenderer(params, this.demoBuffer);

        params.gui.add(this, 'model', Object.keys(allModels));
        const lightFolder = params.gui.addFolder("light");
        lightFolder.add(this.modelRenderer, 'useLight').name("use");
        lightFolder.add(this.modelRenderer, 'lightX', -20, 20).name("x");
        lightFolder.add(this.modelRenderer, 'lightY', -20, 20).name("y");
        lightFolder.add(this.modelRenderer, 'lightZ', -20, 20).name("z");
        params.gui.add(this, 'showBasis');
        params.gui.add(this.modelRenderer, 'debugCoords');

        // Setup basic render.
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
            demoBuffer: this.demoBuffer,
        });

        // Configuring camera.
        this.camera = new cameras.ArcBall(glmatrix.vec3.fromValues(0, 0, 4));
        params.setCamera(this.camera);

        // Force loading the initial model.
        this.model = this.model;
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

        this.demoBuffer.refresh(info, viewproj);

        const commandEncoder = this.params.device.createCommandEncoder();
        commandEncoder.pushDebugGroup('Frame time ${info.elapsedMs}');
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
        this.modelRenderer.draw(info, renderEncoder);
        if (this.showBasis) { renderEncoder.executeBundles([this.basisBundle]); }
        renderEncoder.end();
        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}

// ---- Model renderer

const uniformsDesc = new wg.StructType({
    modelTransform: { idx: 0, type: wg.Mat4x4F32 },
    useLight: { idx: 1, type: wg.I32 },
    light: { idx: 2, type: wg.Vec4f32 },
    debugCoords: { idx: 3, type: wg.I32 },
});

const bgLayout = new wg.layout.BindGroup({
    label: "all data",
    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
    entries: {
        demo: { buffer: { wgtype: shaderlib.demoDesc } },
        uniforms: { buffer: { wgtype: uniformsDesc } },
        material: { buffer: { wgtype: models.materialDesc } },
        smplr: {
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {},
        },
        tex: {
            visibility: GPUShaderStage.FRAGMENT,
            texture: {},
        },
    },
});

const pipelineLayout = new wg.layout.Pipeline({
    label: "render",
    entries: {
        all: { bindGroup: bgLayout },
    }
})

class ModelRenderer {
    useLight = true;
    lightX = 4.0;
    lightY = 4.0;
    lightZ = 10.0;
    debugCoords = false;

    private params: demotypes.InitParams;
    private demoBuffer: shaderlib.DemoBuffer;
    private uniformsBuffer: GPUBuffer;
    private renderPipeline: GPURenderPipeline;
    private modelTransform: glmatrix.mat4;
    private bundles: GPURenderBundle[] = [];

    constructor(params: demotypes.InitParams, demoBuffer: shaderlib.DemoBuffer) {
        this.params = params;
        this.demoBuffer = demoBuffer;
        this.modelTransform = glmatrix.mat4.create();

        this.uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // -- Render pipeline.
        const refs = pipelineLayout.wgsl();
        const shader = params.device.createShaderModule(new wg.WGSLModule({
            label: "vertex shader",
            code: wg.wgsl`
                struct Vertex {
                    @builtin(position) pos: vec4<f32>,
                    @location(0) color: vec4<f32>,
                    @location(1) world: vec4<f32>,
                    @location(2) normal: vec4<f32>,
                    @location(3) texcoord: vec2<f32>,
                };

                @stage(vertex)
                fn vertex(inp: ${models.vertexDesc.vertexType()}) -> Vertex {
                    let TAU = 6.283185;
                    let c = (${refs.all.demo}.elapsedMs / 1000.0) % TAU;
                    let r = vec3<f32>(c, c, c);

                    let tr = ${shaderlib.tr.ref("rotateZ")}(r.z)
                        * ${shaderlib.tr.ref("rotateY")}(r.y)
                        * ${shaderlib.tr.ref("rotateX")}(r.z)
                        * ${refs.all.uniforms}.modelTransform;

                    var out : Vertex;
                    out.pos = ${refs.all.demo}.camera * tr * vec4<f32>(inp.pos, 1.0);
                    out.world = tr * vec4<f32>(inp.pos, 1.0);
                    out.normal = normalize(tr * vec4<f32>(inp.normal, 0.0));
                    out.texcoord = inp.texcoord;

                    let modelPos = ${refs.all.uniforms}.modelTransform * vec4<f32>(inp.pos, 1.0);
                    if (${refs.all.uniforms}.debugCoords == 0) {
                        if (${refs.all.material}.hasColor == 0) {
                            // No provided color? Use a flashy green.
                            out.color = vec4<f32>(0., 1., 0., 1.);
                        } else {
                            out.color = inp.color;
                        }
                    } else {
                        out.color = vec4<f32>(0.5 * (modelPos.xyz + vec3<f32>(1., 1., 1.)), 1.0);
                    }
                    return out;
                }


                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    var frag = vert.color;
                    if (${refs.all.material}.hasTexture != 0 && ${refs.all.uniforms}.debugCoords == 0) {
                        frag = textureSample(${refs.all.tex}, ${refs.all.smplr}, vert.texcoord);
                    }

                    if (${refs.all.uniforms}.useLight == 0 || ${refs.all.material}.hasNormals == 0) {
                        return frag;
                    }
                    let ray = normalize(${refs.all.uniforms}.light - vert.world);
                    let lum = clamp(dot(ray, vert.normal), .0, 1.0);
                    return lum * frag;
                }
            `,
        }).toDesc());

        this.renderPipeline = params.device.createRenderPipeline({
            label: "Rendering pipeline",
            layout: pipelineLayout.layout(params.device),
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
    }

    async setMeshes(gpuMeshes: models.GPUMesh[]) {
        const waitOn: Promise<GPUMeshInfo>[] = [];

        let meshMin: glmatrix.vec3 | undefined;
        let meshMax: glmatrix.vec3 | undefined;
        for (const gpuMesh of gpuMeshes) {
            waitOn.push(this.buildMesh(gpuMesh));

            if (gpuMesh.min) {
                if (!meshMin) {
                    meshMin = glmatrix.vec3.clone(gpuMesh.min);
                } else {
                    glmatrix.vec3.min(meshMin, meshMin, gpuMesh.min);
                }
            }
            if (gpuMesh.max) {
                if (!meshMax) {
                    meshMax = glmatrix.vec3.clone(gpuMesh.max);
                } else {
                    glmatrix.vec3.max(meshMax, meshMax, gpuMesh.max);
                }
            }
        }

        if (meshMin && meshMax) {
            const diff = glmatrix.vec3.sub(glmatrix.vec3.create(), meshMax, meshMin);
            const maxDiff = Math.max(diff[0], diff[1], diff[2]);
            // Make it of size 2 - i.e., fitting it in a box from -1 to +1, as
            // it is rotating around the origin.
            const scale = 2 / maxDiff;
            const scaleVec = glmatrix.vec3.fromValues(scale, scale, scale);

            const tr = glmatrix.vec3.clone(meshMin);
            glmatrix.vec3.scaleAndAdd(tr, tr, diff, 0.5);
            glmatrix.vec3.scale(tr, tr, -1);


            glmatrix.mat4.fromScaling(this.modelTransform, scaleVec);
            glmatrix.mat4.translate(this.modelTransform, this.modelTransform, tr);
        } else {
            glmatrix.mat4.identity(this.modelTransform);
        }

        this.bundles = [];
        for (const mesh of await Promise.all(waitOn)) {
            this.bundles.push(mesh.bundle);
        }
    }

    private async buildMesh(gpuMesh: models.GPUMesh): Promise<GPUMeshInfo> {
        const sampler = this.params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });

        const renderBundleEncoder = this.params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [this.params.renderFormat],
            depthStencilFormat: depthFormat,
        });

        renderBundleEncoder.setPipeline(this.renderPipeline);
        pipelineLayout.setBindGroups(renderBundleEncoder, {
            all: bgLayout.Create(this.params.device, {
                demo: this.demoBuffer.buffer,
                uniforms: this.uniformsBuffer,
                material: gpuMesh.materialBuffer,
                smplr: sampler,
                tex: gpuMesh.textureView!,
            }),
        });
        models.drawGPUMesh(gpuMesh, renderBundleEncoder);
        const bundle = renderBundleEncoder.finish();

        return {
            bundle,
        }
    }

    async draw(info: demotypes.FrameInfo, renderEncoder: GPURenderPassEncoder) {
        renderEncoder.pushDebugGroup("render model");
        this.params.device.queue.writeBuffer(this.uniformsBuffer, 0, uniformsDesc.createArray({
            modelTransform: Array.from(this.modelTransform),
            useLight: this.useLight ? 1 : 0,
            light: [this.lightX, this.lightY, this.lightZ, 1.0],
            debugCoords: this.debugCoords ? 1 : 0,
        }));
        renderEncoder.executeBundles(this.bundles);
        renderEncoder.popDebugGroup();
    }
}