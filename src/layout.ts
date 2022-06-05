// Manage layout, layout binding and corresponding WGSL declarations.

import { lang, types } from '.';
import { WGSLRef } from './lang';

// Store a layout of a bind group, usable for declaring the layout, create the
// bing group and usable from WGSL.
export class BindGroup {
    label: string;

    private _desc: GPUBindGroupLayoutDescriptor;
    private perIndex: BingGroupEntryInfo[];
    private perName: { [k in string]: BingGroupEntryInfo };
    // Per binding group.
    private modules: lang.WGSLModule[] = [];

    private layoutCache: Map<GPUDevice, GPUBindGroupLayout> = new Map();

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
                let varType: string | undefined;
                if (!entry.buffer.type || entry.buffer.type == 'uniform') {
                    varType = 'uniform';
                } else if (entry.buffer.type == 'storage') {
                    varType = 'storage,read_write'
                } else if (entry.buffer.type == 'read-only-storage') {
                    varType = 'storage,read'
                }
                if (!varType) { throw new Error("oops"); }
                addressSpace = lang.wgsl`<${varType}>`;
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

    layoutDesc(): GPUBindGroupLayoutDescriptor { return this._desc; }

    layout(device: GPUDevice): GPUBindGroupLayout {
        let l = this.layoutCache.get(device);
        if (!l) {
            l = device.createBindGroupLayout(this.layoutDesc());
            this.layoutCache.set(device, l);
        }
        return l;
    }

    module(group: number): lang.WGSLModule {
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

    desc(device: GPUDevice, bindings: { [k in string]: any }): GPUBindGroupDescriptor {
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
            layout: this.layout(device),
            entries: entries,
        }
    }

    Create(device: GPUDevice, bindings: { [k in string]: any }): GPUBindGroup {
        return device.createBindGroup(this.desc(device, bindings));
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

// Describe the bindgroups necessary to run a pipeline.
export class Pipeline {
    label: string;

    private perIndex: PipelineEntryInfo[];
    private perName: { [k in string]: PipelineEntryInfo };
    private layoutCache: Map<GPUDevice, GPUPipelineLayout> = new Map();

    constructor(desc: PipelineDesc) {
        this.label = desc.label ?? "unknown pipeline layout";
        this.perIndex = [];
        this.perName = {};

        const entries = desc.entries ?? {};

        // For now, no support to force index.
        for (const [name, entry] of Object.entries(entries)) {
            const nfo: PipelineEntryInfo = {
                index: this.perIndex.length,
                name: name,
                bindGroup: entry.bindGroup,
            }
            this.perIndex.push(nfo);
            this.perName[name] = nfo;
        }
    }

    layoutDesc(device: GPUDevice): GPUPipelineLayoutDescriptor {
        const layouts: GPUBindGroupLayout[] = [];
        for (const nfo of this.perIndex) {
            layouts.push(nfo.bindGroup.layout(device));
        }
        return {
            label: this.label,
            bindGroupLayouts: layouts,
        }
    }

    layout(device: GPUDevice): GPUPipelineLayout {
        let l = this.layoutCache.get(device);
        if (!l) {
            l = device.createPipelineLayout(this.layoutDesc(device));
            this.layoutCache.set(device, l);
        }
        return l;
    }

    setBindGroups(encoder: GPUBindingCommandsMixin, bindGroups: { [k in string]: GPUBindGroup }) {
        for (const nfo of this.perIndex) {
            encoder.setBindGroup(nfo.index, bindGroups[nfo.name]);
        }
    }

    // Give access to all the layout of the pipeline to WGSL code.
    // Keys are the
    wgsl(): { [k in string]: { [k in string]: WGSLRef } } {
        const mods: { [k in string]: { [k in string]: WGSLRef } } = {};
        for (const nfo of this.perIndex) {
            mods[nfo.name] = nfo.bindGroup.module(nfo.index).refs;
        }
        return mods;
    }
}

export interface PipelineDesc {
    label?: string;
    entries?: { [k: string]: PipelineEntry };
}

export interface PipelineEntry {
    bindGroup: BindGroup;
}

interface PipelineEntryInfo {
    index: number;
    name: string;
    bindGroup: BindGroup;
}

// Partial definition; see
// https://gpuweb.github.io/gpuweb/#gpubindingcommandsmixin
// Implemented by GPUComputePassEncoder & GPURenderPassEncoder.
interface GPUBindingCommandsMixin {
    setBindGroup: (index: number, bindGroup: GPUBindGroup, dynamicOffset?: GPUBufferDynamicOffset[]) => void;
}