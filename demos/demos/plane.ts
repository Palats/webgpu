// An infinite plane.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../../src';
import * as shaderlib from '../shaderlib';
import * as varpanel from '@palats/varpanel';
import * as cameras from '../cameras';

// Basic parameters provided to all the shaders.
const uniformsDesc = new wg.StructType({
    elapsedMs: { idx: 0, type: wg.F32 },
    deltaMs: { idx: 1, type: wg.F32 },
    renderWidth: { idx: 2, type: wg.F32 },
    renderHeight: { idx: 3, type: wg.F32 },
    rngSeed: { idx: 4, type: wg.F32 },
    camera: { idx: 5, type: wg.Mat4x4F32 },
    revCamera: { idx: 6, type: wg.Mat4x4F32 },
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
            showBasis: true,
        };
        params.expose(varpanel.newBool({ obj: ctrls, field: 'showBoundaries' }));
        params.expose(varpanel.newBool({ obj: ctrls, field: 'showBasis' }));

        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const depthFormat = "depth24plus";

        // Inspiration from https://stackoverflow.com/questions/12965161/rendering-infinitely-large-plane
        // And http://asliceofrendering.com/scene%20helper/2020/01/05/InfiniteGrid/
        const shader = params.device.createShaderModule(new wg.WGSLModule({
            label: "vertex shader",
            code: wg.wgsl`
                @group(0) @binding(0) var<uniform> uniforms: ${uniformsDesc.typename()};

                // An XY plane described using 4 triangles.
                let mesh = array<vec4<f32>, 12>(
                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(1.f, 0.f, 0.f, 0.f),
                    vec4<f32>(0.f, 1.f, 0.f, 0.f),

                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(0.f, 1.f, 0.f, 0.f),
                    vec4<f32>(-1.f, 0.f, 0.f, 0.f),

                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(-1.f, 0.f, 0.f, 0.f),
                    vec4<f32>(0.f, -1.f, 0.f, 0.f),

                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(0.f, -1.f, 0.f, 0.f),
                    vec4<f32>(1.f, 0.f, 0.f, 0.f),
                );

                struct VertexOut {
                    @builtin(position) pos: vec4<f32>,
                    @location(0) coord: vec4<f32>,
                };

                @stage(vertex)
                fn vertex(@builtin(vertex_index) idx : u32, @builtin(instance_index) instance: u32) -> VertexOut {
                    let pos = mesh[idx];

                    var out : VertexOut;
                    out.pos = uniforms.camera * pos;
                    out.coord = pos;
                    return out;
                }

                let lineWidth = 0.02;
                let gridStep = 1.0;

                struct FragOut {
                    @location(0) color: vec4<f32>,
                }

                @stage(fragment)
                fn fragment(vert: VertexOut) -> FragOut {
                    var out : FragOut;

                    let world = vert.coord / vert.coord.w;
                    let coord = world / gridStep;
                    let d = fwidth(coord);
                    let grid = abs(fract(coord - 0.5) - 0.5) / d;
                    let line = min(grid.x, grid.y);
                    let presence = 1.0 - min(line, 1.0);
                    // Depth is [0..1].
                    let depth = vert.pos.z;

                    out.color = vec4<f32>(.9, .9, .9, presence * (1.0 - depth));
                    return out;
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
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                // The grid should not prevent other things to be displayed, so
                // disable depth writing.
                depthWriteEnabled: false,
                depthCompare: 'less',
                format: depthFormat,
            },
            fragment: {
                entryPoint: 'fragment',
                module: shader,
                targets: [{
                    format: params.renderFormat,
                    blend: {
                        // Do alpha blending of the color.
                        color: {
                            operation: "add",
                            srcFactor: "src-alpha",
                            dstFactor: "one-minus-src-alpha"
                        },
                        // State of alpha on the target always ends up at 1.
                        alpha: {
                            operation: "add",
                            srcFactor: "zero",
                            dstFactor: "one",
                        },
                    }
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
        renderBundleEncoder.draw(12, 1, 0, 0);
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
        const camera = new cameras.ArcBall(glmatrix.vec3.fromValues(0, 0, 5));
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
                revCamera: Array.from(glmatrix.mat4.invert(glmatrix.mat4.create(), viewproj)),
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