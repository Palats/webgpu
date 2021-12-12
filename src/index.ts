/// <reference types="@webgpu/types" />

import { LitElement, html, css, } from 'lit';
import { customElement, property } from 'lit/decorators.js';

interface Demo {
    fps: number;
    sizeX?: number;
    sizeY?: number;
    code: string;
    init: (u: Uniforms, a: ArrayBuffer) => void;
}

// Just fiddling with red component a bit.
const testDemo = {
    fps: 15,
    sizeX: 320,
    sizeY: 200,
    init: (uniforms: Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.sizeY; y++) {
            for (let x = 0; x < uniforms.sizeX; x++) {
                a[4 * (x + y * uniforms.sizeX) + 0] = Math.floor(x * 256 / uniforms.sizeX);
                a[4 * (x + y * uniforms.sizeX) + 1] = Math.floor(y * 256 / uniforms.sizeX);
                a[4 * (x + y * uniforms.sizeX) + 2] = 0;
                a[4 * (x + y * uniforms.sizeX) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            sizex: u32;
            sizey: u32;
            elapsedMs: f32;
        };
        [[block]] struct Frame {
            values: array<u32>;
        };

        [[group(0), binding(0)]] var<storage, read> uniforms : Uniforms;
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, write> dstFrame : Frame;

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.sizex || global_id.y >= uniforms.sizey) {
                return;
            }

            let idx = global_id.y + global_id.x * uniforms.sizey;

            var v = unpack4x8unorm(srcFrame.values[idx]);
            // v.r = 1.0;
            // v.g = 0.5;
            // v.b = 0.1;
            v.r = clamp(uniforms.elapsedMs / 1000.0 / 5.0, 0.0, 1.0);
            v.a = 1.0;
            dstFrame.values[idx] = pack4x8unorm(v);
        }
    `,
}

// Falling pixels
const test2Demo = {
    fps: 4,
    sizeX: 320,
    sizeY: 200,
    init: (uniforms: Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.sizeY; y++) {
            for (let x = 0; x < uniforms.sizeX; x++) {
                a[4 * (x + y * uniforms.sizeX) + 0] = Math.random() * 255;
                a[4 * (x + y * uniforms.sizeX) + 1] = Math.random() * 255;
                a[4 * (x + y * uniforms.sizeX) + 2] = Math.random() * 255;
                a[4 * (x + y * uniforms.sizeX) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            sizex: u32;
            sizey: u32;
            elapsedMs: f32;
        };
        [[block]] struct Frame {
            values: array<u32>;
        };

        [[group(0), binding(0)]] var<storage, read> uniforms : Uniforms;
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, write> dstFrame : Frame;

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.sizex || global_id.y >= uniforms.sizey) {
                return;
            }

            let idx = global_id.x + global_id.y * uniforms.sizex;

            var v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
            if (global_id.y > 0u) {
                let previdx = global_id.x + (global_id.y - 1u) * uniforms.sizex;
                v = unpack4x8unorm(srcFrame.values[previdx]);
                let v2 = unpack4x8unorm(srcFrame.values[idx]);
                v.g = v2.g;
                v.b = v2.b;
            }

            dstFrame.values[idx] = pack4x8unorm(v);
        }
    `,
}

// A basic game of life.
const conwayDemo = {
    fps: 60,
    init: (uniforms: Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.sizeY; y++) {
            for (let x = 0; x < uniforms.sizeX; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[4 * (x + y * uniforms.sizeX) + 0] = v;
                a[4 * (x + y * uniforms.sizeX) + 1] = v;
                a[4 * (x + y * uniforms.sizeX) + 2] = v;
                a[4 * (x + y * uniforms.sizeX) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            sizex: u32;
            sizey: u32;
            elapsedMs: f32;
        };
        [[block]] struct Frame {
            values: array<u32>;
        };

        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, write> dstFrame : Frame;

        fn isOn(x: i32, y: i32) -> i32 {
            if (x < 0) { return 0; }
            if (y < 0) { return 0; }
            if (x >= i32(uniforms.sizex)) { return 0; }
            if (y >= i32(uniforms.sizey)) { return 0; }
            let idx = x + y * i32(uniforms.sizex);
            let v = unpack4x8unorm(srcFrame.values[idx]);
            if (v.r < 0.5) { return 0;}
            return 1;
        }

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {

            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.sizex || global_id.y >= uniforms.sizey) {
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

            let idx = global_id.x + global_id.y * uniforms.sizex;
            var v = unpack4x8unorm(srcFrame.values[idx]);
            v.r = s;
            v.g = s;
            v.b = s;
            v.a = 1.0;
            dstFrame.values[idx] = pack4x8unorm(v);
        }
    `,
}


const currentDemo = conwayDemo;


class Uniforms {
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

@customElement('app-main')
export class AppMain extends LitElement {
    static styles = css`
        /* Cover both shadow dom / non shadow dom cases */
        :host, app-main {
            background-color: #0f0f0f;
            display: grid;
            margin: 0;
            padding: 0;
            height: 100%;
            grid-template-columns: 100fr;
            grid-template-rows: 100fr;
            box-sizing: border-box;
        }

        .nowebgpu {
            background-color: white;
            padding-left: 1em;
        }

        #display {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 2;
            /* Avoid vertical scroll on canvas. */
            min-height: 0;
        }

        #display canvas {
            display: block;
            height: 100%;
            width: 100%;
        }
    `;

    render() {
        if (this.noWebGPU) {
            return html`
            <div class="nowebgpu">
                <p>
                Your browser does not support <a href="https://en.wikipedia.org/wiki/WebGPU">WebGPU</a>.
                </p>
                WebGPU is a future web standard which is supported by Chrome and Firefox, but requires special configuration.

                <ul>
                    <li>For Chrome on Linux, run Chrome with the following extra flags - character case is important:
                        <pre>$ google-chrome --enable-unsafe-webgpu --enable-features=Vulkan</pre>
                    </li>
                    <li>For Chrome on Windows, run Chrome with the following extra flag:
                        <pre>chrome.exe --enable-unsafe-webgpu</pre>
                    </li>
                    <li>
                        For Firefox, as of Dec. 2021, you need to run the nightly. Go in "about:config" and activate feature "dom.webgpu.enabled".
                        You might need to restart Firefox.
                    </li>
                </ul>
                <p>Issue: ${this.noWebGPU}</p>
            </div>
            `
        }
        return html`<div id="display"><canvas id="canvas"></canvas></div>`;
    }

    demo: Demo;

    @property()
    noWebGPU?: string;

    constructor() {
        super();
        this.demo = currentDemo;
    }

    override firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        this.canvas = this.renderRoot.querySelector('#canvas') as HTMLCanvasElement;

        this.initWebGPU().then(() => {
            if (!this.noWebGPU) {
                this.queueFrame();
            }
        })
    }

    previousTimestampMs: DOMHighResTimeStamp = 0;
    previousStepMs: DOMHighResTimeStamp = 0;

    canvas?: HTMLCanvasElement;
    uniforms?: Uniforms;
    adapter?: GPUAdapter;
    device?: GPUDevice;
    outputBuffer?: GPUBuffer;
    shaderModule?: GPUShaderModule;
    computePipeline?: GPUComputePipeline;
    renderPipeline?: GPURenderPipeline;
    context?: GPUCanvasContext;

    buffer1?: GPUBuffer;
    buffer2?: GPUBuffer;
    bindGroup1?: GPUBindGroup;   // For 1 -> 2
    bindGroup2?: GPUBindGroup;   // For 2 -> 1
    bindGroupRender1?: GPUBindGroup;
    bindGroupRender2?: GPUBindGroup;

    isForward = true;  // if false, goes 2->1

    async initWebGPU() {
        if (!this.canvas) { throw "oops"; }
        if (!navigator.gpu) {
            this.noWebGPU = "no webgpu extension";
            return;
        }

        let adapter: GPUAdapter | null = null;
        try {
            // Firefox can have navigator.gpu but still throw when
            // calling requestAdapter.
            adapter = await navigator.gpu.requestAdapter();
        } catch (e) {
            console.error("navigator.gpu.requestAdapter failed:", e);
            this.noWebGPU = "requesting adapter failed";
            return;
        }
        if (!adapter) {
            this.noWebGPU = "no webgpu adapter";
            return;
        }
        this.adapter = adapter;

        this.device = await this.adapter.requestDevice();
        // As of 2021-12-11, Firefox nightly does not support device.lost.
        if (this.device.lost) {
            this.device.lost.then((e) => {
                console.error("device lost", e);
                this.initWebGPU();
            });
        }

        // As of 2021-12-12, Chrome stable & unstable on a Linux (nvidia
        // 460.91.03, 470.86) do not accept a pixel more than 816x640 somehow - "device
        // lost" otherwise.
        const renderWidth = 816;
        const renderHeight = 640;
        //const devicePixelRatio = window.devicePixelRatio || 1;
        //const renderWidth = this.canvas.clientWidth * devicePixelRatio;
        //const renderHeight = this.canvas.clientHeight * devicePixelRatio;


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
        if (!this.context) { throw "no webgpu canvas context"; }
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

    queueFrame() {
        window.requestAnimationFrame((ts) => this.frame(ts));
    }

    async frame(timestampMs: DOMHighResTimeStamp) {
        if (!this.device) { throw "oops"; }
        if (!this.uniforms) { throw "oops"; }
        if (!this.computePipeline) { throw "oops"; }
        if (!this.bindGroup1) { throw "oops"; }
        if (!this.bindGroup2) { throw "oops"; }
        if (!this.buffer1) { throw "oops"; }
        if (!this.buffer2) { throw "oops"; }
        if (!this.outputBuffer) { throw "oops"; }
        if (!this.renderPipeline) { throw "oops"; }
        if (!this.context) { throw "oops"; }

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

        this.queueFrame();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-main": AppMain,
    }
}

// Setup base document.
const htmlElt = document.body.parentElement!;
htmlElt.style.height = '100%';
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.backgroundColor = '#888800';
document.body.appendChild(document.createElement("app-main"));