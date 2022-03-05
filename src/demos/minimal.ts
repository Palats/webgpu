// Minimal effect, with only a basic render pass.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';

export const demo = {
    id: "minimal",
    caption: "Minimal setup without compute.",

    async init(params: demotypes.InitParams) {
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
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    label: "full screen vertices",
                    code: `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec2<f32>;
                        };
                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> VSOut {
                            var data = array<vec2<f32>, 6>(
                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(1.0, -1.0),
                                vec2<f32>(1.0, 1.0),

                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(-1.0, 1.0),
                                vec2<f32>(1.0, 1.0),
                            );

                            let pos = data[idx];

                            var out : VSOut;
                            out.pos = vec4<f32>(pos, 0.0, 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (1.0 - pos.y) / 2.0;

                            return out;
                        }
                    `,
                }),
            },

            primitive: {
                topology: 'triangle-list',
            },

            // Just write some color on each pixel.
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

        const bindgroup = params.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            // Minimal, nothing to bind.
            entries: []
        });

        // Single frame rendering.
        return async (info: demotypes.FrameInfo) => {
            const commandEncoder = params.device.createCommandEncoder();
            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: params.context.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
            });
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindgroup);
            passEncoder.draw(6, 1, 0, 0);
            passEncoder.end();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}