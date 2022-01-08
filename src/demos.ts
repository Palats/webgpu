/// <reference types="@webgpu/types" />

import * as engine from './engine';


// Just fiddling with red component a bit.
const fadeDemo = {
    id: "fade",
    caption: "Fiddling with red component",
    fps: 15,
    computeWidth: 320,
    computeHeight: 200,
    init: (uniforms: engine.Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.computeHeight; y++) {
            for (let x = 0; x < uniforms.computeWidth; x++) {
                a[4 * (x + y * uniforms.computeWidth) + 0] = Math.floor(x * 256 / uniforms.computeWidth);
                a[4 * (x + y * uniforms.computeWidth) + 1] = Math.floor(y * 256 / uniforms.computeWidth);
                a[4 * (x + y * uniforms.computeWidth) + 2] = 0;
                a[4 * (x + y * uniforms.computeWidth) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };
        [[block]] struct Frame {
            values: array<u32>;
        };

        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, write> dstFrame : Frame;

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                return;
            }

            let idx = global_id.y + global_id.x * uniforms.computeHeight;

            var v = unpack4x8unorm(srcFrame.values[idx]);
            // v.r = 1.0;
            // v.g = 0.5;
            // v.b = 0.1;
            v.r = clamp(uniforms.elapsedMs / 1000.0 / 5.0, 0.0, 1.0);
            v.a = 1.0;
            dstFrame.values[idx] = pack4x8unorm(v);
        }
    `,
}

// Falling random pixels
const fallingDemo = {
    id: "falling",
    caption: "Falling random pixels",
    fps: 4,
    computeWidth: 320,
    computeHeight: 200,
    init: (uniforms: engine.Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.computeHeight; y++) {
            for (let x = 0; x < uniforms.computeWidth; x++) {
                a[4 * (x + y * uniforms.computeWidth) + 0] = Math.random() * 255;
                a[4 * (x + y * uniforms.computeWidth) + 1] = Math.random() * 255;
                a[4 * (x + y * uniforms.computeWidth) + 2] = Math.random() * 255;
                a[4 * (x + y * uniforms.computeWidth) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };
        [[block]] struct Frame {
            values: array<u32>;
        };

        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, write> dstFrame : Frame;

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                return;
            }

            let idx = global_id.x + global_id.y * uniforms.computeWidth;

            var v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
            if (global_id.y > 0u) {
                let previdx = global_id.x + (global_id.y - 1u) * uniforms.computeWidth;
                v = unpack4x8unorm(srcFrame.values[previdx]);
                let v2 = unpack4x8unorm(srcFrame.values[idx]);
                v.g = v2.g;
                v.b = v2.b;
            }

            dstFrame.values[idx] = pack4x8unorm(v);
        }
    `,
}

// A basic game of life.
const conwayDemo = {
    id: "conway",
    caption: "Conway game of life",
    fps: 60,
    init: (uniforms: engine.Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.computeHeight; y++) {
            for (let x = 0; x < uniforms.computeWidth; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[4 * (x + y * uniforms.computeWidth) + 0] = v;
                a[4 * (x + y * uniforms.computeWidth) + 1] = v;
                a[4 * (x + y * uniforms.computeWidth) + 2] = v;
                a[4 * (x + y * uniforms.computeWidth) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };
        [[block]] struct Frame {
            values: array<u32>;
        };

        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, write> dstFrame : Frame;

        fn isOn(x: i32, y: i32) -> i32 {
            if (x < 0) { return 0; }
            if (y < 0) { return 0; }
            if (x >= i32(uniforms.computeWidth)) { return 0; }
            if (y >= i32(uniforms.computeHeight)) { return 0; }
            let idx = x + y * i32(uniforms.computeWidth);
            let v = unpack4x8unorm(srcFrame.values[idx]);
            if (v.r < 0.5) { return 0;}
            return 1;
        }

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {

            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                return;
            }

            let x = i32(global_id.x);
            let y = i32(global_id.y);
            let current = isOn(x, y);
            let neighbors =
                  isOn(x - 1, y - 1)
                + isOn(x, y - 1)
                + isOn(x + 1, y - 1)
                + isOn(x - 1, y)
                + isOn(x + 1, y)
                + isOn(x - 1, y + 1)
                + isOn(x, y + 1)
                + isOn(x + 1, y + 1);

            var s = 0.0;
            if (current != 0 && (neighbors == 2 || neighbors == 3)) {
                s = 1.0;
            }
            if (current == 0 && neighbors == 3) {
                s = 1.0;
            }

            let idx = global_id.x + global_id.y * uniforms.computeWidth;
            var v = unpack4x8unorm(srcFrame.values[idx]);
            v.r = s;
            v.g = s;
            v.b = s;
            v.a = 1.0;
            dstFrame.values[idx] = pack4x8unorm(v);
        }
    `,
}

// A classic fire effect.
const fireDemo = {
    computeWidth: 320,
    computeHeight: 200,
    id: "fire",
    caption: "Classic fire effect",
    fps: 30,
    init: (uniforms: engine.Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.computeHeight; y++) {
            for (let x = 0; x < uniforms.computeWidth; x++) {
                a[4 * (x + y * uniforms.computeWidth) + 0] = 0;
                a[4 * (x + y * uniforms.computeWidth) + 1] = 0;
                a[4 * (x + y * uniforms.computeWidth) + 2] = 0;
                a[4 * (x + y * uniforms.computeWidth) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };
        [[block]] struct Frame {
            values: array<u32>;
        };

        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, write> dstFrame : Frame;

        fn rand(v: f32) -> f32 {
            return fract(sin(dot(vec2<f32>(uniforms.elapsedMs, v), vec2<f32>(12.9898,78.233)))*43758.5453123);
        }

        fn at(x: i32, y: i32) -> vec4<f32> {
            if (x < 0) { return vec4<f32>(0.0, 0.0, 0.0, 1.0); }
            if (y < 0) { return vec4<f32>(0.0, 0.0, 0.0, 1.0); }
            if (x >= i32(uniforms.computeWidth)) { return vec4<f32>(0.0, 0.0, 0.0, 1.0); }
            if (y >= i32(uniforms.computeHeight)) { return vec4<f32>(0.0, 0.0, 0.0, 1.0); }
            let idx = x + y * i32(uniforms.computeWidth);
            return unpack4x8unorm(srcFrame.values[idx]);
        }

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                return;
            }

            let x = i32(global_id.x);
            let y = i32(global_id.y);
            let idx = global_id.x + global_id.y * uniforms.computeWidth;

            if (y == (i32(uniforms.computeHeight) - 1)) {
                if (rand(f32(x)) < 0.2) {
                    dstFrame.values[idx] = pack4x8unorm(vec4<f32>(1.0, 1.0, 1.0, 1.0));
                } else {
                    dstFrame.values[idx] = pack4x8unorm(vec4<f32>(0.0, 0.0, 0.0, 1.0));
                }
            } else {
                let v = at(x, y) + at(x - 1, y + 1) + at(x, y + 1) + at(x + 1, y + 1);
                dstFrame.values[idx] = pack4x8unorm((v / 4.0) - 0.01);
            }
        }
    `,

    fragment: `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };
        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;

        [[block]] struct Frame {
            values: array<u32>;
        };
        [[group(0), binding(1)]] var<storage, read> srcFrame : Frame;
        [[group(0), binding(2)]] var<storage, read> dstFrame : Frame;
        [[group(0), binding(3)]] var dstTexture : texture_2d<f32>;
        [[group(0), binding(4)]] var dstSampler : sampler;


        [[stage(fragment)]]
        fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
            let v = textureSample(dstTexture, dstSampler, coord);

            //let x = coord.x * f32(uniforms.computeWidth);
            //let y = coord.y * f32(uniforms.computeHeight);
            // let idx = u32(y) * uniforms.computeWidth + u32(x);
            //let v = unpack4x8unorm(dstFrame.values[idx]);

            let key = v.r * 8.0;
            let c = (v.r * 256.0) % 32.0;
            if (key < 1.0) { return vec4<f32>(0.0, 0.0, c * 2.0 / 256.0, 1.0); }
            if (key < 2.0) { return vec4<f32>(c * 8.0 / 256.0, 0.0, (64.0 - c * 2.0) / 256.0, 1.0); }
            if (key < 3.0) { return vec4<f32>(1.0, c * 8.0 / 256.0, 0.0, 1.0); }
            if (key < 4.0) { return vec4<f32>(1.0, 1.0, c * 4.0 / 256.0, 1.0); }
            if (key < 5.0) { return vec4<f32>(1.0, 1.0, (64.0 + c * 4.0) / 256.0, 1.0); }
            if (key < 6.0) { return vec4<f32>(1.0, 1.0, (128.0 + c * 4.0) / 256.0, 1.0); }
            if (key < 7.0) { return vec4<f32>(1.0, 1.0, (192.0 + c * 4.0) / 256.0, 1.0); }
            return vec4<f32>(1.0, 1.0, (224.0 + c * 4.0) / 256.0, 1.0);
        }
    `,
}


export const allDemos = [
    fireDemo,
    conwayDemo,
    fallingDemo,
    fadeDemo,
];

export function demoByID(id: string): engine.Demo {
    for (const d of allDemos) {
        if (d.id === id) {
            return d;
        }
    }
    return allDemos[0];
}