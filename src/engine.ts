/// <reference types="@webgpu/types" />

export interface Demo {
    id: string;
    caption: string;
    fps: number;
    sizeX?: number;
    sizeY?: number;
    code: string;
    init: (u: Uniforms, a: ArrayBuffer) => void;
}

export class Uniforms {
    sizeX = 320;
    sizeY = 200;
    elapsedMs = 0;

    // Buffer for access from shaders.
    readonly buffer: GPUBuffer;

    // Total size of all the fields to write in uniforms.
    private bytes = 4 + 4 + 4;
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
        d.setUint32(0, this.sizeX, true);
        d.setUint32(4, this.sizeY, true);
        d.setFloat32(8, this.elapsedMs, true);
        this.mappedBuffer.unmap();

        commandEncoder.copyBufferToBuffer(
            this.mappedBuffer, 0,
            this.buffer, 0,
            this.bytes,
        );
    }
}

export class NoWebGPU extends Error { }

export class Engine {
    demo: Demo;
    canvas: HTMLCanvasElement;

    previousTimestampMs: DOMHighResTimeStamp = 0;
    previousStepMs: DOMHighResTimeStamp = 0;

    uniforms!: Uniforms;
    adapter!: GPUAdapter;
    device!: GPUDevice;
    outputBuffer!: GPUBuffer;
    shaderModule!: GPUShaderModule;
    computePipeline!: GPUComputePipeline;
    renderPipeline!: GPURenderPipeline;
    context!: GPUCanvasContext;

    buffer1!: GPUBuffer;
    buffer2!: GPUBuffer;
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
        this.uniforms.sizeX = this.demo.sizeX ?? renderWidth;
        this.uniforms.sizeY = this.demo.sizeY ?? renderHeight;
        console.log("compute size", this.uniforms.sizeX, this.uniforms.sizeY, "render size", renderWidth, renderHeight);

        this.shaderModule = this.device.createShaderModule({ code: this.demo.code });

        this.computePipeline = this.device.createComputePipeline({
            compute: {
                module: this.shaderModule,
                entryPoint: "main"
            }
        });

        // Get a GPU buffer for reading in an unmapped state.
        this.outputBuffer = this.device.createBuffer({
            size: 4 * this.uniforms.sizeX * this.uniforms.sizeY,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        // Initial data.
        this.buffer1 = this.device.createBuffer({
            mappedAtCreation: true,
            size: 4 * this.uniforms.sizeX * this.uniforms.sizeY,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });
        this.demo.init(this.uniforms, this.buffer1.getMappedRange());
        this.buffer1.unmap();

        // Buffer for shader to write to.
        this.buffer2 = this.device.createBuffer({
            size: 4 * this.uniforms.sizeX * this.uniforms.sizeY,
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
                    ]
                },
                ),
            ]
        });

        this.renderPipeline = this.device.createRenderPipeline({
            layout: bindGroupLayout,
            vertex: {
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
                    code: `
                        [[block]] struct Uniforms {
                            sizex: u32;
                            sizey: u32;
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
                            let x = coord.x * f32(uniforms.sizex);
                            let y = coord.y * f32(uniforms.sizey);
                            let idx = u32(y) * uniforms.sizex + u32(x);
                            let v = unpack4x8unorm(dstFrame.values[idx]);
                            return vec4<f32>(v.g, v.r, v.b, 1.0);
                        }
                    `,
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
            passEncoder.dispatch(Math.ceil(this.uniforms.sizeX / 8), Math.ceil(this.uniforms.sizeY / 8));
            passEncoder.endPass();

            this.isForward = !this.isForward;
        }

        // Copy the data from render to a buffer suitable to display.
        commandEncoder.copyBufferToBuffer(
            dstBuffer, 0,
            this.outputBuffer, 0,
            4 * this.uniforms.sizeX * this.uniforms.sizeY,
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

        /*await this.outputBuffer.mapAsync(GPUMapMode.READ);
        const data = new Uint8ClampedArray(this.outputBuffer.getMappedRange());

        const ctx = this.canvas.getContext("2d");
        if (!ctx) { throw "no canvas 2d context"; }
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(new ImageData(data, this.uniforms.sizeX, this.uniforms.sizeY), 0, 0);

        this.outputBuffer.unmap();*/
        this.uniforms.startMap();
    }
}
