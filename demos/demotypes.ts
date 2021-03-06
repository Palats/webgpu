import * as cameras from './cameras';
import * as lilgui from 'lil-gui';

// Description of a given effect.
export interface Demo {
    id: string;
    caption: string;

    // Initialize the effect once. Return a frame rendering function, which will
    // be called on every frame to render the effect to the canvas.
    init(params: InitParams): Promise<(info: FrameInfo) => Promise<void>>;
}

export interface InitParams {
    adapter: GPUAdapter;
    device: GPUDevice;
    context: GPUCanvasContext;

    // Target format for the render pipeline fragment shader.
    renderFormat: GPUTextureFormat;
    // Size of the rendering area on the canvas.
    renderWidth: number;
    renderHeight: number;

    // Connect a camera to pointer events. This is up to the demo to apply
    // transformations or any other calculations.
    setCamera(c: cameras.Camera): void;

    // Control panel for the demo.
    gui: lilgui.GUI;
}

export interface FrameInfo {
    // A reference to what was used during initialization.
    params: InitParams;
    // Elapsed time in millisecond since the demo was started.
    // Stopped when demo is paused.
    elapsedMs: DOMHighResTimeStamp;
    // Time delta in milliseconds since last frame.
    // Zero on first frame or when paused.
    deltaMs: DOMHighResTimeStamp;
    // A random value for this frame. Has no particular meaning - just
    // convenient to use with pseudo-rng per frame.
    rng: number;
    // There is a camera movement in progress - typically, it means that the
    // pointer is currently held to move the camera.
    cameraMvt?: cameras.MoveInfo;
}