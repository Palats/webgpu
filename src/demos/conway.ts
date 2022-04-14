// A basic game of life.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';

import * as wg from '../wg';

const uniformsDesc = new wg.StructType({
    computeWidth: { type: wg.U32, idx: 0 },
    computeHeight: { type: wg.U32, idx: 1 },
})

const computeTexFormat: GPUTextureFormat = "rgba8unorm";

export const demo = {
    id: "conway",
    caption: "A Conway game of life.",

    async init(params: demotypes.InitParams) {
        const computeWidth = params.renderWidth;
        const computeHeight = params.renderHeight;

        // Creates the various buffers & textures.
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Textures, used for compute part swapchain.
        const tex1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const texView1 = tex1.createView({
            format: computeTexFormat,
        });

        const tex2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const texView2 = tex2.createView({
            format: computeTexFormat,
        });

        // Need a sampler to pick from the texture and write to the screen.
        const sampler = params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });

        // Setup the initial texture1, with some initial data.
        const buffer = new ArrayBuffer(computeWidth * computeHeight * 4);
        const a = new Uint8Array(buffer);
        for (let y = 0; y < computeHeight; y++) {
            for (let x = 0; x < computeWidth; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[4 * (x + y * computeWidth) + 0] = v;
                a[4 * (x + y * computeWidth) + 1] = v;
                a[4 * (x + y * computeWidth) + 2] = v;
                a[4 * (x + y * computeWidth) + 3] = 255;
            }
        }
        await params.device.queue.writeTexture(
            { texture: tex1 },
            buffer,
            { bytesPerRow: computeWidth * 4 },
            { width: computeWidth, height: computeHeight }
        );

        // Compute pipeline.
        const computePipeline = params.device.createComputePipeline({
            label: "Effect pipeline",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                    label: "compute pipeline main layout",
                    entries: [
                        // Uniforms.
                        {
                            binding: 0,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: { type: "uniform" },
                        },
                        // Input compute buffer as texture
                        {
                            binding: 1,
                            visibility: GPUShaderStage.COMPUTE,
                            texture: { multisampled: false }
                        },
                        // Output compute buffer as texture
                        {
                            binding: 2,
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
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "Game of life step",
                    code: wg.wgsl`
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var srcTexture : texture_2d<f32>;
                        @group(0) @binding(2) var dstTexture : texture_storage_2d<${computeTexFormat}, write>;

                        fn isOn(x: i32, y: i32) -> i32 {
                            let v = textureLoad(srcTexture, vec2<i32>(x, y), 0);
                            if (v.r < 0.5) { return 0;}
                            return 1;
                        }

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            // Guard against out-of-bounds work group sizes
                            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                                return;
                            }

                            let x = i32(global_id.x);
                            let y = i32(global_id.y);
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
                            textureStore(dstTexture, vec2<i32>(x, y), vec4<f32>(s, s, s, 1.0));
                        }

                    `,
                }).toDesc()),
            }
        });

        // Create 2 bind group for the compute pipeline, depending on what is
        // the current src & dst texture.
        const computeBindGroup1 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: uniformsBuffer }
            }, {
                binding: 1,
                resource: texView1,
            }, {
                binding: 2,
                resource: texView2,
            }]
        });

        const computeBindGroup2 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: uniformsBuffer }
            }, {
                binding: 1,
                resource: texView2,
            }, {
                binding: 2,
                resource: texView1,
            }]
        });

        // Create rendering pipeline.
        const renderPipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            // Current compute texture updated by the compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.FRAGMENT,
                                texture: { multisampled: false },
                            },
                            // Sampler for  the texture.
                            {
                                binding: 1,
                                visibility: GPUShaderStage.FRAGMENT,
                                sampler: { type: "filtering" },
                            },
                        ]
                    },
                    ),
                ]
            }),

            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "full screen vertices",
                    code: wg.wgsl`
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
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
                }).toDesc()),
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "simple copy from compute",
                    code: wg.wgsl`
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };

                        @group(0) @binding(0) var computeTexture : texture_2d<f32>;
                        @group(0) @binding(1) var dstSampler : sampler;

                        @stage(fragment)
                        fn main(inp: VSOut) -> @location(0) vec4<f32> {
                            return textureSample(computeTexture, dstSampler, inp.coord);
                        }
                    `,
                }).toDesc()),
                targets: [{
                    format: params.renderFormat,
                }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        const renderBindGroup1 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: texView2,
            }, {
                binding: 1,
                resource: sampler,
            }]
        });
        const renderBindGroup2 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: texView1,
            }, {
                binding: 1,
                resource: sampler,
            }]
        });

        let isForward = true;

        // -- Single frame rendering.
        return async (info: demotypes.FrameInfo) => {
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                computeWidth: computeWidth,
                computeHeight: computeHeight,
            }));

            // -- Do compute pass, where the actual effect is.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup(`Time ${info.elapsedMs}`);

            commandEncoder.pushDebugGroup('Compute');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.end();
            commandEncoder.popDebugGroup();

            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
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
            // Double-triangle for fullscreen has 6 vertices.
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.end();
            commandEncoder.popDebugGroup();

            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);

            // Switch for next frame.
            isForward = !isForward;
        };
    }
}