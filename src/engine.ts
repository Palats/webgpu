/// <reference types="@webgpu/types" />

import * as types from './types';

// A vertex shader creating full screen rendering using 2 triangles.
// It sets:
//   - builtin position: the position of the vertex.
//   - location(0): screen coordinates, normalized to [0..1].
// The render should:
//   - Set `primitive: { topology: 'triangle-list' }`
//   - Use `passEncoder.draw(6, 1, 0, 0)` on the render pass encoder, with no vertex buffer.
export function vertexFullScreen(params: types.InitParams): GPUVertexState {
    return {
        // Create full screen pair of triangles.
        entryPoint: 'main',
        module: params.device.createShaderModule({
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
    }
}


export class Uniforms {
    computeWidth = 320;
    computeHeight = 200;
    renderWidth = 320;
    renderHeight = 200;
    elapsedMs = 0;
    // An rngseed is also added, only available in the shaders.
    // rngSeed = 0;

    // Buffer for access from shaders.
    readonly buffer: GPUBuffer;

    // Total size of all the fields to write in uniforms.
    private bytes = 6 * 4;
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
        d.setFloat32(20, Math.random(), true);
        this.mappedBuffer.unmap();

        commandEncoder.copyBufferToBuffer(
            this.mappedBuffer, 0,
            this.buffer, 0,
            this.bytes,
        );
    }
}

export class Engine {
    // Class info
    static id: string;
    static caption: string;

    // Setup
    computeWidth?: number;
    computeHeight?: number;
    fps: number = 60;
    computeCode: string = "";
    computeTexFormat: GPUTextureFormat = "rgba8unorm";

    // State
    previousTimestampMs: DOMHighResTimeStamp = 0;
    previousStepMs: DOMHighResTimeStamp = 0;

    uniforms!: Uniforms;
    device!: GPUDevice;
    context!: GPUCanvasContext;
    computePipeline!: GPUComputePipeline;
    renderPipeline!: GPURenderPipeline;

    computeBindGroup1!: GPUBindGroup;   // For 1 -> 2
    computeBindGroup2!: GPUBindGroup;   // For 2 -> 1
    renderBindGroup1!: GPUBindGroup;
    renderBindGroup2!: GPUBindGroup;

    isForward = true;  // if false, goes 2->1

    initCompute(buffer: ArrayBuffer): void { }

    async init(params: types.InitParams) {
        this.context = params.context;
        this.device = params.device;

        // Uniforms setup.
        this.uniforms = new Uniforms(this.device);
        this.uniforms.computeWidth = this.computeWidth ?? params.renderWidth;
        this.uniforms.computeHeight = this.computeHeight ?? params.renderHeight;
        this.uniforms.renderWidth = params.renderWidth;
        this.uniforms.renderHeight = params.renderHeight;
        console.log("compute size", this.uniforms.computeWidth, this.uniforms.computeHeight, "render size", this.uniforms.renderWidth, this.uniforms.renderHeight);

        // Textures, used for compute part swapchain.
        const tex1 = this.device.createTexture({
            size: { width: this.uniforms.computeWidth, height: this.uniforms.computeHeight },
            format: this.computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const texView1 = tex1.createView({
            format: this.computeTexFormat,
        });

        const tex2 = this.device.createTexture({
            size: { width: this.uniforms.computeWidth, height: this.uniforms.computeHeight },
            format: this.computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const texView2 = tex2.createView({
            format: this.computeTexFormat,
        });

        // Setup the initial texture1, to allow for initial data.
        // A bit useless when no init is needed, but that's a one time thing.
        const buffer = new ArrayBuffer(this.uniforms.computeWidth * this.uniforms.computeHeight * 4);
        this.initCompute(buffer);
        await this.device.queue.writeTexture(
            { texture: tex1 },
            buffer,
            { bytesPerRow: this.uniforms.computeWidth * 4 },
            { width: this.uniforms.computeWidth, height: this.uniforms.computeHeight }
        );

        // Create compute pipeline.
        const computeBindGroupLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.device.createBindGroupLayout({
                    entries: [
                        // Uniforms
                        {
                            binding: 0,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: {
                                type: "uniform",
                            }
                        },
                        // Input compute buffer as texture
                        {
                            binding: 1,
                            visibility: GPUShaderStage.COMPUTE,
                            texture: {
                                multisampled: false,
                            }
                        },
                        // Output compute buffer as texture
                        {
                            binding: 2,
                            visibility: GPUShaderStage.COMPUTE,
                            storageTexture: {
                                access: 'write-only',
                                format: this.computeTexFormat,
                            }
                        },
                    ]
                },
                ),
            ]
        });

        this.computePipeline = this.device.createComputePipeline({
            layout: computeBindGroupLayout,
            compute: {
                module: this.device.createShaderModule({ code: this.computeCode }),
                entryPoint: "main"
            }
        });

        this.computeBindGroup1 = this.device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: texView1,
            }, {
                binding: 2,
                resource: texView2,
            }]
        });

        this.computeBindGroup2 = this.device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: texView2,
            }, {
                binding: 2,
                resource: texView1,
            }]
        });

        // Create rendering pipeline.
        const renderBindGroupLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.device.createBindGroupLayout({
                    entries: [
                        // Uniforms
                        {
                            binding: 0,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: {
                                type: "uniform",
                            }
                        },
                        // Output compute texture
                        {
                            binding: 1,
                            visibility: GPUShaderStage.FRAGMENT,
                            texture: {
                                multisampled: false,
                            }
                        },
                        // Sampler for  the texture
                        {
                            binding: 2,
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

        this.renderPipeline = this.device.createRenderPipeline({
            layout: renderBindGroupLayout,
            vertex: vertexFullScreen(params),
            fragment: {
                module: this.device.createShaderModule({
                    code: this.fragmentCode,
                }),
                entryPoint: 'main',
                targets: [{
                    format: params.renderFormat,
                }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        const sampler = this.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });

        this.renderBindGroup1 = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: texView2,
            }, {
                binding: 2,
                resource: sampler,
            }]
        });
        this.renderBindGroup2 = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.buffer, }
            }, {
                binding: 1,
                resource: texView1,
            }, {
                binding: 2,
                resource: sampler,
            }]
        });

    }

    // Default logic to take the compute buffer and display it on the canvas.
    // It just rescales whatever is in the compute buffer to the screen.
    fragmentCode = `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };
        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var computeTexture : texture_2d<f32>;
        [[group(0), binding(2)]] var dstSampler : sampler;

        [[stage(fragment)]]
        fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
            return textureSample(computeTexture, dstSampler, coord);
        }
    `;

    async frame(info: types.FrameInfo) {
        this.uniforms.elapsedMs = info.elapsedMs;

        // Allow to run compute at a lower FPS than rendering.
        let simulDelta = info.timestampMs - this.previousStepMs;
        const runStep = simulDelta > (1000 / this.fps);
        this.previousTimestampMs = info.timestampMs;
        if (runStep) {
            this.previousStepMs = info.timestampMs;
        }

        // Map uniforms
        await this.uniforms.awaitMap();

        //-- Build frame commands
        const commandEncoder = this.device.createCommandEncoder();

        // Add uniforms, always.
        this.uniforms.copy(commandEncoder);

        // Run compute when needed.
        if (runStep) {
            const bindGroup = this.isForward ? this.computeBindGroup1 : this.computeBindGroup2;

            const passEncoder = commandEncoder.beginComputePass();
            passEncoder.setPipeline(this.computePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatch(Math.ceil(this.uniforms.computeWidth / 8), Math.ceil(this.uniforms.computeHeight / 8));
            passEncoder.endPass();

            this.isForward = !this.isForward;
        }

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

        const renderBindGroup = this.isForward ? this.renderBindGroup1! : this.renderBindGroup2!;
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

// Takes a class deriving from Engine and create something suitable
// for the UI to run.
export const asDemo = (t: typeof Engine) => {
    return {
        id: t.id,
        caption: t.caption,
        async init(params: types.InitParams) {
            const d = new t();
            await d.init(params);
            return (nfo: types.FrameInfo) => { return d.frame(nfo) };
        }
    };
};