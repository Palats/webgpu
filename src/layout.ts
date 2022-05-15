// Manage layout, layout binding and corresponding WGSL declarations.

import * as types from './types';

export class Layout {
    private _desc: GPUBindGroupLayoutDescriptor;

    constructor(desc: LayoutDesc) {
        const entries = desc.entries ?? {};
        const perIndex: LayoutEntryDesc[] = [];
        const names: string[] = [];
        // First, find fixed binding index, to avoid using them.
        let nextIndex = 0;
        let entriesCount = 0;
        for (const [name, entry] of Object.entries(entries)) {
            entriesCount++;
            let idx = -1;
            if (entry.binding === undefined) {
                // No specified binding, get the first one we find.
                idx = nextIndex;
            } else {
                // Forced binding, verify there is no redundancy.
                if (perIndex[entry.binding]) {
                    throw new Error(`Binding ${entry.binding} already declared.`);
                }
                idx = entry.binding;

            }
            perIndex[idx] = entry;
            names[idx] = name;

            // Update nextIndex to an available one.
            while (perIndex[nextIndex] !== undefined) { nextIndex++; }
        }

        // Verify there is no gap in indexes.
        if (perIndex.length != entriesCount) {
            throw new Error(`forced binding lead to gap in binding indexes; ${perIndex.length} vs ${entriesCount}`);
        }

        const _entries: GPUBindGroupLayoutEntry[] = [];
        for (const [i, entry] of perIndex.entries()) {
            console.log("layout", i, names[i]);
            const _entry: GPUBindGroupLayoutEntry = {
                visibility: desc.visibility ?? entry.visibility ?? (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE),
                binding: i,
                buffer: entry.buffer,
                sampler: entry.sampler,
                texture: entry.texture,
            };
            _entries[i] = _entry;
        }

        this._desc = {
            label: desc.label,
            entries: _entries,
        }
    }

    Desc(): GPUBindGroupLayoutDescriptor { return this._desc; }
}

export interface LayoutDesc {
    label?: string;
    visibility?: GPUShaderStageFlags;
    entries?: { [k: string]: LayoutEntryDesc };
}

export interface LayoutEntryDesc {
    visibility?: GPUShaderStageFlags;
    binding?: number;
    buffer?: GPUBufferBindingLayout & BufferDesc;
    sampler?: GPUSamplerBindingLayout;
    texture?: GPUTextureBindingLayout;
}

export interface BufferDesc {
    // type?: GPUBuffer;
    wgtype?: types.WGSLType<any>;
    //hasDynamicOffset?: boolean;
    // minBindingSize?: number;
}

/*export interface SamplerDesc {
    type?: GPUSamplerBindingType;
}

export interface TextureDesc {
    sampleType?: GPUTextureSampleType;
    viewDimension?: GPUTextureViewDimension;
    multisampled?: boolean;
}*/

// storagetexture
// externaltexture

/*export type LayoutFields = {
    [k: string]: Entry,
}*/

function test1() {
    const desc = new Layout({
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        entries: {
            uniforms: { buffer: {} },
        }
    })
}