# Some WebGPU demos.

## Activating WebGPU
As of Dec. 2021, WebGPU is not available by default:

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