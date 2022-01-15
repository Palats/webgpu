import * as engine from '../engine';

// A basic game of life.
export class Engine extends engine.Engine {
    static id = "conway";
    static caption = "Conway game of life";

    initCompute(buffer: ArrayBuffer) {
        const a = new Uint8Array(buffer);
        for (let y = 0; y < this.uniforms.computeHeight; y++) {
            for (let x = 0; x < this.uniforms.computeWidth; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[4 * (x + y * this.uniforms.computeWidth) + 0] = v;
                a[4 * (x + y * this.uniforms.computeWidth) + 1] = v;
                a[4 * (x + y * this.uniforms.computeWidth) + 2] = v;
                a[4 * (x + y * this.uniforms.computeWidth) + 3] = 255;
            }
        }
    };

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

        fn isOn(x: i32, y: i32) -> i32 {
            let v = textureLoad(srcTexture, vec2<i32>(x, y), 0);
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
            textureStore(dstTexture, vec2<i32>(x, y), vec4<f32>(s, s, s, 1.0));
        }
    `;
}

export const demo = engine.asDemo(Engine);