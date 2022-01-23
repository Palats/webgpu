/// <reference types="@webgpu/types" />

import { LitElement, html, css, } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as engine from './engine';
import * as types from './types';


import * as conway from './demos/conway';
import * as fire from './demos/fire';
import * as falling from './demos/falling';
import * as fade from './demos/fade';
import * as minimal from './demos/minimal';

export const allDemos: types.Demo[] = [
    fire.demo,
    conway.demo,
    falling.demo,
    fade.demo,
    minimal.demo,
];

export function demoByID(id: string): types.Demo {
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
        }

        .error {
            background-color: #ffbebede;
        }

        #controls {
            background-color: #d6d6d6de;
        }
    `;

    render() {
        return html`
            <div id="display">
                <canvas id="canvas"></canvas>
            </div>

            <div id="overlay">
                <span>
                    <select @change=${this.demoChange}>
                        ${allDemos.map(d => html`
                            <option value=${d.id} ?selected=${d.id === this.demoID}>${d.caption}</option>
                        `)}
                    </select>
                    <button @click="${() => { this.setShowControls(!this.showControls) }}">...</button>
                </span>
                <div id="controls">
                    ${this.webGPUpresent ? '' : html`
                        <div class="error">
                            Your browser does not support <a href="https://en.wikipedia.org/wiki/WebGPU">WebGPU</a>.
                            WebGPU is a future web standard which is supported by Chrome and Firefox, but requires special configuration. See <a href="https://github.com/Palats/webgpu">README</a> for details on how to activate it.
                        </div>
                    `}
                    ${this.error ? html`
                        <div class="error">
                            Issue: ${this.error}
                        </div>
                    `: ``}
                    ${this.showControls ? html`
                        <div>
                            <input type=checkbox ?checked=${this.limitCanvas} @change=${this.limitCanvasChange}>
                                Limit canvas to 816x640 (<a href="https://crbug.com/dawn/1260">crbug.com/dawn/1260</a>)
                            </input>
                        </div>
                    `: ``}
                </div>
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

    constructor() {
        super();
        this.showControls = this.getBoolParam("c", false);
        this.limitCanvas = this.getBoolParam("l", false);
        this.demoID = this.getStringParam("d", allDemos[0].id)
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
                /*if (this.device.lost) {
                    this.device.lost.then((e) => {
                        console.error("device lost", e);
                        this.initWebGPU();
                    });
                }*/

                const context = canvas.getContext('webgpu');
                if (!context) { new Error("no webgpu canvas context"); }

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

                // Render loop
                let elapsedMs = 0;
                let timestampMs = 0;
                while (!this.rebuildNeeded) {
                    const ts = await new Promise(window.requestAnimationFrame);
                    let deltaMs = null;
                    if (timestampMs) {
                        deltaMs = ts - elapsedMs;
                        elapsedMs += deltaMs;
                    }
                    await renderer({
                        timestampMs: ts,
                        elapsedMs: elapsedMs,
                        deltaMs: deltaMs,
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (e) {
                console.error("Run:", e);
                if (e instanceof Error) {
                    this.error = e.toString();
                } else {
                    this.error = "See Javascript console for error";
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