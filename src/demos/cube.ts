// A rotating cube.
// No compute, and vertex are hard coded in the vertex shader.
// Lots of inspiration from
// https://github.com/austinEng/webgpu-samples/blob/main/src/sample/rotatingCube/main.ts

/// <reference types="@webgpu/types" />
import * as types from '../types';
import { mat4, vec3 } from 'gl-matrix';

export const demo = {
    id: "cube",
    caption: "The good old rotating cube.",

    async init(params: types.InitParams) {
        // Compute pipeline.
        const computePipeline = params.device.createComputePipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [params.device.createBindGroupLayout({
                    entries: [
                        // Input buffer, from JS
                        {
                            binding: 0,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: { type: "uniform" },
                        },
                        // Output buffer, for render
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
                    code: `
                        struct Input {
                            elapsedMs: f32;
                        };
                        @group(0) @binding(0) var<uniform> inp : Input;

                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(1) var<storage, write> outp : Output;

                        fn perspective() -> mat4x4<f32> {
                            //  mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);
                            // From https://github.com/toji/gl-matrix
                            let fovy = 2.0 * 3.14159 / 5.0;
                            let aspect = 1.275;
                            let near = 1.0;
                            let far = 100.0;

                            let f = 1.0 / tan(fovy / 2.0);
                            let nf = 1.0 / (near - far);

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
                            let c = (inp.elapsedMs / 1000.0) % TAU;
                            let r = vec3<f32>(c, c, c);
                            outp.mvp = perspective() * translate(vec3<f32>(0.0, 0.0, -4.0)) * rotateZ(r.z) * rotateY(r.y) * rotateX(r.x);
                        }
                    `,
                }),
            }
        });

        const inputBuffer = params.device.createBuffer({
            size: 1 * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const outputBuffer = params.device.createBuffer({
            size: 4 * 4 * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
        });

        const computeBindGroup = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: inputBuffer }
            }, {
                binding: 1,
                resource: { buffer: outputBuffer }
            }]
        });

        // Render pipeline
        const renderPipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {},
                            },
                            {
                                binding: 1,
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
                    // https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
                    code: `
                        struct Uniforms {
                            mvp : mat4x4<f32>;
                        };
                        @group(0) @binding(0) var<uniform> uniforms : Uniforms;

                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(1) var<storage> outp : Output;

                        struct VSOut {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec2<f32>;
                        };

                        let pi = 3.14159;

                        // The cube mesh.
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
                        fn main(@builtin(vertex_index) idx : u32) -> VSOut {
                            let pos = mesh[idx];

                            var out : VSOut;
                            //out.pos = uniforms.mvp * vec4<f32>(pos, 1.0);
                            out.pos = outp.mvp * vec4<f32>(pos + vec3<f32>(0.0, 0.0, 0.0), 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (1.0 - pos.y) / 2.0;
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
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec2<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, 0.5, 1.0);
                        }
                    `,
                }),
                targets: [{
                    format: params.renderFormat,
                }],
            },
        });

        const depthTextureView = params.device.createTexture({
            size: [params.renderWidth, params.renderHeight],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        const projectionMatrixBuffer = params.device.createBuffer({
            size: 4 * 4 * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const renderBindGroup = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: projectionMatrixBuffer,
                        size: 16 * Float32Array.BYTES_PER_ELEMENT,
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: outputBuffer,
                        size: 16 * Float32Array.BYTES_PER_ELEMENT,
                    }
                },
            ]
        });

        const aspect = params.renderWidth / params.renderHeight;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

        // Single frame rendering.
        return async (info: types.FrameInfo) => {
            // Calculate projection.
            const viewMatrix = mat4.create();
            mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -4));
            const now = info.elapsedMs / 1000;
            mat4.rotate(
                viewMatrix,
                viewMatrix,
                1,
                vec3.fromValues(Math.sin(now), Math.cos(now), 0)
            );
            const modelViewProjectionMatrix = mat4.create();
            mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

            // Upload the matrix to the GPU.
            params.device.queue.writeBuffer(projectionMatrixBuffer, 0, modelViewProjectionMatrix as Float32Array);

            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            const computeEncoder = commandEncoder.beginComputePass();

            // Send the current paramaters to the GPU.
            const data = new Float32Array(1);
            data[0] = info.elapsedMs;
            params.device.queue.writeBuffer(inputBuffer, 0, data);

            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            computeEncoder.dispatch(1);
            computeEncoder.endPass();

            // Copy compute output to buffer for vertex shader.
            // It seems that a buffer cannot be
            // XXX commandEncoder.copyBufferToBuffer(outputBuffer, 0, projectionMatrixBuffer, 0, 4 * 4 * Float32Array.BYTES_PER_ELEMENT);

            // -- And do the frame rendering.
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
            renderEncoder.draw(14, 1, 0, 0);
            renderEncoder.endPass();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}