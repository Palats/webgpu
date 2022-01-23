// Description of a given effect.
export interface Demo {
    id: string;
    caption: string;

    // Initialize the effect once.
    init(params: InitParams): Promise<Runner>;
}

export interface InitParams {
    adapter: GPUAdapter;
    device: GPUDevice;
    context: GPUCanvasContext;

    // Size of the rendering area on the canvas.
    renderWidth: number;
    renderHeight: number;
}

export interface Runner {
    // Called on every frame to render the effect to the canvas.
    frame(info: FrameInfo): Promise<void>;
}

export interface FrameInfo {
    timestampMs: DOMHighResTimeStamp;
    elapsedMs: DOMHighResTimeStamp;
    deltaMs: DOMHighResTimeStamp | null;
}