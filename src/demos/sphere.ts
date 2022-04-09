// Draw a sphere.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../wg';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as varpanel from '@palats/varpanel';
import * as models from '../models';


export const demo = {
    id: "sphere",
    caption: "A sphere",

    async init(params: demotypes.InitParams) {
        const d = new Demo(params);
        // await d.init(params);
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
})

const depthFormat = "depth24plus";

class Demo {
    params: demotypes.InitParams;
    depthTextureView: GPUTextureView;
    uniformsBuffer: GPUBuffer;
    camera: cameras.ArcBall;
    bundles: GPURenderBundle[] = [];
    renderPipeline: GPURenderPipeline;
    renderBindGroup: GPUBindGroup;

    _model = "sphere"
    get model(): string { return this._model; }
    set model(s: string) {
        this._model = s;
        if (s === "cube") this.setMesh(new models.GPUMesh(this.params, models.cubeMesh()))
        else this.setMesh(new models.GPUMesh(this.params, models.sphereMesh()));
    }

    constructor(params: demotypes.InitParams) {
        this.params = params;
        params.expose(varpanel.newSelect({ obj: this, field: "model", values: ["sphere", "cube"] }));

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
                    @builtin(position) pos: vec4<f32>;
                    @location(0) color: vec4<f32>;
                };

                @stage(vertex)
                fn vertex(inp: ${models.vertexDesc.vertexType()}) -> Vertex {
                    let TAU = 6.283185;
                    let c = (uniforms.elapsedMs / 1000.0) % TAU;
                    let r = vec3<f32>(c, c, c);

                    var out : Vertex;
                    out.pos =
                        uniforms.camera
                        * ${shaderlib.tr.ref("rotateZ")}(r.z)
                        * ${shaderlib.tr.ref("rotateY")}(r.y)
                        * ${shaderlib.tr.ref("rotateX")}(r.z)
                        * vec4<f32>(inp.pos, 1.0);
                    // out.color = inp.color;
                    out.color = vec4<f32>(0.5 * (inp.pos + vec3<f32>(1., 1., 1.)), 1.0);
                    return out;
                }

                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    return vert.color;
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

        // Configuring camera.
        this.camera = new cameras.ArcBall(glmatrix.vec3.fromValues(0, 0, 4));
        params.setCamera(this.camera);

        this.setMesh(new models.GPUMesh(params, models.sphereMesh()));
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
        this.bundles = [renderBundleEncoder.finish()];
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
        renderEncoder.executeBundles(this.bundles);
        renderEncoder.end();
        commandEncoder.popDebugGroup();

        // Submit all the work.
        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}

