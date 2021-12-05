import { LitElement, html, css, } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref, Ref, createRef } from 'lit/directives/ref.js';


@customElement('app-main')
export class AppMain extends LitElement {
    static styles = css`
        :host {
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
        }

        #display canvas {
            display: block;
            height: 100%;
            width: 100%;
        }
    `;

    canvas: HTMLCanvasElement;

    render() {
        return html`
            <div id="display">${this.canvas}</div>
        `;
    }

    constructor() {
        super();
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
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