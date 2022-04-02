// Draw a sphere.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../wg';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as varpanel from '../varpanel';
import * as models from '../models';

// Basic parameters provided to all the shaders.
const uniformsDesc = new wg.StructType({
    elapsedMs: { idx: 0, type: wg.F32 },
    deltaMs: { idx: 1, type: wg.F32 },
    renderWidth: { idx: 2, type: wg.F32 },
    renderHeight: { idx: 3, type: wg.F32 },
    rngSeed: { idx: 4, type: wg.F32 },
    camera: { idx: 5, type: wg.Mat4x4F32 },
})

export const demo = {
    id: "sphere",
    caption: "A sphere",

    async init(params: demotypes.InitParams) {
        // Setup controls.
        const ctrls = {
            _model: "sphere",
            get model(): string { return this._model; },
            set model(s: string) { this._model = s; console.log(s); },
        };
        params.expose(varpanel.newSelect({ obj: ctrls, field: "model", values: ["sphere", "cube"] }));

        const uniformsBuffer = params.device.createBuffer({
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

        const depthFormat = "depth24plus";

        const renderPipeline = params.device.createRenderPipeline({
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

        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                },
            ]
        });

        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        // -- Prepare mesh.
        const gpuMesh = new models.GPUMesh(params, models.sphereMesh());

        // Prepare the rendering pipeline as a bundle.
        const bundles: GPURenderBundle[] = [];

        const renderBundleEncoder = params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(renderPipeline);
        renderBundleEncoder.setBindGroup(0, renderBindGroup);
        gpuMesh.draw(renderBundleEncoder);
        bundles.push(renderBundleEncoder.finish());

        // Configuring camera.
        const camera = new cameras.ArcBall(glmatrix.vec3.fromValues(0, 0, 4));
        params.setCamera(camera);

        // -- Single frame rendering.
        return async (info: demotypes.FrameInfo) => {
            const viewproj = glmatrix.mat4.perspective(
                glmatrix.mat4.create(),
                2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
                params.renderWidth / params.renderHeight, // aspect
                1.0, // near
                100.0, // far
            );
            camera.transform(viewproj, info.cameraMvt);
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
                deltaMs: info.deltaMs,
                renderWidth: params.renderWidth,
                renderHeight: params.renderHeight,
                rngSeed: info.rng,
                camera: Array.from(viewproj),
            }));

            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');

            // -- Frame rendering.
            commandEncoder.pushDebugGroup('Render cubes');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: params.context.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                },
            });
            renderEncoder.executeBundles(bundles);
            renderEncoder.end();
            commandEncoder.popDebugGroup();

            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}

