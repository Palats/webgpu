// A conway game of life with indirect rendering.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';

export const demo = {
    id: "conway2",
    caption: "A conway game of life with paletted blurring over time.",

    async init(params: demotypes.InitParams) {
        const computeWidth = params.renderWidth;
        const computeHeight = params.renderHeight;
        const computeTexFormat = "rgba8unorm";
        const computeTexBytes = 4;  // Bytes per pixel in compute.

        // Swapchain for the cellular automata progression.
        const cells1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const cellsView1 = cells1.createView({
            format: computeTexFormat,
        });

        const cells2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const cellsView2 = cells2.createView({
            format: computeTexFormat,
        });

        // Swap chain for the intermediate compute effect on top of the cellular
        // automata.
        const trail1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const trailView1 = trail1.createView({
            format: computeTexFormat,
        });

        const trail2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const trailView2 = trail2.createView({
            format: computeTexFormat,
        });

        // Setup the initial cellular automata.
        const buffer = new ArrayBuffer(computeWidth * computeHeight * computeTexBytes);
        const a = new Uint8Array(buffer);
        for (let y = 0; y < computeHeight; y++) {
            for (let x = 0; x < computeWidth; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[computeTexBytes * (x + y * computeWidth) + 0] = v;
                a[computeTexBytes * (x + y * computeWidth) + 1] = v;
                a[computeTexBytes * (x + y * computeWidth) + 2] = v;
                a[computeTexBytes * (x + y * computeWidth) + 3] = 255;
            }
        }
        await params.device.queue.writeTexture(
            { texture: cells1 },
            buffer,
            { bytesPerRow: computeWidth * computeTexBytes },
            { width: computeWidth, height: computeHeight }
        );

        // Compute pipeline.
        const computePipeline = params.device.createComputePipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [params.device.createBindGroupLayout({
                    entries: [
                        // Input automata texture
                        {
                            binding: 0,
                            visibility: GPUShaderStage.COMPUTE,
                            texture: { multisampled: false },
                        },
                        // Output automata texture
                        {
                            binding: 1,
                            visibility: GPUShaderStage.COMPUTE,
                            storageTexture: {
                                access: 'write-only',
                                format: computeTexFormat,
                            }
                        },
                        // Input trail texture
                        {
                            binding: 2,
                            visibility: GPUShaderStage.COMPUTE,
                            texture: { multisampled: false },
                        },
                        // Output trail texture
                        {
                            binding: 3,
                            visibility: GPUShaderStage.COMPUTE,
                            storageTexture: {
                                access: 'write-only',
                                format: computeTexFormat,
                            }
                        },
                    ]
                })],
            }),

            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    code: `
                        @group(0) @binding(0) var cellsSrc : texture_2d<f32>;
                        @group(0) @binding(1) var cellsDst : texture_storage_2d<rgba8unorm, write>;
                        @group(0) @binding(2) var trailSrc : texture_2d<f32>;
                        @group(0) @binding(3) var trailDst : texture_storage_2d<rgba8unorm, write>;

                        fn cellAt(x: i32, y: i32) -> i32 {
                            let v = textureLoad(cellsSrc, vec2<i32>(x, y), 0);
                            if (v.r < 0.5) { return 0;}
                            return 1;
                        }

                        fn trailAt(x: i32, y: i32) -> vec4<f32> {
                            return textureLoad(trailSrc, vec2<i32>(x, y), 0);
                        }

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let x = i32(global_id.x);
                            let y = i32(global_id.y);
                            let pos = vec2<i32>(x, y);

                            // Prepare trailing.
                            var trail =
                                trailAt(x - 1, y - 1)
                                + trailAt(x, y - 1)
                                + trailAt(x + 1, y - 1)
                                + trailAt(x - 1, y)
                                + trailAt(x + 1, y)
                                + trailAt(x - 1, y + 1)
                                + trailAt(x, y + 1)
                                + trailAt(x + 1, y + 1);
                            trail = trail / 9.5;
                            trail.a = 1.0;

                            // Update cellular automata.
                            let current = cellAt(x, y);
                            let neighbors =
                                cellAt(x - 1, y - 1)
                                + cellAt(x, y - 1)
                                + cellAt(x + 1, y - 1)
                                + cellAt(x - 1, y)
                                + cellAt(x + 1, y)
                                + cellAt(x - 1, y + 1)
                                + cellAt(x, y + 1)
                                + cellAt(x + 1, y + 1);

                            var s = 0.0;
                            if (current != 0 && (neighbors == 2 || neighbors == 3)) {
                                s = 1.0;
                                trail = vec4<f32>(1.0, 1.0, 1.0, 1.0);
                            } else if (current == 0 && neighbors == 3) {
                                s = 1.0;
                                trail = vec4<f32>(1.0, 1.0, 1.0, 1.0);
                            } else {

                            }

                            textureStore(cellsDst, pos, vec4<f32>(s, s, s, 1.0));
                            textureStore(trailDst, pos, trail);
                        }
                    `,
                }),
            }
        });

        // Compute binding group for rendering 1 -> 2
        const computeBindGroup1 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: cellsView1,
            }, {
                binding: 1,
                resource: cellsView2,
            }, {
                binding: 2,
                resource: trailView1,
            }, {
                binding: 3,
                resource: trailView2,
            }]
        });

        // Compute binding group for rendering 2 -> 1
        const computeBindGroup2 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: cellsView2,
            }, {
                binding: 1,
                resource: cellsView1,
            }, {
                binding: 2,
                resource: trailView2,
            }, {
                binding: 3,
                resource: trailView1,
            }]
        });

        // Render pipeline.
        const renderPipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            // Texture from compute
                            {
                                binding: 0,
                                visibility: GPUShaderStage.FRAGMENT,
                                texture: { multisampled: false }
                            },
                            // Sampler for the texture
                            {
                                binding: 1,
                                visibility: GPUShaderStage.FRAGMENT,
                                sampler: { type: "filtering" }
                            },
                        ],
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
                        @group(0) @binding(0) var tex : texture_2d<f32>;
                        @group(0) @binding(1) var smplr : sampler;

                        fn palette(v: f32) -> vec4<f32> {
                            let key = v * 8.0;
                            let c = (v * 256.0) % 32.0;
                            if (key < 1.0) { return vec4<f32>(0.0, 0.0, c * 2.0 / 256.0, 1.0); }
                            if (key < 2.0) { return vec4<f32>(c * 8.0 / 256.0, 0.0, (64.0 - c * 2.0) / 256.0, 1.0); }
                            if (key < 3.0) { return vec4<f32>(1.0, c * 8.0 / 256.0, 0.0, 1.0); }
                            if (key < 4.0) { return vec4<f32>(1.0, 1.0, c * 4.0 / 256.0, 1.0); }
                            if (key < 5.0) { return vec4<f32>(1.0, 1.0, (64.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 6.0) { return vec4<f32>(1.0, 1.0, (128.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 7.0) { return vec4<f32>(1.0, 1.0, (192.0 + c * 4.0) / 256.0, 1.0); }
                            return vec4<f32>(1.0, 1.0, (224.0 + c * 4.0) / 256.0, 1.0);
                        }

                        @stage(fragment)
                        fn main(@location(0) coord: vec2<f32>) -> @location(0) vec4<f32> {
                            return palette(textureSample(tex, smplr, coord).r);
                        }
                    `,
                }),
                targets: [{
                    format: params.renderFormat,
                }],
            },
        });

        const sampler = params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });

        // When rendering 1 -> 2
        const renderBindGroup1 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: trailView2,
                }, {
                    binding: 1,
                    resource: sampler,
                },
            ],
        });

        // When rendering 2 -> 1
        const renderBindGroup2 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: trailView1,
                }, {
                    binding: 1,
                    resource: sampler,
                },
            ],
        });

        // Single frame rendering.
        let isForward = true;

        return async (info: demotypes.FrameInfo) => {
            const commandEncoder = params.device.createCommandEncoder();

            // Frame compute
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.end();

            // Frame rendering.
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: params.context.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.end();
            params.device.queue.submit([commandEncoder.finish()]);

            isForward = !isForward;
        };
    }
}