// Load gltf models.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import { vec3, mat4 } from 'gl-matrix';
import * as wg from '../../src';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as models from '../models';

// ---- Demo parameter

export const demo = {
    id: "engine",
    caption: "A simple 3d engine",

    async init(params: demotypes.InitParams) {
        const d = new Demo(params);
        return (f: demotypes.FrameInfo) => d.draw(f);
    }
}


// ---- Rendering setup & UI

const depthFormat = "depth24plus";

class Demo {
    params: demotypes.InitParams;
    demoBuffer: shaderlib.DemoBuffer;
    groupRenderer: GroupRenderer;

    camera: cameras.ArcBall;
    showBasis = true;
    basisBundle: GPURenderBundle;
    depthTextureView: GPUTextureView;

    constructor(params: demotypes.InitParams) {
        this.params = params;
        this.demoBuffer = new shaderlib.DemoBuffer(params);
        this.groupRenderer = new GroupRenderer(params, this.demoBuffer, 100);

        const lightFolder = params.gui.addFolder("light");
        lightFolder.add(this.groupRenderer, 'useLight').name("use");
        lightFolder.add(this.groupRenderer, 'lightX', -20, 20).name("x");
        lightFolder.add(this.groupRenderer, 'lightY', -20, 20).name("y");
        lightFolder.add(this.groupRenderer, 'lightZ', -20, 20).name("z");
        params.gui.add(this, 'showBasis');
        params.gui.add(this.groupRenderer, 'debugCoords');

        // Setup basic render.
        this.depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        // Orthonormals.
        this.basisBundle = shaderlib.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: shaderlib.ortholines,
            demoBuffer: this.demoBuffer,
        });

        // Configuring camera.
        this.camera = new cameras.ArcBall(vec3.fromValues(0, 0, 4));
        params.setCamera(this.camera);

        this.groupRenderer.setPosition();

        this.load();
    }

    async load() {
        const u = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';
        const cpuMeshes = await models.loadGLTF(u);
        const gpuMeshes = await Promise.all(cpuMeshes.map(m => models.buildGPUMesh(this.params, m)));
        this.groupRenderer.setMeshes(gpuMeshes);
    }

    // -- Single frame rendering.
    async draw(info: demotypes.FrameInfo) {
        const viewproj = mat4.perspective(
            mat4.create(),
            2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
            this.params.renderWidth / this.params.renderHeight, // aspect
            1.0, // near
            100.0, // far
        );
        this.camera.transform(viewproj, info.cameraMvt);

        this.demoBuffer.refresh(info, viewproj);

        const commandEncoder = this.params.device.createCommandEncoder();
        commandEncoder.pushDebugGroup('Frame time ${info.elapsedMs}');

        const computeEncoder = commandEncoder.beginComputePass({});
        this.groupRenderer.compute(info, computeEncoder);
        computeEncoder.end();

        const renderEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.params.context.getCurrentTexture().createView(),
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }],
            depthStencilAttachment: {
                view: this.depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });
        this.groupRenderer.draw(info, renderEncoder);
        if (this.showBasis) { renderEncoder.executeBundles([this.basisBundle]); }
        renderEncoder.end();

        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}

// ------------------- group renderer ---------------------------

// Uniforms for instance prep.
const computeUniformsDesc = new wg.StructType({
    modelTransform: { idx: 0, type: wg.Mat4x4F32 },
});

// Parameters of an instance.
const instanceStateDesc = new wg.StructType({
    position: { idx: 0, type: wg.Vec3f32 },
    scale: { idx: 1, type: wg.Vec3f32 },
});

// Render information of an instance.
const instanceRenderDesc = new wg.StructType({
    // Model-View-Project.
    mvp: { idx: 0, type: wg.Mat4x4F32 },
    // To World coordinate (i.e., "Model" from MVP)
    world: { idx: 1, type: wg.Mat4x4F32 },
    // Transformation for normals.
    normalsTr: { idx: 2, type: wg.Mat4x4F32 },
});

// Uniforms for rendering.
const renderUniformsDesc = new wg.StructType({
    useLight: { idx: 0, type: wg.I32 },
    light: { idx: 1, type: wg.Vec4f32 },
    debugCoords: { idx: 2, type: wg.I32 },
    // To be removed as that should come from compute.
    modelTransform: { idx: 3, type: wg.Mat4x4F32 },
});

const computeBG = new wg.layout.BindGroup({
    label: "data for compute",
    visibility: GPUShaderStage.COMPUTE,
    entries: {
        demo: { buffer: { type: 'uniform', wgtype: shaderlib.demoDesc } },
        uniforms: { buffer: { type: 'uniform', wgtype: computeUniformsDesc } },
        instancesState: { buffer: { type: 'read-only-storage', wgtype: new wg.ArrayType(instanceStateDesc) } },
        instancesRender: { buffer: { type: 'storage', wgtype: new wg.ArrayType(instanceRenderDesc) } },
    },
});

const computeLayout = new wg.layout.Pipeline({
    label: "compute",
    entries: {
        all: { bindGroup: computeBG },
    }
});

const renderBG = new wg.layout.BindGroup({
    label: "data for render",
    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
    entries: {
        demo: { buffer: { type: 'uniform', wgtype: shaderlib.demoDesc } },
        uniforms: { buffer: { type: 'uniform', wgtype: renderUniformsDesc } },
        instancesRender: { buffer: { type: 'read-only-storage', wgtype: new wg.ArrayType(instanceRenderDesc) } },
        material: { buffer: { wgtype: models.materialDesc } },
        smplr: {
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {},
        },
        tex: {
            visibility: GPUShaderStage.FRAGMENT,
            texture: {},
        },
    },
});

const renderLayout = new wg.layout.Pipeline({
    label: "render",
    entries: {
        all: { bindGroup: renderBG },
    }
});

class GroupRenderer {
    useLight = true;
    lightX = 4.0;
    lightY = 4.0;
    lightZ = 10.0;
    debugCoords = false;

    private params: demotypes.InitParams;
    private demoBuffer: shaderlib.DemoBuffer;

    private instances: number;

    private computeUniformsBuffer: GPUBuffer;
    private renderUniformsBuffer: GPUBuffer;
    private instancesStateBuffer: GPUBuffer;
    private instancesRenderBuffer: GPUBuffer;

    private computePipeline: GPUComputePipeline;
    private renderPipeline: GPURenderPipeline;
    private modelTransform: mat4;
    private bundles: GPURenderBundle[] = [];

    constructor(params: demotypes.InitParams, demoBuffer: shaderlib.DemoBuffer, instances: number) {
        this.params = params;
        this.demoBuffer = demoBuffer;
        this.instances = instances;

        this.modelTransform = mat4.create();

        this.computeUniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: computeUniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.renderUniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: renderUniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.instancesStateBuffer = params.device.createBuffer({
            label: "instances state",
            size: (new wg.ArrayType(instanceStateDesc, this.instances)).byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.instancesRenderBuffer = params.device.createBuffer({
            label: "instances render info",
            size: (new wg.ArrayType(instanceRenderDesc, this.instances)).byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
        });

        // -- Compute pipeline.
        const computeRefs = computeLayout.wgsl();
        const computeShader = params.device.createShaderModule(new wg.WGSLModule({
            label: "compute shader",
            code: wg.wgsl`
                @stage(compute) @workgroup_size(8, 1)
                fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                    // Guard against out-of-bounds work group sizes
                    if (global_id.x >= ${this.instances.toFixed(0)}u || global_id.y >= 1u) {
                        return;
                    }

                    let idx = global_id.x;
                    let inp = ${computeRefs.all.instancesState}[idx];

                    let TAU = 6.283185;
                    let c = (${computeRefs.all.demo}.elapsedMs / 1000.0) % TAU;
                    let r = vec3<f32>(c, c, c);

                    let scale = mat4x4<f32>(
                        inp.scale.x, 0.0, 0.0, 0.0,
                        0.0, inp.scale.y, 0.0, 0.0,
                        0.0, 0.0, inp.scale.z, 0.0,
                        0.0, 0.0, 0.0, 1.0,
                    );

                    let world = ${shaderlib.tr.refs.translate}(inp.position)
                        * ${shaderlib.tr.ref("rotateZ")}(r.z)
                        * ${shaderlib.tr.ref("rotateY")}(r.y)
                        * ${shaderlib.tr.ref("rotateX")}(r.z)
                        * scale
                        * ${computeRefs.all.uniforms}.modelTransform;
                    ${computeRefs.all.instancesRender}[idx].world = world;

                    let mvp = ${computeRefs.all.demo}.camera * world;
                    ${computeRefs.all.instancesRender}[idx].mvp = mvp;

                    // Normal transform. No clue what I'm doing.
                    // https://gamedev.net/forums/topic/476196-inverse-transpose-of-a-matrix-inside-vertex-shader/476196/
                    let normalsTr = mat4x4<f32>(
                        world[0] / dot(world[0], world[0]),
                        world[1] / dot(world[1], world[1]),
                        world[2] / dot(world[2], world[2]),
                        world[3] / dot(world[3], world[3]),
                    );
                    ${computeRefs.all.instancesRender}[idx].normalsTr = normalsTr;
                }
            `,
        }).toDesc());

        this.computePipeline = params.device.createComputePipeline({
            label: "compute pipeline",
            layout: computeLayout.layout(this.params.device),
            compute: {
                entryPoint: "main",
                module: computeShader,
            }
        });

        // -- Render pipeline.
        const renderRefs = renderLayout.wgsl();
        const renderShader = params.device.createShaderModule(new wg.WGSLModule({
            label: "vertex shader",
            code: wg.wgsl`
                struct Vertex {
                    @builtin(position) pos: vec4<f32>,
                    @location(0) color: vec4<f32>,
                    @location(1) world: vec4<f32>,
                    @location(2) normal: vec4<f32>,
                    @location(3) texcoord: vec2<f32>,
                };

                @stage(vertex)
                fn vertex(inp: ${models.vertexDesc.vertexType()}, @builtin(instance_index) instance: u32) -> Vertex {
                    var out : Vertex;
                    let idx = instance;

                    let nfo = ${renderRefs.all.instancesRender}[idx];
                    out.pos = nfo.mvp * vec4<f32>(inp.pos, 1.0);
                    out.world = nfo.world * vec4<f32>(inp.pos, 1.0);
                    out.normal = normalize(nfo.normalsTr * vec4<f32>(inp.normal, 0.0));
                    out.texcoord = inp.texcoord;

                    let modelPos = ${renderRefs.all.uniforms}.modelTransform * vec4<f32>(inp.pos, 1.0);
                    if (${renderRefs.all.uniforms}.debugCoords == 0) {
                        if (${renderRefs.all.material}.hasColor == 0) {
                            // No provided color? Use a flashy green.
                            out.color = vec4<f32>(0., 1., 0., 1.);
                        } else {
                            out.color = inp.color;
                        }
                    } else {
                        out.color = vec4<f32>(0.5 * (modelPos.xyz + vec3<f32>(1., 1., 1.)), 1.0);
                    }
                    return out;
                }


                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    var frag = vert.color;
                    if (${renderRefs.all.material}.hasTexture != 0 && ${renderRefs.all.uniforms}.debugCoords == 0) {
                        frag = textureSample(${renderRefs.all.tex}, ${renderRefs.all.smplr}, vert.texcoord);
                    }

                    if (${renderRefs.all.uniforms}.useLight == 0 || ${renderRefs.all.material}.hasNormals == 0) {
                        return frag;
                    }
                    let ray = normalize(${renderRefs.all.uniforms}.light - vert.world);
                    let lum = clamp(dot(ray, vert.normal), .0, 1.0);
                    return lum * frag;
                }
            `,
        }).toDesc());

        this.renderPipeline = params.device.createRenderPipeline({
            label: "Rendering pipeline",
            layout: renderLayout.layout(params.device),
            vertex: {
                entryPoint: 'vertex',
                module: renderShader,
                buffers: [models.vertexDesc.vertexBufferLayout()],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: depthFormat,
            },
            fragment: {
                entryPoint: 'fragment',
                module: renderShader,
                targets: [{ format: params.renderFormat, }],
            },
        });
    }

    async setMeshes(gpuMeshes: models.GPUMesh[]) {
        const waitOn: Promise<GPURenderBundle>[] = [];

        let meshMin: vec3 | undefined;
        let meshMax: vec3 | undefined;
        for (const gpuMesh of gpuMeshes) {
            waitOn.push(this.buildMesh(gpuMesh));

            if (gpuMesh.min) {
                if (!meshMin) {
                    meshMin = vec3.clone(gpuMesh.min);
                } else {
                    vec3.min(meshMin, meshMin, gpuMesh.min);
                }
            }
            if (gpuMesh.max) {
                if (!meshMax) {
                    meshMax = vec3.clone(gpuMesh.max);
                } else {
                    vec3.max(meshMax, meshMax, gpuMesh.max);
                }
            }
        }

        if (meshMin && meshMax) {
            const diff = vec3.sub(vec3.create(), meshMax, meshMin);
            const maxDiff = Math.max(diff[0], diff[1], diff[2]);
            // Make it of size 2 - i.e., fitting it in a box from -1 to +1, as
            // it is rotating around the origin.
            const scale = 2 / maxDiff;
            const scaleVec = vec3.fromValues(scale, scale, scale);

            const tr = vec3.clone(meshMin);
            vec3.scaleAndAdd(tr, tr, diff, 0.5);
            vec3.scale(tr, tr, -1);


            mat4.fromScaling(this.modelTransform, scaleVec);
            mat4.translate(this.modelTransform, this.modelTransform, tr);
        } else {
            mat4.identity(this.modelTransform);
        }

        this.bundles = [];
        for (const mesh of await Promise.all(waitOn)) {
            this.bundles.push(mesh);
        }
    }

    private async buildMesh(gpuMesh: models.GPUMesh): Promise<GPURenderBundle> {
        const sampler = this.params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });

        const renderBundleEncoder = this.params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [this.params.renderFormat],
            depthStencilFormat: depthFormat,
        });

        renderBundleEncoder.setPipeline(this.renderPipeline);
        renderLayout.setBindGroups(renderBundleEncoder, {
            all: renderBG.Create(this.params.device, {
                demo: this.demoBuffer.buffer,
                uniforms: this.renderUniformsBuffer,
                instancesRender: this.instancesRenderBuffer,
                material: gpuMesh.materialBuffer,
                smplr: sampler,
                tex: gpuMesh.textureView!,
            }),
        });
        renderBundleEncoder.setIndexBuffer(gpuMesh.indexBuffer, 'uint16');
        renderBundleEncoder.setVertexBuffer(0, gpuMesh.vertexBuffer);
        renderBundleEncoder.drawIndexed(gpuMesh.indicesCount, this.instances);

        return renderBundleEncoder.finish();
    }

    setPosition() {
        let desc = new wg.types.ArrayType(instanceStateDesc, this.instances);
        let data: wg.types.WGSLJSType<typeof desc> = [];
        for (let i = 0; i < this.instances; i++) {
            const scale = Math.random() * 0.2 + 0.1;
            data.push({
                position: [
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 5,
                    -(Math.random()) * 5,
                ],
                scale: [scale, scale, scale],
            });
        }
        this.params.device.queue.writeBuffer(this.instancesStateBuffer, 0, desc.createArray(data));
    }

    compute(info: demotypes.FrameInfo, computeEncoder: GPUComputePassEncoder) {
        computeEncoder.pushDebugGroup("compute group");
        this.params.device.queue.writeBuffer(this.computeUniformsBuffer, 0, computeUniformsDesc.createArray({
            modelTransform: Array.from(this.modelTransform),
        }));
        computeLayout.setBindGroups(computeEncoder, {
            all: computeBG.Create(this.params.device, {
                demo: this.demoBuffer.buffer,
                uniforms: this.computeUniformsBuffer,
                instancesRender: this.instancesRenderBuffer,
                instancesState: this.instancesStateBuffer,
            }),
        });

        computeEncoder.setPipeline(this.computePipeline);
        const c = Math.ceil(this.instances / 8);
        computeEncoder.dispatchWorkgroups(c);
        computeEncoder.popDebugGroup();
    }

    draw(info: demotypes.FrameInfo, renderEncoder: GPURenderPassEncoder) {
        renderEncoder.pushDebugGroup("render group");
        this.params.device.queue.writeBuffer(this.renderUniformsBuffer, 0, renderUniformsDesc.createArray({
            useLight: this.useLight ? 1 : 0,
            light: [this.lightX, this.lightY, this.lightZ, 1.0],
            debugCoords: this.debugCoords ? 1 : 0,
            modelTransform: Array.from(this.modelTransform),
        }));
        renderEncoder.executeBundles(this.bundles);
        renderEncoder.popDebugGroup();
    }
}