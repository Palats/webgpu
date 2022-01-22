# Some WebGPU effects.

WebGPU is an API to drive compute & rendering on GPUs from browsers (and others). This is to WebGL what Vulkan is to OpenGL. This repository implements some effects using both compute & rendering WebGPU APIs:
 - `fire`: A classic demoscene style fire effect.
 - `conway`: A binary Conway [game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
 - `fade`: Trivial example modifying the red channel.
 - `falling`: Trivial compute example, moving data a bit around.

## Activating WebGPU
As of Jan. 2022, WebGPU is not available by default in browsers, and thus require experimental features to be available:

- Chrome on Linux, run it with the following extra flags - character case is important:
  ```
  $ google-chrome --enable-unsafe-webgpu --enable-features=Vulkan
  ```
- Chrome on Windows, add the following extra flag:
  ```
  chrome.exe --enable-unsafe-webgpu
  ```
- Firefox: run the nightly, go in "about:config" and activate feature "dom.webgpu.enabled". You might need to restart Firefox.

## Dev
To run a dev version of this code, from a checkout of the code:
```
npm install
npm run dev
```

## Related links
 - [WebGPU API](https://gpuweb.github.io/gpuweb/) ; [API quick reference](https://webgpu.rocks/)
 - [WebGPU shader language (GLSL)](https://gpuweb.github.io/gpuweb/wgsl)