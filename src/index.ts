/// <reference types="@webgpu/types" />

import { LitElement, html, css, } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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

    canvas: HTMLCanvasElement;

    render() {
        return html`
            <div id="display">${this.canvas}</div>
        `;
    }


    constructor() {
        super();
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    }

    override firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        this.doIt();
    }

    async doIt() {
        console.log("trying");
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) { throw "no webgpu"; }
        const device = await adapter.requestDevice();

        const sizeX = 4;
        const sizeY = 4;

        // Buffer for constant properties (uniforms?)
        const uniformsBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: 2 * Uint32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.STORAGE
        });
        const uniforms = new Uint32Array(uniformsBuffer.getMappedRange());
        uniforms[0] = sizeX;
        uniforms[1] = sizeY;
        uniformsBuffer.unmap();

        // Buffer for input data.
        const srcBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: sizeX * sizeY * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.STORAGE
        });
        const arrayBuffer = srcBuffer.getMappedRange();
        const a = new Float32Array(arrayBuffer);
        a[0] = sizeX;
        a[1] = sizeY;
        for (let y = 0; y < sizeX; y++) {
            for (let x = 0; x < sizeX; x++) {
                a[x + y * sizeX] = x + y;
            }
        }
        srcBuffer.unmap();

        // Buffer for shader to write to.
        const dstBuffer = device.createBuffer({
            size: sizeX * sizeY * Float32Array.BYTES_PER_ELEMENT,
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
                resource: { buffer: uniformsBuffer, }
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
                values: array<f32>;
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
                result.values[idx] = inputMatrix.values[idx] * inputMatrix.values[idx];
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

        const commandEncoder = device.createCommandEncoder();

        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(computePipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatch(Math.ceil(sizeX / 8), Math.ceil(sizeY / 8));
        passEncoder.endPass();

        // Get a GPU buffer for reading in an unmapped state.
        const gpuReadBuffer = device.createBuffer({
            size: sizeX * sizeY * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        // Encode commands for copying buffer to buffer.
        commandEncoder.copyBufferToBuffer(
            dstBuffer, 0,
            gpuReadBuffer, 0,
            sizeX * sizeY * Float32Array.BYTES_PER_ELEMENT,
        );

        // Submit GPU commands.
        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        await gpuReadBuffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = gpuReadBuffer.getMappedRange();
        console.log(new Float32Array(copyArrayBuffer));
        /*await dstBuffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = dstBuffer.getMappedRange();
        console.log(new Float32Array(copyArrayBuffer));*/

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