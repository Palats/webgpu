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

    async copyAsync(commandEncoder: GPUCommandEncoder) {
        if (this.mapPromise) { await this.mapPromise };
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

    startMap() {
        this.mapPromise = this.mappedBuffer.mapAsync(GPUMapMode.WRITE);
    }

    async waitMap() {
        if (this.mapPromise) {
            await this.mapPromise;
        }
    }
}

@customElement('app-main')
export class AppMain extends LitElement {
    static styles = css`
        :host {
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
        return html`<div id="display">${this.canvas}</div>`;
    }

    canvas: HTMLCanvasElement;
    demo: Demo;

    @property()
    noWebGPU?: string;

    constructor() {
        super();
        this.demo = currentDemo;
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    }

    override firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        /*this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;*/

        this.start();
    }

    previousTimestampMs: DOMHighResTimeStamp = 0;
    previousStepMs: DOMHighResTimeStamp = 0;

    uniforms?: Uniforms;
    device?: GPUDevice;
    outputBuffer?: GPUBuffer;
    shaderModule?: GPUShaderModule;
    computePipeline?: GPUComputePipeline;

    buffer1?: GPUBuffer;
    buffer2?: GPUBuffer;
    bindGroup1?: GPUBindGroup;   // For 1 -> 2
    bindGroup2?: GPUBindGroup;   // For 2 -> 1
    isForward = true;  // if false, goes 2->1

    async start() {
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
        this.device = await adapter.requestDevice();

        this.uniforms = new Uniforms(this.device);
        this.uniforms.sizeX = this.demo.sizeX ?? window.innerWidth;
        this.uniforms.sizeY = this.demo.sizeY ?? window.innerHeight;

        this.canvas.width = this.uniforms.sizeX;
        this.canvas.height = this.uniforms.sizeY;

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
            layout: this.computePipeline.getBindGroupLayout(0 /* index */),
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
            layout: this.computePipeline.getBindGroupLayout(0 /* index */),
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

        this.queueFrame();
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

        const commandEncoder = this.device.createCommandEncoder();
        await this.uniforms.copyAsync(commandEncoder);

        let dstBuffer = this.isForward ? this.buffer1 : this.buffer2;
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

        commandEncoder.copyBufferToBuffer(
            dstBuffer, 0,
            this.outputBuffer, 0,
            4 * this.uniforms.sizeX * this.uniforms.sizeY,
        );

        const gpuCommands = commandEncoder.finish();
        this.device.queue.submit([gpuCommands]);

        await this.outputBuffer.mapAsync(GPUMapMode.READ);
        const data = new Uint8ClampedArray(this.outputBuffer.getMappedRange());

        const ctx = this.canvas.getContext("2d");
        if (!ctx) { throw "no canvas 2d context"; }
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(new ImageData(data, this.uniforms.sizeX, this.uniforms.sizeY), 0, 0);

        this.outputBuffer.unmap();
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