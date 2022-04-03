// Load gltf models.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../wg';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as varpanel from '../varpanel';
import * as models from '../models';
import * as gltfloader from 'gltf-loader-ts';


export const demo = {
    id: "viewer",
    caption: "A gltf viewer",

    async init(params: demotypes.InitParams) {
        const d = new Demo(params);
        return (f: demotypes.FrameInfo) => d.draw(f);
    }
}

// Basic parameters provided to all the shaders.
const uniformsDesc = new wg.StructType({
    elapsedMs: { idx: 0, type: wg.F32 },
    deltaMs: { idx: 1, type: wg.F32 },
    renderWidth: { idx: 2, type: wg.F32 },
    renderHeight: { idx: 3, type: wg.F32 },
    rngSeed: { idx: 4, type: wg.F32 },
    camera: { idx: 5, type: wg.Mat4x4F32 },
})

const depthFormat = "depth24plus";

function loadToGPU(u: string): (params: demotypes.InitParams) => Promise<models.GPUMesh> {
    return async params => {
        const mesh = await loadGLTF(u);
        return new models.GPUMesh(params, mesh);
    }
}

const allModels: { [k: string]: (params: demotypes.InitParams) => Promise<models.GPUMesh> } = {
    "builtin sphere": async params => new models.GPUMesh(params, models.sphereMesh()),
    "builtin cube": async params => new models.GPUMesh(params, models.cubeMesh()),
    "gltf cube": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf'),
    "gltf triangle": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Triangle/glTF/Triangle.gltf'),
}

class Demo {
    params: demotypes.InitParams;
    depthTextureView: GPUTextureView;
    uniformsBuffer: GPUBuffer;
    camera: cameras.ArcBall;
    bundles: GPURenderBundle[] = [];
    renderPipeline: GPURenderPipeline;
    renderBindGroup: GPUBindGroup;
    showBasis = true;
    basisBundle: GPURenderBundle;

    _model = "gltf cube"
    get model(): string { return this._model; }
    set model(s: string) {
        this._model = s;
        allModels[s](this.params).then(mesh => this.setMesh(mesh));
    }

    constructor(params: demotypes.InitParams) {
        this.params = params;
        params.expose(varpanel.newSelect({ obj: this, field: "model", values: Object.keys(allModels) }));
        params.expose(varpanel.newBool({ obj: this, field: 'showBasis' }));

        this.uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // -- Render pipeline.
        const shader = params.device.createShaderModule(new wg.WGSLModule({
            label: "vertex shader",
            code: wg.wgsl`
                @group(0) @binding(0) var<uniform> uniforms: ${uniformsDesc.typename()};

                struct Vertex {
                    @builtin(position) pos: vec4<f32>;
                    @location(0) color: vec4<f32>;
                };

                @stage(vertex)
                fn vertex(inp: ${models.vertexDesc.vertexType()}) -> Vertex {
                    let TAU = 6.283185;
                    let c = (uniforms.elapsedMs / 1000.0) % TAU;
                    let r = vec3<f32>(c, c, c);

                    var out : Vertex;
                    out.pos =
                        uniforms.camera
                        * ${shaderlib.tr.ref("rotateZ")}(r.z)
                        * ${shaderlib.tr.ref("rotateY")}(r.y)
                        * ${shaderlib.tr.ref("rotateX")}(r.z)
                        * vec4<f32>(inp.pos, 1.0);
                    // out.color = inp.color;
                    out.color = vec4<f32>(0.5 * (inp.pos + vec3<f32>(1., 1., 1.)), 1.0);
                    return out;
                }

                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    return vert.color;
                }
            `,
        }).toDesc());

        this.renderPipeline = params.device.createRenderPipeline({
            label: "Rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout",
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                                buffer: { type: 'uniform' },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'vertex',
                module: shader,
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
                module: shader,
                targets: [{
                    format: params.renderFormat,
                }],
            },
        });

        this.renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformsBuffer }
                },
            ]
        });

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
            mod: uniformsDesc,
            buffer: this.uniformsBuffer,
        });

        // Configuring camera.
        this.camera = new cameras.ArcBall(glmatrix.vec3.fromValues(0, 0, 4));
        params.setCamera(this.camera);

        // Force loading the initial model.
        this.model = this.model;
        // this.setMesh(new models.GPUMesh(params, models.sphereMesh()));
    }

    setMesh(gpuMesh: models.GPUMesh) {
        const renderBundleEncoder = this.params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [this.params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(this.renderPipeline);
        renderBundleEncoder.setBindGroup(0, this.renderBindGroup);
        gpuMesh.draw(renderBundleEncoder);
        this.bundles = [renderBundleEncoder.finish()];
        if (this.showBasis) { this.bundles.push(this.basisBundle); }
    }

    // -- Single frame rendering.
    async draw(info: demotypes.FrameInfo) {
        const viewproj = glmatrix.mat4.perspective(
            glmatrix.mat4.create(),
            2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
            this.params.renderWidth / this.params.renderHeight, // aspect
            1.0, // near
            100.0, // far
        );
        this.camera.transform(viewproj, info.cameraMvt);
        this.params.device.queue.writeBuffer(this.uniformsBuffer, 0, uniformsDesc.createArray({
            elapsedMs: info.elapsedMs,
            deltaMs: info.deltaMs,
            renderWidth: this.params.renderWidth,
            renderHeight: this.params.renderHeight,
            rngSeed: info.rng,
            camera: Array.from(viewproj),
        }));

        const commandEncoder = this.params.device.createCommandEncoder();
        commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');

        // -- Frame rendering.
        commandEncoder.pushDebugGroup('Render cubes');
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
        renderEncoder.executeBundles(this.bundles);
        renderEncoder.end();
        commandEncoder.popDebugGroup();

        // Submit all the work.
        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}

// https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#_mesh_primitive_mode
enum GLTFPrimitiveMode {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6,
};

// https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#accessor-data-types
enum GLTFAccessorType {
    SCALAR = "SCALAR",
    VEC2 = "VEC2",
    VEC3 = "VEC3",
    VEC4 = "VEC4",
    MAT2 = "MAT2",
    MAT3 = "MAT3",
    MAT4 = "MAT4",
};

enum GLTFAccessorComponentType {
    S8 = 5120,
    U8 = 5121,
    S16 = 5122,
    U16 = 5123,
    U32 = 5125,
    F32 = 5126,
};

async function loadGLTF(u: string): Promise<models.Mesh> {
    const loader = new gltfloader.GltfLoader();
    const asset: gltfloader.GltfAsset = await loader.load(u);
    const content = asset.gltf;
    if (!content.meshes) { throw new Error("no meshes"); }
    const rawMesh = content.meshes[0];
    const primitive = rawMesh.primitives[0];

    if (primitive.mode && primitive.mode != GLTFPrimitiveMode.TRIANGLES) { throw new Error(`only triangles; got ${primitive.mode}`); }
    if (!content.accessors) { throw new Error("no accessors"); }

    // Load vertices.
    const vertAccIndex = primitive.attributes["POSITION"];
    const vertAcc = content.accessors[vertAccIndex];
    if (vertAcc.type != GLTFAccessorType.VEC3) { throw new Error(`wrong type: ${vertAcc.type}`); }
    if (vertAcc.componentType != GLTFAccessorComponentType.F32) { throw new Error(`wrong component type ${vertAcc.componentType}`); }

    // accessorData return the full bufferView, not just specific accessorData.
    const posBufferView = await asset.accessorData(vertAccIndex);
    const f32 = new Float32Array(posBufferView.buffer, posBufferView.byteOffset + (vertAcc.byteOffset ?? 0), vertAcc.count * 3);

    const vertices: wg.types.WGSLJSType<typeof models.vertexDesc>[] = [];

    for (let i = 0; i < vertAcc.count; i++) {
        vertices.push({
            pos: [f32[i * 3], f32[i * 3 + 1], f32[i * 3 + 2]],
            color: [1, 0, 1, 1],
        });
    }

    // Load indices
    if (primitive.indices === undefined) { throw new Error("no indices"); }
    const idxAccIndex = primitive.indices;
    const idxAcc = content.accessors[idxAccIndex];
    if (idxAcc.type != GLTFAccessorType.SCALAR) { throw new Error(`wrong type: ${idxAcc.type}`); }
    if (idxAcc.componentType != GLTFAccessorComponentType.U16) { throw new Error(`wrong component type ${idxAcc.componentType}`); }
    const indicesData = await asset.accessorData(idxAccIndex);
    const u16 = new Uint16Array(indicesData.buffer, indicesData.byteOffset, indicesData.byteLength / Uint16Array.BYTES_PER_ELEMENT);
    const indices = Array.from(u16);

    return {
        vertices,
        indices,
    }
}