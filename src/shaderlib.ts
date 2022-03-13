import * as wg from './wg';

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
})

export type LineDesc = {
    label?: string;
    device: GPUDevice;

    // Color format of where the bundle will be drawn.
    colorFormat: GPUTextureFormat;
    // Line drawing does not use depth buffer, but if one is present in the
    // render pass, then the bundle still needs to know about it.
    depthFormat?: GPUTextureFormat;

    // temporary hack to get the camera transform.
    mod: wg.StructType<any>;
    buffer: GPUBuffer;
}

// Prepare a bundle which will draw a bunch of lines.
export function buildLineBundle(lineDesc: LineDesc) {
    const label = lineDesc.label ?? "lines";

    const lineCount = 3;
    const pointDesc = new wg.StructType({
        pos: wg.Member(wg.Vec3f32, 0),
        color: wg.Member(wg.Vec4f32, 1),
    })
    const arrayDesc = new wg.ArrayType(pointDesc, lineCount * 2);
    const vertexBuffer = lineDesc.device.createBuffer({
        label: `${label} - vertex buffer`,
        size: arrayDesc.byteSize(),
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });
    lineDesc.device.queue.writeBuffer(vertexBuffer, 0, arrayDesc.createArray([
        { pos: [0, 0, 0], color: [1, 0, 0, 1] }, { pos: [1, 0, 0, 1], color: [1, 0, 0, 1] },
        { pos: [0, 0, 0], color: [0, 1, 0, 1] }, { pos: [0, 1, 0, 1], color: [0, 1, 0, 1] },
        { pos: [0, 0, 0], color: [0, 0, 1, 1] }, { pos: [0, 0, 1, 1], color: [0, 0, 1, 1] },
    ]));

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
            entryPoint: 'main',
            buffers: [{
                arrayStride: arrayDesc.stride,
                attributes: [
                    { shaderLocation: 0, format: "float32x3", offset: 0, },
                    { shaderLocation: 1, format: "float32x4", offset: 16, },
                ],
            }],
            module: lineDesc.device.createShaderModule(new wg.WGSLModule({
                label: `${label} - vertex shader`,
                code: wg.wgsl`
                    @group(0) @binding(0) var<uniform> uniforms : ${lineDesc.mod.typename()};

                    struct Input {
                        @location(0) pos: vec3<f32>;
                        @location(1) color: vec4<f32>;
                    }

                    struct Output {
                        @builtin(position) pos: vec4<f32>;
                        @location(0) color: vec4<f32>;
                    };

                    @stage(vertex)
                    fn main(inp: Input) -> Output {
                        var out : Output;
                        out.pos = uniforms.camera * vec4<f32>(inp.pos, 1.0);
                        out.color = inp.color;
                        return out;
                    }
                `,
            }).toDesc())
        },
        primitive: {
            topology: 'line-list',
        },
        depthStencil: lineDesc.depthFormat ? {
            depthWriteEnabled: false,
            format: lineDesc.depthFormat,
        } : undefined,

        fragment: {
            entryPoint: 'main',
            module: lineDesc.device.createShaderModule(new wg.WGSLModule({
                label: `${label} - fragment shader`,
                code: wg.wgsl`
                    @stage(fragment)
                    fn main(@location(0) color : vec4<f32>) -> @location(0) vec4<f32> {
                        return color;
                    }
                `,
            }).toDesc()),
            targets: [{ format: lineDesc.colorFormat }],
        },
    });
    const bindGroup = lineDesc.device.createBindGroup({
        label: `${label} - bindgroup`,
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: lineDesc.buffer } },
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