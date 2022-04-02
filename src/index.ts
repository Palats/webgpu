/// <reference types="@webgpu/types" />

import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as demotypes from './demotypes';
import * as glmatrix from 'gl-matrix';
import * as controls from './varpanel';
import * as cameras from './cameras';

import * as conway from './demos/conway';
import * as fire from './demos/fire';
import * as fade from './demos/fade';
import * as minimal from './demos/minimal';
import * as conway2 from './demos/conway2';
import * as cube from './demos/cube';
import * as multicubes from './demos/multicubes';
import * as sphere from './demos/sphere';
import * as plane from './demos/plane';

export const allDemos: demotypes.Demo[] = [
    conway2.demo,
    fire.demo,
    conway.demo,
    fade.demo,
    minimal.demo,
    cube.demo,
    multicubes.demo,
    sphere.demo,
    plane.demo,
];

export function demoByID(id: string): demotypes.Demo {
    for (const d of allDemos) {
        if (d.id === id) {
            return d;
        }
    }
    return allDemos[0];
}

@customElement('app-main')
export class AppMain extends LitElement {
    static styles = css`
        /* Cover both shadow dom / non shadow dom cases */
        :host, app-main {
            background-color: #0f0f0f;
            display: grid;
            margin: 0;
            padding: 0;
            height: 100%;
            grid-template-columns: 100fr;
            grid-template-rows: 100fr;
            box-sizing: border-box;
        }

        #display {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 2;
            /* Avoid vertical scroll on canvas. */
            min-height: 0;
        }

        #display canvas {
            display: block;
            height: 100%;
            width: 100%;
            background-color: black;
        }

        #overlay {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;

            display: grid;
            grid-template-columns: 250px 100fr;
            align-items: start;
        }

        #controls {
            background-color: #d6d6d6f0;
            border: #8b8b8b 1px solid;
            grid-column-start: 1;
            grid-column-end: 2;
            font-size: 11px;
        }

        .doc {
            font-style: italic;
            font-size: 12px;
            padding: 2px 1px 2px 1px;
        }

        .github {
            display: flex;
            justify-content: center;
            border-top: 1px solid #4d4d4d;
            font-size: 14px;
            font-style: italic;
        }

        #errors {
            background-color: #ffbebede;
            grid-column-start: 2;
            grid-column-end: 3;
            padding: 2px;
        }
    `;

    render() {
        const demoValues = allDemos.map(d => d.id);

        return html`
            <div id="display">
                <canvas id="canvas" tabindex=0></canvas>
            </div>

            <div id="overlay">
                <var-panel ?expanded=${this.controlsExpanded}>
                    <style>${controls.commonStyle}</style>
                    <vp-select .obj=${this} field="demoID" .values=${demoValues}>Demo</vp-select>
                    <div class="doc">${demoByID(this.demoID).caption}</div>
                    <div class="github"><a href="https://github.com/Palats/webgpu">Github source</a></div>
                    <vp-bool .obj=${this} field="limitCanvas">Limit canvas</vp-bool>
                    <div class="doc">
                        Set canvas to 816x640, see <a href="https://crbug.com/dawn/1260">crbug.com/dawn/1260</a>
                    </div>
                    ${this.extraControls}
                </var-panel>
                ${(!this.webGPUpresent || this.error) ? html`
                <div id="errors">
                    ${this.webGPUpresent ? '' : html`
                        <div>
                            Your browser does not support <a href="https://en.wikipedia.org/wiki/WebGPU">WebGPU</a>.
                            WebGPU is a future web standard which is supported by Chrome and Firefox, but requires special configuration. See <a href="https://github.com/Palats/webgpu">README</a> for details on how to activate it.
                        </div>
                    `}
                    ${this.error ? html`
                        <div><pre>${this.error}</pre></div>
                        <div>See javascript console for more details.</div>
                    `: ``}
                </div>
                `: ``}
            </div>
        `;
    }

    @property({ type: Boolean })
    webGPUpresent: boolean = false;

    @property()
    error: string = "";

    private _limitCanvas = false;
    get limitCanvas() { return this._limitCanvas; }
    set limitCanvas(v: boolean) {
        if (v === this._limitCanvas) { return; }
        this._limitCanvas = v;
        this.updateURL("l", this._limitCanvas);
        this.updateSize();
        this.requestUpdate('limitCanvas', !v);
    }

    @property()
    private _demoID: string;

    get demoID() { return this._demoID; }
    set demoID(v: string) {
        if (this._demoID === v) { return; }
        this._demoID = v;
        this.updateURL("d", this._demoID);
        this.rebuild("changed demo");
    }

    canvas?: HTMLCanvasElement;

    rebuildNeeded?: string;

    renderWidth: number = 0;
    renderHeight: number = 0;

    controlsExpanded = true;

    private extraControls: TemplateResult[] = [];

    private paused = false;
    private step = false;
    private shiftPressed = false;

    // -- Camera parameters.
    // When the camera is being moved, start event.
    private cameraStart?: PointerEvent;
    // Last move event, when the camera is being moved.
    private cameraCurrent?: PointerEvent;
    private camera: cameras.Camera = new cameras.Null();

    constructor() {
        super();
        this.limitCanvas = this.getBoolParam("l", false);
        this._demoID = this.getStringParam("d", allDemos[0].id)
        this.controlsExpanded = this.getBoolParam("c", true);
    }

    override firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);

        // Size & observe canvas.
        this.canvas = this.renderRoot.querySelector('#canvas') as HTMLCanvasElement;
        this.updateSize();
        new ResizeObserver(() => {
            this.updateSize();
        }).observe(this.canvas);
        this.loop(this.canvas);

        // Setup listener
        const eventElement = this.canvas;
        eventElement.addEventListener('keydown', e => {
            if (e.key == ' ') {
                this.paused = !this.paused;
            } else if (e.key == '.') {
                this.paused = true;
                this.step = true;
            } else if (e.key == 'Shift') {
                this.shiftPressed = true;
            } else if (e.key == 'Escape') {
                this.camera.reset();
            }
        });
        eventElement.addEventListener('keyup', e => {
            if (e.key == 'Shift') {
                this.shiftPressed = false;
            }
        })
        eventElement.addEventListener('pointerdown', e => {
            if (e.button == 0) {
                if (this.cameraStart) {
                    console.error("missing pointerup");
                }
                this.cameraStart = e;
                this.canvas?.setPointerCapture(e.pointerId);
            }
        });
        eventElement.addEventListener('pointermove', e => {
            if (!this.cameraStart) { return; }
            if (e.pointerId != this.cameraStart.pointerId) { return; }
            this.cameraCurrent = e;
        });
        eventElement.addEventListener('pointerup', e => {
            if (!this.cameraStart) { return; }
            if (e.button != this.cameraStart.button || e.pointerId != this.cameraStart.pointerId) { return; }
            if (this.cameraStart && this.cameraCurrent) {
                this.camera.update(this.getCameraMoveInfo());
            }
            this.cameraStart = undefined;
            this.cameraCurrent = undefined;
        });
        eventElement.addEventListener('pointerout', e => {
            if (!this.cameraStart) { return; }
            if (e.pointerId != this.cameraStart.pointerId) { return; }
            this.cameraStart = undefined;
            this.cameraCurrent = undefined;
        });
        eventElement.addEventListener('wheel', e => {
            this.camera.update({
                deltaZoom: e.deltaY / this.canvas!.clientHeight,
                shift: this.shiftPressed,
            })
        });

        // Make sure keyboard events go to the canvas initially.
        this.canvas.focus();
    }

    getCameraMoveInfo(): cameras.MoveInfo {
        const mvt: cameras.MoveInfo = {
            shift: this.shiftPressed,
        }
        if (this.cameraStart && this.cameraCurrent) {
            mvt.deltaX = (this.cameraCurrent!.x - this.cameraStart!.x) / this.canvas!.clientWidth;
            mvt.deltaY = (this.cameraCurrent!.y - this.cameraStart!.y) / this.canvas!.clientHeight;
        }
        return mvt;
    }

    updateSize() {
        if (!this.canvas) { return; }
        const devicePixelRatio = window.devicePixelRatio || 1;
        let renderWidth = this.canvas.clientWidth * devicePixelRatio;
        let renderHeight = this.canvas.clientHeight * devicePixelRatio;
        if (this.limitCanvas && ((renderWidth > 816) || (renderHeight > 640))) {
            // As of 2021-12-12, Chrome stable & unstable on a Linux (nvidia
            // 460.91.03, 470.86) do not accept a pixel more than 816x640 somehow - "device
            // lost" otherwise.
            renderWidth = 816;
            renderHeight = 640;
        }
        if (!renderWidth || !renderHeight) {
            return;
        }
        if (renderWidth === this.renderWidth && renderHeight === this.renderHeight) {
            return;
        }
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.rebuild(`resize to ${renderWidth}x${renderHeight}`);
    }

    // rebuild tells to stop the current engine and create a new one.
    rebuild(s: string) {
        this.rebuildNeeded = s;
    }

    // loop is responsible for running each frame when needed, and recreating
    // the engine when requested (e.g., on resize).
    async loop(canvas: HTMLCanvasElement) {
        while (true) {
            console.log("new engine:", this.rebuildNeeded);
            this.rebuildNeeded = undefined;
            this.webGPUpresent = false;
            this.error = "";

            try {
                if (!navigator.gpu) {
                    throw new Error("no webgpu extension");
                }

                let adapter: GPUAdapter | null = null;
                try {
                    // Firefox can have navigator.gpu but still throw when
                    // calling requestAdapter.
                    adapter = await navigator.gpu.requestAdapter();
                } catch (e) {
                    console.error("navigator.gpu.requestAdapter failed:", e);
                    throw new Error("requesting adapter failed");
                }
                if (!adapter) {
                    throw new Error("no webgpu adapter");
                }
                const device = await adapter.requestDevice();

                // As of 2021-12-11, Firefox nightly does not support device.lost.
                device.lost.then((e) => {
                    console.error("device lost", e);
                    this.error = "device lost";
                });

                device.onuncapturederror = (ev) => {
                    console.error("webgpu error", ev);
                    this.error = "webgpu device error";
                }

                const context = canvas.getContext('webgpu');
                if (!context) { throw new Error("no webgpu canvas context"); }

                this.webGPUpresent = true;

                const renderFormat = context.getPreferredFormat(adapter);
                context.configure({
                    device: device,
                    format: renderFormat,
                    compositingAlphaMode: 'opaque',
                    size: {
                        width: this.renderWidth,
                        height: this.renderHeight,
                    },
                });

                this.extraControls = [];
                this.camera = new cameras.Null();
                const renderer = await demoByID(this.demoID).init({
                    context: context,
                    adapter: adapter,
                    device: device,
                    renderFormat: renderFormat,
                    renderWidth: this.renderWidth,
                    renderHeight: this.renderHeight,
                    setCamera: (c: cameras.Camera) => { this.camera = c; },
                    expose: (t: TemplateResult) => { this.extraControls.push(t) },
                });
                if (this.error) {
                    throw new Error("init failed");
                }

                // Render loop
                let elapsedMs = 0;
                let timestampMs = 0;
                while (!this.rebuildNeeded) {
                    const ts = await new Promise(window.requestAnimationFrame);

                    let deltaMs = 0;
                    if (timestampMs) {
                        deltaMs = ts - timestampMs;
                    }

                    // Even when paused, continue updating timestampMs - this
                    // way, when resuming, it will just count a delta of a
                    // single frame instead of the full time since paused.
                    timestampMs = ts;

                    if (!this.paused || this.step) {
                        elapsedMs += deltaMs;
                    } else {
                        deltaMs = 0;
                    }
                    this.step = false;

                    await renderer({
                        elapsedMs: elapsedMs,
                        deltaMs: deltaMs,
                        rng: Math.random(),
                        cameraMvt: this.getCameraMoveInfo(),
                    });

                    if (this.error) {
                        throw new Error("frame failed");
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (e) {
                console.error("Run:", e);
                if (e instanceof Error) {
                    this.error = e.toString();
                } else {
                    this.error = "generic error";
                }

                // And now, wait for something to tell us to retry.
                // Could be better done with a proper event, but here we are.
                while (!this.rebuildNeeded) {
                    await new Promise(window.requestAnimationFrame);
                }
            }
        }
    }

    updateURL(k: string, v: string | boolean) {
        if (typeof v == "boolean") {
            v = v === true ? "1" : "0";
        }
        const params = new URLSearchParams(window.location.search)
        params.set(k, v);
        history.pushState(null, '', window.location.pathname + '?' + params.toString());
    }

    getBoolParam(k: string, defvalue = false): boolean {
        const params = new URLSearchParams(window.location.search)
        const v = params.get(k);
        if (v === null) {
            return defvalue;
        }
        if (v === "1" || v.toLowerCase() === "false") {
            return true;
        }
        return false;
    }

    getStringParam(k: string, defvalue = ""): string {
        const params = new URLSearchParams(window.location.search)
        const v = params.get(k);
        if (v === null) {
            return defvalue;
        }
        return v;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-main": AppMain,
    }
}

// Setup base document.
const htmlElt = document.body.parentElement!;
htmlElt.style.height = '100%';
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.backgroundColor = '#888800';
document.body.appendChild(document.createElement("app-main"));