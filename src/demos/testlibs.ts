// Testing ground for the various helper libraries.

/// <reference types="@webgpu/types" />
import * as types from '../types';

import * as bufferdesc from '../bufferdesc';

const uniformsDesc = new bufferdesc.Descriptor({
    elapsedMs: bufferdesc.Field(bufferdesc.F32, 0),
    renderWidth: bufferdesc.Field(bufferdesc.F32, 1),
    renderHeight: bufferdesc.Field(bufferdesc.F32, 2),
})

export const demo = {
    id: "testlibs",
    caption: "Testing the helper libs",

    async init(params: types.InitParams) {
        const computePipeline = params.device.createComputePipeline({
            label: "Compute pipeline for projection matrix",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                    label: "compute pipeline main layout",
                    entries: [
                        // Input buffer, which will be coming from JS.
                        {
                            binding: 0,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: { type: "uniform" },
                        },
                        // Output buffer, to feed the vertex shader.
                        {
                            binding: 1,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: { type: "storage" },
                        },
                    ]
                })],
            }),

            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    label: "Rendering matrix compute",
                    // Project & rotations from https://github.com/toji/gl-matrix
                    code: `
                        struct Uniforms {
                            elapsedMs: f32;
                            renderWidth: f32;
                            renderHeight: f32;
                        };
                        @group(0) @binding(0) var<uniform> uniforms : Uniforms;

                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(1) var<storage, write> outp : Output;

                        fn perspective() -> mat4x4<f32> {
                            // Hard coded projection parameters - for more flexibility,
                            // we could imagine getting them from the uniforms.
                            let fovy = 2.0 * 3.14159 / 5.0; // Vertical field of view (rads)
                            let near = 1.0;
                            let far = 100.0;

                            let f = 1.0 / tan(fovy / 2.0);
                            let nf = 1.0 / (near - far);

                            let aspect = uniforms.renderWidth / uniforms.renderHeight;

                            return mat4x4<f32>(
                                f / aspect, 0.0, 0.0, 0.0,
                                0.0, f, 0.0, 0.0,
                                0.0, 0.0, (far + near) * nf, -1.0,
                                0.0, 0.0, 2.0 * far * near * nf, 0.0,
                            );
                        }

                        fn translate(tr : vec3<f32>) -> mat4x4<f32> {
                            return mat4x4<f32>(
                                1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                tr.x, tr.y, tr.z, 1.0,
                            );
                        }

                        fn rotateX(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                1.0, 0.0, 0.0, 0.0,
                                0.0, c, s, 0.0,
                                0.0, -s, c, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        fn rotateY(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                c, 0.0, -s, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                s, 0.0, c, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        fn rotateZ(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                c, s, 0.0, 0.0,
                                -s, c, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        @stage(compute) @workgroup_size(1)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let TAU = 6.283185;
                            let c = (uniforms.elapsedMs / 1000.0) % TAU;
                            let r = vec3<f32>(c, c, c);
                            outp.mvp = perspective() * translate(vec3<f32>(0.0, 0.0, -4.0)) * rotateZ(r.z) * rotateY(r.y) * rotateX(r.x);
                        }
                    `,
                }),
            }
        });

        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const computeResult = params.device.createBuffer({
            label: "Compute output for vertex shaders",
            size: bufferdesc.Mat4x4F32.byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
        });

        const computeBindGroup = params.device.createBindGroup({
            label: "Bind group for the projection matrix compute",
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: uniformsBuffer }
            }, {
                binding: 1,
                resource: { buffer: computeResult }
            }]
        });

        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const renderPipeline = params.device.createRenderPipeline({
            label: "Cube rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout for compute data",
                        entries: [
                            // Matrix info coming from compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {
                                    type: 'read-only-storage',
                                },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "cube vertex shader",
                    // https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
                    code: `
                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(0) var<storage> outp : Output;

                        struct Out {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec3<f32>;
                        };

                        // The cube mesh, as triangle strip.
                        let mesh = array<vec3<f32>, 14>(
                            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
                            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
                            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
                            vec3<f32>(-1.f, -1.f, 1.f),     // Front-bottom-right
                            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
                            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
                            vec3<f32>(-1.f, 1.f, -1.f),     // Back-top-right
                            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
                            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
                            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
                            vec3<f32>(1.f, -1.f, -1.f),   // Back-bottom-left
                            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
                            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
                            vec3<f32>(-1.f, 1.f, -1.f),      // Back-top-right
                        );

                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> Out {
                            let pos = mesh[idx];
                            var out : Out;
                            out.pos = outp.mvp * vec4<f32>(pos + vec3<f32>(0.0, 0.0, 0.0), 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (pos.y + 1.0) / 2.0;
                            out.coord.z = (pos.z + 1.0) / 2.0;
                            return out;
                        }
                    `,
                }),
            },
            primitive: {
                topology: 'triangle-strip',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "trivial fragment shader",
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec3<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, coord.z, 1.0);
                        }
                    `,
                }),
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
                    resource: {
                        buffer: computeResult,
                    }
                },
            ]
        });

        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        // -- Single frame rendering.
        return async (info: types.FrameInfo) => {
            // Fill up the uniforms to feed the compute shaders.
            // Rotation of the cube is just a function of current time,
            // calculated in the compute shader.
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
                renderWidth: params.renderWidth,
                renderHeight: params.renderHeight,
            }));

            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');

            commandEncoder.pushDebugGroup('Compute projection');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            // The compute has only a single matrix to compute. More typical compute shaders
            // would dispatch on NxM elements.
            computeEncoder.dispatch(1);
            computeEncoder.endPass();
            commandEncoder.popDebugGroup();

            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: params.context.getCurrentTexture().createView(),
                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthLoadValue: 1.0,
                    depthStoreOp: 'store',
                    stencilLoadValue: 0,
                    stencilStoreOp: 'store',
                },
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, renderBindGroup);
            // Cube mesh as a triangle-strip uses 14 vertices.
            renderEncoder.draw(14, 1, 0, 0);
            renderEncoder.endPass();
            commandEncoder.popDebugGroup();

            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}