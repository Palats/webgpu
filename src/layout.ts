// Manage layout, layout binding and corresponding WGSL declarations.

import { lang, types } from '.';

// Store a layout of a bind group, usable for declaring the layout, create the
// bing group and usable from WGSL.
export class BindGroup {
    label: string;

    private _desc: GPUBindGroupLayoutDescriptor;
    private perIndex: BingGroupEntryInfo[];
    private perName: { [k in string]: BingGroupEntryInfo };
    // Per binding group.
    private modules: lang.WGSLModule[] = [];

    constructor(desc: BindGroupDesc) {
        this.label = desc.label ?? "unnamed bindgroup layout";
        const entries = desc.entries ?? {};
        this.perIndex = [];
        this.perName = {};

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
                if (this.perIndex[entry.binding]) {
                    throw new Error(`Binding ${entry.binding} already declared.`);
                }
                idx = entry.binding;
            }

            const _entry: GPUBindGroupLayoutEntry = {
                visibility: desc.visibility ?? entry.visibility ?? (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE),
                binding: idx,
                buffer: entry.buffer,
                sampler: entry.sampler,
                texture: entry.texture,
            };

            var type: lang.WGSLCode;
            var addressSpace: lang.WGSLCode;
            var resource: (data: any) => GPUBindingResource;
            if (entry.buffer) {
                if (!entry.buffer.wgtype) { throw new Error(`missing wgtype for entry ${name}`); }
                type = entry.buffer.wgtype.typename();
                addressSpace = lang.wgsl`<uniform>`;
                resource = (data: any) => {
                    return { buffer: data as GPUBuffer };

                };
            } else if (entry.sampler) {
                type = lang.wgsl`sampler`;
                addressSpace = lang.wgsl``;
                resource = (data: any) => {
                    return data as GPUSampler;
                }
            } else if (entry.texture) {
                type = lang.wgsl`texture_2d<f32>`;
                addressSpace = lang.wgsl``;
                resource = (data: any) => {
                    return data as GPUTextureView;
                }
            } else {
                throw new Error(`missing entry type`);
            }

            const info: BingGroupEntryInfo = {
                index: idx,
                name: name,
                type: type,
                addressSpace: addressSpace,
                srcDesc: entry,
                dstDesc: _entry,
                resource: resource,
            };
            this.perIndex[idx] = info;
            this.perName[name] = info;

            // Update nextIndex to an available one.
            while (this.perIndex[nextIndex] !== undefined) { nextIndex++; }
        }

        // Verify there is no gap in indexes.
        if (this.perIndex.length != entriesCount) {
            throw new Error(`forced binding lead to gap in binding indexes; ${this.perIndex.length} vs ${entriesCount}`);
        }

        const _entries: GPUBindGroupLayoutEntry[] = [];
        for (const nfo of this.perIndex) {
            _entries[nfo.index] = nfo.dstDesc;
        }

        this._desc = {
            label: desc.label,
            entries: _entries,
        }
    }

    Layout(): GPUBindGroupLayoutDescriptor { return this._desc; }

    Module(group: number): lang.WGSLModule {
        if (this.modules[group] === undefined) {
            const lines = [
                lang.wgsl`// Layout ${this.label}\n`,
            ];
            for (const nfo of this.perIndex) {
                lines.push(lang.wgsl`@group(${group.toString()}) @binding(${nfo.index.toString()}) var${nfo.addressSpace} ${new lang.WGSLName(nfo.name)}: ${nfo.type};\n`);
            }
            this.modules[group] = new lang.WGSLModule({
                label: this.label,
                code: lang.wgsl`${lines}`,
            });
        }
        return this.modules[group];
    }

    Desc(layout: GPUBindGroupLayout, bindings: { [k in string]: any }): GPUBindGroupDescriptor {
        const entries: GPUBindGroupEntry[] = [];
        let found = 0;
        for (const [name, bind] of Object.entries(bindings)) {
            const nfo = this.perName[name];
            if (!nfo) { throw new Error(`unknown key "${name}"`); }
            found++;
            entries.push({
                binding: nfo.index,
                resource: nfo.resource(bind),
            });
        }
        if (found !== this.perIndex.length) {
            // Only track what missing/extra on failure, to avoid the extra
            // bookkeeping cost.
            const provided = new Set(Object.keys(bindings));
            const missing = Object.keys(this.perName).filter(x => !provided.has(x));
            throw new Error(`invalid bindings; missing: ${missing}`);
        }
        return {
            label: this.label,
            layout: layout,
            entries: entries,
        }
    }
}

interface BingGroupEntryInfo {
    index: number;
    name: string;
    type: lang.WGSLCode;
    addressSpace: lang.WGSLCode;
    srcDesc: BindGroupEntry;
    dstDesc: GPUBindGroupLayoutEntry;
    resource: (data: any) => GPUBindingResource;
}

export interface BindGroupDesc {
    label?: string;
    visibility?: GPUShaderStageFlags;
    entries?: { [k: string]: BindGroupEntry };
}

export interface BindGroupEntry {
    visibility?: GPUShaderStageFlags;
    binding?: number;
    buffer?: GPUBufferBindingLayout & BufferDesc;
    sampler?: GPUSamplerBindingLayout;
    texture?: GPUTextureBindingLayout;
}

export interface BufferDesc {
    wgtype?: types.WGSLType<any>;
}