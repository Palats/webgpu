// A WebGPU helper libraries. For now, providers:
//   - WGSLModule: A way to import / manage a library of reusable WGSL code.
//   - A way to manage mapping between Javascript types and WGSL types, for
//     simple buffer translation.

/// <reference types="@webgpu/types" />

// The following providing a kind of WGSL import system.

type WGSLModuleConfig = {
    label?: string;
    imports?: WGSLModule[];
    code: WGSLCode;
}

export class WGSLModule {
    readonly label: string;
    private imports: WGSLModule[] = [];
    private code: WGSLCode;
    symbols = new Set<string>();

    constructor(cfg: WGSLModuleConfig) {
        if (cfg.imports) {
            this.imports.push(...cfg.imports);
        }
        this.label = cfg.label ?? "<unnamed>";
        this.code = cfg.code;

        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                if (this.symbols.has(token.name)) {
                    throw new Error("duplicate symbol");
                }
                this.symbols.add(token.name);
            } else if (token instanceof WGSLRef) {
                if (!token.mod.symbols.has(token.name)) {
                    throw new Error(`reference to unknown symbol "${token.name}" in module "${token.mod.label}" from module "${this.label}"`);
                }
                this.imports.push(token.mod);
            }
        }
    }

    // Create a reference to a symbol this module "exports".
    ref(name: string) {
        return new WGSLRef(this, name);
    }

    private importOrder(): WGSLModule[] {
        const ordered: WGSLModule[] = [];
        const imported = new Set<WGSLModule>();
        const next = (mod: WGSLModule, seen: Set<WGSLModule>) => {
            seen.add(mod);
            for (const imp of mod.imports) {
                if (seen.has(imp)) { throw new Error("import cycle"); }
                if (!imported.has(imp)) {
                    next(imp, seen);
                }
            }
            imported.add(mod);
            ordered.push(mod);
            seen.delete(mod);
        }

        next(this, new Set());
        return ordered;
    }

    // Create a text representation of the code of this module only.
    private render(imports: Map<WGSLModule, string>): string {
        const prefix = imports.get(this);
        if (prefix === undefined) {
            throw new Error(`internal: module "${this.label}" is imported but has no prefix`);
        }
        let s = `\n// -------- Module: ${this.label} --------\n`;
        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                s += prefix + token.name;
            } else if (token instanceof WGSLRef) {
                const refPrefix = imports.get(token.mod);
                if (refPrefix === undefined) {
                    throw new Error("module not found");
                }
                s += refPrefix + token.name;
            } else {
                s += token;
            }
        }
        return s;
    }

    // Render the code of this module with all its dependencies.
    private generate(): string {
        const mods = this.importOrder();
        const imports = new Map<WGSLModule, string>();
        for (const [idx, mod] of mods.entries()) {
            imports.set(mod, `m${idx}_`);
        }

        const textMods = [];
        for (const mod of mods) {
            textMods.push(mod.render(imports));
        }
        const s = textMods.join("\n");
        console.groupCollapsed(`Generated shader code "${this.label}"`);
        console.log(s);
        console.groupEnd();
        return textMods.join("\n");
    }

    toDesc(): GPUShaderModuleDescriptorWGSL {
        return {
            label: this.label,
            code: this.generate(),
            // sourceMap
            // hint
        }
    }
}

class WGSLName {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class WGSLRef {
    mod: WGSLModule;
    name: string;
    constructor(mod: WGSLModule, name: string) {
        this.mod = mod;
        this.name = name;
    }
}

type WGSLToken = string | WGSLName | WGSLRef;

// https://gpuweb.github.io/gpuweb/wgsl/#identifiers
const markersRE = /@@(([a-zA-Z_][0-9a-zA-Z][0-9a-zA-Z_]*)|([a-zA-Z][0-9a-zA-Z_]*))/g;

// WGSLCode holds a snippet of code, without parsing.
// This is used to allow mixing actual text representation of WGSL but also
// Javascript references to other module - that are interpretated differently
// when "rendering" the WGSL code.
class WGSLCode {
    readonly tokens: WGSLToken[];
    constructor(tokens: WGSLToken[]) {
        this.tokens = [...tokens];
    }
}

// Declare WGSLCode using template strings.
export function wgsl(strings: TemplateStringsArray, ...keys: (WGSLToken | WGSLCode | WGSLCode[])[]) {
    const tokens = [...wgslSplit(strings[0])];
    for (let i = 1; i < strings.length; i++) {
        const token = keys[i - 1];
        if (Array.isArray(token)) {
            for (const subtoken of token) {
                tokens.push(...subtoken.tokens);
            }
        } else if (token instanceof WGSLCode) {
            tokens.push(...token.tokens);
        } else if (typeof token === "string") {
            tokens.push(...wgslSplit(token));
        } else {
            tokens.push(token);
        }
        tokens.push(...wgslSplit(strings[i]));
    }

    return new WGSLCode(tokens);
}

function wgslSplit(s: string): WGSLToken[] {
    const tokens: WGSLToken[] = [];
    let prevIndex = 0;
    for (const m of s.matchAll(markersRE)) {
        if (m.index === undefined) { throw new Error("oops") }
        if (m.index > prevIndex) {
            tokens.push(s.slice(prevIndex, m.index));
        }
        prevIndex = m.index + m[0].length;
        tokens.push(new WGSLName(m[1]));
    }
    if (prevIndex < s.length) {
        tokens.push(s.slice(prevIndex, s.length));
    }
    return tokens;
}


function testWGSLModules() {
    console.group("testWGSL");
    console.log("tagged template 1", wgsl``);
    console.log("tagged template 2", wgsl`a`);
    console.log("tagged template 3", wgsl`${"plop"}`);
    console.log("tagged template 4", wgsl`foo @@bar plop`);

    const testModule1 = new WGSLModule({
        label: "test1",
        code: wgsl`
            foo
            coin @@bar plop
        `,
    });

    const testModule2 = new WGSLModule({
        label: "test2",
        code: wgsl`
            foo ${testModule1.ref("bar")}
        `,
    });

    console.log("render1", testModule2.toDesc().code);
    console.groupEnd();
}


// ----------------------------------------------------------------------
// The following contains an attempt at making it easier to manipulate basic
// uniforms - i.e., maintaing a buffer content with structured data from
// Javascript.
// It is a bit overcomplicated in order to keep typing work.

// Basic class to represent info about a given WGSL type. The template parameter
// is the type of the value it maps to in javascript.
abstract class WGSLType<T> {
    // If a template parameter is not used, it means the template type not being resolved,
    // leading to unexpected results.
    private unused?: T;

    // Size in byte of that value in WGSL (e.g., 4 for f32).
    abstract byteSize(): number;

    // Alignement of that value in WGSL
    // https://gpuweb.github.io/gpuweb/wgsl/#alignment
    abstract alignOf(): number;

    // Write a value from javascript to a data view.
    abstract dataViewSet(dv: DataView, offset: number, v: T): void;

    // What to use in WGSL to refer to that type.
    abstract typename(): WGSLCode;
}

// Info about WGSL `f32` type.
class F32Type extends WGSLType<number> {
    byteSize() { return 4; }
    alignOf() { return 4; }

    dataViewSet(dv: DataView, offset: number, v: number) {
        dv.setFloat32(offset, v, true);
    }

    typename(): WGSLCode {
        return wgsl`f32`;
    }
}
export const F32 = new F32Type();

// Info about WGSL `u32` type.
class U32Type extends WGSLType<number> {
    byteSize() { return 4; }
    alignOf() { return 4; }

    dataViewSet(dv: DataView, offset: number, v: number) {
        dv.setInt32(offset, v, true);
    }

    typename(): WGSLCode {
        return wgsl`u32`;
    }
}
export const U32 = new U32Type();

// Info about WGSL `vec3<f32>` type.
class Vec3f32Type extends WGSLType<number[]> {
    byteSize() { return 12; }
    alignOf() { return 16; }

    dataViewSet(dv: DataView, offset: number, v: number[]) {
        dv.setFloat32(offset, v[0], true);
        dv.setFloat32(offset + F32.byteSize(), v[1], true);
        dv.setFloat32(offset + 2 * F32.byteSize(), v[2], true);
    }

    typename(): WGSLCode {
        return wgsl`vec3<f32>`;
    }
}
export const Vec32f32 = new Vec3f32Type();

// mat4x4<f32> WGSL type.
class Mat4x4F32Type extends WGSLType<number[]> {
    byteSize() { return 64; }
    alignOf() { return 16; }

    dataViewSet(dv: DataView, offset: number, v: number[]) {
        for (let i = 0; i < 16; i++) {
            dv.setFloat32(offset, v[i], true);
            offset += F32.byteSize();
        }
    }

    typename(): WGSLCode {
        return wgsl`mat4x4<f32>`;
    }
}
export const Mat4x4F32 = new Mat4x4F32Type();


// A WGSL array containing type T.
export class FixedArray<T extends WGSLType<A>, A> extends WGSLType<A[]> {
    readonly count: number;
    readonly etype: T;

    private stride: number;

    constructor(etype: T, count: number) {
        super();
        this.etype = etype;
        this.count = count;
        this.stride = this.etype.alignOf() * Math.ceil(this.etype.byteSize() / this.etype.alignOf());
    }

    byteSize() { return this.count * this.stride; }
    alignOf() { return this.etype.alignOf(); }

    dataViewSet(dv: DataView, offset: number, v: A[]) {
        for (let i = 0; i < this.count; i++) {
            this.etype.dataViewSet(dv, offset, v[i]);
            offset += this.stride;
        }
    }

    typename(): WGSLCode {
        return wgsl`array<${this.etype.typename()}, ${this.count.toString()}>`;
    }
}

// Description of a given field in a WGSL struct.
class FieldType<T> {
    // Index of that field in the struct.
    readonly idx: number;
    // Type of the content of that field.
    readonly type: T;

    constructor(t: T, idx: number) {
        this.idx = idx;
        this.type = t;
    }
}

// Declare a field of the given type, at the given position. Index of the field
// in the struct is mandatory, to reduce renaming and moving mistakes.
export function Field<T>(type: T, idx: number): FieldType<T> {
    return new FieldType(type, idx);
}

// Extract the WGSL type class of a field declaration.
type FieldWGSLType<F> = F extends FieldType<infer T> ? T : never;
// Extract the javascript type from a WGSL type (e.g., F32Type -> number).
type WGSLJSType<F> = F extends WGSLType<infer T> ? T : string;


type DescriptorInfo = { [k: string]: any }

// Internal state keeping of a descriptor, tracking
// explicit offset of each field.
type FullField = {
    field: FieldType<any>
    name: string
    sizeOf: number
    alignOf: number
    offset: number
}

// Description of a struct allowing mapping between javascript and WGSL.
export class Descriptor<T extends DescriptorInfo> {
    // The object listing the fields this struct contains.
    public fields: T;

    private byIndex: FullField[];
    private _byteSize: number;
    private _alignOf: number;
    private mod?: WGSLModule;

    constructor(fields: T) {
        this.fields = fields;
        this.byIndex = [];

        if (fields.length < 1) {
            // Not sure if empty struct are valid in WGSL - in the mean time,
            // reject.
            throw new Error("struct must have at least one field");
        }

        for (const [name, field] of Object.entries(fields)) {
            if (!(field instanceof FieldType)) { continue }
            if (this.byIndex[field.idx]) {
                throw new Error(`field index ${field.idx} is duplicated`);
            }
            this.byIndex[field.idx] = {
                field,
                name,
                // No support for @size & @align attributes for now.
                sizeOf: field.type.byteSize(),
                alignOf: field.type.alignOf(),
                // Calculated below
                offset: 0,
            };
        }

        // Struct offsets, size and aligns are non-trivial - see
        // https://gpuweb.github.io/gpuweb/wgsl/#structure-member-layout

        this._byteSize = 0;
        this._alignOf = 0;
        for (const [idx, ffield] of this.byIndex.entries()) {
            if (!ffield) {
                throw new Error(`missing field index ${idx}`);
            }
            if (idx > 0) {
                const prev = this.byIndex[idx - 1];
                ffield.offset = ffield.alignOf * Math.ceil((prev.offset + prev.sizeOf) / ffield.alignOf);
            }
            this._alignOf = Math.max(this._alignOf, ffield.alignOf);
        }

        const last = this.byIndex[this.byIndex.length - 1];
        this._byteSize = this._alignOf * Math.ceil((last.offset + last.sizeOf) / this._alignOf);
    }

    byteSize() { return this._byteSize; }
    alignOf() { return this._alignOf; }

    // Take an object containg the value for each field, and write it
    // in the provided data view.
    dataViewSet(dv: DataView, offset: number, v: DescInfoJSClass<T>): void {
        for (const ffield of this.byIndex) {
            ffield.field.type.dataViewSet(dv, offset + ffield.offset, v[ffield.name]);
        }
    }

    // Create an array containing the serialized value from each field.
    createArray(values: DescInfoJSClass<T>): ArrayBuffer {
        const a = new ArrayBuffer(this.byteSize());
        this.dataViewSet(new DataView(a), 0, values);
        return a;
    }

    // Refer to that structure type in a WGSL fragment. It will take care of
    // creating a name and inserting the struct declaration as needed.
    typename(): WGSLRef {
        if (!this.mod) {
            const lines = [
                wgsl`// sizeOf: ${this.byteSize().toString()} ; alignOf: ${this.alignOf().toString()}\n`,
                wgsl`struct @@structname {\n`,
            ];

            for (const ffield of this.byIndex) {
                lines.push(wgsl`  // offset: ${ffield.offset.toString()} sizeOf: ${ffield.sizeOf.toString()} ; alignOf: ${ffield.alignOf.toString()}\n`,);
                lines.push(wgsl`  ${ffield.name}: ${ffield.field.type.typename()};\n`);
            }

            lines.push(wgsl`};\n`);
            this.mod = new WGSLModule({
                label: "buffer struct declaration",
                code: wgsl`${lines}`,
            });
        }

        return new WGSLRef(this.mod, "structname");
    }
}

// Extract the descriptor info ( == map of fields info) for the given
// descriptor.
export type DescriptorInfoType<Desc> = Desc extends Descriptor<infer DescInfo> ? DescInfo : never;

export type DescInfoJSClass<DescInfo> = {
    [k in keyof DescInfo]: WGSLJSType<FieldWGSLType<DescInfo[k]>>;
}

// Type definition for a mapping field name / javascript value, suitable to feed into
// a descriptor value. I.e., the actual structure as javascript.
type DescriptorJSClass<Desc> = DescInfoJSClass<DescriptorInfoType<Desc>>;

//-----------------------------------------------
// Basic test

function testBuffer() {
    console.group("testBuffer");
    const uniformsDesc = new Descriptor({
        elapsedMs: Field(F32, 0),
        renderWidth: Field(F32, 1),
        renderHeight: Field(F32, 2),
    })

    // type Uniforms = DescriptorJSClass<typeof uniformsDesc>;

    console.log("byteSize", uniformsDesc.byteSize);
    console.log("content", uniformsDesc.createArray({
        elapsedMs: 10,
        renderWidth: 320,
        renderHeight: 200,
    }));

    console.log("decl", uniformsDesc.typename().mod);
    console.groupEnd();
}
// testBuffer();