import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const commonStyle = css`
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
`;

@customElement('ctrl-ui')
export class CtrlUI extends LitElement {
    static styles = [commonStyle, css`
        :host {
            background-color: #d6d6d6f0;
            border: #8b8b8b 1px solid;
            font-size: 11px;
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
    `];

    render() {
        return html`
            ${this.expanded ? html`<slot></slot>` : ``}
            <div class="line">
                <button @click="${() => { this.expanded = !this.expanded }}">
                    ${this.expanded ? 'Close' : 'Open'} controls
                </button>
            </div>
        `;
    }

    @property({ type: Boolean })
    expanded = true;
}

declare global {
    interface HTMLElementTagNameMap {
        "ctrl-ui": CtrlUI,
    }
}

export type exposeBoolDesc = {
    caption?: string;
}

export function exposeBool<T extends { [k in K]: boolean }, K extends string | number | symbol>(obj: T, field: K, desc: exposeBoolDesc = {}): TemplateResult {
    return html`<ctrl-bool .obj=${obj} .field=${field}>${desc.caption}</ctrl-bool>`;
}

@customElement('ctrl-bool')
export class CtrlBool extends LitElement {
    static styles = [commonStyle];

    @property()
    field: string | number | symbol = "";

    @property()
    obj: any;

    render() {
        return html`
            <div class="labelvalue">
                <label><slot>${this.field}</slot></label>
                <input class="value" type=checkbox ?checked=${this.getValue()} @change=${(e: Event) => { this.setValue((e.target as HTMLInputElement).checked); }}></input>
            </div>
        `;
    }

    getValue(): boolean {
        return this.obj[this.field] ?? false;
    }

    setValue(v: boolean) {
        this.obj[this.field] = v;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ctrl-bool": CtrlBool,
    }
}
