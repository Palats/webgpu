# Some WebGPU effects.

[> Live version <](https://palats.github.io/webgpu/)

WebGPU is an API to drive compute & rendering on GPUs from browsers (and others). This is to WebGL what Vulkan is to OpenGL. This repository implements some effects using both compute & rendering WebGPU APIs:
 - `fire`: A classic demoscene style fire effect.
 - `cube`: A rotating cube. All is done on the GPU, even the rotation / projection matrix calculation.
 - `conway`: A binary Conway [game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
 - `conway2`: Another game of life, but with more fancy rendering.
 - `fade`: Trivial example modifying the red channel.
 - `falling`: Trivial compute example, moving data a bit around.
 - `minimal`: Minimalistic render pipeline with no compute.

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

## Example of conway2

https://user-images.githubusercontent.com/905855/151704281-b2c7c4dd-c814-4cae-a48c-c69bbedfae6e.mp4

## Related links
 - [WebGPU API](https://gpuweb.github.io/gpuweb/) ; [API quick reference](https://webgpu.rocks/)
 - [WebGPU shader language (GLSL)](https://gpuweb.github.io/gpuweb/wgsl)

## Dev

### Running locally
To run a dev version of this code, from a checkout of the code, assuming `npm` being available:
```
npm install
npm run dev
```

### Updating live version
```
npm run build
git checkout pages
cp -f dist/* .
git commit -a -m "Updating live version"
```
