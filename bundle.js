/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/demos/conway.ts":
/*!*****************************!*\
  !*** ./src/demos/conway.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// A basic game of life.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
const wg = __webpack_require__(/*! ../wg */ "./src/wg.ts");
const uniformsDesc = new wg.StructType({
    computeWidth: wg.Member(wg.U32, 0),
    computeHeight: wg.Member(wg.U32, 1),
});
const computeTexFormat = "rgba8unorm";
exports.demo = {
    id: "conway",
    caption: "A Conway game of life.",
    async init(params) {
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
        await params.device.queue.writeTexture({ texture: tex1 }, buffer, { bytesPerRow: computeWidth * 4 }, { width: computeWidth, height: computeHeight });
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
                    code: wg.wgsl `
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
                    }),
                ]
            }),
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "full screen vertices",
                    code: wg.wgsl `
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
                }).toDesc()),
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "simple copy from compute",
                    code: wg.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec2<f32>;
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
        return async (info) => {
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
            computeEncoder.endPass();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        storeOp: 'store',
                    }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            // Double-triangle for fullscreen has 6 vertices.
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.endPass();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
            // Switch for next frame.
            isForward = !isForward;
        };
    }
};


/***/ }),

/***/ "./src/demos/conway2.ts":
/*!******************************!*\
  !*** ./src/demos/conway2.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


// A conway game of life with indirect rendering.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
exports.demo = {
    id: "conway2",
    caption: "A conway game of life with paletted blurring over time.",
    async init(params) {
        const computeWidth = params.renderWidth;
        const computeHeight = params.renderHeight;
        const computeTexFormat = "rgba8unorm";
        const computeTexBytes = 4; // Bytes per pixel in compute.
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
        await params.device.queue.writeTexture({ texture: cells1 }, buffer, { bytesPerRow: computeWidth * computeTexBytes }, { width: computeWidth, height: computeHeight });
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

                        fn cellAt(x: i32, y: i32) -> i32 {
                            let v = textureLoad(cellsSrc, vec2<i32>(x, y), 0);
                            if (v.r < 0.5) { return 0;}
                            return 1;
                        }

                        fn trailAt(x: i32, y: i32) -> vec4<f32> {
                            return textureLoad(trailSrc, vec2<i32>(x, y), 0);
                        }

                        [[stage(compute), workgroup_size(8, 8)]]
                        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
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
                        [[group(0), binding(0)]] var tex : texture_2d<f32>;
                        [[group(0), binding(1)]] var smplr : sampler;

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

                        [[stage(fragment)]]
                        fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
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
        return async (info) => {
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
};


/***/ }),

/***/ "./src/demos/cube.ts":
/*!***************************!*\
  !*** ./src/demos/cube.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


// A rotating cube, with rotation on GPU.
//
// Rotation, translation and project are calculated within a compute shader. For
// a single matrix like that, it is probably over the top - though it shows it
// can be done purely on the GPU, while javascript just need to update the time.
//
// Lots of inspiration from
// https://github.com/austinEng/webgpu-samples/blob/main/src/sample/rotatingCube/main.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
exports.demo = {
    id: "cube",
    caption: "The good old rotating cube.",
    async init(params) {
        // -- Compute pipeline. It takes care of calculating the cube vertices
        // transformion (and projection) matrix.
        const computePipeline = params.device.createComputePipeline({
            label: "Compute pipeline for projection matrix",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Input buffer, which will be coming from JS.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Output buffer, to feed the vertex shader.
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "storage" },
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    label: "Rendering matrix compute",
                    // Project & rotations from https://github.com/toji/gl-matrix
                    code: `
                        struct Uniforms {
                            elapsedMs: f32;
                            renderWidth: f32;
                            renderHeight: f32;
                        };
                        @group(0) @binding(0) var<uniform> uniforms : Uniforms;

                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(1) var<storage, write> outp : Output;

                        fn perspective() -> mat4x4<f32> {
                            // Hard coded projection parameters - for more flexibility,
                            // we could imagine getting them from the uniforms.
                            let fovy = 2.0 * 3.14159 / 5.0; // Vertical field of view (rads)
                            let near = 1.0;
                            let far = 100.0;

                            let f = 1.0 / tan(fovy / 2.0);
                            let nf = 1.0 / (near - far);

                            let aspect = uniforms.renderWidth / uniforms.renderHeight;

                            return mat4x4<f32>(
                                f / aspect, 0.0, 0.0, 0.0,
                                0.0, f, 0.0, 0.0,
                                0.0, 0.0, (far + near) * nf, -1.0,
                                0.0, 0.0, 2.0 * far * near * nf, 0.0,
                            );
                        }

                        fn translate(tr : vec3<f32>) -> mat4x4<f32> {
                            return mat4x4<f32>(
                                1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                tr.x, tr.y, tr.z, 1.0,
                            );
                        }

                        fn rotateX(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                1.0, 0.0, 0.0, 0.0,
                                0.0, c, s, 0.0,
                                0.0, -s, c, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        fn rotateY(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                c, 0.0, -s, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                s, 0.0, c, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        fn rotateZ(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                c, s, 0.0, 0.0,
                                -s, c, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        @stage(compute) @workgroup_size(1)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let TAU = 6.283185;
                            let c = (uniforms.elapsedMs / 1000.0) % TAU;
                            let r = vec3<f32>(c, c, c);
                            outp.mvp = perspective() * translate(vec3<f32>(0.0, 0.0, -4.0)) * rotateZ(r.z) * rotateY(r.y) * rotateX(r.x);
                        }
                    `,
                }),
            }
        });
        const uniformsBufferSize = 3 * 4;
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const computeResult = params.device.createBuffer({
            label: "Compute output for vertex shaders",
            // Size for one mat4x4<f32>.
            size: 4 * 4 * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
        });
        const computeBindGroup = params.device.createBindGroup({
            label: "Bind group for the projection matrix compute",
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: computeResult }
                }]
        });
        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const renderPipeline = params.device.createRenderPipeline({
            label: "Cube rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout for compute data",
                        entries: [
                            // Matrix info coming from compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {
                                    type: 'read-only-storage',
                                },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "cube vertex shader",
                    // https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
                    code: `
                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(0) var<storage> outp : Output;

                        struct Out {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec3<f32>;
                        };

                        // The cube mesh, as triangle strip.
                        let mesh = array<vec3<f32>, 14>(
                            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
                            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
                            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
                            vec3<f32>(-1.f, -1.f, 1.f),     // Front-bottom-right
                            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
                            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
                            vec3<f32>(-1.f, 1.f, -1.f),     // Back-top-right
                            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
                            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
                            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
                            vec3<f32>(1.f, -1.f, -1.f),   // Back-bottom-left
                            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
                            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
                            vec3<f32>(-1.f, 1.f, -1.f),      // Back-top-right
                        );

                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> Out {
                            let pos = mesh[idx];
                            var out : Out;
                            out.pos = outp.mvp * vec4<f32>(pos + vec3<f32>(0.0, 0.0, 0.0), 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (pos.y + 1.0) / 2.0;
                            out.coord.z = (pos.z + 1.0) / 2.0;
                            return out;
                        }
                    `,
                }),
            },
            primitive: {
                topology: 'triangle-strip',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "trivial fragment shader",
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec3<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, coord.z, 1.0);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: computeResult,
                    }
                },
            ]
        });
        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // -- Single frame rendering.
        return async (info) => {
            // Fill up the uniforms to feed the compute shaders.
            // Rotation of the cube is just a function of current time,
            // calculated in the compute shader.
            const data = new DataView(new ArrayBuffer(uniformsBufferSize));
            data.setFloat32(0, info.elapsedMs, true);
            data.setFloat32(4, params.renderWidth, true);
            data.setFloat32(8, params.renderHeight, true);
            params.device.queue.writeBuffer(uniformsBuffer, 0, data);
            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
            commandEncoder.pushDebugGroup('Compute projection');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            // The compute has only a single matrix to compute. More typical compute shaders
            // would dispatch on NxM elements.
            computeEncoder.dispatch(1);
            computeEncoder.endPass();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        storeOp: 'store',
                    }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthLoadValue: 1.0,
                    depthStoreOp: 'store',
                    stencilLoadValue: 0,
                    stencilStoreOp: 'store',
                },
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, renderBindGroup);
            // Cube mesh as a triangle-strip uses 14 vertices.
            renderEncoder.draw(14, 1, 0, 0);
            renderEncoder.endPass();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./src/demos/fade.ts":
/*!***************************!*\
  !*** ./src/demos/fade.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// A minimal effect which works on a buffer and make it evolve over time.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
const wg = __webpack_require__(/*! ../wg */ "./src/wg.ts");
const uniformsDesc = new wg.StructType({
    elapsedMs: wg.Member(wg.F32, 0),
});
const computeTexFormat = "rgba8unorm";
exports.demo = {
    id: "fade",
    caption: "Cycling the red component over time.",
    async init(params) {
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
                a[4 * (x + y * computeWidth) + 0] = 0;
                a[4 * (x + y * computeWidth) + 1] = Math.floor(x * 256 / computeWidth);
                a[4 * (x + y * computeWidth) + 2] = Math.floor(y * 256 / computeWidth);
                a[4 * (x + y * computeWidth) + 3] = 255;
            }
        }
        await params.device.queue.writeTexture({ texture: tex1 }, buffer, { bytesPerRow: computeWidth * 4 }, { width: computeWidth, height: computeHeight });
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
                    label: "Changing the red channel from previous buffer",
                    code: wg.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var srcTexture : texture_2d<f32>;
                        @group(0) @binding(2) var dstTexture : texture_storage_2d<${computeTexFormat}, write>;

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let xy = vec2<i32>(global_id.xy);
                            var v = textureLoad(srcTexture, xy, 0);
                            v.r = (sin(modf(uniforms.elapsedMs / 1000.0 / 3.0).fract * 2.0 * 3.1415) + 1.0) / 2.0;
                            textureStore(dstTexture, xy, v);
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
                    }),
                ]
            }),
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "full screen vertices",
                    code: wg.wgsl `
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
                }).toDesc()),
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "simple copy from compute",
                    code: wg.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec2<f32>;
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
        return async (info) => {
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
            }));
            // -- Do compute pass, where the actual effect is.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup(`Time ${info.elapsedMs}`);
            commandEncoder.pushDebugGroup('Compute');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.endPass();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        storeOp: 'store',
                    }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            // Double-triangle for fullscreen has 6 vertices.
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.endPass();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
            // Switch for next frame.
            isForward = !isForward;
        };
    }
};


/***/ }),

/***/ "./src/demos/fire.ts":
/*!***************************!*\
  !*** ./src/demos/fire.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// A classic fire effect.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
const wg = __webpack_require__(/*! ../wg */ "./src/wg.ts");
const shaderlib = __webpack_require__(/*! ../shaderlib */ "./src/shaderlib.ts");
const uniformsDesc = new wg.StructType({
    computeWidth: wg.Member(wg.U32, 0),
    computeHeight: wg.Member(wg.U32, 1),
    rngSeed: wg.Member(wg.F32, 2),
});
const computeTexFormat = "rgba8unorm";
exports.demo = {
    id: "fire",
    caption: "The classic fire effect.",
    async init(params) {
        const computeWidth = 160;
        const computeHeight = 100;
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
                    label: "update fire state",
                    code: wg.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var srcTexture : texture_2d<f32>;
                        @group(0) @binding(2) var dstTexture : texture_storage_2d<${computeTexFormat}, write>;

                        fn at(x: i32, y: i32) -> vec4<f32> {
                            return textureLoad(srcTexture, vec2<i32>(x, y), 0);
                        }

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            // Guard against out-of-bounds work group sizes
                            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                                return;
                            }

                            let x = i32(global_id.x);
                            let y = i32(global_id.y);

                            var v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
                            if (y == (i32(uniforms.computeHeight) - 1)) {
                                if (${shaderlib.rand.ref("meh")}(uniforms.rngSeed, f32(x)) < 0.2) {
                                    v = vec4<f32>(1.0, 1.0, 1.0, 1.0);
                                } else {
                                    v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
                                }
                            } else {
                                let sum = at(x, y) + at(x - 1, y + 1) + at(x, y + 1) + at(x + 1, y + 1);
                                v = (sum / 4.0) - 0.005;
                            }
                            textureStore(dstTexture, vec2<i32>(x, y), v);
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
                    }),
                ]
            }),
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "full screen vertices",
                    code: wg.wgsl `
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
                }).toDesc()),
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "simple copy from compute",
                    code: wg.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec2<f32>;
                        };

                        @group(0) @binding(0) var computeTexture : texture_2d<f32>;
                        @group(0) @binding(1) var dstSampler : sampler;

                        @stage(fragment)
                        fn main(inp: VSOut) -> @location(0) vec4<f32> {
                            let v = textureSample(computeTexture, dstSampler, inp.coord);

                            let key = v.r * 8.0;
                            let c = (v.r * 256.0) % 32.0;
                            if (key < 1.0) { return vec4<f32>(0.0, 0.0, c * 2.0 / 256.0, 1.0); }
                            if (key < 2.0) { return vec4<f32>(c * 8.0 / 256.0, 0.0, (64.0 - c * 2.0) / 256.0, 1.0); }
                            if (key < 3.0) { return vec4<f32>(1.0, c * 8.0 / 256.0, 0.0, 1.0); }
                            if (key < 4.0) { return vec4<f32>(1.0, 1.0, c * 4.0 / 256.0, 1.0); }
                            if (key < 5.0) { return vec4<f32>(1.0, 1.0, (64.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 6.0) { return vec4<f32>(1.0, 1.0, (128.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 7.0) { return vec4<f32>(1.0, 1.0, (192.0 + c * 4.0) / 256.0, 1.0); }
                            return vec4<f32>(1.0, 1.0, (224.0 + c * 4.0) / 256.0, 1.0);
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
        return async (info) => {
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                computeWidth: computeWidth,
                computeHeight: computeHeight,
                rngSeed: Math.random(),
            }));
            // -- Do compute pass, where the actual effect is.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup(`Time ${info.elapsedMs}`);
            commandEncoder.pushDebugGroup('Compute');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.endPass();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        storeOp: 'store',
                    }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            // Double-triangle for fullscreen has 6 vertices.
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.endPass();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
            // Switch for next frame.
            isForward = !isForward;
        };
    }
};


/***/ }),

/***/ "./src/demos/minimal.ts":
/*!******************************!*\
  !*** ./src/demos/minimal.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


// Minimal effect, with only a basic render pass.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
exports.demo = {
    id: "minimal",
    caption: "Minimal setup without compute.",
    async init(params) {
        const pipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    // We do not need here a bind group, as we are not binding
                    // anything in this example - keeping it around for
                    // reference.
                    params.device.createBindGroupLayout({
                        entries: [],
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
                        [[stage(fragment)]]
                        fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, 0.5, 1.0);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const bindgroup = params.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            // Minimal, nothing to bind.
            entries: []
        });
        // Single frame rendering.
        return async (info) => {
            const commandEncoder = params.device.createCommandEncoder();
            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        storeOp: 'store',
                    }],
            });
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindgroup);
            passEncoder.draw(6, 1, 0, 0);
            passEncoder.endPass();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./src/demos/multicubes.ts":
/*!*********************************!*\
  !*** ./src/demos/multicubes.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// Multiple rotating cubes.
//
// Rotation, translation and projection are calculated within compute shaders.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
const wg = __webpack_require__(/*! ../wg */ "./src/wg.ts");
const shaderlib = __webpack_require__(/*! ../shaderlib */ "./src/shaderlib.ts");
// Number of instances.
const workgroupWidth = 8;
const workgroupHeight = 8;
const instancesWidth = 1 * workgroupWidth;
const instancesHeight = 1 * workgroupHeight;
const instances = instancesWidth * instancesHeight;
// Space parameters.
const boxSize = 20;
const zOffset = -25;
const spaceLimit = boxSize / 2.0;
console.log(`Instances: ${instances} (${instancesWidth} x ${instancesHeight})`);
// Basic parameters provided to all the shaders.
const uniformsDesc = new wg.StructType({
    elapsedMs: wg.Member(wg.F32, 0),
    renderWidth: wg.Member(wg.F32, 1),
    renderHeight: wg.Member(wg.F32, 2),
    rngSeed: wg.Member(wg.F32, 3),
});
// Parameters from Javascript to the computer shader
// for each instance.
const instanceParamsDesc = new wg.StructType({
    'pos': wg.Member(wg.Vec32f32, 0),
    'rot': wg.Member(wg.Vec32f32, 1),
    'move': wg.Member(wg.Vec32f32, 2),
    'scale': wg.Member(wg.F32, 3),
});
const instanceArrayDesc = new wg.ArrayType(instanceParamsDesc, instances);
exports.demo = {
    id: "multicubes",
    caption: "Multiple independent rotating cubes.",
    async init(params) {
        // Setup some initial positions for the cubes.
        const positions = [];
        for (let y = 0; y < instancesHeight; y++) {
            for (let x = 0; x < instancesWidth; x++) {
                positions.push({
                    pos: [
                        boxSize * (0.5 - Math.random()),
                        boxSize * (0.5 - Math.random()),
                        boxSize * (0.5 - Math.random()),
                    ],
                    rot: [
                        Math.random() * 2 * Math.PI,
                        Math.random() * 2 * Math.PI,
                        Math.random() * 2 * Math.PI,
                    ],
                    move: [
                        0.4 * (0.5 - Math.random()),
                        0.4 * (0.5 - Math.random()),
                        0.4 * (0.5 - Math.random()),
                    ],
                    scale: 1.0 + 0.3 * (0.5 - Math.random()),
                });
            }
        }
        const instancesBuffer = params.device.createBuffer({
            label: "Instance parameters",
            size: instanceArrayDesc.byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        const a = new ArrayBuffer(instanceArrayDesc.byteSize());
        const dv = new DataView(a);
        instanceArrayDesc.dataViewSet(dv, 0, positions);
        params.device.queue.writeBuffer(instancesBuffer, 0, a);
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const computeResult = params.device.createBuffer({
            label: "Compute output for vertex shaders",
            size: instances * wg.Mat4x4F32.byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
        });
        // -- Compute pipeline. It takes care of calculating the cube vertices
        // transformation (and projection) matrices.
        const computePipeline = params.device.createComputePipeline({
            label: "Compute pipeline for projection matrix",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Uniforms, from JS
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Instances parameters, from JS
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "storage" },
                            },
                            // Output buffer, to feed the vertex shader.
                            {
                                binding: 2,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "storage" },
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "Rendering matrix compute",
                    code: wg.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var<storage, read_write> params : ${instanceArrayDesc.typename()};

                        struct InstanceState {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(2) var<storage, write> outp : array<InstanceState, ${instances.toString()}>;

                        @stage(compute) @workgroup_size(${workgroupWidth.toString()}u, ${workgroupHeight.toString()}u)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let idx = global_id.y * ${instancesWidth.toString()}u + global_id.x;

                            var pos = params[idx].pos;

                            let nextpos = pos + params[idx].move;
                            // This is probably horribly inefficient.
                            if (nextpos.x < -${spaceLimit.toFixed(1)} || nextpos.x >= ${spaceLimit.toFixed(1)}) {
                                params[idx].move.x = -params[idx].move.x;
                            }
                            if (nextpos.y < -${spaceLimit.toFixed(1)} || nextpos.y >= ${spaceLimit.toFixed(1)}) {
                                params[idx].move.y = -params[idx].move.y;
                            }
                            if (nextpos.z < -${spaceLimit.toFixed(1)} || nextpos.z >= ${spaceLimit.toFixed(1)}) {
                                params[idx].move.z = -params[idx].move.z;
                            }
                            pos = pos + params[idx].move;
                            params[idx].pos = pos;

                            let TAU = 6.283185;
                            let c = (uniforms.elapsedMs / 1000.0) % TAU;
                            let r = params[idx].rot + vec3<f32>(c, c, c);

                            outp[idx].mvp =
                                ${shaderlib.projection.ref("perspective")}(uniforms.renderWidth / uniforms.renderHeight)
                                * ${shaderlib.tr.ref("translate")}(vec3<f32>(0.0, 0.0, ${zOffset.toFixed(1)}))
                                * ${shaderlib.tr.ref("translate")}(pos)
                                * ${shaderlib.tr.ref("rotateZ")}(r.z)
                                * ${shaderlib.tr.ref("rotateY")}(r.y)
                                * ${shaderlib.tr.ref("rotateX")}(r.x)
                                * ${shaderlib.tr.ref("scale")}(params[idx].scale);
                        }
                    `,
                }).toDesc()),
            }
        });
        const computeBindGroup = params.device.createBindGroup({
            label: "Bind group for the projection matrix compute",
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: instancesBuffer }
                }, {
                    binding: 2,
                    resource: { buffer: computeResult }
                }]
        });
        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const renderPipeline = params.device.createRenderPipeline({
            label: "Cube rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout for compute data",
                        entries: [
                            // Matrix info coming from compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {
                                    type: 'read-only-storage',
                                },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "cube vertex shader",
                    // https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
                    code: wg.wgsl `
                        struct InstanceState {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(0) var<storage> states : array<InstanceState, ${instances.toString()}>;

                        struct Out {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec3<f32>;
                        };

                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32, @builtin(instance_index) instance: u32) -> Out {
                            let pos = ${shaderlib.cubeMeshStrip.ref("mesh")}[idx];

                            var out : Out;
                            out.pos = states[instance].mvp * vec4<f32>(pos + vec3<f32>(0.0, 0.0, 0.0), 1.0);
                            out.pos.x = out.pos.x;
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (pos.y + 1.0) / 2.0;
                            out.coord.z = (pos.z + 1.0) / 2.0;
                            return out;
                        }
                    `,
                }).toDesc())
            },
            primitive: {
                topology: 'triangle-strip',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "trivial fragment shader",
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec3<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, coord.z, 1.0);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: computeResult }
                },
            ]
        });
        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // -- Single frame rendering.
        return async (info) => {
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
                renderWidth: params.renderWidth,
                renderHeight: params.renderHeight,
                rngSeed: Math.random(),
            }));
            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
            commandEncoder.pushDebugGroup('Compute projection');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            // Calculate projection matrices for each instance.
            computeEncoder.dispatch(workgroupWidth, workgroupHeight);
            computeEncoder.endPass();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        storeOp: 'store',
                    }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthLoadValue: 1.0,
                    depthStoreOp: 'store',
                    stencilLoadValue: 0,
                    stencilStoreOp: 'store',
                },
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, renderBindGroup);
            // Cube mesh as a triangle-strip uses 14 vertices.
            renderEncoder.draw(14, instances, 0, 0);
            renderEncoder.endPass();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./src/demos/testlibs.ts":
/*!*******************************!*\
  !*** ./src/demos/testlibs.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// Testing ground for the various helper libraries.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demo = void 0;
const wg = __webpack_require__(/*! ../wg */ "./src/wg.ts");
const shaderlib = __webpack_require__(/*! ../shaderlib */ "./src/shaderlib.ts");
const uniformsDesc = new wg.StructType({
    elapsedMs: wg.Member(wg.F32, 0),
    renderWidth: wg.Member(wg.F32, 1),
    renderHeight: wg.Member(wg.F32, 2),
});
exports.demo = {
    id: "testlibs",
    caption: "Testing the helper libs",
    async init(params) {
        const computePipeline = params.device.createComputePipeline({
            label: "Compute pipeline for projection matrix",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Input buffer, which will be coming from JS.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Output buffer, to feed the vertex shader.
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "storage" },
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "Rendering matrix compute",
                    // Project & rotations from https://github.com/toji/gl-matrix
                    code: wg.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};

                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(1) var<storage, write> outp : Output;

                        @stage(compute) @workgroup_size(1)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let TAU = 6.283185;
                            let c = (uniforms.elapsedMs / 1000.0) % TAU;
                            let r = vec3<f32>(c, c, c);
                            outp.mvp =
                                ${shaderlib.projection.ref("perspective")}(uniforms.renderWidth / uniforms.renderHeight)
                                * ${shaderlib.tr.ref("translate")}(vec3<f32>(0.0, 0.0, -4.0))
                                * ${shaderlib.tr.ref("rotateZ")}(r.z)
                                * ${shaderlib.tr.ref("rotateY")}(r.y)
                                * ${shaderlib.tr.ref("rotateX")}(r.x);
                        }
                    `,
                }).toDesc()),
            }
        });
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const computeResult = params.device.createBuffer({
            label: "Compute output for vertex shaders",
            size: wg.Mat4x4F32.byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
        });
        const computeBindGroup = params.device.createBindGroup({
            label: "Bind group for the projection matrix compute",
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: computeResult }
                }]
        });
        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const renderPipeline = params.device.createRenderPipeline({
            label: "Cube rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout for compute data",
                        entries: [
                            // Matrix info coming from compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {
                                    type: 'read-only-storage',
                                },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new wg.WGSLModule({
                    label: "cube vertex shader",
                    // https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
                    code: wg.wgsl `
                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(0) var<storage> outp : Output;

                        struct Out {
                            @builtin(position) pos: vec4<f32>;
                            @location(0) coord: vec3<f32>;
                        };

                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> Out {
                            let pos = ${shaderlib.cubeMeshStrip.ref("mesh")}[idx];
                            var out : Out;
                            out.pos = outp.mvp * vec4<f32>(pos + vec3<f32>(0.0, 0.0, 0.0), 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (pos.y + 1.0) / 2.0;
                            out.coord.z = (pos.z + 1.0) / 2.0;
                            return out;
                        }
                    `,
                }).toDesc())
            },
            primitive: {
                topology: 'triangle-strip',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "trivial fragment shader",
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec3<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, coord.z, 1.0);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: computeResult,
                    }
                },
            ]
        });
        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // -- Single frame rendering.
        return async (info) => {
            // Fill up the uniforms to feed the compute shaders.
            // Rotation of the cube is just a function of current time,
            // calculated in the compute shader.
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
                renderWidth: params.renderWidth,
                renderHeight: params.renderHeight,
            }));
            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
            commandEncoder.pushDebugGroup('Compute projection');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            // The compute has only a single matrix to compute. More typical compute shaders
            // would dispatch on NxM elements.
            computeEncoder.dispatch(1);
            computeEncoder.endPass();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        storeOp: 'store',
                    }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthLoadValue: 1.0,
                    depthStoreOp: 'store',
                    stencilLoadValue: 0,
                    stencilStoreOp: 'store',
                },
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, renderBindGroup);
            // Cube mesh as a triangle-strip uses 14 vertices.
            renderEncoder.draw(14, 1, 0, 0);
            renderEncoder.endPass();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/// <reference types="@webgpu/types" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppMain = exports.demoByID = exports.allDemos = void 0;
const lit_1 = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
const decorators_js_1 = __webpack_require__(/*! lit/decorators.js */ "./node_modules/lit/decorators.js");
const conway = __webpack_require__(/*! ./demos/conway */ "./src/demos/conway.ts");
const fire = __webpack_require__(/*! ./demos/fire */ "./src/demos/fire.ts");
const fade = __webpack_require__(/*! ./demos/fade */ "./src/demos/fade.ts");
const minimal = __webpack_require__(/*! ./demos/minimal */ "./src/demos/minimal.ts");
const conway2 = __webpack_require__(/*! ./demos/conway2 */ "./src/demos/conway2.ts");
const cube = __webpack_require__(/*! ./demos/cube */ "./src/demos/cube.ts");
const multicubes = __webpack_require__(/*! ./demos/multicubes */ "./src/demos/multicubes.ts");
const testlibs = __webpack_require__(/*! ./demos/testlibs */ "./src/demos/testlibs.ts");
exports.allDemos = [
    conway2.demo,
    fire.demo,
    conway.demo,
    fade.demo,
    minimal.demo,
    cube.demo,
    testlibs.demo,
    multicubes.demo,
];
function demoByID(id) {
    for (const d of exports.allDemos) {
        if (d.id === id) {
            return d;
        }
    }
    return exports.allDemos[0];
}
exports.demoByID = demoByID;
let AppMain = class AppMain extends lit_1.LitElement {
    constructor() {
        super();
        this.webGPUpresent = false;
        this.error = "";
        this.renderWidth = 0;
        this.renderHeight = 0;
        this.paused = false;
        this.step = false;
        this.showControls = this.getBoolParam("c", true);
        this.limitCanvas = this.getBoolParam("l", false);
        this.demoID = this.getStringParam("d", exports.allDemos[0].id);
        document.addEventListener('keydown', e => {
            if (e.key == ' ') {
                this.paused = !this.paused;
            }
            if (e.key == '.') {
                this.paused = true;
                this.step = true;
            }
        });
    }
    render() {
        return (0, lit_1.html) `
            <div id="display">
                <canvas id="canvas"></canvas>
            </div>

            <div id="overlay">
                <div id="controls">
                    ${this.showControls ? (0, lit_1.html) `
                    <div class="labelvalue">
                        <label>Demo</label>
                        <select class="value" @change=${this.demoChange}>
                            ${exports.allDemos.map(d => (0, lit_1.html) `
                                <option value=${d.id} ?selected=${d.id === this.demoID}>${d.id}</option>
                            `)}
                        </select>
                    </div>
                    <div class="doc">${demoByID(this.demoID).caption}</div>
                    <div class="github"><a href="https://github.com/Palats/webgpu">Github source</a></div>
                    <div class="labelvalue">
                        <label>Limit canvas</label>
                        <input class="value" type=checkbox ?checked=${this.limitCanvas} @change=${this.limitCanvasChange}></input>
                    </div>
                    <div class="doc">
                        Set canvas to 816x640, see <a href="https://crbug.com/dawn/1260">crbug.com/dawn/1260</a>
                    </div>
                ` : ``}
                    <div class="line">
                        <button @click="${() => { this.setShowControls(!this.showControls); }}">
                            ${this.showControls ? 'Close' : 'Open'} controls
                        </button>
                    </div>
                </div>
                ${(!this.webGPUpresent || this.error) ? (0, lit_1.html) `
                <div id="errors">
                    ${this.webGPUpresent ? '' : (0, lit_1.html) `
                        <div>
                            Your browser does not support <a href="https://en.wikipedia.org/wiki/WebGPU">WebGPU</a>.
                            WebGPU is a future web standard which is supported by Chrome and Firefox, but requires special configuration. See <a href="https://github.com/Palats/webgpu">README</a> for details on how to activate it.
                        </div>
                    `}
                    ${this.error ? (0, lit_1.html) `
                        <div><pre>${this.error}</pre></div>
                        <div>See javascript console for more details.</div>
                    ` : ``}
                </div>
                ` : ``}
            </div>
        `;
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.canvas = this.renderRoot.querySelector('#canvas');
        this.updateSize();
        new ResizeObserver(() => {
            this.updateSize();
        }).observe(this.canvas);
        this.loop(this.canvas);
    }
    updateSize() {
        if (!this.canvas) {
            return;
        }
        const devicePixelRatio = window.devicePixelRatio || 1;
        let renderWidth = this.canvas.clientWidth * devicePixelRatio;
        let renderHeight = this.canvas.clientHeight * devicePixelRatio;
        if (this.limitCanvas && ((renderWidth > 816) || (renderHeight > 640))) {
            // As of 2021-12-12, Chrome stable & unstable on a Linux (nvidia
            // 460.91.03, 470.86) do not accept a pixel more than 816x640 somehow - "device
            // lost" otherwise.
            renderWidth = 816;
            renderHeight = 640;
        }
        if (!renderWidth || !renderHeight) {
            return;
        }
        if (renderWidth === this.renderWidth && renderHeight === this.renderHeight) {
            return;
        }
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.rebuild(`resize to ${renderWidth}x${renderHeight}`);
    }
    // rebuild tells to stop the current engine and create a new one.
    rebuild(s) {
        this.rebuildNeeded = s;
    }
    // loop is responsible for running each frame when needed, and recreating
    // the engine when requested (e.g., on resize).
    async loop(canvas) {
        while (true) {
            console.log("new engine:", this.rebuildNeeded);
            this.rebuildNeeded = undefined;
            this.webGPUpresent = false;
            this.error = "";
            try {
                if (!navigator.gpu) {
                    throw new Error("no webgpu extension");
                }
                let adapter = null;
                try {
                    // Firefox can have navigator.gpu but still throw when
                    // calling requestAdapter.
                    adapter = await navigator.gpu.requestAdapter();
                }
                catch (e) {
                    console.error("navigator.gpu.requestAdapter failed:", e);
                    throw new Error("requesting adapter failed");
                }
                if (!adapter) {
                    throw new Error("no webgpu adapter");
                }
                const device = await adapter.requestDevice();
                // As of 2021-12-11, Firefox nightly does not support device.lost.
                device.lost.then((e) => {
                    console.error("device lost", e);
                    this.error = "device lost";
                });
                device.onuncapturederror = (ev) => {
                    console.error("webgpu error", ev);
                    this.error = "webgpu device error";
                };
                const context = canvas.getContext('webgpu');
                if (!context) {
                    throw new Error("no webgpu canvas context");
                }
                this.webGPUpresent = true;
                const renderFormat = context.getPreferredFormat(adapter);
                context.configure({
                    device: device,
                    format: renderFormat,
                    size: {
                        width: this.renderWidth,
                        height: this.renderHeight,
                    },
                });
                const renderer = await demoByID(this.demoID).init({
                    context: context,
                    adapter: adapter,
                    device: device,
                    renderFormat: renderFormat,
                    renderWidth: this.renderWidth,
                    renderHeight: this.renderHeight
                });
                if (this.error) {
                    throw new Error("init failed");
                }
                // Render loop
                let elapsedMs = 0;
                let timestampMs = 0;
                while (!this.rebuildNeeded) {
                    const ts = await new Promise(window.requestAnimationFrame);
                    let deltaMs = 0;
                    if (timestampMs) {
                        deltaMs = ts - timestampMs;
                    }
                    timestampMs = ts;
                    // Even when paused, continue updating timestampMs - this
                    // way, when resuming, it will just count a delta of a
                    // single frame instead of the full time since paused.
                    if (this.paused && !this.step) {
                        continue;
                    }
                    this.step = false;
                    elapsedMs += deltaMs;
                    await renderer({
                        timestampMs: ts,
                        elapsedMs: elapsedMs,
                        deltaMs: deltaMs,
                    });
                    if (this.error) {
                        throw new Error("frame failed");
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            catch (e) {
                console.error("Run:", e);
                if (e instanceof Error) {
                    this.error = e.toString();
                }
                else {
                    this.error = "generic error";
                }
                // And now, wait for something to tell us to retry.
                // Could be better done with a proper event, but here we are.
                while (!this.rebuildNeeded) {
                    await new Promise(window.requestAnimationFrame);
                }
            }
        }
    }
    limitCanvasChange(evt) {
        const checked = evt.target.checked;
        if (checked === this.limitCanvas) {
            return;
        }
        this.limitCanvas = checked;
        this.updateURL("l", this.limitCanvas);
        this.updateSize();
    }
    setShowControls(v) {
        this.updateURL("c", v);
        this.showControls = v;
    }
    demoChange(evt) {
        const options = evt.target.selectedOptions;
        if (!options) {
            return;
        }
        const v = options[0].value;
        if (this.demoID === v) {
            return;
        }
        this.demoID = v;
        this.updateURL("d", this.demoID);
        this.rebuild("changed demo");
    }
    updateURL(k, v) {
        if (typeof v == "boolean") {
            v = v === true ? "1" : "0";
        }
        const params = new URLSearchParams(window.location.search);
        params.set(k, v);
        history.pushState(null, '', window.location.pathname + '?' + params.toString());
    }
    getBoolParam(k, defvalue = false) {
        const params = new URLSearchParams(window.location.search);
        const v = params.get(k);
        if (v === null) {
            return defvalue;
        }
        if (v === "1" || v.toLowerCase() === "false") {
            return true;
        }
        return false;
    }
    getStringParam(k, defvalue = "") {
        const params = new URLSearchParams(window.location.search);
        const v = params.get(k);
        if (v === null) {
            return defvalue;
        }
        return v;
    }
};
AppMain.styles = (0, lit_1.css) `
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
            background-color: black;
        }

        #overlay {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;

            display: grid;
            grid-template-columns: 250px 100fr;
            align-items: start;
        }

        #controls {
            background-color: #d6d6d6f0;
            border: #8b8b8b 1px solid;
            grid-column-start: 1;
            grid-column-end: 2;
            font-size: 11px;
        }

        .doc {
            font-style: italic;
            font-size: 12px;
            padding: 2px 1px 2px 1px;
        }

        .github {
            display: flex;
            justify-content: center;
            border-top: 1px solid #4d4d4d;
            font-size: 14px;
            font-style: italic;
        }

        .labelvalue {
            display: grid;
            grid-template-columns: 8em 100fr;
            grid-template-rows: 100fr;

            border-top: 1px solid #4d4d4d;
            padding: 2px 1px 2px 1px;
            font: 11px 'Lucida Grande', sans-serif;
        }

        .labelvalue select, .labelvalue input {
            font: 11px 'Lucida Grande', sans-serif;
            margin: 0;
        }

        .labelvalue label {
            grid-column-start: 1;
            grid-column-end: 2;
        }

        .value {
            grid-column-start: 2;
            grid-column-end: 3;
        }

        .line {
            border-top: 1px solid #4d4d4d;
            display: flex;
            justify-content: center;
        }

        .line button {
            flex-grow: 1;
            font: italic 11px 'Lucida Grande', sans-serif;
            border: none;
            background-color: transparent;
        }

        #errors {
            background-color: #ffbebede;
            grid-column-start: 2;
            grid-column-end: 3;
            padding: 2px;
        }
    `;
__decorate([
    (0, decorators_js_1.property)({ type: Boolean })
], AppMain.prototype, "webGPUpresent", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AppMain.prototype, "error", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean })
], AppMain.prototype, "showControls", void 0);
__decorate([
    (0, decorators_js_1.property)({ type: Boolean })
], AppMain.prototype, "limitCanvas", void 0);
__decorate([
    (0, decorators_js_1.property)()
], AppMain.prototype, "demoID", void 0);
AppMain = __decorate([
    (0, decorators_js_1.customElement)('app-main')
], AppMain);
exports.AppMain = AppMain;
// Setup base document.
const htmlElt = document.body.parentElement;
htmlElt.style.height = '100%';
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.backgroundColor = '#888800';
document.body.appendChild(document.createElement("app-main"));


/***/ }),

/***/ "./src/shaderlib.ts":
/*!**************************!*\
  !*** ./src/shaderlib.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rand = exports.cubeMeshStrip = exports.tr = exports.projection = void 0;
const wg = __webpack_require__(/*! ./wg */ "./src/wg.ts");
// Functions to calculate projection matrices.
exports.projection = new wg.WGSLModule({
    label: "projection matrices",
    code: wg.wgsl `
        fn @@perspective(aspect: f32) -> mat4x4<f32> {
            // Hard coded projection parameters - for more flexibility,
            // we could imagine getting them from the uniforms.
            let fovy = 2.0 * 3.14159 / 5.0; // Vertical field of view (rads)
            let near = 1.0;
            let far = 100.0;

            let f = 1.0 / tan(fovy / 2.0);
            let nf = 1.0 / (near - far);

            return mat4x4<f32>(
                f / aspect, 0.0, 0.0, 0.0,
                0.0, f, 0.0, 0.0,
                0.0, 0.0, (far + near) * nf, -1.0,
                0.0, 0.0, 2.0 * far * near * nf, 0.0,
            );
        }`,
});
// Functions for common transformations - translation, rotation.
exports.tr = new wg.WGSLModule({
    label: "transform matrices",
    code: wg.wgsl `
        fn @@translate(tr : vec3<f32>) -> mat4x4<f32> {
            return mat4x4<f32>(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                tr.x, tr.y, tr.z, 1.0,
            );
        }

        fn @@scale(ratio: f32) -> mat4x4<f32> {
            return mat4x4<f32>(
                ratio, 0.0, 0.0, 0.0,
                0.0, ratio, 0.0, 0.0,
                0.0, 0.0, ratio, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }

        fn @@rotateX(rad: f32) -> mat4x4<f32> {
            let s = sin(rad);
            let c = cos(rad);
            return mat4x4<f32>(
                1.0, 0.0, 0.0, 0.0,
                0.0, c, s, 0.0,
                0.0, -s, c, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }

        fn @@rotateY(rad: f32) -> mat4x4<f32> {
            let s = sin(rad);
            let c = cos(rad);
            return mat4x4<f32>(
                c, 0.0, -s, 0.0,
                0.0, 1.0, 0.0, 0.0,
                s, 0.0, c, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }

        fn @@rotateZ(rad: f32) -> mat4x4<f32> {
            let s = sin(rad);
            let c = cos(rad);
            return mat4x4<f32>(
                c, s, 0.0, 0.0,
                -s, c, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }
        `,
});
// An hard coded list of vertex for a cube declared as triangle strip.
// Cube is between -1 and +1.
// https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
exports.cubeMeshStrip = new wg.WGSLModule({
    label: "mesh for a cube triangle strip",
    code: wg.wgsl `
        let @@mesh = array<vec3<f32>, 14>(
            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
            vec3<f32>(-1.f, -1.f, 1.f),     // Front-bottom-right
            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
            vec3<f32>(-1.f, 1.f, -1.f),     // Back-top-right
            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
            vec3<f32>(1.f, -1.f, -1.f),   // Back-bottom-left
            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
            vec3<f32>(-1.f, 1.f, -1.f),      // Back-top-right
        );
    `,
});
exports.rand = new wg.WGSLModule({
    label: "random functions",
    code: wg.wgsl `
        fn @@meh(a: f32, b: f32) -> f32 {
            return fract(sin(dot(vec2<f32>(a, b), vec2<f32>(12.9898,78.233)))*43758.5453123);
        }
    `,
});


/***/ }),

/***/ "./src/wg.ts":
/*!*******************!*\
  !*** ./src/wg.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// A WebGPU helper libraries. For now, providers:
//   - WGSLModule: A way to import / manage a library of reusable WGSL code.
//   - A way to manage mapping between Javascript types and WGSL types, for
//     simple buffer translation.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vec32f32 = exports.Mat4x4F32 = exports.ArrayType = exports.StructType = exports.F32 = exports.U32 = exports.Member = exports.wgsl = exports.WGSLModule = exports.lang = exports.types = void 0;
exports.types = __webpack_require__(/*! ./wg/types */ "./src/wg/types.ts");
exports.lang = __webpack_require__(/*! ./wg/lang */ "./src/wg/lang.ts");
var lang_1 = __webpack_require__(/*! ./wg/lang */ "./src/wg/lang.ts");
Object.defineProperty(exports, "WGSLModule", ({ enumerable: true, get: function () { return lang_1.WGSLModule; } }));
Object.defineProperty(exports, "wgsl", ({ enumerable: true, get: function () { return lang_1.wgsl; } }));
var types_1 = __webpack_require__(/*! ./wg/types */ "./src/wg/types.ts");
Object.defineProperty(exports, "Member", ({ enumerable: true, get: function () { return types_1.Member; } }));
Object.defineProperty(exports, "U32", ({ enumerable: true, get: function () { return types_1.U32; } }));
Object.defineProperty(exports, "F32", ({ enumerable: true, get: function () { return types_1.F32; } }));
Object.defineProperty(exports, "StructType", ({ enumerable: true, get: function () { return types_1.StructType; } }));
Object.defineProperty(exports, "ArrayType", ({ enumerable: true, get: function () { return types_1.ArrayType; } }));
Object.defineProperty(exports, "Mat4x4F32", ({ enumerable: true, get: function () { return types_1.Mat4x4F32; } }));
Object.defineProperty(exports, "Vec32f32", ({ enumerable: true, get: function () { return types_1.Vec32f32; } }));


/***/ }),

/***/ "./src/wg/lang.ts":
/*!************************!*\
  !*** ./src/wg/lang.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


// The following providing a kind of WGSL import system.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wgsl = exports.WGSLCode = exports.WGSLRef = exports.WGSLName = exports.WGSLModule = void 0;
/// <reference types="@webgpu/types" />
class WGSLModule {
    constructor(cfg) {
        this.imports = [];
        this.symbols = new Set();
        if (cfg.imports) {
            this.imports.push(...cfg.imports);
        }
        this.label = cfg.label ?? "<unnamed>";
        this.code = cfg.code;
        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                if (this.symbols.has(token.name)) {
                    throw new Error("duplicate symbol");
                }
                this.symbols.add(token.name);
            }
            else if (token instanceof WGSLRef) {
                if (!token.mod.symbols.has(token.name)) {
                    throw new Error(`reference to unknown symbol "${token.name}" in module "${token.mod.label}" from module "${this.label}"`);
                }
                this.imports.push(token.mod);
            }
        }
    }
    // Create a reference to a symbol this module "exports".
    ref(name) {
        return new WGSLRef(this, name);
    }
    importOrder() {
        const ordered = [];
        const imported = new Set();
        const next = (mod, seen) => {
            seen.add(mod);
            for (const imp of mod.imports) {
                if (seen.has(imp)) {
                    throw new Error("import cycle");
                }
                if (!imported.has(imp)) {
                    next(imp, seen);
                }
            }
            imported.add(mod);
            ordered.push(mod);
            seen.delete(mod);
        };
        next(this, new Set());
        return ordered;
    }
    // Create a text representation of the code of this module only.
    render(imports) {
        const prefix = imports.get(this);
        if (prefix === undefined) {
            throw new Error(`internal: module "${this.label}" is imported but has no prefix`);
        }
        let s = '';
        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                s += prefix + token.name;
            }
            else if (token instanceof WGSLRef) {
                const refPrefix = imports.get(token.mod);
                if (refPrefix === undefined) {
                    throw new Error("module not found");
                }
                s += refPrefix + token.name;
            }
            else {
                s += token;
            }
        }
        s = stripExtraIndent(s);
        s = `\n// -------- Module: ${this.label} --------\n` + s;
        return s;
    }
    // Render the code of this module with all its dependencies.
    generate() {
        const mods = this.importOrder();
        const imports = new Map();
        for (const [idx, mod] of mods.entries()) {
            imports.set(mod, `m${idx}_`);
        }
        const textMods = [];
        for (const mod of mods) {
            textMods.push(mod.render(imports));
        }
        const s = textMods.join("\n");
        console.groupCollapsed(`Generated shader code "${this.label}"`);
        console.log(s);
        console.groupEnd();
        return textMods.join("\n");
    }
    toDesc() {
        return {
            label: this.label,
            code: this.generate(),
            // sourceMap
            // hint
        };
    }
}
exports.WGSLModule = WGSLModule;
class WGSLName {
    constructor(name) {
        this.name = name;
    }
}
exports.WGSLName = WGSLName;
class WGSLRef {
    constructor(mod, name) {
        this.mod = mod;
        this.name = name;
    }
}
exports.WGSLRef = WGSLRef;
// https://gpuweb.github.io/gpuweb/wgsl/#identifiers
const markersRE = /@@(([a-zA-Z_][0-9a-zA-Z][0-9a-zA-Z_]*)|([a-zA-Z][0-9a-zA-Z_]*))/g;
// WGSLCode holds a snippet of code, without parsing.
// This is used to allow mixing actual text representation of WGSL but also
// Javascript references to other module - that are interpretated differently
// when "rendering" the WGSL code.
class WGSLCode {
    constructor(tokens) {
        this.tokens = [...tokens];
    }
}
exports.WGSLCode = WGSLCode;
// Declare WGSLCode using template strings.
function wgsl(strings, ...keys) {
    const tokens = [...wgslSplit(strings[0])];
    for (let i = 1; i < strings.length; i++) {
        const token = keys[i - 1];
        if (Array.isArray(token)) {
            for (const subtoken of token) {
                tokens.push(...subtoken.tokens);
            }
        }
        else if (token instanceof WGSLCode) {
            tokens.push(...token.tokens);
        }
        else if (typeof token === "string") {
            tokens.push(...wgslSplit(token));
        }
        else {
            tokens.push(token);
        }
        tokens.push(...wgslSplit(strings[i]));
    }
    return new WGSLCode(tokens);
}
exports.wgsl = wgsl;
function wgslSplit(s) {
    const tokens = [];
    let prevIndex = 0;
    for (const m of s.matchAll(markersRE)) {
        if (m.index === undefined) {
            throw new Error("oops");
        }
        if (m.index > prevIndex) {
            tokens.push(s.slice(prevIndex, m.index));
        }
        prevIndex = m.index + m[0].length;
        tokens.push(new WGSLName(m[1]));
    }
    if (prevIndex < s.length) {
        tokens.push(s.slice(prevIndex, s.length));
    }
    return tokens;
}
// Find if there is a common indentation on all lines (spaces, tabs) and remove
// it.
// Lines with only spaces and tabs are ignored.
// Also removes trailing spaces.
function stripExtraIndent(s) {
    const lines = s.split("\n");
    let prefix = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trimEnd();
        lines[i] = line;
        if (line.length > 0) {
            if (prefix === null) {
                prefix = line.match(/^[ \t]*/)[0];
            }
            else {
                let idx = 0;
                while (idx < prefix.length && idx < line.length && line[idx] == prefix[idx]) {
                    idx++;
                }
                prefix = prefix.slice(0, idx);
            }
        }
    }
    if (prefix !== null) {
        for (let i = 0; i < lines.length; i++) {
            if (lines.length == 0) {
                continue;
            }
            lines[i] = lines[i].slice(prefix.length);
        }
    }
    return lines.join("\n");
}
function testWGSLModules() {
    console.group("testWGSL");
    console.log("tagged template 1", wgsl ``);
    console.log("tagged template 2", wgsl `a`);
    console.log("tagged template 3", wgsl `${"plop"}`);
    console.log("tagged template 4", wgsl `foo @@bar plop`);
    const testModule1 = new WGSLModule({
        label: "test1",
        code: wgsl `
            foo
            coin @@bar plop
        `,
    });
    const testModule2 = new WGSLModule({
        label: "test2",
        code: wgsl `
            foo ${testModule1.ref("bar")}
        `,
    });
    console.log("render1", testModule2.toDesc().code);
    console.groupEnd();
}


/***/ }),

/***/ "./src/wg/types.ts":
/*!*************************!*\
  !*** ./src/wg/types.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// The following contains an attempt at making it easier to manipulate basic
// uniforms - i.e., maintaing a buffer content with structured data from
// Javascript.
// It is a bit overcomplicated in order to keep typing work.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StructType = exports.Member = exports.ArrayType = exports.Mat4x4F32 = exports.Vec32f32 = exports.U32 = exports.F32 = void 0;
const lang = __webpack_require__(/*! ./lang */ "./src/wg/lang.ts");
const wgsl = lang.wgsl;
// Basic class to represent info about a given WGSL type. The template parameter
// is the type of the value it maps to in javascript.
class WGSLType {
}
// Info about WGSL `f32` type.
class F32Type extends WGSLType {
    byteSize() { return 4; }
    alignOf() { return 4; }
    dataViewSet(dv, offset, v) {
        dv.setFloat32(offset, v, true);
    }
    typename() {
        return wgsl `f32`;
    }
}
exports.F32 = new F32Type();
// Info about WGSL `u32` type.
class U32Type extends WGSLType {
    byteSize() { return 4; }
    alignOf() { return 4; }
    dataViewSet(dv, offset, v) {
        dv.setInt32(offset, v, true);
    }
    typename() {
        return wgsl `u32`;
    }
}
exports.U32 = new U32Type();
// Info about WGSL `vec3<f32>` type.
class Vec3f32Type extends WGSLType {
    byteSize() { return 12; }
    alignOf() { return 16; }
    dataViewSet(dv, offset, v) {
        dv.setFloat32(offset, v[0], true);
        dv.setFloat32(offset + exports.F32.byteSize(), v[1], true);
        dv.setFloat32(offset + 2 * exports.F32.byteSize(), v[2], true);
    }
    typename() {
        return wgsl `vec3<f32>`;
    }
}
exports.Vec32f32 = new Vec3f32Type();
// mat4x4<f32> WGSL type.
class Mat4x4F32Type extends WGSLType {
    byteSize() { return 64; }
    alignOf() { return 16; }
    dataViewSet(dv, offset, v) {
        for (let i = 0; i < 16; i++) {
            dv.setFloat32(offset, v[i], true);
            offset += exports.F32.byteSize();
        }
    }
    typename() {
        return wgsl `mat4x4<f32>`;
    }
}
exports.Mat4x4F32 = new Mat4x4F32Type();
// A WGSL array containing type T.
class ArrayType extends WGSLType {
    constructor(etype, count) {
        super();
        this.etype = etype;
        this.count = count;
        this.stride = this.etype.alignOf() * Math.ceil(this.etype.byteSize() / this.etype.alignOf());
    }
    byteSize() { return this.count * this.stride; }
    alignOf() { return this.etype.alignOf(); }
    dataViewSet(dv, offset, v) {
        for (let i = 0; i < this.count; i++) {
            this.etype.dataViewSet(dv, offset, v[i]);
            offset += this.stride;
        }
    }
    typename() {
        return wgsl `array<${this.etype.typename()}, ${this.count.toString()}>`;
    }
}
exports.ArrayType = ArrayType;
// Description of a given member of a WGSL struct.
class MemberType {
    constructor(t, idx) {
        this.idx = idx;
        this.type = t;
    }
}
// Declare a field of the given type, at the given position. Index of the field
// in the struct is mandatory, to reduce renaming and moving mistakes.
function Member(type, idx) {
    return new MemberType(type, idx);
}
exports.Member = Member;
// Description of a WGSL struct allowing mapping between javascript and WGSL.
// An instance of a StructType describes just the layout of the struct:
//  - The MemberMap (aka MM) descripts the list of members - name, position in
//    the struct.
//  - StructJSType<StructType<MM>> describes javascript object, which member
//    names are the same as the struct. The type of the value are the typescript
//    types corresponding to the WGSL values - e.g., a `f32` is mapped to a number.
class StructType extends WGSLType {
    constructor(members) {
        super();
        this.members = members;
        this.byIndex = [];
        if (members.length < 1) {
            // Not sure if empty struct are valid in WGSL - in the mean time,
            // reject.
            throw new Error("struct must have at least one member");
        }
        for (const [name, member] of Object.entries(members)) {
            if (!(member instanceof MemberType)) {
                continue;
            }
            if (this.byIndex[member.idx]) {
                throw new Error(`member index ${member.idx} is duplicated`);
            }
            this.byIndex[member.idx] = {
                member: member,
                name,
                // No support for @size & @align attributes for now.
                sizeOf: member.type.byteSize(),
                alignOf: member.type.alignOf(),
                // Calculated below
                offset: 0,
            };
        }
        // Struct offsets, size and aligns are non-trivial - see
        // https://gpuweb.github.io/gpuweb/wgsl/#structure-member-layout
        this._byteSize = 0;
        this._alignOf = 0;
        for (const [idx, smember] of this.byIndex.entries()) {
            if (!smember) {
                throw new Error(`missing member index ${idx}`);
            }
            if (idx > 0) {
                const prev = this.byIndex[idx - 1];
                smember.offset = smember.alignOf * Math.ceil((prev.offset + prev.sizeOf) / smember.alignOf);
            }
            this._alignOf = Math.max(this._alignOf, smember.alignOf);
        }
        const last = this.byIndex[this.byIndex.length - 1];
        this._byteSize = this._alignOf * Math.ceil((last.offset + last.sizeOf) / this._alignOf);
    }
    byteSize() { return this._byteSize; }
    alignOf() { return this._alignOf; }
    // Take an object containg the value for each member, and write it
    // in the provided data view.
    dataViewSet(dv, offset, v) {
        for (const smember of this.byIndex) {
            smember.member.type.dataViewSet(dv, offset + smember.offset, v[smember.name]);
        }
    }
    // Create an array containing the serialized value from each member.
    createArray(values) {
        const a = new ArrayBuffer(this.byteSize());
        this.dataViewSet(new DataView(a), 0, values);
        return a;
    }
    // Refer to that structure type in a WGSL fragment. It will take care of
    // creating a name and inserting the struct declaration as needed.
    typename() {
        if (!this.mod) {
            const lines = [
                wgsl `// sizeOf: ${this.byteSize().toString()} ; alignOf: ${this.alignOf().toString()}\n`,
                wgsl `struct @@structname {\n`,
            ];
            for (const smember of this.byIndex) {
                lines.push(wgsl `  // offset: ${smember.offset.toString()} sizeOf: ${smember.sizeOf.toString()} ; alignOf: ${smember.alignOf.toString()}\n`);
                lines.push(wgsl `  ${smember.name}: ${smember.member.type.typename()};\n`);
            }
            lines.push(wgsl `};\n`);
            this.mod = new lang.WGSLModule({
                label: "buffer struct declaration",
                code: wgsl `${lines}`,
            });
        }
        return wgsl `${new lang.WGSLRef(this.mod, "structname")}`;
    }
}
exports.StructType = StructType;
//-----------------------------------------------
// Basic test
function testBuffer() {
    console.group("testBuffer");
    const uniformsDesc = new StructType({
        elapsedMs: Member(exports.F32, 0),
        renderWidth: Member(exports.F32, 1),
        renderHeight: Member(exports.F32, 2),
        plop: Member(new ArrayType(exports.F32, 4), 3),
    });
    console.log("byteSize", uniformsDesc.byteSize);
    console.log("content", uniformsDesc.createArray({
        elapsedMs: 10,
        renderWidth: 320,
        renderHeight: 200,
        plop: [1, 2, 3],
    }));
    const foo = new ArrayType(uniformsDesc, 4);
    const a = new ArrayBuffer(foo.byteSize());
    foo.dataViewSet(new DataView(a), 0, [
        { elapsedMs: 10, renderWidth: 320, renderHeight: 200, plop: [0, 1, 3] },
    ]);
    console.groupEnd();
}
// testBuffer();


/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/css-tag.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/css-tag.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* binding */ supportsAdoptingStyleSheets),
/* harmony export */   "CSSResult": () => (/* binding */ CSSResult),
/* harmony export */   "unsafeCSS": () => (/* binding */ unsafeCSS),
/* harmony export */   "css": () => (/* binding */ css),
/* harmony export */   "adoptStyles": () => (/* binding */ adoptStyles),
/* harmony export */   "getCompatibleStyle": () => (/* binding */ getCompatibleStyle)
/* harmony export */ });
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = window.ShadowRoot &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
const styleSheetCache = new Map();
/**
 * A container for a string of CSS text, that may be used to create a CSSStyleSheet.
 *
 * CSSResult is the return value of `css`-tagged template literals and
 * `unsafeCSS()`. In order to ensure that CSSResults are only created via the
 * `css` tag and `unsafeCSS()`, CSSResult cannot be constructed directly.
 */
class CSSResult {
    constructor(cssText, safeToken) {
        // This property needs to remain unminified.
        this['_$cssResult$'] = true;
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        // Note, if `supportsAdoptingStyleSheets` is true then we assume
        // CSSStyleSheet is constructable.
        let styleSheet = styleSheetCache.get(this.cssText);
        if (supportsAdoptingStyleSheets && styleSheet === undefined) {
            styleSheetCache.set(this.cssText, (styleSheet = new CSSStyleSheet()));
            styleSheet.replaceSync(this.cssText);
        }
        return styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    // This property needs to remain unminified.
    if (value['_$cssResult$'] === true) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ` +
            `${value}. Use 'unsafeCSS' to pass non-literal values, but take care ` +
            `to ensure page security.`);
    }
};
/**
 * Wrap a value for interpolation in a [[`css`]] tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => new CSSResult(typeof value === 'string' ? value : String(value), constructionToken);
/**
 * A template literal tag which can be used with LitElement's
 * [[LitElement.styles | `styles`]] property to set element styles.
 *
 * For security reasons, only literal string values and number may be used in
 * embedded expressions. To incorporate non-literal values [[`unsafeCSS`]] may
 * be used inside an expression.
 */
const css = (strings, ...values) => {
    const cssText = strings.length === 1
        ? strings[0]
        : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};
/**
 * Applies the given styles to a `shadowRoot`. When Shadow DOM is
 * available but `adoptedStyleSheets` is not, styles are appended to the
 * `shadowRoot` to [mimic spec behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
 * Note, when shimming is used, any styles that are subsequently placed into
 * the shadowRoot should be placed *before* any shimmed adopted styles. This
 * will match spec behavior that gives adopted sheets precedence over styles in
 * shadowRoot.
 */
const adoptStyles = (renderRoot, styles) => {
    if (supportsAdoptingStyleSheets) {
        renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    }
    else {
        styles.forEach((s) => {
            const style = document.createElement('style');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nonce = window['litNonce'];
            if (nonce !== undefined) {
                style.setAttribute('nonce', nonce);
            }
            style.textContent = s.cssText;
            renderRoot.appendChild(style);
        });
    }
};
const cssResultFromStyleSheet = (sheet) => {
    let cssText = '';
    for (const rule of sheet.cssRules) {
        cssText += rule.cssText;
    }
    return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets
    ? (s) => s
    : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
//# sourceMappingURL=css-tag.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/base.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/base.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "legacyPrototypeMethod": () => (/* binding */ legacyPrototypeMethod),
/* harmony export */   "standardPrototypeMethod": () => (/* binding */ standardPrototypeMethod),
/* harmony export */   "decorateProperty": () => (/* binding */ decorateProperty)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const legacyPrototypeMethod = (descriptor, proto, name) => {
    Object.defineProperty(proto, name, descriptor);
};
const standardPrototypeMethod = (descriptor, element) => ({
    kind: 'method',
    placement: 'prototype',
    key: element.key,
    descriptor,
});
/**
 * Helper for decorating a property that is compatible with both TypeScript
 * and Babel decorators. The optional `finisher` can be used to perform work on
 * the class. The optional `descriptor` should return a PropertyDescriptor
 * to install for the given property.
 *
 * @param finisher {function} Optional finisher method; receives the element
 * constructor and property key as arguments and has no return value.
 * @param descriptor {function} Optional descriptor method; receives the
 * property key as an argument and returns a property descriptor to define for
 * the given property.
 * @returns {ClassElement|void}
 */
const decorateProperty = ({ finisher, descriptor, }) => (protoOrDescriptor, name
// Note TypeScript requires the return type to be `void|any`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
    var _a;
    // TypeScript / Babel legacy mode
    if (name !== undefined) {
        const ctor = protoOrDescriptor
            .constructor;
        if (descriptor !== undefined) {
            Object.defineProperty(protoOrDescriptor, name, descriptor(name));
        }
        finisher === null || finisher === void 0 ? void 0 : finisher(ctor, name);
        // Babel standard mode
    }
    else {
        // Note, the @property decorator saves `key` as `originalKey`
        // so try to use it here.
        const key = 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_a = protoOrDescriptor.originalKey) !== null && _a !== void 0 ? _a : protoOrDescriptor.key;
        const info = descriptor != undefined
            ? {
                kind: 'method',
                placement: 'prototype',
                key,
                descriptor: descriptor(protoOrDescriptor.key),
            }
            : { ...protoOrDescriptor, key };
        if (finisher != undefined) {
            info.finisher = function (ctor) {
                finisher(ctor, key);
            };
        }
        return info;
    }
};
//# sourceMappingURL=base.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/custom-element.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/custom-element.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* binding */ customElement)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        },
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```js
 * @customElement('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The tag name of the custom element to define.
 */
const customElement = (tagName) => (classOrDescriptor) => typeof classOrDescriptor === 'function'
    ? legacyCustomElement(tagName, classOrDescriptor)
    : standardCustomElement(tagName, classOrDescriptor);
//# sourceMappingURL=custom-element.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/event-options.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/event-options.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eventOptions": () => (/* binding */ eventOptions)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}`>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
function eventOptions(options) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        finisher: (ctor, name) => {
            Object.assign(ctor.prototype[name], options);
        },
    });
}
//# sourceMappingURL=event-options.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/property.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/property.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "property": () => (/* binding */ property)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' &&
        element.descriptor &&
        !('value' in element.descriptor)) {
        return {
            ...element,
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            },
        };
    }
    else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // store the original key so subsequent decorators have access to it.
            originalKey: element.key,
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            },
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a reactive property that reflects a
 * corresponding attribute value. When a decorated property is set
 * the element will update and render. A [[`PropertyDeclaration`]] may
 * optionally be supplied to configure property features.
 *
 * This decorator should only be used for public fields. As public fields,
 * properties should be considered as primarily settable by element users,
 * either via attribute or the property itself.
 *
 * Generally, properties that are changed by the element should be private or
 * protected fields and should use the [[`state`]] decorator.
 *
 * However, sometimes element code does need to set a public property. This
 * should typically only be done in response to user interaction, and an event
 * should be fired informing the user; for example, a checkbox sets its
 * `checked` property when clicked and fires a `changed` event. Mutating public
 * properties should typically not be done for non-primitive (object or array)
 * properties. In other cases when an element needs to manage state, a private
 * property decorated via the [[`state`]] decorator should be used. When needed,
 * state properties can be initialized via public properties to facilitate
 * complex interactions.
 *
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function property(options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (protoOrDescriptor, name) => name !== undefined
        ? legacyProperty(options, protoOrDescriptor, name)
        : standardProperty(options, protoOrDescriptor);
}
//# sourceMappingURL=property.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-all.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-all.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAll": () => (/* binding */ queryAll)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * ```ts
 * class MyElement {
 *   @queryAll('div')
 *   divs;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAll(selector) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            get() {
                var _a, _b;
                return (_b = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector)) !== null && _b !== void 0 ? _b : [];
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-all.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAssignedNodes": () => (/* binding */ queryAssignedNodes)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 *
 * @param slotName A string name of the slot.
 * @param flatten A boolean which when true flattens the assigned nodes,
 *     meaning any assigned nodes that are slot elements are replaced with their
 *     assigned nodes.
 * @param selector A string which filters the results to elements that match
 *     the given css selector.
 *
 * ```ts
 * class MyElement {
 *   @queryAssignedNodes('list', true, '.item')
 *   listItems;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAssignedNodes(slotName = '', flatten = false, selector = '') {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            get() {
                var _a, _b, _c;
                const slotSelector = `slot${slotName ? `[name=${slotName}]` : ':not([name])'}`;
                const slot = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(slotSelector);
                let nodes = (_c = (_b = slot) === null || _b === void 0 ? void 0 : _b.assignedNodes({ flatten })) !== null && _c !== void 0 ? _c : [];
                if (selector) {
                    nodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE &&
                        node.matches(selector));
                }
                return nodes;
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-assigned-nodes.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-async.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-async.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAsync": () => (/* binding */ queryAsync)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
function queryAsync(selector) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            async get() {
                var _a;
                await this.updateComplete;
                return (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-async.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "query": () => (/* binding */ query)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 *     once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function query(selector, cache) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (name) => {
            const descriptor = {
                get() {
                    var _a, _b;
                    return (_b = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector)) !== null && _b !== void 0 ? _b : null;
                },
                enumerable: true,
                configurable: true,
            };
            if (cache) {
                const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
                descriptor.get = function () {
                    var _a, _b;
                    if (this[key] === undefined) {
                        this[key] = (_b = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector)) !== null && _b !== void 0 ? _b : null;
                    }
                    return this[key];
                };
            }
            return descriptor;
        },
    });
}
//# sourceMappingURL=query.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/state.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/state.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "state": () => (/* binding */ state)
/* harmony export */ });
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./property.js */ "./node_modules/@lit/reactive-element/development/decorators/property.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

/**
 * Declares a private or protected reactive property that still triggers
 * updates to the element when it changes. It does not reflect from the
 * corresponding attribute.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 * @category Decorator
 */
function state(options) {
    return (0,_property_js__WEBPACK_IMPORTED_MODULE_0__.property)({
        ...options,
        state: true,
    });
}
//# sourceMappingURL=state.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/reactive-element.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/reactive-element.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS),
/* harmony export */   "defaultConverter": () => (/* binding */ defaultConverter),
/* harmony export */   "notEqual": () => (/* binding */ notEqual),
/* harmony export */   "ReactiveElement": () => (/* binding */ ReactiveElement)
/* harmony export */ });
/* harmony import */ var _css_tag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css-tag.js */ "./node_modules/@lit/reactive-element/development/css-tag.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c;
var _d;
/**
 * Use this module if you want to create your own base class extending
 * [[ReactiveElement]].
 * @packageDocumentation
 */


const DEV_MODE = true;
let requestUpdateThenable;
let issueWarning;
const trustedTypes = window
    .trustedTypes;
// Temporary workaround for https://crbug.com/993268
// Currently, any attribute starting with "on" is considered to be a
// TrustedScript source. Such boolean attributes must be set to the equivalent
// trusted emptyScript value.
const emptyStringForBooleanAttribute = trustedTypes
    ? trustedTypes.emptyScript
    : '';
const polyfillSupport = DEV_MODE
    ? window.reactiveElementPolyfillSupportDevMode
    : window.reactiveElementPolyfillSupport;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    const issuedWarnings = ((_a = globalThis.litIssuedWarnings) !== null && _a !== void 0 ? _a : (globalThis.litIssuedWarnings = new Set()));
    // Issue a warning, if we haven't already.
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!issuedWarnings.has(warning)) {
            console.warn(warning);
            issuedWarnings.add(warning);
        }
    };
    issueWarning('dev-mode', `Lit is in dev mode. Not recommended for production!`);
    // Issue polyfill support warning.
    if (((_b = window.ShadyDOM) === null || _b === void 0 ? void 0 : _b.inUse) && polyfillSupport === undefined) {
        issueWarning('polyfill-support-missing', `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
            `the \`polyfill-support\` module has not been loaded.`);
    }
    requestUpdateThenable = (name) => ({
        then: (onfulfilled, _onrejected) => {
            issueWarning('request-update-promise', `The \`requestUpdate\` method should no longer return a Promise but ` +
                `does so on \`${name}\`. Use \`updateComplete\` instead.`);
            if (onfulfilled !== undefined) {
                onfulfilled(false);
            }
        },
    });
}
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                value = value ? emptyStringForBooleanAttribute : null;
                break;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                value = value == null ? value : JSON.stringify(value);
                break;
        }
        return value;
    },
    fromAttribute(value, type) {
        let fromValue = value;
        switch (type) {
            case Boolean:
                fromValue = value !== null;
                break;
            case Number:
                fromValue = value === null ? null : Number(value);
                break;
            case Object:
            case Array:
                // Do *not* generate exception when invalid JSON is set as elements
                // don't normally complain on being mis-configured.
                // TODO(sorvell): Do generate exception in *dev mode*.
                try {
                    // Assert to adhere to Bazel's "must type assert JSON parse" rule.
                    fromValue = JSON.parse(value);
                }
                catch (e) {
                    fromValue = null;
                }
                break;
        }
        return fromValue;
    },
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual,
};
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
class ReactiveElement extends HTMLElement {
    constructor() {
        super();
        this.__instanceProperties = new Map();
        /**
         * True if there is a pending update as a result of calling `requestUpdate()`.
         * Should only be read.
         * @category updates
         */
        this.isUpdatePending = false;
        /**
         * Is set to `true` after the first update. The element code cannot assume
         * that `renderRoot` exists before the element `hasUpdated`.
         * @category updates
         */
        this.hasUpdated = false;
        /**
         * Name of currently reflecting property
         */
        this.__reflectingProperty = null;
        this._initialize();
    }
    /**
     * Adds an initializer function to the class that is called during instance
     * construction.
     *
     * This is useful for code that runs against a `ReactiveElement`
     * subclass, such as a decorator, that needs to do work for each
     * instance, such as setting up a `ReactiveController`.
     *
     * ```ts
     * const myDecorator = (target: typeof ReactiveElement, key: string) => {
     *   target.addInitializer((instance: ReactiveElement) => {
     *     // This is run during construction of the element
     *     new MyController(instance);
     *   });
     * }
     * ```
     *
     * Decorating a field will then cause each instance to run an initializer
     * that adds a controller:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   @myDecorator foo;
     * }
     * ```
     *
     * Initializers are stored per-constructor. Adding an initializer to a
     * subclass does not add it to a superclass. Since initializers are run in
     * constructors, initializers will run in order of the class hierarchy,
     * starting with superclasses and progressing to the instance's class.
     *
     * @nocollapse
     */
    static addInitializer(initializer) {
        var _a;
        (_a = this._initializers) !== null && _a !== void 0 ? _a : (this._initializers = []);
        this._initializers.push(initializer);
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     * @category attributes
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.elementProperties.forEach((v, p) => {
            const attr = this.__attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a `PropertyDeclaration` for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * ```ts
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        var _a;
        // if this is a state property, force the attribute to false.
        if (options.state) {
            // Cast as any since this is readonly.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options.attribute = false;
        }
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure finalization has been kicked off.
        this.finalize();
        this.elementProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (!options.noAccessor && !this.prototype.hasOwnProperty(name)) {
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                Object.defineProperty(this.prototype, name, descriptor);
                if (DEV_MODE) {
                    // If this class doesn't have its own set, create one and initialize
                    // with the values in the set from the nearest ancestor class, if any.
                    if (!this.hasOwnProperty('__reactivePropertyKeys')) {
                        this.__reactivePropertyKeys = new Set((_a = this.__reactivePropertyKeys) !== null && _a !== void 0 ? _a : []);
                    }
                    this.__reactivePropertyKeys.add(name);
                }
            }
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     * ```ts
     * class MyElement extends LitElement {
     *   static getPropertyDescriptor(name, key, options) {
     *     const defaultDescriptor =
     *         super.getPropertyDescriptor(name, key, options);
     *     const setter = defaultDescriptor.set;
     *     return {
     *       get: defaultDescriptor.get,
     *       set(value) {
     *         setter.call(this, value);
     *         // custom action.
     *       },
     *       configurable: true,
     *       enumerable: true
     *     }
     *   }
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static getPropertyDescriptor(name, key, options) {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a `PropertyDeclaration` via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override [[`createProperty`]].
     *
     * @nocollapse
     * @final
     * @category properties
     */
    static getPropertyOptions(name) {
        return this.elementProperties.get(name) || defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties, sets up element
     * styling, and ensures any superclasses are also finalized. Returns true if
     * the element was finalized.
     * @nocollapse
     */
    static finalize() {
        if (this.hasOwnProperty(finalized)) {
            return false;
        }
        this[finalized] = true;
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        superCtor.finalize();
        this.elementProperties = new Map(superCtor.elementProperties);
        // initialize Map populated in observedAttributes
        this.__attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...Object.getOwnPropertySymbols(props),
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeScript lack of support for symbol in
                // index types
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.createProperty(p, props[p]);
            }
        }
        this.elementStyles = this.finalizeStyles(this.styles);
        // DEV mode warnings
        if (DEV_MODE) {
            const warnRemovedOrRenamed = (name, renamed = false) => {
                if (this.prototype.hasOwnProperty(name)) {
                    issueWarning(renamed ? 'renamed-api' : 'removed-api', `\`${name}\` is implemented on class ${this.name}. It ` +
                        `has been ${renamed ? 'renamed' : 'removed'} ` +
                        `in this version of LitElement.`);
                }
            };
            warnRemovedOrRenamed('initialize');
            warnRemovedOrRenamed('requestUpdateInternal');
            warnRemovedOrRenamed('_getUpdateComplete', true);
        }
        return true;
    }
    /**
     * Takes the styles the user supplied via the `static styles` property and
     * returns the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * Styles are deduplicated preserving the _last_ instance in the list. This
     * is a performance optimization to avoid duplicated styles that can occur
     * especially when composing via subclassing. The last item is kept to try
     * to preserve the cascade order with the assumption that it's most important
     * that last added styles override previous styles.
     *
     * @nocollapse
     * @category styles
     */
    static finalizeStyles(styles) {
        const elementStyles = [];
        if (Array.isArray(styles)) {
            // Dedupe the flattened array in reverse order to preserve the last items.
            // Casting to Array<unknown> works around TS error that
            // appears to come from trying to flatten a type CSSResultArray.
            const set = new Set(styles.flat(Infinity).reverse());
            // Then preserve original order by adding the set items in reverse order.
            for (const s of set) {
                elementStyles.unshift((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(s));
            }
        }
        else if (styles !== undefined) {
            elementStyles.push((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(styles));
        }
        return elementStyles;
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
                ? attribute
                : typeof name === 'string'
                    ? name.toLowerCase()
                    : undefined;
    }
    /**
     * Internal only override point for customizing work done when elements
     * are constructed.
     *
     * @internal
     */
    _initialize() {
        var _a;
        this.__updatePromise = new Promise((res) => (this.enableUpdating = res));
        this._$changedProperties = new Map();
        this.__saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdate();
        (_a = this.constructor._initializers) === null || _a === void 0 ? void 0 : _a.forEach((i) => i(this));
    }
    /**
     * Registers a `ReactiveController` to participate in the element's reactive
     * update cycle. The element automatically calls into any registered
     * controllers during its lifecycle callbacks.
     *
     * If the element is connected when `addController()` is called, the
     * controller's `hostConnected()` callback will be immediately called.
     * @category controllers
     */
    addController(controller) {
        var _a, _b;
        ((_a = this.__controllers) !== null && _a !== void 0 ? _a : (this.__controllers = [])).push(controller);
        // If a controller is added after the element has been connected,
        // call hostConnected. Note, re-using existence of `renderRoot` here
        // (which is set in connectedCallback) to avoid the need to track a
        // first connected state.
        if (this.renderRoot !== undefined && this.isConnected) {
            (_b = controller.hostConnected) === null || _b === void 0 ? void 0 : _b.call(controller);
        }
    }
    /**
     * Removes a `ReactiveController` from the element.
     * @category controllers
     */
    removeController(controller) {
        var _a;
        // Note, if the indexOf is -1, the >>> will flip the sign which makes the
        // splice do nothing.
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.splice(this.__controllers.indexOf(controller) >>> 0, 1);
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    __saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor.elementProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                this.__instanceProperties.set(p, this[p]);
                delete this[p];
            }
        });
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     *
     * @return Returns a node into which to render.
     * @category rendering
     */
    createRenderRoot() {
        var _a;
        const renderRoot = (_a = this.shadowRoot) !== null && _a !== void 0 ? _a : this.attachShadow(this.constructor.shadowRootOptions);
        (0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles)(renderRoot, this.constructor.elementStyles);
        return renderRoot;
    }
    /**
     * On first connection, creates the element's renderRoot, sets up
     * element styling, and enables updating.
     * @category lifecycle
     */
    connectedCallback() {
        var _a;
        // create renderRoot before first update.
        if (this.renderRoot === undefined) {
            this.renderRoot = this.createRenderRoot();
        }
        this.enableUpdating(true);
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostConnected) === null || _a === void 0 ? void 0 : _a.call(c); });
    }
    /**
     * Note, this method should be considered final and not overridden. It is
     * overridden on the element instance with a function that triggers the first
     * update.
     * @category updates
     */
    enableUpdating(_requestedUpdate) { }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     * @category lifecycle
     */
    disconnectedCallback() {
        var _a;
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostDisconnected) === null || _a === void 0 ? void 0 : _a.call(c); });
    }
    /**
     * Synchronizes property values when attributes change.
     * @category attributes
     */
    attributeChangedCallback(name, _old, value) {
        this._$attributeToProperty(name, value);
    }
    __propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        var _a, _b;
        const attr = this.constructor.__attributeNameForProperty(name, options);
        if (attr !== undefined && options.reflect === true) {
            const toAttribute = (_b = (_a = options.converter) === null || _a === void 0 ? void 0 : _a.toAttribute) !== null && _b !== void 0 ? _b : defaultConverter.toAttribute;
            const attrValue = toAttribute(value, options.type);
            if (DEV_MODE &&
                this.constructor.enabledWarnings.indexOf('migration') >= 0 &&
                attrValue === undefined) {
                issueWarning('undefined-attribute-value', `The attribute value for the ${name} property is ` +
                    `undefined on element ${this.localName}. The attribute will be ` +
                    `removed, but in the previous version of \`ReactiveElement\`, ` +
                    `the attribute would not have changed.`);
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this.__reflectingProperty = name;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /** @internal */
    _$attributeToProperty(name, value) {
        var _a, _b, _c;
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        const propName = ctor.__attributeToPropertyMap.get(name);
        // Use tracking info to avoid reflecting a property value to an attribute
        // if it was just set because the attribute changed.
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = ctor.getPropertyOptions(propName);
            const converter = options.converter;
            const fromAttribute = (_c = (_b = (_a = converter) === null || _a === void 0 ? void 0 : _a.fromAttribute) !== null && _b !== void 0 ? _b : (typeof converter === 'function'
                ? converter
                : null)) !== null && _c !== void 0 ? _c : defaultConverter.fromAttribute;
            // mark state reflecting
            this.__reflectingProperty = propName;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this[propName] = fromAttribute(value, options.type);
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should be called
     * when an element should update based on some state not triggered by setting
     * a reactive property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored.
     *
     * @param name name of requesting property
     * @param oldValue old value of requesting property
     * @param options property options to use instead of the previously
     *     configured options
     * @category updates
     */
    requestUpdate(name, oldValue, options) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            options =
                options ||
                    this.constructor.getPropertyOptions(name);
            const hasChanged = options.hasChanged || notEqual;
            if (hasChanged(this[name], oldValue)) {
                if (!this._$changedProperties.has(name)) {
                    this._$changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true && this.__reflectingProperty !== name) {
                    if (this.__reflectingProperties === undefined) {
                        this.__reflectingProperties = new Map();
                    }
                    this.__reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this.isUpdatePending && shouldRequestUpdate) {
            this.__updatePromise = this.__enqueueUpdate();
        }
        // Note, since this no longer returns a promise, in dev mode we return a
        // thenable which warns if it's called.
        return DEV_MODE
            ? requestUpdateThenable(this.localName)
            : undefined;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async __enqueueUpdate() {
        this.isUpdatePending = true;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this.__updatePromise;
        }
        catch (e) {
            // Refire any previous errors async so they do not disrupt the update
            // cycle. Errors are refired so developers have a chance to observe
            // them, and this can be done by implementing
            // `window.onunhandledrejection`.
            Promise.reject(e);
        }
        const result = this.scheduleUpdate();
        // If `scheduleUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this.isUpdatePending;
    }
    /**
     * Schedules an element update. You can override this method to change the
     * timing of updates by returning a Promise. The update will await the
     * returned Promise, and you should resolve the Promise to allow the update
     * to proceed. If this method is overridden, `super.scheduleUpdate()`
     * must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```ts
     * override protected async scheduleUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.scheduleUpdate();
     * }
     * ```
     * @category updates
     */
    scheduleUpdate() {
        return this.performUpdate();
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * Call `performUpdate()` to immediately process a pending update. This should
     * generally not be needed, but it can be done in rare cases when you need to
     * update synchronously.
     *
     * Note: To ensure `performUpdate()` synchronously completes a pending update,
     * it should not be overridden. In LitElement 2.x it was suggested to override
     * `performUpdate()` to also customizing update scheduling. Instead, you should now
     * override `scheduleUpdate()`. For backwards compatibility with LitElement 2.x,
     * scheduling updates via `performUpdate()` continues to work, but will make
     * also calling `performUpdate()` to synchronously process updates difficult.
     *
     * @category updates
     */
    performUpdate() {
        var _a, _b;
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this.isUpdatePending) {
            return;
        }
        // create renderRoot before first update.
        if (!this.hasUpdated) {
            // Produce warning if any class properties are shadowed by class fields
            if (DEV_MODE) {
                const shadowedProperties = [];
                (_a = this.constructor.__reactivePropertyKeys) === null || _a === void 0 ? void 0 : _a.forEach((p) => {
                    var _a;
                    if (this.hasOwnProperty(p) && !((_a = this.__instanceProperties) === null || _a === void 0 ? void 0 : _a.has(p))) {
                        shadowedProperties.push(p);
                    }
                });
                if (shadowedProperties.length) {
                    throw new Error(`The following properties on element ${this.localName} will not ` +
                        `trigger updates as expected because they are set using class ` +
                        `fields: ${shadowedProperties.join(', ')}. ` +
                        `Native class fields and some compiled output will overwrite ` +
                        `accessors used for detecting changes. See ` +
                        `https://lit.dev/msg/class-field-shadowing ` +
                        `for more information.`);
                }
            }
        }
        // Mixin instance properties once, if they exist.
        if (this.__instanceProperties) {
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.__instanceProperties.forEach((v, p) => (this[p] = v));
            this.__instanceProperties = undefined;
        }
        let shouldUpdate = false;
        const changedProperties = this._$changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.willUpdate(changedProperties);
                (_b = this.__controllers) === null || _b === void 0 ? void 0 : _b.forEach((c) => { var _a; return (_a = c.hostUpdate) === null || _a === void 0 ? void 0 : _a.call(c); });
                this.update(changedProperties);
            }
            else {
                this.__markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this.__markUpdated();
            throw e;
        }
        // The update is no longer considered pending and further updates are now allowed.
        if (shouldUpdate) {
            this._$didUpdate(changedProperties);
        }
    }
    /**
     * @category updates
     */
    willUpdate(_changedProperties) { }
    // Note, this is an override point for polyfill-support.
    // @internal
    _$didUpdate(changedProperties) {
        var _a;
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostUpdated) === null || _a === void 0 ? void 0 : _a.call(c); });
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
        if (DEV_MODE &&
            this.isUpdatePending &&
            this.constructor.enabledWarnings.indexOf('change-in-update') >= 0) {
            issueWarning('change-in-update', `Element ${this.localName} scheduled an update ` +
                `(generally because a property was set) ` +
                `after an update completed, causing a new update to be scheduled. ` +
                `This is inefficient and should be avoided unless the next update ` +
                `can only be scheduled as a side effect of the previous update.`);
        }
    }
    __markUpdated() {
        this._$changedProperties = new Map();
        this.isUpdatePending = false;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super.getUpdateComplete()`, then any subsequent state.
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    get updateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   override async getUpdateComplete() {
     *     const result = await super.getUpdateComplete();
     *     await this._myChild.updateComplete;
     *     return result;
     *   }
     * }
     * ```
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    getUpdateComplete() {
        return this.__updatePromise;
    }
    /**
     * Controls whether or not `update()` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    update(_changedProperties) {
        if (this.__reflectingProperties !== undefined) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this.__reflectingProperties.forEach((v, k) => this.__propertyToAttribute(k, this[k], v));
            this.__reflectingProperties = undefined;
        }
        this.__markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    updated(_changedProperties) { }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    firstUpdated(_changedProperties) { }
}
_d = finalized;
/**
 * Marks class as having finished creating properties.
 */
ReactiveElement[_d] = true;
/**
 * Memoized list of all element properties, including any superclass properties.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category properties
 */
ReactiveElement.elementProperties = new Map();
/**
 * Memoized list of all element styles.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category styles
 */
ReactiveElement.elementStyles = [];
/**
 * Options used when calling `attachShadow`. Set this property to customize
 * the options for the shadowRoot; for example, to create a closed
 * shadowRoot: `{mode: 'closed'}`.
 *
 * Note, these options are used in `createRenderRoot`. If this method
 * is customized, options should be respected if possible.
 * @nocollapse
 * @category rendering
 */
ReactiveElement.shadowRootOptions = { mode: 'open' };
// Apply polyfills if available
polyfillSupport === null || polyfillSupport === void 0 ? void 0 : polyfillSupport({ ReactiveElement });
// Dev mode warnings...
if (DEV_MODE) {
    // Default warning set.
    ReactiveElement.enabledWarnings = ['change-in-update'];
    const ensureOwnWarnings = function (ctor) {
        if (!ctor.hasOwnProperty(JSCompiler_renameProperty('enabledWarnings', ctor))) {
            ctor.enabledWarnings = ctor.enabledWarnings.slice();
        }
    };
    ReactiveElement.enableWarning = function (warning) {
        ensureOwnWarnings(this);
        if (this.enabledWarnings.indexOf(warning) < 0) {
            this.enabledWarnings.push(warning);
        }
    };
    ReactiveElement.disableWarning = function (warning) {
        ensureOwnWarnings(this);
        const i = this.enabledWarnings.indexOf(warning);
        if (i >= 0) {
            this.enabledWarnings.splice(i, 1);
        }
    };
}
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for ReactiveElement usage.
((_c = globalThis.reactiveElementVersions) !== null && _c !== void 0 ? _c : (globalThis.reactiveElementVersions = [])).push('1.0.2');
if (DEV_MODE && globalThis.reactiveElementVersions.length > 1) {
    issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
        `is not recommended.`);
}
//# sourceMappingURL=reactive-element.js.map

/***/ }),

/***/ "./node_modules/lit-element/development/lit-element.js":
/*!*************************************************************!*\
  !*** ./node_modules/lit-element/development/lit-element.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   "ReactiveElement": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   "defaultConverter": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.defaultConverter),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   "notEqual": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.notEqual),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS),
/* harmony export */   "INTERNAL": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.INTERNAL),
/* harmony export */   "_$LH": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH),
/* harmony export */   "html": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   "noChange": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   "nothing": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   "render": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   "svg": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   "UpdatingElement": () => (/* binding */ UpdatingElement),
/* harmony export */   "LitElement": () => (/* binding */ LitElement),
/* harmony export */   "_$LE": () => (/* binding */ _$LE)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c;
/**
 * The main LitElement module, which defines the [[`LitElement`]] base class and
 * related APIs.
 *
 *  LitElement components can define a template and a set of observed
 * properties. Changing an observed property triggers a re-render of the
 * element.
 *
 *  Import [[`LitElement`]] and [[`html`]] from this module to create a
 * component:
 *
 *  ```js
 * import {LitElement, html} from 'lit-element';
 *
 * class MyElement extends LitElement {
 *
 *   // Declare observed properties
 *   static get properties() {
 *     return {
 *       adjective: {}
 *     }
 *   }
 *
 *   constructor() {
 *     this.adjective = 'awesome';
 *   }
 *
 *   // Define the element's template
 *   render() {
 *     return html`<p>your ${adjective} template here</p>`;
 *   }
 * }
 *
 * customElements.define('my-element', MyElement);
 * ```
 *
 * `LitElement` extends [[`ReactiveElement`]] and adds lit-html templating.
 * The `ReactiveElement` class is provided for users that want to build
 * their own custom element base classes that don't use lit-html.
 *
 * @packageDocumentation
 */




// For backwards compatibility export ReactiveElement as UpdatingElement. Note,
// IE transpilation requires exporting like this.
const UpdatingElement = _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement;
const DEV_MODE = true;
let issueWarning;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    const issuedWarnings = ((_a = globalThis.litIssuedWarnings) !== null && _a !== void 0 ? _a : (globalThis.litIssuedWarnings = new Set()));
    // Issue a warning, if we haven't already.
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!issuedWarnings.has(warning)) {
            console.warn(warning);
            issuedWarnings.add(warning);
        }
    };
}
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the [[`properties`]] property or the [[`property`]] decorator.
 */
class LitElement extends _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement {
    constructor() {
        super(...arguments);
        /**
         * @category rendering
         */
        this.renderOptions = { host: this };
        this.__childPart = undefined;
    }
    /**
     * @category rendering
     */
    createRenderRoot() {
        var _a;
        var _b;
        const renderRoot = super.createRenderRoot();
        // When adoptedStyleSheets are shimmed, they are inserted into the
        // shadowRoot by createRenderRoot. Adjust the renderBefore node so that
        // any styles in Lit content render before adoptedStyleSheets. This is
        // important so that adoptedStyleSheets have precedence over styles in
        // the shadowRoot.
        (_a = (_b = this.renderOptions).renderBefore) !== null && _a !== void 0 ? _a : (_b.renderBefore = renderRoot.firstChild);
        return renderRoot;
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param changedProperties Map of changed properties with old values
     * @category updates
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const value = this.render();
        if (!this.hasUpdated) {
            this.renderOptions.isConnected = this.isConnected;
        }
        super.update(changedProperties);
        this.__childPart = (0,lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(value, this.renderRoot, this.renderOptions);
    }
    /**
     * Invoked when the component is added to the document's DOM.
     *
     * In `connectedCallback()` you should setup tasks that should only occur when
     * the element is connected to the document. The most common of these is
     * adding event listeners to nodes external to the element, like a keydown
     * event handler added to the window.
     *
     * ```ts
     * connectedCallback() {
     *   super.connectedCallback();
     *   addEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * Typically, anything done in `connectedCallback()` should be undone when the
     * element is disconnected, in `disconnectedCallback()`.
     *
     * @category lifecycle
     */
    connectedCallback() {
        var _a;
        super.connectedCallback();
        (_a = this.__childPart) === null || _a === void 0 ? void 0 : _a.setConnected(true);
    }
    /**
     * Invoked when the component is removed from the document's DOM.
     *
     * This callback is the main signal to the element that it may no longer be
     * used. `disconnectedCallback()` should ensure that nothing is holding a
     * reference to the element (such as event listeners added to nodes external
     * to the element), so that it is free to be garbage collected.
     *
     * ```ts
     * disconnectedCallback() {
     *   super.disconnectedCallback();
     *   window.removeEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * An element may be re-connected after being disconnected.
     *
     * @category lifecycle
     */
    disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        (_a = this.__childPart) === null || _a === void 0 ? void 0 : _a.setConnected(false);
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `ChildPart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     * @category rendering
     */
    render() {
        return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See @lit/reactive-element for more information.
 */
LitElement['finalized'] = true;
// This property needs to remain unminified.
LitElement['_$litElement$'] = true;
// Install hydration if available
(_b = globalThis.litElementHydrateSupport) === null || _b === void 0 ? void 0 : _b.call(globalThis, { LitElement });
// Apply polyfills if available
const polyfillSupport = DEV_MODE
    ? globalThis.litElementPolyfillSupportDevMode
    : globalThis.litElementPolyfillSupport;
polyfillSupport === null || polyfillSupport === void 0 ? void 0 : polyfillSupport({ LitElement });
// DEV mode warnings
if (DEV_MODE) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // Note, for compatibility with closure compilation, this access
    // needs to be as a string property index.
    LitElement['finalize'] = function () {
        const finalized = _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement.finalize.call(this);
        if (!finalized) {
            return false;
        }
        const warnRemovedOrRenamed = (obj, name, renamed = false) => {
            if (obj.hasOwnProperty(name)) {
                const ctorName = (typeof obj === 'function' ? obj : obj.constructor)
                    .name;
                issueWarning(renamed ? 'renamed-api' : 'removed-api', `\`${name}\` is implemented on class ${ctorName}. It ` +
                    `has been ${renamed ? 'renamed' : 'removed'} ` +
                    `in this version of LitElement.`);
            }
        };
        warnRemovedOrRenamed(this, 'render');
        warnRemovedOrRenamed(this, 'getStyles', true);
        warnRemovedOrRenamed(this.prototype, 'adoptStyles');
        return true;
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _$LE object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-html, since this module re-exports all of lit-html.
 *
 * @private
 */
const _$LE = {
    _$attributeToProperty: (el, name, value) => {
        // eslint-disable-next-line
        el._$attributeToProperty(name, value);
    },
    // eslint-disable-next-line
    _$changedProperties: (el) => el._$changedProperties,
};
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
((_c = globalThis.litElementVersions) !== null && _c !== void 0 ? _c : (globalThis.litElementVersions = [])).push('3.0.2');
if (DEV_MODE && globalThis.litElementVersions.length > 1) {
    issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
        `is not recommended.`);
}
//# sourceMappingURL=lit-element.js.map

/***/ }),

/***/ "./node_modules/lit-html/development/lit-html.js":
/*!*******************************************************!*\
  !*** ./node_modules/lit-html/development/lit-html.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "INTERNAL": () => (/* binding */ INTERNAL),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "svg": () => (/* binding */ svg),
/* harmony export */   "noChange": () => (/* binding */ noChange),
/* harmony export */   "nothing": () => (/* binding */ nothing),
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "_$LH": () => (/* binding */ _$LH)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c, _d;
const DEV_MODE = true;
const ENABLE_EXTRA_SECURITY_HOOKS = true;
const ENABLE_SHADYDOM_NOPATCH = true;
/**
 * `true` if we're building for google3 with temporary back-compat helpers.
 * This export is not present in prod builds.
 * @internal
 */
const INTERNAL = true;
let issueWarning;
if (DEV_MODE) {
    (_a = globalThis.litIssuedWarnings) !== null && _a !== void 0 ? _a : (globalThis.litIssuedWarnings = new Set());
    // Issue a warning, if we haven't already.
    issueWarning = (code, warning) => {
        warning += code
            ? ` See https://lit.dev/msg/${code} for more information.`
            : '';
        if (!globalThis.litIssuedWarnings.has(warning)) {
            console.warn(warning);
            globalThis.litIssuedWarnings.add(warning);
        }
    };
    issueWarning('dev-mode', `Lit is in dev mode. Not recommended for production!`);
}
const wrap = ENABLE_SHADYDOM_NOPATCH &&
    ((_b = window.ShadyDOM) === null || _b === void 0 ? void 0 : _b.inUse) &&
    ((_c = window.ShadyDOM) === null || _c === void 0 ? void 0 : _c.noPatch) === true
    ? window.ShadyDOM.wrap
    : (node) => node;
const trustedTypes = globalThis.trustedTypes;
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = trustedTypes
    ? trustedTypes.createPolicy('lit-html', {
        createHTML: (s) => s,
    })
    : undefined;
const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;
/** Sets the global sanitizer factory. */
const setSanitizer = (newSanitizer) => {
    if (!ENABLE_EXTRA_SECURITY_HOOKS) {
        return;
    }
    if (sanitizerFactoryInternal !== noopSanitizer) {
        throw new Error(`Attempted to overwrite existing lit-html security policy.` +
            ` setSanitizeDOMValueFactory should be called at most once.`);
    }
    sanitizerFactoryInternal = newSanitizer;
};
/**
 * Only used in internal tests, not a part of the public API.
 */
const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
    sanitizerFactoryInternal = noopSanitizer;
};
const createSanitizer = (node, name, type) => {
    return sanitizerFactoryInternal(node, name, type);
};
// Added to an attribute name to mark the attribute as bound so we can find
// it easily.
const boundAttributeSuffix = '$lit$';
// This marker is used in many syntactic positions in HTML, so it must be
// a valid element name and attribute name. We don't support dynamic names (yet)
// but this at least ensures that the parse tree is closer to the template
// intention.
const marker = `lit$${String(Math.random()).slice(9)}$`;
// String used to tell if a comment is a marker comment
const markerMatch = '?' + marker;
// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
const nodeMarker = `<${markerMatch}>`;
const d = document;
// Creates a dynamic marker. We never have to search for these in the DOM.
const createMarker = (v = '') => d.createComment(v);
const isPrimitive = (value) => value === null || (typeof value != 'object' && typeof value != 'function');
const isArray = Array.isArray;
const isIterable = (value) => {
    var _a;
    return isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof ((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]) === 'function';
};
const SPACE_CHAR = `[ \t\n\f\r]`;
const ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
const NAME_CHAR = `[^\\s"'>=/]`;
// These regexes represent the five parsing states that we care about in the
// Template's HTML scanner. They match the *end* of the state they're named
// after.
// Depending on the match, we transition to a new state. If there's no match,
// we stay in the same state.
// Note that the regexes are stateful. We utilize lastIndex and sync it
// across the multiple regexes used. In addition to the five regexes below
// we also dynamically create a regex to find the matching end tags for raw
// text elements.
/**
 * End of text is: `<` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
const textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single `>`
 */
const comment2EndRegex = />/g;
/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a `>`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, 'g');
const ENTIRE_MATCH = 0;
const ATTRIBUTE_NAME = 1;
const SPACES_AND_EQUALS = 2;
const QUOTE_CHAR = 3;
const singleQuoteAttrEndRegex = /'/g;
const doubleQuoteAttrEndRegex = /"/g;
/**
 * Matches the raw text elements.
 *
 * Comments are not parsed within raw text elements, so we need to search their
 * text content for marker strings.
 */
const rawTextElement = /^(?:script|style|textarea)$/i;
/** TemplateResult types */
const HTML_RESULT = 1;
const SVG_RESULT = 2;
// TemplatePart types
// IMPORTANT: these must match the values in PartType
const ATTRIBUTE_PART = 1;
const CHILD_PART = 2;
const PROPERTY_PART = 3;
const BOOLEAN_ATTRIBUTE_PART = 4;
const EVENT_PART = 5;
const ELEMENT_PART = 6;
const COMMENT_PART = 7;
/**
 * Generates a template literal tag function that returns a TemplateResult with
 * the given result type.
 */
const tag = (type) => (strings, ...values) => {
    // Warn against templates octal escape sequences
    // We do this here rather than in render so that the warning is closer to the
    // template definition.
    if (DEV_MODE && strings.some((s) => s === undefined)) {
        console.warn('Some template strings are undefined.\n' +
            'This is probably caused by illegal octal escape sequences.');
    }
    return {
        // This property needs to remain unminified.
        ['_$litType$']: type,
        strings,
        values,
    };
};
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 *
 * ```ts
 * const header = (title: string) => html`<h1>${title}</h1>`;
 * ```
 *
 * The `html` tag returns a description of the DOM to render as a value. It is
 * lazy, meaning no work is done until the template is rendered. When rendering,
 * if a template comes from the same expression as a previously rendered result,
 * it's efficiently updated instead of replaced.
 */
const html = tag(HTML_RESULT);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = tag(SVG_RESULT);
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = Symbol.for('lit-noChange');
/**
 * A sentinel value that signals a ChildPart to fully clear its content.
 *
 * ```ts
 * const button = html`${
 *  user.isAdmin
 *    ? html`<button>DELETE</button>`
 *    : nothing
 * }`;
 * ```
 *
 * Prefer using `nothing` over other falsy values as it provides a consistent
 * behavior between various expression binding contexts.
 *
 * In child expressions, `undefined`, `null`, `''`, and `nothing` all behave the
 * same and render no nodes. In attribute expressions, `nothing` _removes_ the
 * attribute, while `undefined` and `null` will render an empty string. In
 * property expressions `nothing` becomes `undefined`.
 */
const nothing = Symbol.for('lit-nothing');
/**
 * The cache of prepared templates, keyed by the tagged TemplateStringsArray
 * and _not_ accounting for the specific template tag used. This means that
 * template tags cannot be dynamic - the must statically be one of html, svg,
 * or attr. This restriction simplifies the cache lookup, which is on the hot
 * path for rendering.
 */
const templateCache = new WeakMap();
/**
 * Renders a value, usually a lit-html TemplateResult, to the container.
 * @param value
 * @param container
 * @param options
 */
const render = (value, container, options) => {
    var _a, _b, _c;
    const partOwnerNode = (_a = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _a !== void 0 ? _a : container;
    // This property needs to remain unminified.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let part = partOwnerNode['_$litPart$'];
    if (part === undefined) {
        const endNode = (_b = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _b !== void 0 ? _b : null;
        // Internal modification: don't clear container to match lit-html 2.0
        if (INTERNAL &&
            ((_c = options) === null || _c === void 0 ? void 0 : _c.clearContainerForLit2MigrationOnly) ===
                true) {
            let n = container.firstChild;
            // Clear only up to the `endNode` aka `renderBefore` node.
            while (n && n !== endNode) {
                const next = n.nextSibling;
                n.remove();
                n = next;
            }
        }
        // This property needs to remain unminified.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        partOwnerNode['_$litPart$'] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, undefined, options !== null && options !== void 0 ? options : {});
    }
    part._$setValue(value);
    return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
    render.setSanitizer = setSanitizer;
    render.createSanitizer = createSanitizer;
    if (DEV_MODE) {
        render._testOnlyClearSanitizerFactoryDoNotCallOrElse =
            _testOnlyClearSanitizerFactoryDoNotCallOrElse;
    }
}
const walker = d.createTreeWalker(d, 129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */, null, false);
let sanitizerFactoryInternal = noopSanitizer;
/**
 * Returns an HTML string for the given TemplateStringsArray and result type
 * (HTML or SVG), along with the case-sensitive bound attribute names in
 * template order. The HTML contains comment comment markers denoting the
 * `ChildPart`s and suffixes on bound attributes denoting the `AttributeParts`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing `[html, attrNames]` (array returned for terseness,
 *     to avoid object fields since this code is shared with non-minified SSR
 *     code)
 */
const getTemplateHtml = (strings, type) => {
    // Insert makers into the template HTML to represent the position of
    // bindings. The following code scans the template strings to determine the
    // syntactic position of the bindings. They can be in text position, where
    // we insert an HTML comment, attribute value position, where we insert a
    // sentinel string and re-write the attribute name, or inside a tag where
    // we insert the sentinel string.
    const l = strings.length - 1;
    // Stores the case-sensitive bound attribute names in the order of their
    // parts. ElementParts are also reflected in this array as undefined
    // rather than a string, to disambiguate from attribute bindings.
    const attrNames = [];
    let html = type === SVG_RESULT ? '<svg>' : '';
    // When we're inside a raw text tag (not it's text content), the regex
    // will still be tagRegex so we can find attributes, but will switch to
    // this regex when the tag ends.
    let rawTextEndRegex;
    // The current parsing state, represented as a reference to one of the
    // regexes
    let regex = textEndRegex;
    for (let i = 0; i < l; i++) {
        const s = strings[i];
        // The index of the end of the last attribute name. When this is
        // positive at end of a string, it means we're in an attribute value
        // position and need to rewrite the attribute name.
        // We also use a special value of -2 to indicate that we encountered
        // the end of a string in attribute name position.
        let attrNameEndIndex = -1;
        let attrName;
        let lastIndex = 0;
        let match;
        // The conditions in this loop handle the current parse state, and the
        // assignments to the `regex` variable are the state transitions.
        while (lastIndex < s.length) {
            // Make sure we start searching from where we previously left off
            regex.lastIndex = lastIndex;
            match = regex.exec(s);
            if (match === null) {
                break;
            }
            lastIndex = regex.lastIndex;
            if (regex === textEndRegex) {
                if (match[COMMENT_START] === '!--') {
                    regex = commentEndRegex;
                }
                else if (match[COMMENT_START] !== undefined) {
                    // We started a weird comment, like </{
                    regex = comment2EndRegex;
                }
                else if (match[TAG_NAME] !== undefined) {
                    if (rawTextElement.test(match[TAG_NAME])) {
                        // Record if we encounter a raw-text element. We'll switch to
                        // this regex at the end of the tag.
                        rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, 'g');
                    }
                    regex = tagEndRegex;
                }
                else if (match[DYNAMIC_TAG_NAME] !== undefined) {
                    if (DEV_MODE) {
                        throw new Error('Bindings in tag names are not supported. Please use static templates instead. ' +
                            'See https://lit.dev/docs/templates/expressions/#static-expressions');
                    }
                    regex = tagEndRegex;
                }
            }
            else if (regex === tagEndRegex) {
                if (match[ENTIRE_MATCH] === '>') {
                    // End of a tag. If we had started a raw-text element, use that
                    // regex
                    regex = rawTextEndRegex !== null && rawTextEndRegex !== void 0 ? rawTextEndRegex : textEndRegex;
                    // We may be ending an unquoted attribute value, so make sure we
                    // clear any pending attrNameEndIndex
                    attrNameEndIndex = -1;
                }
                else if (match[ATTRIBUTE_NAME] === undefined) {
                    // Attribute name position
                    attrNameEndIndex = -2;
                }
                else {
                    attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
                    attrName = match[ATTRIBUTE_NAME];
                    regex =
                        match[QUOTE_CHAR] === undefined
                            ? tagEndRegex
                            : match[QUOTE_CHAR] === '"'
                                ? doubleQuoteAttrEndRegex
                                : singleQuoteAttrEndRegex;
                }
            }
            else if (regex === doubleQuoteAttrEndRegex ||
                regex === singleQuoteAttrEndRegex) {
                regex = tagEndRegex;
            }
            else if (regex === commentEndRegex || regex === comment2EndRegex) {
                regex = textEndRegex;
            }
            else {
                // Not one of the five state regexes, so it must be the dynamically
                // created raw text regex and we're at the close of that element.
                regex = tagEndRegex;
                rawTextEndRegex = undefined;
            }
        }
        if (DEV_MODE) {
            // If we have a attrNameEndIndex, which indicates that we should
            // rewrite the attribute name, assert that we're in a valid attribute
            // position - either in a tag, or a quoted attribute value.
            console.assert(attrNameEndIndex === -1 ||
                regex === tagEndRegex ||
                regex === singleQuoteAttrEndRegex ||
                regex === doubleQuoteAttrEndRegex, 'unexpected parse state B');
        }
        // We have four cases:
        //  1. We're in text position, and not in a raw text element
        //     (regex === textEndRegex): insert a comment marker.
        //  2. We have a non-negative attrNameEndIndex which means we need to
        //     rewrite the attribute name to add a bound attribute suffix.
        //  3. We're at the non-first binding in a multi-binding attribute, use a
        //     plain marker.
        //  4. We're somewhere else inside the tag. If we're in attribute name
        //     position (attrNameEndIndex === -2), add a sequential suffix to
        //     generate a unique attribute name.
        // Detect a binding next to self-closing tag end and insert a space to
        // separate the marker from the tag end:
        const end = regex === tagEndRegex && strings[i + 1].startsWith('/>') ? ' ' : '';
        html +=
            regex === textEndRegex
                ? s + nodeMarker
                : attrNameEndIndex >= 0
                    ? (attrNames.push(attrName),
                        s.slice(0, attrNameEndIndex) +
                            boundAttributeSuffix +
                            s.slice(attrNameEndIndex)) +
                        marker +
                        end
                    : s +
                        marker +
                        (attrNameEndIndex === -2 ? (attrNames.push(undefined), i) : end);
    }
    const htmlResult = html + (strings[l] || '<?>') + (type === SVG_RESULT ? '</svg>' : '');
    // Returned as an array for terseness
    return [
        policy !== undefined
            ? policy.createHTML(htmlResult)
            : htmlResult,
        attrNames,
    ];
};
class Template {
    constructor(
    // This property needs to remain unminified.
    { strings, ['_$litType$']: type }, options) {
        /** @internal */
        this.parts = [];
        let node;
        let nodeIndex = 0;
        let attrNameIndex = 0;
        const partCount = strings.length - 1;
        const parts = this.parts;
        // Create template element
        const [html, attrNames] = getTemplateHtml(strings, type);
        this.el = Template.createElement(html, options);
        walker.currentNode = this.el.content;
        // Reparent SVG nodes into template root
        if (type === SVG_RESULT) {
            const content = this.el.content;
            const svgElement = content.firstChild;
            svgElement.remove();
            content.append(...svgElement.childNodes);
        }
        // Walk the template to find binding markers and create TemplateParts
        while ((node = walker.nextNode()) !== null && parts.length < partCount) {
            if (node.nodeType === 1) {
                if (DEV_MODE) {
                    const tag = node.localName;
                    // Warn if `textarea` includes an expression and throw if `template`
                    // does since these are not supported. We do this by checking
                    // innerHTML for anything that looks like a marker. This catches
                    // cases like bindings in textarea there markers turn into text nodes.
                    if (/^(?:textarea|template)$/i.test(tag) &&
                        node.innerHTML.includes(marker)) {
                        const m = `Expressions are not supported inside \`${tag}\` ` +
                            `elements. See https://lit.dev/msg/expression-in-${tag} for more ` +
                            `information.`;
                        if (tag === 'template') {
                            throw new Error(m);
                        }
                        else
                            issueWarning('', m);
                    }
                }
                // TODO (justinfagnani): for attempted dynamic tag names, we don't
                // increment the bindingIndex, and it'll be off by 1 in the element
                // and off by two after it.
                if (node.hasAttributes()) {
                    // We defer removing bound attributes because on IE we might not be
                    // iterating attributes in their template order, and would sometimes
                    // remove an attribute that we still need to create a part for.
                    const attrsToRemove = [];
                    for (const name of node.getAttributeNames()) {
                        // `name` is the name of the attribute we're iterating over, but not
                        // _neccessarily_ the name of the attribute we will create a part
                        // for. They can be different in browsers that don't iterate on
                        // attributes in source order. In that case the attrNames array
                        // contains the attribute name we'll process next. We only need the
                        // attribute name here to know if we should process a bound attribute
                        // on this element.
                        if (name.endsWith(boundAttributeSuffix) ||
                            name.startsWith(marker)) {
                            const realName = attrNames[attrNameIndex++];
                            attrsToRemove.push(name);
                            if (realName !== undefined) {
                                // Lowercase for case-sensitive SVG attributes like viewBox
                                const value = node.getAttribute(realName.toLowerCase() + boundAttributeSuffix);
                                const statics = value.split(marker);
                                const m = /([.?@])?(.*)/.exec(realName);
                                parts.push({
                                    type: ATTRIBUTE_PART,
                                    index: nodeIndex,
                                    name: m[2],
                                    strings: statics,
                                    ctor: m[1] === '.'
                                        ? PropertyPart
                                        : m[1] === '?'
                                            ? BooleanAttributePart
                                            : m[1] === '@'
                                                ? EventPart
                                                : AttributePart,
                                });
                            }
                            else {
                                parts.push({
                                    type: ELEMENT_PART,
                                    index: nodeIndex,
                                });
                            }
                        }
                    }
                    for (const name of attrsToRemove) {
                        node.removeAttribute(name);
                    }
                }
                // TODO (justinfagnani): benchmark the regex against testing for each
                // of the 3 raw text element names.
                if (rawTextElement.test(node.tagName)) {
                    // For raw text elements we need to split the text content on
                    // markers, create a Text node for each segment, and create
                    // a TemplatePart for each marker.
                    const strings = node.textContent.split(marker);
                    const lastIndex = strings.length - 1;
                    if (lastIndex > 0) {
                        node.textContent = trustedTypes
                            ? trustedTypes.emptyScript
                            : '';
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for node parts
                        // We can't use empty text nodes as markers because they're
                        // normalized when cloning in IE (could simplify when
                        // IE is no longer supported)
                        for (let i = 0; i < lastIndex; i++) {
                            node.append(strings[i], createMarker());
                            // Walk past the marker node we just added
                            walker.nextNode();
                            parts.push({ type: CHILD_PART, index: ++nodeIndex });
                        }
                        // Note because this marker is added after the walker's current
                        // node, it will be walked to in the outer loop (and ignored), so
                        // we don't need to adjust nodeIndex here
                        node.append(strings[lastIndex], createMarker());
                    }
                }
            }
            else if (node.nodeType === 8) {
                const data = node.data;
                if (data === markerMatch) {
                    parts.push({ type: CHILD_PART, index: nodeIndex });
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        parts.push({ type: COMMENT_PART, index: nodeIndex });
                        // Move to the end of the match
                        i += marker.length - 1;
                    }
                }
            }
            nodeIndex++;
        }
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @nocollapse */
    static createElement(html, _options) {
        const el = d.createElement('template');
        el.innerHTML = html;
        return el;
    }
}
function resolveDirective(part, value, parent = part, attributeIndex) {
    var _a, _b, _c;
    var _d;
    // Bail early if the value is explicitly noChange. Note, this means any
    // nested directive is still attached and is not run.
    if (value === noChange) {
        return value;
    }
    let currentDirective = attributeIndex !== undefined
        ? (_a = parent.__directives) === null || _a === void 0 ? void 0 : _a[attributeIndex]
        : parent.__directive;
    const nextDirectiveConstructor = isPrimitive(value)
        ? undefined
        : // This property needs to remain unminified.
            value['_$litDirective$'];
    if ((currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective.constructor) !== nextDirectiveConstructor) {
        // This property needs to remain unminified.
        (_b = currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective['_$notifyDirectiveConnectionChanged']) === null || _b === void 0 ? void 0 : _b.call(currentDirective, false);
        if (nextDirectiveConstructor === undefined) {
            currentDirective = undefined;
        }
        else {
            currentDirective = new nextDirectiveConstructor(part);
            currentDirective._$initialize(part, parent, attributeIndex);
        }
        if (attributeIndex !== undefined) {
            ((_c = (_d = parent).__directives) !== null && _c !== void 0 ? _c : (_d.__directives = []))[attributeIndex] =
                currentDirective;
        }
        else {
            parent.__directive = currentDirective;
        }
    }
    if (currentDirective !== undefined) {
        value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
    }
    return value;
}
/**
 * An updateable instance of a Template. Holds references to the Parts used to
 * update the template instance.
 */
class TemplateInstance {
    constructor(template, parent) {
        /** @internal */
        this._parts = [];
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$template = template;
        this._$parent = parent;
    }
    // Called by ChildPart parentNode getter
    get parentNode() {
        return this._$parent.parentNode;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    // This method is separate from the constructor because we need to return a
    // DocumentFragment and we don't want to hold onto it with an instance field.
    _clone(options) {
        var _a;
        const { el: { content }, parts: parts, } = this._$template;
        const fragment = ((_a = options === null || options === void 0 ? void 0 : options.creationScope) !== null && _a !== void 0 ? _a : d).importNode(content, true);
        walker.currentNode = fragment;
        let node = walker.nextNode();
        let nodeIndex = 0;
        let partIndex = 0;
        let templatePart = parts[0];
        while (templatePart !== undefined) {
            if (nodeIndex === templatePart.index) {
                let part;
                if (templatePart.type === CHILD_PART) {
                    part = new ChildPart(node, node.nextSibling, this, options);
                }
                else if (templatePart.type === ATTRIBUTE_PART) {
                    part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
                }
                else if (templatePart.type === ELEMENT_PART) {
                    part = new ElementPart(node, this, options);
                }
                this._parts.push(part);
                templatePart = parts[++partIndex];
            }
            if (nodeIndex !== (templatePart === null || templatePart === void 0 ? void 0 : templatePart.index)) {
                node = walker.nextNode();
                nodeIndex++;
            }
        }
        return fragment;
    }
    _update(values) {
        let i = 0;
        for (const part of this._parts) {
            if (part !== undefined) {
                if (part.strings !== undefined) {
                    part._$setValue(values, part, i);
                    // The number of values the part consumes is part.strings.length - 1
                    // since values are in between template spans. We increment i by 1
                    // later in the loop, so increment it by part.strings.length - 2 here
                    i += part.strings.length - 2;
                }
                else {
                    part._$setValue(values[i]);
                }
            }
            i++;
        }
    }
}
class ChildPart {
    constructor(startNode, endNode, parent, options) {
        var _a;
        this.type = CHILD_PART;
        this._$committedValue = nothing;
        // The following fields will be patched onto ChildParts when required by
        // AsyncDirective
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$startNode = startNode;
        this._$endNode = endNode;
        this._$parent = parent;
        this.options = options;
        // Note __isConnected is only ever accessed on RootParts (i.e. when there is
        // no _$parent); the value on a non-root-part is "don't care", but checking
        // for parent would be more code
        this.__isConnected = (_a = options === null || options === void 0 ? void 0 : options.isConnected) !== null && _a !== void 0 ? _a : true;
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            // Explicitly initialize for consistent class shape.
            this._textSanitizer = undefined;
        }
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        var _a, _b;
        // ChildParts that are not at the root should always be created with a
        // parent; only RootChildNode's won't, so they return the local isConnected
        // state
        return (_b = (_a = this._$parent) === null || _a === void 0 ? void 0 : _a._$isConnected) !== null && _b !== void 0 ? _b : this.__isConnected;
    }
    /**
     * The parent node into which the part renders its content.
     *
     * A ChildPart's content consists of a range of adjacent child nodes of
     * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
     * `.endNode`).
     *
     * - If both `.startNode` and `.endNode` are non-null, then the part's content
     * consists of all siblings between `.startNode` and `.endNode`, exclusively.
     *
     * - If `.startNode` is non-null but `.endNode` is null, then the part's
     * content consists of all siblings following `.startNode`, up to and
     * including the last child of `.parentNode`. If `.endNode` is non-null, then
     * `.startNode` will always be non-null.
     *
     * - If both `.endNode` and `.startNode` are null, then the part's content
     * consists of all child nodes of `.parentNode`.
     */
    get parentNode() {
        let parentNode = wrap(this._$startNode).parentNode;
        const parent = this._$parent;
        if (parent !== undefined &&
            parentNode.nodeType === 11 /* Node.DOCUMENT_FRAGMENT */) {
            // If the parentNode is a DocumentFragment, it may be because the DOM is
            // still in the cloned fragment during initial render; if so, get the real
            // parentNode the part will be committed into by asking the parent.
            parentNode = parent.parentNode;
        }
        return parentNode;
    }
    /**
     * The part's leading marker node, if any. See `.parentNode` for more
     * information.
     */
    get startNode() {
        return this._$startNode;
    }
    /**
     * The part's trailing marker node, if any. See `.parentNode` for more
     * information.
     */
    get endNode() {
        return this._$endNode;
    }
    _$setValue(value, directiveParent = this) {
        if (DEV_MODE && this.parentNode === null) {
            throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
        }
        value = resolveDirective(this, value, directiveParent);
        if (isPrimitive(value)) {
            // Non-rendering child values. It's important that these do not render
            // empty text nodes to avoid issues with preventing default <slot>
            // fallback content.
            if (value === nothing || value == null || value === '') {
                if (this._$committedValue !== nothing) {
                    this._$clear();
                }
                this._$committedValue = nothing;
            }
            else if (value !== this._$committedValue && value !== noChange) {
                this._commitText(value);
            }
            // This property needs to remain unminified.
        }
        else if (value['_$litType$'] !== undefined) {
            this._commitTemplateResult(value);
        }
        else if (value.nodeType !== undefined) {
            this._commitNode(value);
        }
        else if (isIterable(value)) {
            this._commitIterable(value);
        }
        else {
            // Fallback, will render the string representation
            this._commitText(value);
        }
    }
    _insert(node, ref = this._$endNode) {
        return wrap(wrap(this._$startNode).parentNode).insertBefore(node, ref);
    }
    _commitNode(value) {
        var _a;
        if (this._$committedValue !== value) {
            this._$clear();
            if (ENABLE_EXTRA_SECURITY_HOOKS &&
                sanitizerFactoryInternal !== noopSanitizer) {
                const parentNodeName = (_a = this._$startNode.parentNode) === null || _a === void 0 ? void 0 : _a.nodeName;
                if (parentNodeName === 'STYLE' || parentNodeName === 'SCRIPT') {
                    let message = 'Forbidden';
                    if (DEV_MODE) {
                        if (parentNodeName === 'STYLE') {
                            message =
                                `Lit does not support binding inside style nodes. ` +
                                    `This is a security risk, as style injection attacks can ` +
                                    `exfiltrate data and spoof UIs. ` +
                                    `Consider instead using css\`...\` literals ` +
                                    `to compose styles, and make do dynamic styling with ` +
                                    `css custom properties, ::parts, <slot>s, ` +
                                    `and by mutating the DOM rather than stylesheets.`;
                        }
                        else {
                            message =
                                `Lit does not support binding inside script nodes. ` +
                                    `This is a security risk, as it could allow arbitrary ` +
                                    `code execution.`;
                        }
                    }
                    throw new Error(message);
                }
            }
            this._$committedValue = this._insert(value);
        }
    }
    _commitText(value) {
        // If the committed value is a primitive it means we called _commitText on
        // the previous render, and we know that this._$startNode.nextSibling is a
        // Text node. We can now just replace the text content (.data) of the node.
        if (this._$committedValue !== nothing &&
            isPrimitive(this._$committedValue)) {
            const node = wrap(this._$startNode).nextSibling;
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(node, 'data', 'property');
                }
                value = this._textSanitizer(value);
            }
            node.data = value;
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                const textNode = document.createTextNode('');
                this._commitNode(textNode);
                // When setting text content, for security purposes it matters a lot
                // what the parent is. For example, <style> and <script> need to be
                // handled with care, while <span> does not. So first we need to put a
                // text node into the document, then we can sanitize its contentx.
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(textNode, 'data', 'property');
                }
                value = this._textSanitizer(value);
                textNode.data = value;
            }
            else {
                this._commitNode(d.createTextNode(value));
            }
        }
        this._$committedValue = value;
    }
    _commitTemplateResult(result) {
        var _a;
        // This property needs to remain unminified.
        const { values, ['_$litType$']: type } = result;
        // If $litType$ is a number, result is a plain TemplateResult and we get
        // the template from the template cache. If not, result is a
        // CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
        // to create the <template> element the first time we see it.
        const template = typeof type === 'number'
            ? this._$getTemplate(result)
            : (type.el === undefined &&
                (type.el = Template.createElement(type.h, this.options)),
                type);
        if (((_a = this._$committedValue) === null || _a === void 0 ? void 0 : _a._$template) === template) {
            this._$committedValue._update(values);
        }
        else {
            const instance = new TemplateInstance(template, this);
            const fragment = instance._clone(this.options);
            instance._update(values);
            this._commitNode(fragment);
            this._$committedValue = instance;
        }
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @internal */
    _$getTemplate(result) {
        let template = templateCache.get(result.strings);
        if (template === undefined) {
            templateCache.set(result.strings, (template = new Template(result)));
        }
        return template;
    }
    _commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If value is an array, then the previous render was of an
        // iterable and value will contain the ChildParts from the previous
        // render. If value is not an array, clear this part and make a new
        // array for ChildParts.
        if (!isArray(this._$committedValue)) {
            this._$committedValue = [];
            this._$clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._$committedValue;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            if (partIndex === itemParts.length) {
                // If no existing part, create a new one
                // TODO (justinfagnani): test perf impact of always creating two parts
                // instead of sharing parts between nodes
                // https://github.com/lit/lit/issues/1266
                itemParts.push((itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options)));
            }
            else {
                // Reuse an existing part
                itemPart = itemParts[partIndex];
            }
            itemPart._$setValue(item);
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // itemParts always have end nodes
            this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
        }
    }
    /**
     * Removes the nodes contained within this Part from the DOM.
     *
     * @param start Start node to clear from, for clearing a subset of the part's
     *     DOM (used when truncating iterables)
     * @param from  When `start` is specified, the index within the iterable from
     *     which ChildParts are being removed, used for disconnecting directives in
     *     those Parts.
     *
     * @internal
     */
    _$clear(start = wrap(this._$startNode).nextSibling, from) {
        var _a;
        (_a = this._$notifyConnectionChanged) === null || _a === void 0 ? void 0 : _a.call(this, false, true, from);
        while (start && start !== this._$endNode) {
            const n = wrap(start).nextSibling;
            wrap(start).remove();
            start = n;
        }
    }
    /**
     * Implementation of RootPart's `isConnected`. Note that this metod
     * should only be called on `RootPart`s (the `ChildPart` returned from a
     * top-level `render()` call). It has no effect on non-root ChildParts.
     * @param isConnected Whether to set
     * @internal
     */
    setConnected(isConnected) {
        var _a;
        if (this._$parent === undefined) {
            this.__isConnected = isConnected;
            (_a = this._$notifyConnectionChanged) === null || _a === void 0 ? void 0 : _a.call(this, isConnected);
        }
        else if (DEV_MODE) {
            throw new Error('part.setConnected() may only be called on a ' +
                'RootPart returned from render().');
        }
    }
}
class AttributePart {
    constructor(element, name, strings, parent, options) {
        this.type = ATTRIBUTE_PART;
        /** @internal */
        this._$committedValue = nothing;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this.element = element;
        this.name = name;
        this._$parent = parent;
        this.options = options;
        if (strings.length > 2 || strings[0] !== '' || strings[1] !== '') {
            this._$committedValue = new Array(strings.length - 1).fill(new String());
            this.strings = strings;
        }
        else {
            this._$committedValue = nothing;
        }
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            this._sanitizer = undefined;
        }
    }
    get tagName() {
        return this.element.tagName;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    /**
     * Sets the value of this part by resolving the value from possibly multiple
     * values and static strings and committing it to the DOM.
     * If this part is single-valued, `this._strings` will be undefined, and the
     * method will be called with a single value argument. If this part is
     * multi-value, `this._strings` will be defined, and the method is called
     * with the value array of the part's owning TemplateInstance, and an offset
     * into the value array from which the values should be read.
     * This method is overloaded this way to eliminate short-lived array slices
     * of the template instance values, and allow a fast-path for single-valued
     * parts.
     *
     * @param value The part value, or an array of values for multi-valued parts
     * @param valueIndex the index to start reading values from. `undefined` for
     *   single-valued parts
     * @param noCommit causes the part to not commit its value to the DOM. Used
     *   in hydration to prime attribute parts with their first-rendered value,
     *   but not set the attribute, and in SSR to no-op the DOM operation and
     *   capture the value for serialization.
     *
     * @internal
     */
    _$setValue(value, directiveParent = this, valueIndex, noCommit) {
        const strings = this.strings;
        // Whether any of the values has changed, for dirty-checking
        let change = false;
        if (strings === undefined) {
            // Single-value binding case
            value = resolveDirective(this, value, directiveParent, 0);
            change =
                !isPrimitive(value) ||
                    (value !== this._$committedValue && value !== noChange);
            if (change) {
                this._$committedValue = value;
            }
        }
        else {
            // Interpolation case
            const values = value;
            value = strings[0];
            let i, v;
            for (i = 0; i < strings.length - 1; i++) {
                v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
                if (v === noChange) {
                    // If the user-provided value is `noChange`, use the previous value
                    v = this._$committedValue[i];
                }
                change || (change = !isPrimitive(v) || v !== this._$committedValue[i]);
                if (v === nothing) {
                    value = nothing;
                }
                else if (value !== nothing) {
                    value += (v !== null && v !== void 0 ? v : '') + strings[i + 1];
                }
                // We always record each value, even if one is `nothing`, for future
                // change detection.
                this._$committedValue[i] = v;
            }
        }
        if (change && !noCommit) {
            this._commitValue(value);
        }
    }
    /** @internal */
    _commitValue(value) {
        if (value === nothing) {
            wrap(this.element).removeAttribute(this.name);
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._sanitizer === undefined) {
                    this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'attribute');
                }
                value = this._sanitizer(value !== null && value !== void 0 ? value : '');
            }
            wrap(this.element).setAttribute(this.name, (value !== null && value !== void 0 ? value : ''));
        }
    }
}
class PropertyPart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = PROPERTY_PART;
    }
    /** @internal */
    _commitValue(value) {
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            if (this._sanitizer === undefined) {
                this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'property');
            }
            value = this._sanitizer(value);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.element[this.name] = value === nothing ? undefined : value;
    }
}
// Temporary workaround for https://crbug.com/993268
// Currently, any attribute starting with "on" is considered to be a
// TrustedScript source. Such boolean attributes must be set to the equivalent
// trusted emptyScript value.
const emptyStringForBooleanAttribute = trustedTypes
    ? trustedTypes.emptyScript
    : '';
class BooleanAttributePart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = BOOLEAN_ATTRIBUTE_PART;
    }
    /** @internal */
    _commitValue(value) {
        if (value && value !== nothing) {
            wrap(this.element).setAttribute(this.name, emptyStringForBooleanAttribute);
        }
        else {
            wrap(this.element).removeAttribute(this.name);
        }
    }
}
class EventPart extends AttributePart {
    constructor(element, name, strings, parent, options) {
        super(element, name, strings, parent, options);
        this.type = EVENT_PART;
        if (DEV_MODE && this.strings !== undefined) {
            throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with ` +
                'invalid content. Event listeners in templates must have exactly ' +
                'one expression and no surrounding text.');
        }
    }
    // EventPart does not use the base _$setValue/_resolveValue implementation
    // since the dirty checking is more complex
    /** @internal */
    _$setValue(newListener, directiveParent = this) {
        var _a;
        newListener =
            (_a = resolveDirective(this, newListener, directiveParent, 0)) !== null && _a !== void 0 ? _a : nothing;
        if (newListener === noChange) {
            return;
        }
        const oldListener = this._$committedValue;
        // If the new value is nothing or any options change we have to remove the
        // part as a listener.
        const shouldRemoveListener = (newListener === nothing && oldListener !== nothing) ||
            newListener.capture !==
                oldListener.capture ||
            newListener.once !==
                oldListener.once ||
            newListener.passive !==
                oldListener.passive;
        // If the new value is not nothing and we removed the listener, we have
        // to add the part as a listener.
        const shouldAddListener = newListener !== nothing &&
            (oldListener === nothing || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.name, this, oldListener);
        }
        if (shouldAddListener) {
            // Beware: IE11 and Chrome 41 don't like using the listener as the
            // options object. Figure out how to deal w/ this in IE11 - maybe
            // patch addEventListener?
            this.element.addEventListener(this.name, this, newListener);
        }
        this._$committedValue = newListener;
    }
    handleEvent(event) {
        var _a, _b;
        if (typeof this._$committedValue === 'function') {
            this._$committedValue.call((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : this.element, event);
        }
        else {
            this._$committedValue.handleEvent(event);
        }
    }
}
class ElementPart {
    constructor(element, parent, options) {
        this.element = element;
        this.type = ELEMENT_PART;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$parent = parent;
        this.options = options;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    _$setValue(value) {
        resolveDirective(this, value);
    }
}
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _$LH object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-element, which re-exports all of lit-html.
 *
 * @private
 */
const _$LH = {
    // Used in lit-ssr
    _boundAttributeSuffix: boundAttributeSuffix,
    _marker: marker,
    _markerMatch: markerMatch,
    _HTML_RESULT: HTML_RESULT,
    _getTemplateHtml: getTemplateHtml,
    // Used in hydrate
    _TemplateInstance: TemplateInstance,
    _isIterable: isIterable,
    _resolveDirective: resolveDirective,
    // Used in tests and private-ssr-support
    _ChildPart: ChildPart,
    _AttributePart: AttributePart,
    _BooleanAttributePart: BooleanAttributePart,
    _EventPart: EventPart,
    _PropertyPart: PropertyPart,
    _ElementPart: ElementPart,
};
// Apply polyfills if available
const polyfillSupport = DEV_MODE
    ? window.litHtmlPolyfillSupportDevMode
    : window.litHtmlPolyfillSupport;
polyfillSupport === null || polyfillSupport === void 0 ? void 0 : polyfillSupport(Template, ChildPart);
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
((_d = globalThis.litHtmlVersions) !== null && _d !== void 0 ? _d : (globalThis.litHtmlVersions = [])).push('2.0.2');
if (DEV_MODE && globalThis.litHtmlVersions.length > 1) {
    issueWarning('multiple-versions', `Multiple versions of Lit loaded. ` +
        `Loading multiple versions is not recommended.`);
}
//# sourceMappingURL=lit-html.js.map

/***/ }),

/***/ "./node_modules/lit/decorators.js":
/*!****************************************!*\
  !*** ./node_modules/lit/decorators.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* reexport safe */ _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__.customElement),
/* harmony export */   "property": () => (/* reexport safe */ _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__.property),
/* harmony export */   "state": () => (/* reexport safe */ _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__.state),
/* harmony export */   "eventOptions": () => (/* reexport safe */ _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__.eventOptions),
/* harmony export */   "query": () => (/* reexport safe */ _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__.query),
/* harmony export */   "queryAll": () => (/* reexport safe */ _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__.queryAll),
/* harmony export */   "queryAsync": () => (/* reexport safe */ _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__.queryAsync),
/* harmony export */   "queryAssignedNodes": () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_7__.queryAssignedNodes)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element/decorators/custom-element.js */ "./node_modules/@lit/reactive-element/development/decorators/custom-element.js");
/* harmony import */ var _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lit/reactive-element/decorators/property.js */ "./node_modules/@lit/reactive-element/development/decorators/property.js");
/* harmony import */ var _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lit/reactive-element/decorators/state.js */ "./node_modules/@lit/reactive-element/development/decorators/state.js");
/* harmony import */ var _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lit/reactive-element/decorators/event-options.js */ "./node_modules/@lit/reactive-element/development/decorators/event-options.js");
/* harmony import */ var _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lit/reactive-element/decorators/query.js */ "./node_modules/@lit/reactive-element/development/decorators/query.js");
/* harmony import */ var _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-all.js */ "./node_modules/@lit/reactive-element/development/decorators/query-all.js");
/* harmony import */ var _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-async.js */ "./node_modules/@lit/reactive-element/development/decorators/query-async.js");
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-assigned-nodes.js */ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js");

//# sourceMappingURL=decorators.js.map


/***/ }),

/***/ "./node_modules/lit/index.js":
/*!***********************************!*\
  !*** ./node_modules/lit/index.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.CSSResult),
/* harmony export */   "INTERNAL": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.INTERNAL),
/* harmony export */   "LitElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.LitElement),
/* harmony export */   "ReactiveElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.ReactiveElement),
/* harmony export */   "UpdatingElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.UpdatingElement),
/* harmony export */   "_$LE": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LE),
/* harmony export */   "_$LH": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LH),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.css),
/* harmony export */   "defaultConverter": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.defaultConverter),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.getCompatibleStyle),
/* harmony export */   "html": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.html),
/* harmony export */   "noChange": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.noChange),
/* harmony export */   "notEqual": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.notEqual),
/* harmony export */   "nothing": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.nothing),
/* harmony export */   "render": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.render),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.supportsAdoptingStyleSheets),
/* harmony export */   "svg": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.svg),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
/* harmony import */ var lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lit-element/lit-element.js */ "./node_modules/lit-element/development/lit-element.js");

//# sourceMappingURL=index.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map