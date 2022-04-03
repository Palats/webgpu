/// <reference types="@webgpu/types" />
import * as demotypes from './demotypes';
import * as glmatrix from 'gl-matrix';
import * as wg from './wg';

export const vertexDesc = new wg.StructType({
    pos: { type: wg.Vec3f32, idx: 0 },
    color: { type: wg.Vec4f32, idx: 1 },
});

export type Mesh = {
    vertices: wg.types.WGSLJSType<typeof vertexDesc>[];
    indices: number[];
}

export class GPUMesh {
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