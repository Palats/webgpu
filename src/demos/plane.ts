// An infinite plane.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../wg';
import * as shaderlib from '../shaderlib';
import * as controls from '../controls';
import * as cameras from '../cameras';

// Basic parameters provided to all the shaders.
const uniformsDesc = new wg.StructType({
    elapsedMs: { idx: 0, type: wg.F32 },
    deltaMs: { idx: 1, type: wg.F32 },
    renderWidth: { idx: 2, type: wg.F32 },
    renderHeight: { idx: 3, type: wg.F32 },
    rngSeed: { idx: 4, type: wg.F32 },
    camera: { idx: 5, type: wg.Mat4x4F32 },
})

// Parameters from Javascript to the computer shader
// for each instance.

export const demo = {
    id: "plane",
    caption: "An infinite plane",

    async init(params: demotypes.InitParams) {
        // Setup controls.
        const ctrls = {
            showBoundaries: true,
            showBasis: false,
        };
        params.expose(controls.exposeBool(ctrls, 'showBoundaries'));
        params.expose(controls.exposeBool(ctrls, 'showBasis'));

        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const depthFormat = "depth24plus";

        const shader = params.device.createShaderModule(new wg.WGSLModule({
            label: "vertex shader",
            code: wg.wgsl`
                @group(0) @binding(0) var<uniform> uniforms: ${uniformsDesc.typename()};

                struct Vertex {
                    @builtin(position) pos: vec4<f32>;
                    @location(0) coord: vec4<f32>;
                };

                @stage(vertex)
                fn vertex(@builtin(vertex_index) idx : u32, @builtin(instance_index) instance: u32) -> Vertex {
                    let pos = ${shaderlib.cubeMeshStrip.ref("mesh")}[idx];

                    var out : Vertex;
                    out.pos = uniforms.camera * vec4<f32>(pos , 1.0);
                    out.coord.x = (pos.x + 1.0) / 2.0;
                    out.coord.y = (pos.y + 1.0) / 2.0;
                    out.coord.z = (pos.z + 1.0) / 2.0;
                    out.coord.w = 1.0;
                    return out;
                }

                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    return vert.coord;
                }
            `,
        }).toDesc());

        const renderPipeline = params.device.createRenderPipeline({
            label: "rendering pipeline",
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
            },
            primitive: {
                topology: 'triangle-strip',
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

        // Prepare the rendering pipeline as a bundle.
        const renderBundleEncoder = params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(renderPipeline);
        renderBundleEncoder.setBindGroup(0, renderBindGroup);
        // Cube mesh as a triangle-strip uses 14 vertices.
        renderBundleEncoder.draw(14, 1, 0, 0);
        const renderBundle = renderBundleEncoder.finish();

        // Orthonormals.
        const basisBundle = shaderlib.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: shaderlib.ortholines,
            mod: uniformsDesc,
            buffer: uniformsBuffer,
        });
        // Cube surrounding the scene.
        const boundariesBundle = shaderlib.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: shaderlib.cubelines(1.0),
            depthCompare: 'less',
            mod: uniformsDesc,
            buffer: uniformsBuffer,
        });

        // Configuring camera.
        const camera = new cameras.FirstPerson(glmatrix.vec3.fromValues(0, 0, -5));
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
            camera.transform(viewproj, info.cameraStart, info.cameraCurrent);
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

            commandEncoder.pushDebugGroup('Render');
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
            const bundles = [renderBundle];
            if (ctrls.showBoundaries) { bundles.push(boundariesBundle); }
            if (ctrls.showBasis) { bundles.push(basisBundle); }
            renderEncoder.executeBundles(bundles);
            renderEncoder.end();
            commandEncoder.popDebugGroup();

            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}