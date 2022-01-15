import * as engine from '../engine';

// Falling random pixels
class Engine extends engine.Engine {
    static id = "falling";
    static caption = "Falling random pixels";
    fps = 4;
    computeWidth = 320;
    computeHeight = 200;

    initCompute(buffer: ArrayBuffer) {
        const a = new Uint8Array(buffer);
        for (let y = 0; y < this.uniforms.computeHeight; y++) {
            for (let x = 0; x < this.uniforms.computeWidth; x++) {
                a[4 * (x + y * this.uniforms.computeWidth) + 0] = Math.random() * 255;
                a[4 * (x + y * this.uniforms.computeWidth) + 1] = Math.random() * 255;
                a[4 * (x + y * this.uniforms.computeWidth) + 2] = Math.random() * 255;
                a[4 * (x + y * this.uniforms.computeWidth) + 3] = 255;
            }
        }
    }

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

        let vect = vec2<i32>(0, -1);

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            let xy = vec2<i32>(global_id.xy);
            let v = textureLoad(srcTexture, xy + vect, 0);
            textureStore(dstTexture, xy, v);
        }
    `;
}

export const demo = engine.asDemo(Engine);