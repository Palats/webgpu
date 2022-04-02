// Draw a sphere.

/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../wg';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as varpanel from '../varpanel';

// Basic parameters provided to all the shaders.
const uniformsDesc = new wg.StructType({
    elapsedMs: { idx: 0, type: wg.F32 },
    deltaMs: { idx: 1, type: wg.F32 },
    renderWidth: { idx: 2, type: wg.F32 },
    renderHeight: { idx: 3, type: wg.F32 },
    rngSeed: { idx: 4, type: wg.F32 },
    camera: { idx: 5, type: wg.Mat4x4F32 },
})

const vertexDesc = new wg.StructType({
    pos: { type: wg.Vec3f32, idx: 0 },
    color: { type: wg.Vec4f32, idx: 1 },
});

type Mesh = {
    vertices: wg.types.WGSLJSType<typeof vertexDesc>[];
    indices: number[];
}

class GPUMesh {
    private vertexBuffer: GPUBuffer;
    private indexBuffer: GPUBuffer;
    private indicesCount: number;

    constructor(params: demotypes.InitParams, mesh: Mesh) {
        const verticesDesc = new wg.ArrayType(vertexDesc, mesh.vertices.length);

        this.vertexBuffer = params.device.createBuffer({
            label: `vertex buffer`,
            size: verticesDesc.byteSize(),
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        params.device.queue.writeBuffer(this.vertexBuffer, 0, verticesDesc.createArray(mesh.vertices));

        const indexDesc = new wg.ArrayType(wg.U16, mesh.indices.length);
        this.indexBuffer = params.device.createBuffer({
            label: `index buffer`,
            size: indexDesc.byteSize(),
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        });
        params.device.queue.writeBuffer(this.indexBuffer, 0, indexDesc.createArray(mesh.indices));

        this.indicesCount = mesh.indices.length;
    }

    draw(encoder: GPURenderEncoderBase) {
        encoder.setIndexBuffer(this.indexBuffer, 'uint16');
        encoder.setVertexBuffer(0, this.vertexBuffer);
        encoder.drawIndexed(this.indicesCount);
    }
}

export const demo = {
    id: "sphere",
    caption: "A sphere",

    async init(params: demotypes.InitParams) {
        // Setup controls.
        const ctrls = {
            _model: "sphere",
            get model(): string { return this._model; },
            set model(s: string) { this._model = s; console.log(s); },
        };
        params.expose(varpanel.newSelect({ obj: ctrls, field: "model", values: ["sphere", "cube"] }));

        const uniformsBuffer = params.device.createBuffer({
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
                fn vertex(inp: ${vertexDesc.vertexType()}) -> Vertex {
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

        const depthFormat = "depth24plus";

        const renderPipeline = params.device.createRenderPipeline({
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
                buffers: [vertexDesc.vertexBufferLayout()],
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

        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                },
            ]
        });

        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        // -- Prepare mesh.
        const gpuMesh = new GPUMesh(params, sphereMesh());

        // Prepare the rendering pipeline as a bundle.
        const bundles: GPURenderBundle[] = [];

        const renderBundleEncoder = params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(renderPipeline);
        renderBundleEncoder.setBindGroup(0, renderBindGroup);
        gpuMesh.draw(renderBundleEncoder);
        bundles.push(renderBundleEncoder.finish());

        // Configuring camera.
        const camera = new cameras.ArcBall(glmatrix.vec3.fromValues(0, 0, 4));
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
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
                deltaMs: info.deltaMs,
                renderWidth: params.renderWidth,
                renderHeight: params.renderHeight,
                rngSeed: info.rng,
                camera: Array.from(viewproj),
            }));

            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');

            // -- Frame rendering.
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
            renderEncoder.executeBundles(bundles);
            renderEncoder.end();
            commandEncoder.popDebugGroup();

            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
}

function cubeMesh(): Mesh {
    const r = 0.5;

    return {
        vertices: [
            { pos: [-r, -r, -r], color: [0, 0, 0, 1] },
            { pos: [r, -r, -r], color: [1, 0, 0, 1] },
            { pos: [r, r, -r], color: [1, 1, 0, 1] },
            { pos: [-r, r, -r], color: [0, 1, 0, 1] },
            { pos: [-r, -r, r], color: [0, 0, 1, 1] },
            { pos: [r, -r, r], color: [1, 0, 1, 1] },
            { pos: [r, r, r], color: [1, 1, 1, 1] },
            { pos: [-r, r, r], color: [0, 1, 1, 1] },
        ],
        indices: [
            0, 3, 1, // back
            1, 3, 2,
            5, 1, 6, // right
            6, 1, 2,
            0, 7, 3, // left
            0, 4, 7,
            7, 4, 5, // front
            5, 6, 7,
            3, 7, 6, // top
            6, 2, 3,
            4, 0, 5, // bottom
            5, 0, 1,
        ]
    };
}

// Inspired from https://github.com/caosdoar/spheres/blob/master/src/spheres.cpp
const faces = [
    { idx: 0, origin: glmatrix.vec3.fromValues(-1, -1, -1), right: glmatrix.vec3.fromValues(2, 0, 0), up: glmatrix.vec3.fromValues(0, 2, 0) },
    { idx: 1, origin: glmatrix.vec3.fromValues(1, -1, -1), right: glmatrix.vec3.fromValues(0, 0, 2), up: glmatrix.vec3.fromValues(0, 2, 0) },
    { idx: 2, origin: glmatrix.vec3.fromValues(1, -1, 1), right: glmatrix.vec3.fromValues(-2, 0, 0), up: glmatrix.vec3.fromValues(0, 2, 0) },
    { idx: 3, origin: glmatrix.vec3.fromValues(-1, -1, 1), right: glmatrix.vec3.fromValues(0, 0, -2), up: glmatrix.vec3.fromValues(0, 2, 0) },
    { idx: 4, origin: glmatrix.vec3.fromValues(-1, 1, -1), right: glmatrix.vec3.fromValues(2, 0, 0), up: glmatrix.vec3.fromValues(0, 0, 2) },
    { idx: 5, origin: glmatrix.vec3.fromValues(-1, -1, 1), right: glmatrix.vec3.fromValues(2, 0, 0), up: glmatrix.vec3.fromValues(0, 0, -2) },
]

function sphereMesh(): Mesh {
    const vertices: wg.types.WGSLJSType<typeof vertexDesc>[] = [];
    const indices: number[] = [];

    const divisions = 4;
    const step = 1 / divisions;

    for (const face of faces) {
        for (let j = 0; j <= divisions; j++) {
            for (let i = 0; i <= divisions; i++) {
                const p = glmatrix.vec3.fromValues(
                    face.origin[0] + step * (i * face.right[0] + j * face.up[0]),
                    face.origin[1] + step * (i * face.right[1] + j * face.up[1]),
                    face.origin[2] + step * (i * face.right[2] + j * face.up[2]),
                );
                const p2 = glmatrix.vec3.multiply(glmatrix.vec3.create(), p, p);
                vertices.push({
                    pos: [
                        p[0] * Math.sqrt(1 - 0.5 * (p2[1] + p2[2]) + p2[1] * p2[2] / 3),
                        p[1] * Math.sqrt(1 - 0.5 * (p2[2] + p2[0]) + p2[2] * p2[0] / 3),
                        p[2] * Math.sqrt(1 - 0.5 * (p2[0] + p2[1]) + p2[0] * p2[1] / 3),
                    ],
                    color: [j / divisions, i / divisions, 0, 1],
                });
            }
        }
    }

    const k = divisions + 1;
    for (const face of faces) {
        for (let j = 0; j < divisions; j++) {
            const bottom = j < (divisions / 2);
            for (let i = 0; i < divisions; i++) {
                const left = i < (divisions / 2);
                const a = (face.idx * k + j) * k + i;
                const b = (face.idx * k + j) * k + i + 1;
                const c = (face.idx * k + j + 1) * k + i;
                const d = (face.idx * k + j + 1) * k + i + 1;
                if ((!bottom && !left) || (bottom && left)) {
                    indices.push(...[a, c, d, a, d, b]);
                    // indices.push(...[a, c, b, c, d, b]);

                } else {
                    // indices.push(...[a, c, d, a, d, b]);
                    indices.push(...[a, c, b, c, d, b]);
                }
            }
        }
    }

    return {
        vertices: vertices,
        indices: indices,
    };
}