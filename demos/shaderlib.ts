import * as wg from '../src';
import * as demotypes from './demotypes';
import * as glmatrix from 'gl-matrix';


// Functions to calculate projection matrices.
export const projection = new wg.WGSLModule({
    label: "projection matrices",
    code: wg.wgsl`
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
export const tr = new wg.WGSLModule({
    label: "transform matrices",
    code: wg.wgsl`
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

        fn @@fromQuat(q: vec4<f32>) -> mat4x4<f32> {
            let x2 = q.x + q.x;
            let y2 = q.y + q.y;
            let z2 = q.z + q.z;
            let xx = q.x * x2;
            let yx = q.y * x2;
            let yy = q.y * y2;
            let zx = q.z * x2;
            let zy = q.z * y2;
            let zz = q.z * z2;
            let wx = q.w * x2;
            let wy = q.w * y2;
            let wz = q.w * z2;

            return mat4x4<f32>(
                1.-yy-zz, yx+wz, zx-wy, 0.,
                yx-wz, 1.-xx-zz, zy+wx, 0.,
                zx+wy, zy-wx, 1.-xx-yy, 0.,
                0., 0., 0., 1.,
            );
        }

        fn @@quatFromEuler(ang: vec3<f32>) -> vec4<f32> {
            // Divide by 2. to make sure that a full rotation 2*Pi
            let s = sin(ang / 2.);
            let c = cos(ang / 2.);
            return vec4<f32>(
                s.x * c.y * c.z - c.x * s.y * s.z,
                c.x * s.y * c.z + s.x * c.y * s.z,
                c.x * c.y * s.z - s.x * s.y * c.z,
                c.x * c.y * c.z + s.x * s.y * s.z,
            );
        }

        // Quaternion for rotation from one vec to another.
        // a & b must be units.
        // https://glmatrix.net/docs/quat.js.html#line652
        fn @@quatRotation(a: vec3<f32>, b: vec3<f32>) -> vec4<f32> {
            let d = dot(a, b);
            if (d < -0.999999) {
                var t = cross(vec3<f32>(1., 0., 0.), a);
                if (length(t) < 0.000001)  {
                    t = cross(vec3<f32>(0., 1., 0.), a);
                }
                t = normalize(t);
                // return quatSetAxisAngle(t, PI == 3.1415926);
                // sin(PI/2) = 1, cos(PI/2) = 0
                return vec4<f32>(t, 0.);
            }
            if (d > 0.999999) {
                return vec4<f32>(0., 0., 0., 1.);
            }
            let t = cross(a, b);
            return normalize(vec4<f32>(t, 1 + d));
        }

        // https://glmatrix.net/docs/quat.js.html#line50
        fn @@quatSetAxisAngle(axis: vec3<f32>, rad: f32) -> vec4<f32> {
            let r = rad * 0.5;
            let s = sin(rad);
            return vec4<f32>(
                s * axis.x,
                s * axis.y,
                s * axis.z,
                cos(r),
            );
        }

        fn @@quatMul(a: vec4<f32>, b: vec4<f32>) -> vec4<f32> {
            return vec4<f32>(
                a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y,
                a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z,
                a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x,
                a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
            );
        }
        `,
});

// An hard coded list of vertex for a cube declared as triangle strip.
// Cube is between -1 and +1.
// https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
export const cubeMeshStrip = new wg.WGSLModule({
    label: "mesh for a cube triangle strip",
    code: wg.wgsl`
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
})

export const rand = new wg.WGSLModule({
    label: "random functions",
    code: wg.wgsl`
        fn @@meh(a: f32, b: f32) -> f32 {
            return fract(sin(dot(vec2<f32>(a, b), vec2<f32>(12.9898,78.233)))*43758.5453123);
        }
    `,
});

// Common information coming from the demo subsystem.
export const demoDesc = new wg.StructType({
    elapsedMs: { idx: 0, type: wg.F32 },
    deltaMs: { idx: 1, type: wg.F32 },
    renderWidth: { idx: 2, type: wg.F32 },
    renderHeight: { idx: 3, type: wg.F32 },
    rngSeed: { idx: 4, type: wg.F32 },
    camera: { idx: 5, type: wg.Mat4x4F32 },
});

export class DemoBuffer {
    buffer: GPUBuffer;
    desc: typeof demoDesc;

    constructor(params: demotypes.InitParams) {
        this.desc = demoDesc;
        this.buffer = params.device.createBuffer({
            label: "Demo params buffer",
            size: demoDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }

    // Update the demo buffer info for the current frame.
    refresh(info: demotypes.FrameInfo, viewproj: glmatrix.mat4) {
        info.params.device.queue.writeBuffer(this.buffer, 0, demoDesc.createArray({
            elapsedMs: info.elapsedMs,
            deltaMs: info.deltaMs,
            renderWidth: info.params.renderWidth,
            renderHeight: info.params.renderHeight,
            rngSeed: info.rng,
            camera: Array.from(viewproj),
        }));
    }
}

export type Point = {
    pos: [number, number, number];
    color: [number, number, number, number];
}

export type LineDesc = {
    label?: string;
    device: GPUDevice;

    // Color format of where the bundle will be drawn.
    colorFormat: GPUTextureFormat;
    // Even when drawing does not use depth buffer, if one is present in the
    // render pass, then the bundle still needs to know about it.
    depthFormat?: GPUTextureFormat;
    depthCompare?: GPUCompareFunction;

    // List of lines to draw. Each entry of the list is a single independent
    // line. Each line will connect one point to the next.
    lines: Point[][];

    // Info for rendering.
    demoBuffer: DemoBuffer;
}

// Prepare a bundle which will draw a bunch of lines.
export function buildLineBundle(lineDesc: LineDesc) {
    const label = lineDesc.label ?? "lines";

    // Count the number of lines.
    let lineCount = 0;
    for (const line of lineDesc.lines) {
        lineCount += line.length - 1;
    }

    const pointDesc = new wg.StructType({
        pos: { type: wg.Vec3f32, idx: 0 },
        color: { type: wg.Vec4f32, idx: 1 },
    })
    const arrayDesc = new wg.ArrayType(pointDesc, lineCount * 2);
    const vertexBuffer = lineDesc.device.createBuffer({
        label: `${label} - vertex buffer`,
        size: arrayDesc.byteSize(),
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });

    const a = new ArrayBuffer(arrayDesc.byteSize());
    const dv = new DataView(a);
    let offset = 0;
    for (const line of lineDesc.lines) {
        let prev = line[0];
        for (let i = 1; i < line.length; i++) {
            let next = line[i];
            pointDesc.dataViewSet(dv, offset, prev);
            offset += pointDesc.byteSize();
            pointDesc.dataViewSet(dv, offset, next);
            offset += pointDesc.byteSize();
            prev = next;
        }
    }
    lineDesc.device.queue.writeBuffer(vertexBuffer, 0, a);

    const shader = lineDesc.device.createShaderModule(new wg.WGSLModule({
        label: `${label} - render shader`,
        code: wg.wgsl`
            @group(0) @binding(0) var<uniform> uniforms : ${lineDesc.demoBuffer.desc.typename()};

            struct Input {
                @location(0) pos: vec3<f32>,
                @location(1) color: vec4<f32>,
            }

            struct VertexOutput {
                @builtin(position) pos: vec4<f32>,
                @location(0) color: vec4<f32>,
            };

            @stage(vertex)
            fn vertex(inp: Input) -> VertexOutput {
                var out : VertexOutput;
                out.pos = uniforms.camera * vec4<f32>(inp.pos, 1.0);
                out.color = inp.color;
                return out;
            }

            @stage(fragment)
            fn fragment(@location(0) color : vec4<f32>) -> @location(0) vec4<f32> {
                return color;
            }
        `,
    }).toDesc());

    const pipeline = lineDesc.device.createRenderPipeline({
        label: `${label} - pipeline`,
        layout: lineDesc.device.createPipelineLayout({
            label: `${label} - pipeline layouts`,
            bindGroupLayouts: [lineDesc.device.createBindGroupLayout({
                label: `${label} - main layout`,
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: { type: "uniform" },
                    },
                ]
            })],
        }),
        vertex: {
            buffers: [{
                arrayStride: pointDesc.stride(),
                attributes: [
                    { shaderLocation: 0, format: "float32x3", offset: 0, },
                    { shaderLocation: 1, format: "float32x4", offset: 16, },
                ],
            }],
            entryPoint: 'vertex',
            module: shader,
        },
        primitive: {
            topology: 'line-list',
        },
        depthStencil: lineDesc.depthFormat ? {
            depthWriteEnabled: false,
            depthCompare: lineDesc.depthCompare ?? 'always',
            format: lineDesc.depthFormat,
        } : undefined,

        fragment: {
            entryPoint: "fragment",
            module: shader,
            targets: [{ format: lineDesc.colorFormat }],
        },
    });
    const bindGroup = lineDesc.device.createBindGroup({
        label: `${label} - bindgroup`,
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: lineDesc.demoBuffer.buffer } },
        ]
    });

    const bundleEncoder = lineDesc.device.createRenderBundleEncoder({
        label: label,
        depthReadOnly: true,
        stencilReadOnly: true,
        colorFormats: [lineDesc.colorFormat],
        depthStencilFormat: lineDesc.depthFormat ?? undefined,
    });
    bundleEncoder.pushDebugGroup(`${label} - building bundle`);
    bundleEncoder.setVertexBuffer(0, vertexBuffer);
    bundleEncoder.setPipeline(pipeline);
    bundleEncoder.setBindGroup(0, bindGroup);
    bundleEncoder.draw(lineCount * 2, 1, 0, 0);
    bundleEncoder.popDebugGroup();
    return bundleEncoder.finish();
}

// Lines for indicating the orthonormal reference.
export const ortholines: Point[][] = [
    [{ pos: [0, 0, 0], color: [1, 0, 0, 1] }, { pos: [1, 0, 0], color: [1, 0, 0, 1] }],
    [{ pos: [0, 0, 0], color: [0, 1, 0, 1] }, { pos: [0, 1, 0], color: [0, 1, 0, 1] }],
    [{ pos: [0, 0, 0], color: [0, 0, 1, 1] }, { pos: [0, 0, 1], color: [0, 0, 1, 1] }],
]

// Lines for a cube centered in 0 and going [-s, +s].
export function cubelines(s: number): Point[][] {
    return [
        [
            { pos: [-s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [s, s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, -s, -s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [-s, -s, s], color: [1, 1, 1, 1] },
            { pos: [s, -s, s], color: [1, 1, 1, 1] },
            { pos: [s, s, s], color: [1, 1, 1, 1] },
            { pos: [-s, s, s], color: [1, 1, 1, 1] },
            { pos: [-s, -s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [-s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, -s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [s, -s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [s, s, -s], color: [1, 1, 1, 1] },
            { pos: [s, s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [-s, s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, s, s], color: [1, 1, 1, 1] },
        ],
    ];
}
