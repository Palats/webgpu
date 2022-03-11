/// <reference types="@webgpu/types" />

import { LitElement, html, css, } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as demotypes from './demotypes';
import * as glmatrix from 'gl-matrix';


import * as conway from './demos/conway';
import * as fire from './demos/fire';
import * as fade from './demos/fade';
import * as minimal from './demos/minimal';
import * as conway2 from './demos/conway2';
import * as cube from './demos/cube';
import * as multicubes from './demos/multicubes';
import * as testlibs from './demos/testlibs';
import { glMatrix } from 'gl-matrix';

export const allDemos: demotypes.Demo[] = [
    conway2.demo,
    fire.demo,
    conway.demo,
    fade.demo,
    minimal.demo,
    cube.demo,
    testlibs.demo,
    multicubes.demo,
];

export function demoByID(id: string): demotypes.Demo {
    for (const d of allDemos) {
        if (d.id === id) {
            return d;
        }
    }
    return allDemos[0];
}

type CameraMoveInfo = {
    // Position of the cursor / click.
    // Screen coordinate from [0, 1].
    x: number;
    y: number;
    // The event that triggered this move.
    evt: PointerEvent;
}

class Camera {
    private tr = glmatrix.vec3.fromValues(0, 0, -25);

    chain(camera: glmatrix.mat4, start?: CameraMoveInfo, current?: CameraMoveInfo) {
        glmatrix.mat4.translate(
            camera,
            camera,
            this.tr,
        );
        if (start && current) {
            glmatrix.mat4.translate(
                camera,
                camera,
                this.delta(start, current),
            );
        }
    }

    update(start: CameraMoveInfo, end: CameraMoveInfo) {
        glmatrix.vec3.add(this.tr, this.tr, this.delta(start, end));
    }

    private delta(start: CameraMoveInfo, end: CameraMoveInfo): glmatrix.vec3 {
        return glmatrix.vec3.fromValues(
            20 * (end.x - start.x),
            -20 * (end.y - start.y),
            0,
        );
    }
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

        .labelvalue {
            display: grid;
            grid-template-columns: 8em 100fr;
            grid-template-rows: 100fr;

            border-top: 1px solid #4d4d4d;
            padding: 2px 1px 2px 1px;
            font: 11px 'Lucida Grande', sans-serif;
        }

        .labelvalue select, .labelvalue input {
            font: 11px 'Lucida Grande', sans-serif;
            margin: 0;
        }

        .labelvalue label {
            grid-column-start: 1;
            grid-column-end: 2;
        }

        .value {
            grid-column-start: 2;
            grid-column-end: 3;
        }

        .line {
            border-top: 1px solid #4d4d4d;
            display: flex;
            justify-content: center;
        }

        .line button {
            flex-grow: 1;
            font: italic 11px 'Lucida Grande', sans-serif;
            border: none;
            background-color: transparent;
        }

        #errors {
            background-color: #ffbebede;
            grid-column-start: 2;
            grid-column-end: 3;
            padding: 2px;
        }
    `;

    render() {
        return html`
            <div id="display">
                <canvas id="canvas"></canvas>
            </div>

            <div id="overlay">
                <div id="controls">
                    ${this.showControls ? html`
                    <div class="labelvalue">
                        <label>Demo</label>
                        <select class="value" @change=${this.demoChange}>
                            ${allDemos.map(d => html`
                                <option value=${d.id} ?selected=${d.id === this.demoID}>${d.id}</option>
                            `)}
                        </select>
                    </div>
                    <div class="doc">${demoByID(this.demoID).caption}</div>
                    <div class="github"><a href="https://github.com/Palats/webgpu">Github source</a></div>
                    <div class="labelvalue">
                        <label>Limit canvas</label>
                        <input class="value" type=checkbox ?checked=${this.limitCanvas} @change=${this.limitCanvasChange}></input>
                    </div>
                    <div class="doc">
                        Set canvas to 816x640, see <a href="https://crbug.com/dawn/1260">crbug.com/dawn/1260</a>
                    </div>
                `: ``}
                    <div class="line">
                        <button @click="${() => { this.setShowControls(!this.showControls) }}">
                            ${this.showControls ? 'Close' : 'Open'} controls
                        </button>
                    </div>
                </div>
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

    @property({ type: Boolean })
    showControls;

    @property({ type: Boolean })
    limitCanvas;

    @property()
    demoID: string;

    canvas?: HTMLCanvasElement;

    rebuildNeeded?: string;

    renderWidth: number = 0;
    renderHeight: number = 0;

    private paused = false;
    private step = false;

    // -- Camera parameters.
    // When the camera is being moved, start event.
    private cameraStart?: CameraMoveInfo;
    // Last move event, when the camera is being moved.
    private cameraCurrent?: CameraMoveInfo;
    private camera = new Camera();

    constructor() {
        super();
        this.showControls = this.getBoolParam("c", true);
        this.limitCanvas = this.getBoolParam("l", false);
        this.demoID = this.getStringParam("d", allDemos[0].id)
        document.addEventListener('keydown', e => {
            if (e.key == ' ') {
                this.paused = !this.paused;
            }
            if (e.key == '.') {
                this.paused = true;
                this.step = true;
            }
        });
        document.addEventListener('pointerdown', e => {
            if (e.button == 0) {
                if (this.cameraStart) {
                    console.error("missing pointerup");
                }
                this.cameraStart = this.getMoveInfo(e);
            }
        });
        document.addEventListener('pointermove', e => {
            if (!this.cameraStart) { return; }
            if (e.pointerId != this.cameraStart.evt.pointerId) { return; }
            this.cameraCurrent = this.getMoveInfo(e);
        });
        document.addEventListener('pointerup', e => {
            if (!this.cameraStart) { return; }
            if (e.button != this.cameraStart.evt.button || e.pointerId != this.cameraStart.evt.pointerId) { return; }
            if (this.cameraStart && this.cameraCurrent) {
                this.camera.update(this.cameraStart, this.cameraCurrent);
            }
            this.cameraStart = undefined;
            this.cameraCurrent = undefined;
        });

    }

    getMoveInfo(evt: PointerEvent): CameraMoveInfo {
        return {
            x: evt.x / this.canvas!.clientWidth,
            y: evt.y / this.canvas!.clientHeight,
            evt: evt,
        }
    }

    override firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        this.canvas = this.renderRoot.querySelector('#canvas') as HTMLCanvasElement;
        this.updateSize();
        new ResizeObserver(() => {
            this.updateSize();
        }).observe(this.canvas);
        this.loop(this.canvas);
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
                    size: {
                        width: this.renderWidth,
                        height: this.renderHeight,
                    },
                });

                const renderer = await demoByID(this.demoID).init({
                    context: context,
                    adapter: adapter,
                    device: device,
                    renderFormat: renderFormat,
                    renderWidth: this.renderWidth,
                    renderHeight: this.renderHeight
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
                    timestampMs = ts;

                    // Even when paused, continue updating timestampMs - this
                    // way, when resuming, it will just count a delta of a
                    // single frame instead of the full time since paused.
                    if (this.paused && !this.step) {
                        continue;
                    }
                    this.step = false;

                    elapsedMs += deltaMs;

                    const camera = glmatrix.mat4.create();
                    glmatrix.mat4.perspective(
                        camera,
                        2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
                        this.renderWidth / this.renderHeight, // aspect
                        1.0, // near
                        100.0, // far
                    );
                    this.camera.chain(camera, this.cameraStart, this.cameraCurrent);
                    await renderer({
                        timestampMs: ts,
                        elapsedMs: elapsedMs,
                        deltaMs: deltaMs,
                        rng: Math.random(),
                        camera: camera,
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

    limitCanvasChange(evt: Event) {
        const checked = (evt.target as HTMLInputElement).checked;
        if (checked === this.limitCanvas) { return; }
        this.limitCanvas = checked;
        this.updateURL("l", this.limitCanvas);
        this.updateSize();
    }

    setShowControls(v: boolean) {
        this.updateURL("c", v);
        this.showControls = v;
    }

    demoChange(evt: Event) {
        const options = (evt.target as HTMLSelectElement).selectedOptions;
        if (!options) {
            return;
        }
        const v = options[0].value;
        if (this.demoID === v) { return; }
        this.demoID = v;
        this.updateURL("d", this.demoID);
        this.rebuild("changed demo");
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