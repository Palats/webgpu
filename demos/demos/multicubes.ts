// Multiple rotating cubes.
//
// Rotation, translation and projection are calculated within compute shaders.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../../src';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';

// Number of instances.
const workgroupWidth = 8;
const workgroupHeight = 8;
const instancesWidth = 1 * workgroupWidth;
const instancesHeight = 1 * workgroupHeight;
const instances = instancesWidth * instancesHeight

// Space parameters.
const boxSize = 20;
const cameraOffset = glmatrix.vec3.fromValues(0, 0, 25);
const spaceLimit = boxSize / 2.0;

// Parameters from Javascript to the computer shader
// for each instance.
const instanceParamsDesc = new wg.StructType({
    'pos': { type: wg.Vec3f32, idx: 0 },
    'rot': { type: wg.Vec3f32, idx: 1 },
    'move': { type: wg.Vec3f32, idx: 2 },
    'scale': { type: wg.F32, idx: 3 },
})

const instanceArrayDesc = new wg.ArrayType(instanceParamsDesc, instances);

export const demo = {
    id: "multicubes",
    caption: "Multiple independent rotating cubes.",

    async init(params: demotypes.InitParams) {
        // Setup controls.
        const ctrls = {
            showBoundaries: true,
            showBasis: false,
        };
        params.gui.add(ctrls, 'showBoundaries');
        params.gui.add(ctrls, 'showBasis');

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
        instanceArrayDesc.dataViewSet(new DataView(a), 0, positions);
        params.device.queue.writeBuffer(instancesBuffer, 0, a);

        const demoBuffer = new shaderlib.DemoBuffer(params);

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
                    code: wg.wgsl`
                        @group(0) @binding(0) var<uniform> demo : ${demoBuffer.desc.typename()};
                        @group(0) @binding(1) var<storage, read_write> params : ${instanceArrayDesc.typename()};

                        struct InstanceState {
                            // ModelViewProjection
                            mvp: mat4x4<f32>,
                        };
                        @group(0) @binding(2) var<storage, write> outp : array<InstanceState, ${instances.toString()}>;

                        @stage(compute) @workgroup_size(${workgroupWidth.toString()}u, ${workgroupHeight.toString()}u)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let idx = global_id.y * ${instancesWidth.toString()}u + global_id.x;

                            var pos = params[idx].pos;

                            if (demo.deltaMs > 0.0) {
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
                            }

                            let TAU = 6.283185;
                            let c = (demo.elapsedMs / 1000.0) % TAU;
                            let r = params[idx].rot + vec3<f32>(c, c, c);

                            outp[idx].mvp =
                                demo.camera
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
                resource: { buffer: demoBuffer.buffer }
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
        const depthFormat = "depth24plus";

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
                    code: wg.wgsl`
                        struct InstanceState {
                            // ModelViewProjection
                            mvp: mat4x4<f32>,
                        };
                        @group(0) @binding(0) var<storage> states : array<InstanceState, ${instances.toString()}>;

                        struct Out {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec3<f32>,
                        };

                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32, @builtin(instance_index) instance: u32) -> Out {
                            let pos = ${shaderlib.cubeMeshStrip.ref("mesh")}[idx];

                            var out : Out;
                            out.pos = states[instance].mvp * vec4<f32>(pos , 1.0);
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
                format: depthFormat,
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
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        // Prepare the rendering pipeline as a bundle.
        const renderBundleEncoder = params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(renderPipeline);
        renderBundleEncoder.setBindGroup(0, renderBindGroup);
        // Cube mesh as a triangle-strip uses 14 vertices.
        renderBundleEncoder.draw(14, instances, 0, 0);
        const renderBundle = renderBundleEncoder.finish();

        // Orthonormals.
        const basisBundle = shaderlib.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: shaderlib.ortholines,
            demoBuffer: demoBuffer,
        });
        // Cube surrounding the scene.
        const boundariesBundle = shaderlib.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: shaderlib.cubelines(spaceLimit),
            depthCompare: 'less',
            demoBuffer: demoBuffer,
        });

        // Configuring camera.
        const camera = new cameras.ArcBall(cameraOffset)
        params.setCamera(camera);

        // -- Single frame rendering.
        return async (info: demotypes.FrameInfo) => {
            const viewproj = glmatrix.mat4.perspective(
                glmatrix.mat4.create(),
                2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
                params.renderWidth / params.renderHeight, // aspect
                1.0, // near
                100.0, // far
            );
            camera.transform(viewproj, info.cameraMvt);
            demoBuffer.refresh(info, viewproj);

            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');

            commandEncoder.pushDebugGroup('Compute cube movement');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            // Calculate projection matrices for each instance.
            computeEncoder.dispatchWorkgroups(workgroupWidth, workgroupHeight);
            computeEncoder.end();
            commandEncoder.popDebugGroup();

            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cubes');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: params.context.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                },
            });
            const bundles = [renderBundle];
            if (ctrls.showBoundaries) { bundles.push(boundariesBundle); }
            if (ctrls.showBasis) { bundles.push(basisBundle); }
            renderEncoder.executeBundles(bundles);
            renderEncoder.end();
            commandEncoder.popDebugGroup();

            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}