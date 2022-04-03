/// <reference types="@webgpu/types" />
import * as demotypes from './demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from './wg';
import * as gltfloader from 'gltf-loader-ts';

export const vertexDesc = new wg.StructType({
    pos: { type: wg.Vec3f32, idx: 0 },
    color: { type: wg.Vec4f32, idx: 1 },
});

export type Mesh = {
    vertices: wg.types.WGSLJSType<typeof vertexDesc>[];
    indices: number[];
    min?: [number, number, number];
    max?: [number, number, number];
}

export class GPUMesh {
    private vertexBuffer: GPUBuffer;
    private indexBuffer: GPUBuffer;
    private indicesCount: number;
    min?: glmatrix.ReadonlyVec3;
    max?: glmatrix.ReadonlyVec3;

    constructor(params: demotypes.InitParams, mesh: Mesh) {
        this.min = mesh.min;
        this.max = mesh.max;
        const verticesDesc = new wg.ArrayType(vertexDesc, mesh.vertices.length);

        this.vertexBuffer = params.device.createBuffer({
            label: `vertex buffer`,
            size: verticesDesc.byteSize(),
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        params.device.queue.writeBuffer(this.vertexBuffer, 0, verticesDesc.createArray(mesh.vertices));

        const indexDesc = new wg.ArrayType(wg.U16, mesh.indices.length);
        // Writing to buffer must be multiple of 4.
        const indexSize = Math.ceil(indexDesc.byteSize() / 4) * 4;
        this.indexBuffer = params.device.createBuffer({
            label: `index buffer`,
            size: indexSize,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        });
        const indexArray = new ArrayBuffer(indexSize);
        indexDesc.dataViewSet(new DataView(indexArray), 0, mesh.indices);
        params.device.queue.writeBuffer(this.indexBuffer, 0, indexArray, 0, indexSize);
        this.indicesCount = mesh.indices.length;
    }

    draw(encoder: GPURenderEncoderBase) {
        encoder.setIndexBuffer(this.indexBuffer, 'uint16');
        encoder.setVertexBuffer(0, this.vertexBuffer);
        encoder.drawIndexed(this.indicesCount);
    }
}

export function cubeMesh(): Mesh {
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

export function sphereMesh(): Mesh {
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

// https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#_mesh_primitive_mode
export enum GLTFPrimitiveMode {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6,
};

// https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#accessor-data-types
export enum GLTFAccessorType {
    SCALAR = "SCALAR",
    VEC2 = "VEC2",
    VEC3 = "VEC3",
    VEC4 = "VEC4",
    MAT2 = "MAT2",
    MAT3 = "MAT3",
    MAT4 = "MAT4",
};

export enum GLTFAccessorComponentType {
    S8 = 5120,
    U8 = 5121,
    S16 = 5122,
    U16 = 5123,
    U32 = 5125,
    F32 = 5126,
};

export async function loadGLTF(u: string): Promise<Mesh> {
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

    const min = vertAcc.min ? vertAcc.min as [number, number, number] : undefined;
    const max = vertAcc.max ? vertAcc.max as [number, number, number] : undefined;

    // accessorData return the full bufferView, not just specific accessorData.
    const posBufferView = await asset.accessorData(vertAccIndex);
    const f32 = new Float32Array(posBufferView.buffer, posBufferView.byteOffset + (vertAcc.byteOffset ?? 0), vertAcc.count * 3);

    const vertices: wg.types.WGSLJSType<typeof vertexDesc>[] = [];

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
        min,
        max,
    }
}