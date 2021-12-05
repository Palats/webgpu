/// <reference types="@webgpu/types" />

import { LitElement, html, css, } from 'lit';
import { customElement, property } from 'lit/decorators.js';

class Uniforms {
    sizeX = 320;
    sizeY = 200;
    elapsed = 0;

    readonly storageBuffer: GPUBuffer;

    private bytes = 3 * 4;
    private mappedBuffer: GPUBuffer;

    constructor(device: GPUDevice) {
        this.mappedBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: this.bytes * Uint32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
        });
        this.storageBuffer = device.createBuffer({
            size: this.bytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
    }

    copy(commandEncoder: GPUCommandEncoder) {
        const d = new DataView(this.mappedBuffer.getMappedRange());
        d.setUint32(0, this.sizeX, true);
        d.setUint32(4, this.sizeY, true);
        d.setUint32(8, this.elapsed, true);
        this.mappedBuffer.unmap();

        commandEncoder.copyBufferToBuffer(
            this.mappedBuffer, 0,
            this.storageBuffer, 0,
            this.bytes,
        );

        // this.mappedBuffer.mapAsync(GPUMapMode.WRITE);
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

        #display {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 2;
        }

        #display canvas {
            display: block;
            height: 100%;
            width: 100%;
        }
    `;

    render() {
        return html`
            <div id="display">${this.canvas}</div>
        `;
    }

    canvas: HTMLCanvasElement;
    uniforms?: Uniforms;

    constructor() {
        super();
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    }

    override firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        this.doIt();
    }

    async doIt() {
        const sizeX = this.canvas.width;
        const sizeY = this.canvas.height;

        console.log("running", sizeX, sizeY);

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) { throw "no webgpu"; }
        const device = await adapter.requestDevice();

        this.uniforms = new Uniforms(device);
        this.uniforms.sizeX = sizeX;
        this.uniforms.sizeY = sizeY;

        // Buffer for input data.
        const srcBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: 4 * sizeX * sizeY,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        const arrayBuffer = srcBuffer.getMappedRange();
        const a = new Uint8Array(arrayBuffer);
        for (let y = 0; y < sizeX; y++) {
            for (let x = 0; x < sizeX; x++) {
                a[4 * (x + y * sizeX) + 0] = Math.floor(x * 256 / sizeX);
                a[4 * (x + y * sizeX) + 1] = Math.floor(y * 256 / sizeX);
                a[4 * (x + y * sizeX) + 2] = 0;
                a[4 * (x + y * sizeX) + 3] = 255;
            }
        }
        srcBuffer.unmap();

        // Buffer for shader to write to.
        const dstBuffer = device.createBuffer({
            size: 4 * sizeX * sizeY,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });

        const bindGroupLayout = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "read-only-storage" }
            }, {
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "read-only-storage" }
            }, {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "storage" }
            }]
        });

        const bindGroup = device.createBindGroup({
            layout: bindGroupLayout,
            entries: [{
                binding: 0,
                resource: { buffer: this.uniforms.storageBuffer, }
            }, {
                binding: 1,
                resource: { buffer: srcBuffer, }
            }, {
                binding: 2,
                resource: { buffer: dstBuffer, }
            }]
        });

        const shaderModule = device.createShaderModule({
            code: `
              [[block]] struct Uniforms {
                  sizex: u32;
                  sizey: u32;
              };
              [[block]] struct Matrix {
                values: array<u32>;
              };

              [[group(0), binding(0)]] var<storage, read> uniforms : Uniforms;
              [[group(0), binding(1)]] var<storage, read> inputMatrix : Matrix;
              [[group(0), binding(2)]] var<storage, write> result : Matrix;

              [[stage(compute), workgroup_size(8, 8)]]
              fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
                // Guard against out-of-bounds work group sizes
                if (global_id.x >= uniforms.sizex || global_id.y >= uniforms.sizey) {
                  return;
                }

                let idx = global_id.y + global_id.x * uniforms.sizey;

                var v = unpack4x8unorm(inputMatrix.values[idx]);
                // v.r = 1.0;
                // v.g = 0.5;
                // v.b = 0.1;
                v.a = 1.0;
                result.values[idx] = pack4x8unorm(v);
              }
            `
        });

        const computePipeline = device.createComputePipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
            }),
            compute: {
                module: shaderModule,
                entryPoint: "main"
            }
        });

        // Get a GPU buffer for reading in an unmapped state.
        const gpuReadBuffer = device.createBuffer({
            size: 4 * sizeX * sizeY,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        const commandEncoder = device.createCommandEncoder();
        this.uniforms.copy(commandEncoder);
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(computePipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatch(Math.ceil(sizeX / 8), Math.ceil(sizeY / 8));
        passEncoder.endPass();
        commandEncoder.copyBufferToBuffer(
            dstBuffer, 0,
            gpuReadBuffer, 0,
            4 * sizeX * sizeY,
        );
        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        await gpuReadBuffer.mapAsync(GPUMapMode.READ);
        const data = new Uint8ClampedArray(gpuReadBuffer.getMappedRange());

        const ctx = this.canvas.getContext("2d");
        if (!ctx) { throw "no canvas 2d context"; }
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(new ImageData(data, sizeX, sizeY), 0, 0);
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