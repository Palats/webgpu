import * as engine from '../engine';

// A classic fire effect.
export class demo extends engine.Engine {
    static id = "fire";
    static caption = "Classic fire effect";

    computeWidth = 320;
    computeHeight = 200;
    fps = 60;

    computeCode = `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };

        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var srcTexture : texture_2d<f32>;
        [[group(0), binding(2)]] var dstTexture : texture_storage_2d<rgba8unorm, write>;

        fn rand(v: f32) -> f32 {
            return fract(sin(dot(vec2<f32>(uniforms.elapsedMs, v), vec2<f32>(12.9898,78.233)))*43758.5453123);
        }

        fn at(x: i32, y: i32) -> vec4<f32> {
            return textureLoad(srcTexture, vec2<i32>(x, y), 0);
        }

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            // Guard against out-of-bounds work group sizes
            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                return;
            }

            let x = i32(global_id.x);
            let y = i32(global_id.y);

            var v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
            if (y == (i32(uniforms.computeHeight) - 1)) {
                if (rand(f32(x)) < 0.2) {
                    v = vec4<f32>(1.0, 1.0, 1.0, 1.0);
                } else {
                    v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
                }
            } else {
                let sum = at(x, y) + at(x - 1, y + 1) + at(x, y + 1) + at(x + 1, y + 1);
                v = (sum / 4.0) - 0.01;
            }
            textureStore(dstTexture, vec2<i32>(x, y), v);
        }
    `;

    fragmentCode = `
        [[block]] struct Uniforms {
            computeWidth: u32;
            computeHeight: u32;
            renderWidth: u32;
            renderHeight: u32;
            elapsedMs: f32;
        };
        [[group(0), binding(0)]] var<uniform> uniforms : Uniforms;
        [[group(0), binding(1)]] var computeTexture : texture_2d<f32>;
        [[group(0), binding(2)]] var dstSampler : sampler;

        [[stage(fragment)]]
        fn main([[location(0)]] coord: vec2<f32>) -> [[location(0)]] vec4<f32> {
            let v = textureSample(computeTexture, dstSampler, coord);

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
    `;
}
