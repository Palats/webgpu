# Some WebGPU demos.

## Activating WebGPU
As of Dec. 2021, WebGPU is not available by default:

- Chrome on Linux:
  ```
  $ google-chrome --enable-unsafe-webgpu --enable-features=Vulkan
  ```
- Chrome on Windows:
  ```
  chrome.exe --enable-unsafe-webgpu
  ```
- Firefox: run the nightly, go in "about:config" and activate feature "dom.webgpu.enabled".

## Dev
To run a dev version of this code:
```
npm run dev
```