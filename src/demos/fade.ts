import * as engine from '../engine';

// Just fiddling with red component a bit.
class Engine extends engine.Engine {
    static id = "fade";
    static caption = "Fading red component";

    initCompute(buffer: ArrayBuffer) {
        const a = new Uint8Array(buffer);
        for (let y = 0; y < this.uniforms.computeHeight; y++) {
            for (let x = 0; x < this.uniforms.computeWidth; x++) {
                a[4 * (x + y * this.uniforms.computeWidth) + 0] = 0;
                a[4 * (x + y * this.uniforms.computeWidth) + 1] = Math.floor(x * 256 / this.uniforms.computeWidth);
                a[4 * (x + y * this.uniforms.computeWidth) + 2] = Math.floor(y * 256 / this.uniforms.computeWidth);
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

        [[stage(compute), workgroup_size(8, 8)]]
        fn main([[builtin(global_invocation_id)]] global_id : vec3<u32>) {
            let xy = vec2<i32>(global_id.xy);
            var v = textureLoad(srcTexture, xy, 0);
            v.r = (sin(modf(uniforms.elapsedMs / 1000.0 / 3.0).fract * 2.0 * 3.1415) + 1.0) / 2.0;
            textureStore(dstTexture, xy, v);
        }
    `;
}

export const demo = engine.asDemo(Engine);