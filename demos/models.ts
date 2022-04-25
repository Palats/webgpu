/// <reference types="@webgpu/types" />
import * as demotypes from './demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from '../src';
import * as gltfloader from 'gltf-loader-ts';

export const vertexDesc = new wg.StructType({
    pos: { type: wg.Vec3f32, idx: 0 },
    color: { type: wg.Vec4f32, idx: 1 },
    normal: { type: wg.Vec3f32, idx: 2 },
    texcoord: { type: wg.Vec2f32, idx: 3 },
    material: { type: wg.U32, idx: 4 },
});

export type Mesh = {
    vertices: wg.types.WGSLJSType<typeof vertexDesc>[];
    indices: number[];
    materials?: Material[];
    min?: glmatrix.ReadonlyVec3;
    max?: glmatrix.ReadonlyVec3;
}

export type Material = {
    baseColorTexture?: HTMLImageElement;
}

export class GPUMesh {
    private vertexBuffer: GPUBuffer;
    private indexBuffer: GPUBuffer;
    private indicesCount: number;
    min?: glmatrix.ReadonlyVec3;
    max?: glmatrix.ReadonlyVec3;
    mesh: Mesh;

    constructor(params: demotypes.InitParams, mesh: Mesh) {
        this.mesh = mesh;
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
            // back
            { pos: [-r, -r, -r], color: [0, 0, 0, 1], normal: [0, 0, -1], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [-r, r, -r], color: [0, 1, 0, 1], normal: [0, 0, -1], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, r, -r], color: [1, 1, 0, 1], normal: [0, 0, -1], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, -r, -r], color: [1, 0, 0, 1], normal: [0, 0, -1], texcoord: [0, 0], material: wg.U32Max, },

            // right
            { pos: [r, -r, r], color: [1, 0, 1, 1], normal: [1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, -r, -r], color: [1, 0, 0, 1], normal: [1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, r, -r], color: [1, 1, 0, 1], normal: [1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, r, r], color: [1, 1, 1, 1], normal: [1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },

            // left
            { pos: [-r, r, -r], color: [0, 1, 0, 1], normal: [-1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [-r, -r, -r], color: [0, 0, 0, 1], normal: [-1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [-r, -r, r], color: [0, 0, 1, 1], normal: [-1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [-r, r, r], color: [0, 1, 1, 1], normal: [-1, 0, 0], texcoord: [0, 0], material: wg.U32Max, },

            // front
            { pos: [-r, r, r], color: [0, 1, 1, 1], normal: [0, 0, 1], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [-r, -r, r], color: [0, 0, 1, 1], normal: [0, 0, 1], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, -r, r], color: [1, 0, 1, 1], normal: [0, 0, 1], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, r, r], color: [1, 1, 1, 1], normal: [0, 0, 1], texcoord: [0, 0], material: wg.U32Max, },

            // top
            { pos: [-r, r, -r], color: [0, 1, 0, 1], normal: [0, 1, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [-r, r, r], color: [0, 1, 1, 1], normal: [0, 1, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, r, r], color: [1, 1, 1, 1], normal: [0, 1, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, r, -r], color: [1, 1, 0, 1], normal: [0, 1, 0], texcoord: [0, 0], material: wg.U32Max, },

            // bottom
            { pos: [-r, -r, r], color: [0, 0, 1, 1], normal: [0, -1, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [-r, -r, -r], color: [0, 0, 0, 1], normal: [0, -1, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, -r, -r], color: [1, 0, 1, 1], normal: [0, -1, 0], texcoord: [0, 0], material: wg.U32Max, },
            { pos: [r, -r, r], color: [1, 0, 0, 1], normal: [0, -1, 0], texcoord: [0, 0], material: wg.U32Max, },
        ],
        indices: [
            // back
            0, 1, 2,
            2, 3, 0,

            // right
            4, 5, 6,
            6, 7, 4,

            // left
            8, 9, 10,
            10, 11, 8,

            // front
            12, 13, 14,
            14, 15, 12,

            // top
            16, 17, 18,
            18, 19, 16,

            // bottom
            20, 21, 22,
            22, 23, 20,
        ],
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
                const pos = [
                    p[0] * Math.sqrt(1 - 0.5 * (p2[1] + p2[2]) + p2[1] * p2[2] / 3),
                    p[1] * Math.sqrt(1 - 0.5 * (p2[2] + p2[0]) + p2[2] * p2[0] / 3),
                    p[2] * Math.sqrt(1 - 0.5 * (p2[0] + p2[1]) + p2[0] * p2[1] / 3),
                ];
                vertices.push({
                    pos: pos,
                    color: [j / divisions, i / divisions, 0, 1],
                    normal: pos,
                    texcoord: [0, 0],
                    material: wg.U32Max,
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

type vec3tuple = [number, number, number];
type quattuple = [number, number, number, number];
type mat4tuple = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

export async function loadGLTF(u: string): Promise<Mesh[]> {
    const loader = new gltfloader.GltfLoader();
    const asset: gltfloader.GltfAsset = await loader.load(u);
    const content = asset.gltf;
    if (content.scene === undefined) { throw new Error("no default scene"); }
    if (content.nodes === undefined) { throw new Error("missing nodes"); }
    if (content.scenes === undefined) { throw new Error("no scenes"); }
    if (content.meshes === undefined) { throw new Error("no meshes"); }
    const scene = content.scenes[content.scene];
    if (scene.nodes === undefined) { throw new Error("no nodes in scene"); }

    const nodelists = [scene.nodes];
    const primitives: [glmatrix.mat4, gltfloader.gltf.MeshPrimitive][] = [];
    while (nodelists.length > 0) {
        const nl = nodelists.pop()!;
        for (const nodeidx of nl) {
            const node = content.nodes[nodeidx];
            let tr = glmatrix.mat4.create();
            if (node.matrix) {
                glmatrix.mat4.set(tr, ...node.matrix as mat4tuple);
            } else {
                // First the scale is applied to the vertices, then the rotation, and then the translation.
                // https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#transformations
                if (node.scale) {
                    glmatrix.mat4.scale(tr, tr, glmatrix.vec3.fromValues(...node.scale as vec3tuple));
                }
                if (node.rotation) {
                    const rq = glmatrix.quat.fromValues(...node.rotation as quattuple);
                    const r = glmatrix.mat4.fromQuat(glmatrix.mat4.create(), rq);
                    glmatrix.mat4.multiply(tr, tr, r);
                }
                if (node.translation) {
                    glmatrix.mat4.translate(tr, tr, glmatrix.vec3.fromValues(...node.translation as vec3tuple));
                }
            }
            if (node.mesh !== undefined) {
                for (const p of content.meshes[node.mesh].primitives) {
                    primitives.push([tr, p]);
                }
            }

            // Missing: transform of the children
            if (node.children !== undefined) {
                nodelists.push(node.children);
            }
        }
    }

    console.log(`Loading ${primitives.length} primitives...`);

    // Cache of already loaded materials.
    const materials: Material[] = [];
    const meshes: Mesh[] = [];

    for (const [tr, primitive] of primitives) {
        const vertices: wg.types.WGSLJSType<typeof vertexDesc>[] = [];
        let min: glmatrix.vec3 | undefined = undefined;
        let max: glmatrix.vec3 | undefined = undefined;

        if (primitive.mode && primitive.mode != GLTFPrimitiveMode.TRIANGLES) { throw new Error(`only triangles; got ${primitive.mode}`); }
        if (!content.accessors) { throw new Error("no accessors"); }

        // This is all a horrible hack.
        let hasTexture = false;
        if (primitive.material !== undefined && content.materials) {
            if (materials[primitive.material] === undefined) {
                const mat: Material = {};
                const gltfMat = content.materials[primitive.material];
                const texinfo = gltfMat.pbrMetallicRoughness?.baseColorTexture;
                if (texinfo?.index !== undefined) {
                    const tex = content.textures![texinfo.index];
                    mat.baseColorTexture = await asset.imageData.get(tex.source!);
                    hasTexture = true;
                }
                materials[primitive.material] = mat;
            }
        }

        // Load vertices.
        const posAccIndex = primitive.attributes["POSITION"];
        const posAcc = content.accessors[posAccIndex];
        if (posAcc.type != GLTFAccessorType.VEC3) { throw new Error(`wrong type: ${posAcc.type}`); }
        if (posAcc.componentType != GLTFAccessorComponentType.F32) { throw new Error(`wrong component type ${posAcc.componentType}`); }

        if (posAcc.min) {
            const posMin = glmatrix.vec3.fromValues(...posAcc.min as vec3tuple);
            glmatrix.vec3.transformMat4(posMin, posMin, tr);
            if (!min) { min = posMin; }
            else { min = glmatrix.vec3.min(min, min, posMin); }
        }
        if (posAcc.max) {
            const posMax = glmatrix.vec3.fromValues(...posAcc.max as vec3tuple);
            glmatrix.vec3.transformMat4(posMax, posMax, tr);
            if (!max) { max = posMax; }
            else { max = glmatrix.vec3.max(max, max, posMax); }
        }
        if (!posAcc.min || !posAcc.max) { console.warn("missing min/max"); }

        // accessorData return the full bufferView, not just specific accessorData.
        const posBufferView = await asset.accessorData(posAccIndex);
        const positions = new Float32Array(posBufferView.buffer, posBufferView.byteOffset + (posAcc.byteOffset ?? 0), posAcc.count * 3);

        // Load normals, if avail.
        const normalsAccIndex = primitive.attributes["NORMAL"];
        let normals: Float32Array | undefined;
        if (normalsAccIndex !== undefined) {
            const normalsAcc = content.accessors[normalsAccIndex];
            if (normalsAcc.type != GLTFAccessorType.VEC3) { throw new Error(`wrong type: ${normalsAcc.type}`); }
            if (normalsAcc.componentType != GLTFAccessorComponentType.F32) { throw new Error(`wrong component type ${normalsAcc.componentType}`); }

            const normalsBufferView = await asset.accessorData(normalsAccIndex);
            normals = new Float32Array(normalsBufferView.buffer, normalsBufferView.byteOffset + (normalsAcc.byteOffset ?? 0), normalsAcc.count * 3);
        }

        // Load texture coords, if avail.
        const texcoordsAccIdx = primitive.attributes["TEXCOORD_0"];
        let texcoords: Float32Array | undefined;
        if (texcoordsAccIdx !== undefined) {
            const texcoordsAcc = content.accessors[texcoordsAccIdx];
            if (texcoordsAcc.type != GLTFAccessorType.VEC2) { throw new Error(`wrong type: ${texcoordsAcc.type}`); }
            if (texcoordsAcc.componentType != GLTFAccessorComponentType.F32) { throw new Error(`wrong component type ${texcoordsAcc.componentType}`); }

            const texcoordsBufferView = await asset.accessorData(texcoordsAccIdx);
            texcoords = new Float32Array(texcoordsBufferView.buffer, texcoordsBufferView.byteOffset + (texcoordsAcc.byteOffset ?? 0), texcoordsAcc.count * 2);
        }

        for (let i = 0; i < posAcc.count; i++) {
            const v = glmatrix.vec3.fromValues(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            glmatrix.vec3.transformMat4(v, v, tr);

            let normal = [0, 0, 0];
            if (normals) {
                const f = glmatrix.vec4.fromValues(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2], 0);
                glmatrix.vec4.transformMat4(f, f, tr);
                normal = [f[0], f[1], f[2]];
            }

            let texcoord: [number, number] = [0, 0];
            if (texcoords) {
                texcoord = [texcoords[i * 2], texcoords[i * 2 + 1]];
            }

            vertices.push({
                pos: [v[0], v[1], v[2]],
                color: [1, 0, 1, 1],
                normal: normal,
                texcoord: texcoord,
                material: hasTexture ? 1.0 : wg.U32Max,
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
        const indices = Array.from(u16.values());

        console.log(`${vertices.length} vertices, ${indices.length} indices`);
        meshes.push({
            vertices,
            indices,
            materials,
            min,
            max,
        });
    }

    return meshes;
}