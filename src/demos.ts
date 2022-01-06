/// <reference types="@webgpu/types" />

import { LitElement, html, css, } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as engine from './engine';


// Just fiddling with red component a bit.
const fadeDemo = {
    id: "fade",
    caption: "Fiddling with red component",
    fps: 15,
    sizeX: 320,
    sizeY: 200,
    init: (uniforms: engine.Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.sizeY; y++) {
            for (let x = 0; x < uniforms.sizeX; x++) {
                a[4 * (x + y * uniforms.sizeX) + 0] = Math.floor(x * 256 / uniforms.sizeX);
                a[4 * (x + y * uniforms.sizeX) + 1] = Math.floor(y * 256 / uniforms.sizeX);
                a[4 * (x + y * uniforms.sizeX) + 2] = 0;
                a[4 * (x + y * uniforms.sizeX) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            sizex: u32;
            sizey: u32;
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
            if (global_id.x >= uniforms.sizex || global_id.y >= uniforms.sizey) {
                return;
            }

            let idx = global_id.y + global_id.x * uniforms.sizey;

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
    sizeX: 320,
    sizeY: 200,
    init: (uniforms: engine.Uniforms, data: ArrayBuffer) => {
        const a = new Uint8Array(data);
        for (let y = 0; y < uniforms.sizeY; y++) {
            for (let x = 0; x < uniforms.sizeX; x++) {
                a[4 * (x + y * uniforms.sizeX) + 0] = Math.random() * 255;
                a[4 * (x + y * uniforms.sizeX) + 1] = Math.random() * 255;
                a[4 * (x + y * uniforms.sizeX) + 2] = Math.random() * 255;
                a[4 * (x + y * uniforms.sizeX) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            sizex: u32;
            sizey: u32;
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
            if (global_id.x >= uniforms.sizex || global_id.y >= uniforms.sizey) {
                return;
            }

            let idx = global_id.x + global_id.y * uniforms.sizex;

            var v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
            if (global_id.y > 0u) {
                let previdx = global_id.x + (global_id.y - 1u) * uniforms.sizex;
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
        for (let y = 0; y < uniforms.sizeY; y++) {
            for (let x = 0; x < uniforms.sizeX; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[4 * (x + y * uniforms.sizeX) + 0] = v;
                a[4 * (x + y * uniforms.sizeX) + 1] = v;
                a[4 * (x + y * uniforms.sizeX) + 2] = v;
                a[4 * (x + y * uniforms.sizeX) + 3] = 255;
            }
        }
    },
    code: `
        [[block]] struct Uniforms {
            sizex: u32;
            sizey: u32;
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
            if (x >= i32(uniforms.sizex)) { return 0; }
            if (y >= i32(uniforms.sizey)) { return 0; }
            let idx = x + y * i32(uniforms.sizex);
            let v = unpack4x8unorm(srcFrame.values[idx]);
            if (v.r < 0.5) { return 0;}
            return 1;
        }

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {

            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.sizex || global_id.y >= uniforms.sizey) {
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

            let idx = global_id.x + global_id.y * uniforms.sizex;
            var v = unpack4x8unorm(srcFrame.values[idx]);
            v.r = s;
            v.g = s;
            v.b = s;
            v.a = 1.0;
            dstFrame.values[idx] = pack4x8unorm(v);
        }
    `,
}

export const allDemos = [
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
