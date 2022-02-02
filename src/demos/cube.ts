// A rotating cube.
// No compute, and vertex are hard coded in the vertex shader.
// Lots of inspiration from
// https://github.com/austinEng/webgpu-samples/blob/main/src/sample/rotatingCube/main.ts

/// <reference types="@webgpu/types" />
import * as types from '../types';
import * as engine from '../engine';
import { mat4, vec3 } from 'gl-matrix';

export const demo = {
    id: "cube",
    caption: "The good old rotating cube.",

    async init(params: types.InitParams) {
        const pipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {},
                            }
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    // https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
                    code: `
                    [[block]] struct Uniforms {
                        modelViewProjectionMatrix : mat4x4<f32>;
                    };
                    [[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

                    struct VSOut {
                        [[builtin(position)]] pos: vec4<f32>;
                        [[location(0)]] coord: vec2<f32>;
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

                    [[stage(vertex)]]
                    fn main([[builtin(vertex_index)]] idx : u32) -> VSOut {
                        let pos = mesh[idx];

                        var out : VSOut;
                        out.pos = uniforms.modelViewProjectionMatrix * vec4<f32>(pos, 1.0);
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
                        [[stage(fragment)]]
                        fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
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

        const bindgroup = params.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: projectionMatrixBuffer,
                        size: 16 * Float32Array.BYTES_PER_ELEMENT,
                    }
                }
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

            // And do the frame rendering.
            const commandEncoder = params.device.createCommandEncoder();
            const passEncoder = commandEncoder.beginRenderPass({
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
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindgroup);
            passEncoder.draw(14, 1, 0, 0);
            passEncoder.endPass();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}