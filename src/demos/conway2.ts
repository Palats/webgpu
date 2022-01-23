// A conway game of life with indirect rendering.

/// <reference types="@webgpu/types" />
import * as types from '../types';
import * as engine from '../engine';

export const demo = {
    id: "conway2",
    caption: "Game of life with special rendering",

    async init(params: types.InitParams) {
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
                        [[group(0), binding(0)]] var cellsSrc : texture_2d<f32>;
                        [[group(0), binding(1)]] var cellsDst : texture_storage_2d<rgba8unorm, write>;
                        [[group(0), binding(2)]] var trailSrc : texture_2d<f32>;
                        [[group(0), binding(3)]] var trailDst : texture_storage_2d<rgba8unorm, write>;

                        fn isOn(x: i32, y: i32) -> i32 {
                            let v = textureLoad(cellsSrc, vec2<i32>(x, y), 0);
                            if (v.r < 0.5) { return 0;}
                            return 1;
                        }

                        [[stage(compute), workgroup_size(8, 8)]]
                        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
                            let x = i32(global_id.x);
                            let y = i32(global_id.y);
                            let pos = vec2<i32>(x, y);

                            // Update cellular automata.
                            let current = isOn(x, y);
                            let neighbors =
                                isOn(x - 1, y - 1)
                                + isOn(x, y - 1)
                                + isOn(x + 1, y - 1)
                                + isOn(x - 1, y)
                                + isOn(x + 1, y)
                                + isOn(x - 1, y + 1)
                                + isOn(x, y + 1)
                                + isOn(x + 1, y + 1);

                            var s = 0.0;
                            if (current != 0 && (neighbors == 2 || neighbors == 3)) {
                                s = 1.0;
                            }
                            if (current == 0 && neighbors == 3) {
                                s = 1.0;
                            }
                            textureStore(cellsDst, pos, vec4<f32>(s, s, s, 1.0));

                            // Update trailing.
                            let trail =
                                textureLoad(trailSrc, vec2<i32>(x - 1, y - 1), 0)
                                + textureLoad(trailSrc, vec2<i32>(x - 1, y), 0)
                                + textureLoad(trailSrc, vec2<i32>(x - 1, y + 1), 0)
                                + textureLoad(trailSrc, vec2<i32>(x, y - 1), 0)
                                + textureLoad(trailSrc, vec2<i32>(x, y), 0)
                                + textureLoad(trailSrc, vec2<i32>(x, y + 1), 0)
                                + textureLoad(trailSrc, vec2<i32>(x + 1, y - 1), 0)
                                + textureLoad(trailSrc, vec2<i32>(x + 1, y), 0)
                                + textureLoad(trailSrc, vec2<i32>(x + 1, y + 1), 0);

                            var v = 1.0;
                            if (s < 1.0) {
                                // Use 10 instead of 9 to guarantee decay, even
                                // if all neighbors are at full power.
                                v = trail.r / 10.0;
                            }
                            textureStore(trailDst, pos, vec4<f32>(v, v, v, 1.0));
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
            vertex: engine.vertexFullScreen(params),
            primitive: {
                topology: 'triangle-list',
            },

            // Just write some color on each pixel.
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    code: `
                        [[group(0), binding(0)]] var tex : texture_2d<f32>;
                        [[group(0), binding(1)]] var smplr : sampler;

                        [[stage(fragment)]]
                        fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
                            return textureSample(tex, smplr, coord);
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

        return async (info: types.FrameInfo) => {
            const commandEncoder = params.device.createCommandEncoder();

            // Frame compute
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.endPass();

            // Frame rendering.
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: params.context.getCurrentTexture().createView(),
                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.endPass();
            params.device.queue.submit([commandEncoder.finish()]);

            isForward = !isForward;
        };
    }
}