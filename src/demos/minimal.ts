// Minimal effect, with only a basic render pass.

/// <reference types="@webgpu/types" />
import * as types from '../types';
import * as engine from '../engine';

export const demo = {
    id: "minimal",
    caption: "Minimal render pass",

    async init(params: types.InitParams) {
        const pipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    // We do not need here a bind group, as we are not binding
                    // anything in this example - keeping it around for
                    // reference.
                    params.device.createBindGroupLayout({
                        entries: [],
                    }),
                ]
            }),
            // Create triangles to cover the screen.
            vertex: engine.vertexFullScreen(params),
            primitive: {
                topology: 'triangle-list',
            },

            // Just write some color on each pixel.
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

        const bindgroup = params.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            // Minimal, nothing to bind.
            entries: []
        });

        // Single frame rendering.
        return async (info: types.FrameInfo) => {
            const commandEncoder = params.device.createCommandEncoder();
            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: params.context.getCurrentTexture().createView(),
                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                }],
            });
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindgroup);
            passEncoder.draw(6, 1, 0, 0);
            passEncoder.endPass();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}