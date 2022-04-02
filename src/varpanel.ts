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

@customElement('var-panel')
export class VarPanel extends LitElement {
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
    expanded = false;
}

declare global {
    interface HTMLElementTagNameMap {
        "var-panel": VarPanel,
    }
}

export type FieldKey = string | number | symbol;

export interface BaseOptionDesc<T extends Record<K, any>, K extends FieldKey> {
    obj: T,
    field: K,
    caption?: string;
}

export interface BoolDesc<T extends Record<K, boolean>, K extends FieldKey> extends BaseOptionDesc<T, K> { }

export function newBool<T extends Record<K, boolean>, K extends FieldKey>(desc: BoolDesc<T, K>): TemplateResult {
    return html`<vp-bool .obj=${desc.obj} .field=${desc.field}>${desc.caption}</vp-bool>`;
}

@customElement('vp-bool')
export class BoolElement extends LitElement {
    static styles = [commonStyle];

    @property()
    field: FieldKey = "";

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
        "vp-bool": BoolElement,
    }
}

// Type of the values a SelectElement can set.
export type SelectType = string | number;

export interface SelectDesc<T extends Record<K, SelectType>, K extends FieldKey> extends BaseOptionDesc<T, K> {
    obj: T,
    field: K,
    caption?: string;
    values: SelectType[];
}

export function newSelect<T extends Record<K, SelectType>, K extends FieldKey>(desc: SelectDesc<T, K>): TemplateResult {
    return html`<vp-select .obj=${desc.obj} .field=${desc.field} .values=${desc.values}>${desc.caption}</vp-select>`;
}

@customElement('vp-select')
export class SelectElement extends LitElement {
    static styles = [commonStyle];

    @property()
    field: FieldKey = "";

    @property({ attribute: false })
    obj: any;

    @property({ attribute: false })
    values: SelectType[] = [];

    render() {
        const current = this.getValue();
        return html`
            <div class="labelvalue">
                <label><slot>${this.field}</slot></label>
                <select class="value" @change=${this.onChange}>
                    ${this.values.map(id => html`
                        <option value=${id} ?selected=${id === current}>${id}</option>
                    `)}
                </select>
            </div>
        `;
    }

    onChange(evt: Event) {
        const options = (evt.target as HTMLSelectElement).selectedOptions;
        if (!options) {
            return;
        }
        this.setValue(options[0].value);
    }

    getValue(): SelectType {
        return this.obj[this.field] ?? false;
    }

    setValue(v: SelectType) {
        this.obj[this.field] = v;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "vp-select": SelectElement,
    }
}
