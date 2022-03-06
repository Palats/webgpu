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
}

export interface FrameInfo {
    // An absolute timestamp, in milliseconds.
    timestampMs: DOMHighResTimeStamp;
    // Elapsed time in millisecond since the demo was started.
    // Stopped when demo is paused.
    elapsedMs: DOMHighResTimeStamp;
    // Time delta in milliseconds since last frame. Null on first frame.
    deltaMs: DOMHighResTimeStamp | null;
    // A random value for this frame. Has no particular meaning - just
    // convenient to use with pseudo-rng per frame.
    rng: number;
}