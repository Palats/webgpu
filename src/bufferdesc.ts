/// <reference types="@webgpu/types" />

// The following providing a kind of WSGL import system.

type WSGLModuleConfig = {
    label?: string;
    imports?: WSGLModule[];
}

class WSGLModule {
    readonly label: string;
    private imports: WSGLModule[] = [];
    private code: WSGLCode;
    symbols = new Set<string>();

    constructor(cfg: WSGLModuleConfig, code: WSGLCode) {
        if (cfg.imports) {
            this.imports.push(...cfg.imports);
        }
        this.label = cfg.label ?? "<unnamed>";
        this.code = code;

        for (const token of this.code.tokens) {
            if (token instanceof WSGLName) {
                if (this.symbols.has(token.name)) {
                    throw new Error("duplicate symbol");
                }
                this.symbols.add(token.name);
            }
            if (token instanceof WSGLRef) {
                if (!token.mod.symbols.has(token.name)) {
                    throw new Error("missing symbol");
                }
                this.imports.push(token.mod);
            }
        }
    }

    // Create a reference to a symbol this module "exports".
    ref(name: string) {
        return new WSGLRef(this, name);
    }

    private importOrder(): WSGLModule[] {
        const ordered: WSGLModule[] = [];
        const imported = new Set<WSGLModule>();
        const next = (mod: WSGLModule, seen: Set<WSGLModule>) => {
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
    private render(imports: Map<WSGLModule, string>): string {
        const prefix = imports.get(this);
        if (prefix === undefined) {
            throw new Error("something went wrong");
        }
        let s = `\n// -------- Module: ${this.label} --------\n`;
        for (const token of this.code.tokens) {
            if (token instanceof WSGLName) {
                s += prefix + token.name;
            } else if (token instanceof WSGLRef) {
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
        const imports = new Map<WSGLModule, string>();
        for (const [idx, mod] of mods.entries()) {
            imports.set(mod, `m${idx}_`);
        }

        const textMods = [];
        for (const mod of mods) {
            textMods.push(mod.render(imports));
        }
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

class WSGLName {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class WSGLRef {
    mod: WSGLModule;
    name: string;
    constructor(mod: WSGLModule, name: string) {
        this.mod = mod;
        this.name = name;
    }
}

type WSGLToken = string | WSGLName | WSGLRef;

// https://gpuweb.github.io/gpuweb/wgsl/#identifiers
const markersRE = /@@(([a-zA-Z_][0-9a-zA-Z][0-9a-zA-Z_]*)|([a-zA-Z][0-9a-zA-Z_]*))/g;

class WSGLCode {
    readonly tokens: WSGLToken[];
    constructor(strings: TemplateStringsArray, keys: WSGLToken[]) {
        this.tokens = [...wsglSplit(strings[0])];
        for (let i = 1; i < strings.length; i++) {
            this.tokens.push(keys[i - 1]);
            this.tokens.push(...wsglSplit(strings[i]));
        }
    }

    toString(): string {
        let s = '';
        for (const token of this.tokens) {
            s += token;
        }
        return s;
    }
}

function wsglSplit(s: string): WSGLToken[] {
    const tokens: WSGLToken[] = [];
    let prevIndex = 0;
    for (const m of s.matchAll(markersRE)) {
        if (m.index === undefined) { throw new Error("oops") }
        if (m.index > prevIndex) {
            tokens.push(s.slice(prevIndex, m.index));
        }
        prevIndex = m.index + m[0].length;
        tokens.push(new WSGLName(m[1]));
    }
    if (prevIndex < s.length) {
        tokens.push(s.slice(prevIndex, s.length));
    }
    return tokens;
}

export function wsgl(strings: TemplateStringsArray, ...keys: WSGLToken[]) {
    return new WSGLCode(strings, keys);
}

function testWSGL() {
    console.group("testWSGL");
    console.log("tagged template 1", wsgl``);
    console.log("tagged template 2", wsgl`a`);
    console.log("tagged template 3", wsgl`${"plop"}`);
    console.log("tagged template 4", wsgl`foo @@bar plop`);

    const testModule1 = new WSGLModule({ label: "test1" }, wsgl`
        foo
        coin @@bar plop
    `);

    const testModule2 = new WSGLModule({ label: "test2" }, wsgl`
        foo ${testModule1.ref("bar")}
    `);

    console.log("render1", testModule2.toDesc().code);
    console.groupEnd();
}


// ----------------------------------------------------------------------
// The following contains an attempt at making it easier to manipulate basic
// uniforms - i.e., maintaing a buffer content with structured data from
// Javascript.
// It is a bit overcomplicated in order to keep typing work.

// Basic class to represent info about a given WSGL type. The template parameter
// is the type of the value it maps to in javascript.
abstract class WSGLType<T> {
    // If a template parameter is not used, it means the template type not being resolved,
    // leading to unexpected results.
    private v?: T;

    // Size in byte of that value in WSGL (e.g., 4 for f32).
    abstract byteSize(): number;

    // Write a value from javascript to a data view.
    abstract dataViewSet(dv: DataView, offset: number, v: T): void;
}

// Info about WSGL `f32` type.
class F32Type extends WSGLType<number> {
    byteSize() { return 4; }
    dataViewSet(dv: DataView, offset: number, v: number) {
        dv.setFloat32(offset, v, true);
    }
}
export const F32 = new F32Type();

// mat4x4<f32> WSGL type.
class Mat4x4F32Type extends WSGLType<number[]> {
    byteSize() { return 16 * F32.byteSize(); }
    dataViewSet(dv: DataView, offset: number, v: number[]) {
        for (let i = 0; i < 16; i++) {
            dv.setFloat32(offset, v[i], true);
        }
    }
}
export const Mat4x4F32 = new Mat4x4F32Type();


// Description of a given field in a WSGL struct.
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

// Extract the WSGL type class of a field declaration.
type FieldWSGLType<F> = F extends FieldType<infer T> ? T : never;
// Extract the javascript type from a WSGL type (e.g., F32Type -> number).
type WSGLJSType<F> = F extends WSGLType<infer T> ? T : string;


type DescriptorInfo = { [k: string]: any }

// Internal state keeping of a descriptor, tracking
// explicit offset of each field.
type FullField = {
    field: FieldType<any>
    name: string
    offset: number
}

// Description of a struct allowing mapping between javascript and WSGL.
export class Descriptor<T extends DescriptorInfo> {
    // The object listing the fields this struct contains.
    public fields: T;

    private byIndex: FullField[];
    private _byteSize: number;

    constructor(fields: T) {
        this.fields = fields;
        this.byIndex = [];
        this._byteSize = 0;

        for (const [name, field] of Object.entries(fields)) {
            if (!(field instanceof FieldType)) {
                continue
            }
            if (this.byIndex[field.idx]) {
                throw new Error(`field index ${field.idx} is duplicated`);
            }
            this.byIndex[field.idx] = {
                field,
                name,
                offset: 0,
            };
            this._byteSize += field.type.byteSize();
        }

        let offset = 0;
        for (const [idx, ffield] of this.byIndex.entries()) {
            if (!ffield) {
                throw new Error(`missing field index ${idx}`);
            }
            ffield.offset = offset;
            offset += ffield.field.type.byteSize();
        }
    }

    // Size of this structure.
    byteSize() {
        return this._byteSize;
    }

    // Take an object containg the value for each field, and write it
    // in the provided data view.
    writeTo(values: DescInfoJSClass<T>, data: DataView) {
        for (const ffield of this.byIndex) {
            ffield.field.type.dataViewSet(data, ffield.offset, values[ffield.name]);
        }
    }

    // Create an array containing the serialized value from each field.
    createArray(values: DescInfoJSClass<T>): ArrayBuffer {
        const a = new ArrayBuffer(this.byteSize());
        this.writeTo(values, new DataView(a));
        return a;
    }
}

// Extract the descriptor info ( == map of fields info) for the given
// descriptor.
export type DescriptorInfoType<Desc> = Desc extends Descriptor<infer DescInfo> ? DescInfo : never;

export type DescInfoJSClass<DescInfo> = {
    [k in keyof DescInfo]: WSGLJSType<FieldWSGLType<DescInfo[k]>>;
}

// Type definition for a mapping field name / javascript value, suitable to feed into
// a descriptor value. I.e., the actual structure as javascript.
type DescriptorJSClass<Desc> = DescInfoJSClass<DescriptorInfoType<Desc>>;

//-----------------------------------------------
// Basic test

function testBuffer() {
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
}