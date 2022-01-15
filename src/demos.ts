/// <reference types="@webgpu/types" />

import * as engine from './engine';

interface Demo {
    id: string;
    caption: string;
    init(canvas: HTMLCanvasElement, renderWidth: number, renderHeight: number): Promise<Runner>;
}

interface Runner {
    frame(timestampMs: DOMHighResTimeStamp): Promise<void>;
}

export const asDemo = (t: typeof engine.Engine) => {
    return {
        id: t.id,
        caption: t.caption,
        async init(canvas: HTMLCanvasElement, renderWidth: number, renderHeight: number) {
            const d = new t();
            await d.init(canvas, renderWidth, renderHeight);
            return d;
        }
    };
};

import * as conway from './demos/conway';
import * as fire from './demos/conway';
import * as falling from './demos/conway';
import * as fade from './demos/conway';

export const allDemos: Demo[] = [
    asDemo(fire.demo),
    asDemo(conway.demo),
    asDemo(falling.demo),
    asDemo(fade.demo),
];


export function byID(id: string): Demo {
    for (const d of allDemos) {
        if (d.id === id) {
            return d;
        }
    }
    return allDemos[0];
}