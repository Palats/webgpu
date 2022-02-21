// Multiple rotating cubes.
//
// Rotation, translation and projection are calculated within compute shaders.

/// <reference types="@webgpu/types" />
import * as types from '../types';

import * as wg from '../wg';
import * as shaderlib from '../shaderlib';

const uniformsDesc = new wg.Descriptor({
    elapsedMs: wg.Field(wg.F32, 0),
    renderWidth: wg.Field(wg.F32, 1),
    renderHeight: wg.Field(wg.F32, 2),
})

export const demo = {
    id: "multicubes",
    caption: "Multiple independent rotating cubes.",

    async init(params: types.InitParams) {
        const instances = 3;

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
                    code: wg.wgsl`
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};

                        struct InstanceState {
                            // ModelViewProjection
                            mvp: mat4x4<f32>;
                        };
                        @group(0) @binding(1) var<storage, write> outp : array<InstanceState, ${instances.toString()}>;

                        @stage(compute) @workgroup_size(1)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let TAU = 6.283185;
                            let c = (uniforms.elapsedMs / 1000.0) % TAU;
                            let r = vec3<f32>(c, c, c);
                            outp[global_id.x].mvp =
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
                    code: wg.wgsl`
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
                            out.pos.x = out.pos.x + f32(instance);
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
        return async (info: types.FrameInfo) => {
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
            // Calculate projection matrices for each instance.
            computeEncoder.dispatch(instances);
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
}