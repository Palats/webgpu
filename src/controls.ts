import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ctrl-ui')
export class CtrlUI extends LitElement {
    static styles = css`
        :host {
            background-color: #d6d6d6f0;
            border: #8b8b8b 1px solid;
            font-size: 11px;
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
    `;

    render() {
        return html`
            ${this.expanded ? this.controls : ``}
            <div class="line">
                <button @click="${() => { this.expanded = !this.expanded }}">
                    ${this.expanded ? 'Close' : 'Open'} controls
                </button>
            </div>
        `;
    }

    @property({ type: Boolean })
    expanded = true;

    private controls: TemplateResult[] = [];

    appendEntry(c: TemplateResult) {
        this.controls.push(c);
        this.requestUpdate();
    }
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
    const current = obj[field];
    return html`
        <div class="labelvalue">
            <label>${desc.caption ?? field}</label>
            <input class="value" type=checkbox ?checked=${current} @change=${(e: Event) => { obj[field] = (e.target as HTMLInputElement).checked as any; }}></input>
        </div>
    `;
}