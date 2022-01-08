/// <reference types="@webgpu/types" />

export interface Demo {
    id: string;
    caption: string;
    fps: number;
    computeWidth?: number;
    computeHeight?: number;
    code: string;
    fragment?: string;
    init: (u: Uniforms, a: ArrayBuffer) => void;
}

export class Uniforms {
    computeWidth = 320;
    computeHeight = 200;
    renderWidth = 320;
    renderHeight = 200;
    elapsedMs = 0;

    // Buffer for access from shaders.
    readonly buffer: GPUBuffer;

    // Total size of all the fields to write in uniforms.
    private bytes = 5 * 4;
    // Buffer for copy from Javascript.
    private mappedBuffer: GPUBuffer;
    // When mapping of the buffer to copy uniforms has been requested, this is
    // what to wait on.
    private mapPromise?: Promise<undefined>;

    constructor(device: GPUDevice) {
        this.mappedBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: this.bytes * Uint32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
        });
        this.buffer = device.createBuffer({
            size: this.bytes,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }

    startMap() {
        this.mapPromise = this.mappedBuffer.mapAsync(GPUMapMode.WRITE);
    }

    async awaitMap() {
        if (this.mapPromise) {
            await this.mapPromise;
        }
        this.mapPromise = undefined;
    }

    copy(commandEncoder: GPUCommandEncoder) {
        const d = new DataView(this.mappedBuffer.getMappedRange());
        d.setUint32(0, this.computeWidth, true);
        d.setUint32(4, this.computeHeight, true);
        d.setUint32(8, this.renderWidth, true);
        d.setUint32(12, this.renderHeight, true);
        d.setFloat32(16, this.elapsedMs, true);
        this.mappedBuffer.unmap();

        commandEncoder.copyBufferToBuffer(
            this.mappedBuffer, 0,
            this.buffer, 0,
            this.bytes,
        );
    }
}

// Default logic to take the compute buffer and display it on the canvas.
// It just rescales whatever is in the compute buffer to the screen.
const defaultFragment = `
    [[block]] struct Uniforms {
        computeWidth: u32;
        computeHeight: u32;
        renderWidth: u32;
        renderHeight: u32;
        elapsedMs: f32;
    };
    [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;

    [[block]] struct Frame {
        values: array<u32>;
    };
    [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
    [[group(0), binding(2)]] var<storage, read> dstFrame : Frame;

    [[stage(fragment)]]
    fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
        let x = coord.x * f32(uniforms.computeWidth);
        let y = coord.y * f32(uniforms.computeHeight);
        let idx = u32(y) * uniforms.computeWidth + u32(x);
        let v = unpack4x8unorm(dstFrame.values[idx]);
        return vec4<f32>(v.g, v.r, v.b, 1.0);
    }
`;

export class NoWebGPU extends Error { }

export class Engine {
    demo: Demo;
    canvas: HTMLCanvasElement;

    previousTimestampMs: DOMHighResTimeStamp = 0;
    previousStepMs: DOMHighResTimeStamp = 0;

    uniforms!: Uniforms;
    adapter!: GPUAdapter;
    device!: GPUDevice;
    shaderModule!: GPUShaderModule;
    computePipeline!: GPUComputePipeline;
    renderPipeline!: GPURenderPipeline;
    context!: GPUCanvasContext;

    buffer1!: GPUBuffer;
    buffer2!: GPUBuffer;
    renderTexture!: GPUTexture;
    bindGroup1!: GPUBindGroup;   // For 1 -> 2
    bindGroup2!: GPUBindGroup;   // For 2 -> 1
    bindGroupRender1!: GPUBindGroup;
    bindGroupRender2!: GPUBindGroup;

    isForward = true;  // if false, goes 2->1

    constructor(canvas: HTMLCanvasElement, demo: Demo) {
        this.canvas = canvas;
        this.demo = demo;
    }

    async init(renderWidth: number, renderHeight: number) {
        if (!navigator.gpu) {
            throw new NoWebGPU("no webgpu extension");
        }

        let adapter: GPUAdapter | null = null;
        try {
            // Firefox can have navigator.gpu but still throw when
            // calling requestAdapter.
            adapter = await navigator.gpu.requestAdapter();
        } catch (e) {
            console.error("navigator.gpu.requestAdapter failed:", e);
            throw new NoWebGPU("requesting adapter failed");
        }
        if (!adapter) {
            throw new NoWebGPU("no webgpu adapter");
        }
        this.adapter = adapter;

        this.device = await this.adapter.requestDevice();

        // As of 2021-12-11, Firefox nightly does not support device.lost.
        /*if (this.device.lost) {
            this.device.lost.then((e) => {
                console.error("device lost", e);
                this.initWebGPU();
            });
        }*/

        this.uniforms = new Uniforms(this.device);
        this.uniforms.computeWidth = this.demo.computeWidth ?? renderWidth;
        this.uniforms.computeHeight = this.demo.computeHeight ?? renderHeight;
        this.uniforms.renderWidth = renderWidth;
        this.uniforms.renderHeight = renderHeight;
        console.log("compute size", this.uniforms.computeWidth, this.uniforms.computeHeight, "render size", this.uniforms.renderWidth, this.uniforms.renderHeight);

        this.shaderModule = this.device.createShaderModule({ code: this.demo.code });

        this.computePipeline = this.device.createComputePipeline({
            compute: {
                module: this.shaderModule,
                entryPoint: "main"
            }
        });

        // Initial data.
        this.buffer1 = this.device.createBuffer({
            mappedAtCreation: true,
            size: 4 * this.uniforms.computeWidth * this.uniforms.computeHeight,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });
        this.demo.init(this.uniforms, this.buffer1.getMappedRange());
        this.buffer1.unmap();

        // Buffer for shader to write to.
        this.buffer2 = this.device.createBuffer({
            size: 4 * this.uniforms.computeWidth * this.uniforms.computeHeight,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });

        this.bindGroup1 = this.device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: { buffer: this.buffer1, }
            }, {
                binding: 2,
                resource: { buffer: this.buffer2, }
            }]
        });

        this.bindGroup2 = this.device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: { buffer: this.buffer2, }
            }, {
                binding: 2,
                resource: { buffer: this.buffer1, }
            }]
        });

        // Now setup rendering.
        this.context = this.canvas.getContext('webgpu');
        if (!this.context) { new Error("no webgpu canvas context"); }
        const presentationFormat = this.context.getPreferredFormat(this.adapter);
        this.context.configure({
            device: this.device,
            format: presentationFormat,
            size: {
                width: renderWidth,
                height: renderHeight,
            },
        });

        this.renderTexture = this.device.createTexture({
            size: { width: this.uniforms.computeWidth, height: this.uniforms.computeHeight },
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            // usage: GPUTextureUsage. GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        })

        const bindGroupLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.device.createBindGroupLayout({
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: {
                                type: "uniform",
                            }
                        },
                        {
                            binding: 1,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: {
                                type: "read-only-storage",
                            }
                        },
                        {
                            binding: 2,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: {
                                type: "read-only-storage",
                            }
                        },
                        {
                            binding: 3,
                            visibility: GPUShaderStage.FRAGMENT,
                            texture: {
                                multisampled: false,
                            }
                        },
                        {
                            binding: 4,
                            visibility: GPUShaderStage.FRAGMENT,
                            sampler: {
                                type: "filtering",
                            }
                        },
                    ]
                },
                ),
            ]
        });

        const fragment = this.demo.fragment ?? defaultFragment;

        this.renderPipeline = this.device.createRenderPipeline({
            layout: bindGroupLayout,
            vertex: {
                // Create full screen pair of triangles.
                module: this.device.createShaderModule({
                    code: `
                        struct VSOut {
                            [[builtin(position)]] pos: vec4<f32>;
                            [[location(0)]] coord: vec2<f32>;
                        };
                        [[stage(vertex)]]
                        fn main([[builtin(vertex_index)]] idx : u32) -> VSOut {
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
                entryPoint: 'main',
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: fragment,
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: presentationFormat,
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        const sampler = this.device.createSampler({ label: "sampler" });
        const textureView = this.renderTexture.createView();

        this.bindGroupRender1 = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: { buffer: this.buffer1, }
            }, {
                binding: 2,
                resource: { buffer: this.buffer2, }
            }, {
                binding: 3,
                resource: textureView,
            }, {
                binding: 4,
                resource: sampler,
            }]
        });
        this.bindGroupRender2 = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: { buffer: this.buffer2, }
            }, {
                binding: 2,
                resource: { buffer: this.buffer1, }
            }, {
                binding: 3,
                resource: textureView,
            }, {
                binding: 4,
                resource: sampler,
            }]
        });

    }

    async frame(timestampMs: DOMHighResTimeStamp) {
        let frameDelta = 0;
        if (this.previousTimestampMs) {
            frameDelta = timestampMs - this.previousTimestampMs;
        }
        this.uniforms.elapsedMs += frameDelta;

        let simulDelta = timestampMs - this.previousStepMs;
        const runStep = simulDelta > (1000 / this.demo.fps);

        this.previousTimestampMs = timestampMs;
        if (runStep) {
            this.previousStepMs = timestampMs;
        }

        // Map uniforms
        await this.uniforms.awaitMap();

        //-- Build frame commands
        const commandEncoder = this.device.createCommandEncoder();

        // Add uniforms, always.
        this.uniforms.copy(commandEncoder);

        let dstBuffer = this.isForward ? this.buffer1 : this.buffer2;
        // Run compute when needed.
        if (runStep) {
            const bindGroup = this.isForward ? this.bindGroup1 : this.bindGroup2;
            dstBuffer = this.isForward ? this.buffer2 : this.buffer1;

            const passEncoder = commandEncoder.beginComputePass();
            passEncoder.setPipeline(this.computePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatch(Math.ceil(this.uniforms.computeWidth / 8), Math.ceil(this.uniforms.computeHeight / 8));
            passEncoder.endPass();

            this.isForward = !this.isForward;
        }

        // Copy the data from compute buffer to a texture to allow for sampling.
        commandEncoder.copyBufferToTexture(
            {
                buffer: dstBuffer,
                bytesPerRow: 4 * this.uniforms.computeWidth,
            },
            { texture: this.renderTexture },
            { width: this.uniforms.computeWidth, height: this.uniforms.computeHeight },
        );

        // Rendering.
        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                },
            ],
        };

        const renderBindGroup = this.isForward ? this.bindGroupRender1! : this.bindGroupRender2!;
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.renderPipeline);
        passEncoder.setBindGroup(0, renderBindGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.endPass();

        // And submit the work.
        this.device.queue.submit([commandEncoder.finish()]);

        this.uniforms.startMap();
    }
}
