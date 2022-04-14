// The following contains an attempt at making it easier to manipulate basic
// uniforms - i.e., maintaing a buffer content with structured data from
// Javascript.
// It is a bit overcomplicated in order to keep typing work.

import * as lang from './lang';

const wgsl = lang.wgsl;

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

    // Return the stride of this type when used in an array.
    stride(): number {
        return this.alignOf() * Math.ceil(this.byteSize() / this.alignOf());
    }

    // Return the GPUVertexFormat associated to this type.
    // If no vertex format exists, throw an exception.
    vertexFormat(): GPUVertexFormat {
        throw new Error("type with no vertex format");
    }

    // Return the list of GPUVertexAttribute for this type, suitable for a
    // GPUVertexFormat. Can throw an error if that type does not support being
    // used as vertex attribute.
    // By default, just use the vertexFormat of this type.
    vertexAttributes(): GPUVertexAttribute[] {
        return [{
            shaderLocation: 0,
            offset: 0,
            format: this.vertexFormat(),
        }]
    }

    // Write a value from javascript to a data view.
    abstract dataViewSet(dv: DataView, offset: number, v: T): void;

    // Create a javascript Array read to be sent to the GPU with the provided
    // content.
    createArray(values: T): ArrayBuffer {
        const a = new ArrayBuffer(this.byteSize());
        this.dataViewSet(new DataView(a), 0, values);
        return a;
    }

    // What to use in WGSL to refer to that type.
    abstract typename(): lang.WGSLCode;
}

// Info about WGSL `f32` type.
class F32Type extends WGSLType<number> {
    byteSize() { return 4; }
    alignOf() { return 4; }

    dataViewSet(dv: DataView, offset: number, v: number) {
        dv.setFloat32(offset, v, true);
    }

    typename(): lang.WGSLCode {
        return wgsl`f32`;
    }
}
export const F32 = new F32Type();

// Info about WGSL `u16` type.
// This is not a real type in WGSL, but it can be used to map
// vertex indices.
class U16Type extends WGSLType<number> {
    byteSize() { return 2; }
    alignOf() { return 2; }

    dataViewSet(dv: DataView, offset: number, v: number) {
        dv.setUint16(offset, v, true);
    }

    typename(): lang.WGSLCode {
        return wgsl`u16`;
    }
}
export const U16 = new U16Type();

// Info about WGSL `u32` type.
class U32Type extends WGSLType<number> {
    byteSize() { return 4; }
    alignOf() { return 4; }

    dataViewSet(dv: DataView, offset: number, v: number) {
        dv.setUint32(offset, v, true);
    }

    typename(): lang.WGSLCode {
        return wgsl`u32`;
    }
}
export const U32 = new U32Type();

// Info about WGSL `vec3<f32>` type.
export class Vec3f32Type extends WGSLType<[number, number, number]> {
    byteSize() { return 12; }
    alignOf() { return 16; }

    dataViewSet(dv: DataView, offset: number, v: number[]) {
        dv.setFloat32(offset, v[0], true);
        dv.setFloat32(offset + F32.byteSize(), v[1], true);
        dv.setFloat32(offset + 2 * F32.byteSize(), v[2], true);
    }

    typename(): lang.WGSLCode {
        return wgsl`vec3<f32>`;
    }

    vertexFormat(): GPUVertexFormat {
        return "float32x3";
    }
}
export const Vec3f32 = new Vec3f32Type();

// Info about WGSL `vec4<f32>` type.
export class Vec4f32Type extends WGSLType<[number, number, number, number]> {
    byteSize() { return 16; }
    alignOf() { return 16; }

    dataViewSet(dv: DataView, offset: number, v: number[]) {
        dv.setFloat32(offset, v[0], true);
        dv.setFloat32(offset + F32.byteSize(), v[1], true);
        dv.setFloat32(offset + 2 * F32.byteSize(), v[2], true);
        dv.setFloat32(offset + 3 * F32.byteSize(), v[3], true);
    }

    typename(): lang.WGSLCode {
        return wgsl`vec4<f32>`;
    }

    vertexFormat(): GPUVertexFormat {
        return "float32x4";
    }
}
export const Vec4f32 = new Vec4f32Type();

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

    typename(): lang.WGSLCode {
        return wgsl`mat4x4<f32>`;
    }
}
export const Mat4x4F32 = new Mat4x4F32Type();


// A WGSL array containing type T.
export class ArrayType<T extends WGSLType<any>> extends WGSLType<WGSLJSType<T>[]> {
    readonly count: number;
    readonly etype: T;

    constructor(etype: T, count: number) {
        super();
        this.etype = etype;
        this.count = count;
    }

    byteSize() { return this.count * this.etype.stride(); }
    alignOf() { return this.etype.alignOf(); }

    dataViewSet(dv: DataView, offset: number, v: WGSLJSType<T>[]) {
        for (let i = 0; i < this.count; i++) {
            this.etype.dataViewSet(dv, offset, v[i]);
            offset += this.etype.stride();
        }
    }

    typename(): lang.WGSLCode {
        return wgsl`array<${this.etype.typename()}, ${this.count.toString()}>`;
    }

    // Creates a vertex buffer layout matching this array, suitable for a
    // createRenderPipeline call.
    vertexBufferLayout(): GPUVertexBufferLayout {
        return {
            arrayStride: this.stride(),
            attributes: this.etype.vertexAttributes(),
        }
    }
}

// Description of a given member of a WGSL struct.
type MemberDesc<T> = {
    // Index of the field in the struct is mandatory, to reduce renaming and moving mistakes.
    idx: number;
    type: T;
}

// Extract the WGSL type class of a field descriptor.
type MemberWGSLType<F> = F extends MemberDesc<infer T> ? T : never;
// Extract the javascript type from a WGSL type (e.g., F32Type -> number).
export type WGSLJSType<F> = F extends WGSLType<infer T> ? T : never;

// Description of the list of members of a struct, for StructType constructor.
type MemberDescMap = { [k: string]: MemberDesc<any> }

// Details about each field of the struct.
export type Member<T> = {
    type: WGSLType<T>,
    idx: number,
    name: string
    sizeOf: number
    alignOf: number
    offset: number
}

// Description of a WGSL struct allowing mapping between javascript and WGSL.
// An instance of a StructType describes just the layout of the struct:
//  - The MemberDescMap (aka MDM) describes the list of members - name, position in
//    the struct.
//  - StructJSType<StructType<MDM>> describes javascript object, which member
//    names are the same as the struct. The type of the value are the typescript
//    types corresponding to the WGSL values - e.g., a `f32` is mapped to a number.
export class StructType<MDM extends MemberDescMap> extends WGSLType<MemberDescMapJSType<MDM>> {
    // Info about each single field.
    public members: MemberMap<MDM>;

    private byIndex: Member<any>[];
    private _byteSize: number;
    private _alignOf: number;

    // Module when using this struct for a variable.
    private typemod?: lang.WGSLModule;
    // Module when using this struct for a vertex buffer.
    private vertexmod?: lang.WGSLModule;

    constructor(membersdesc: MDM) {
        super();
        this.members = {} as MemberMap<MDM>;
        this.byIndex = [];

        if (Object.keys(membersdesc).length < 1) {
            // Not sure if empty struct are valid in WGSL - in the mean time,
            // reject.
            throw new Error("struct must have at least one member");
        }

        for (const [name, memberdesc] of Object.entries(membersdesc)) {
            if (this.byIndex[memberdesc.idx]) {
                throw new Error(`member index ${memberdesc.idx} is duplicated`);
            }
            const member = {
                name,
                idx: memberdesc.idx,
                type: memberdesc.type,
                // No support for @size & @align attributes for now.
                sizeOf: memberdesc.type.byteSize(),
                alignOf: memberdesc.type.alignOf(),
                // Calculated below
                offset: 0,
            }
            this.members[name as keyof MemberMap<MDM>] = member;
            this.byIndex[memberdesc.idx] = member;
        }

        // Struct offsets, size and aligns are non-trivial - see
        // https://gpuweb.github.io/gpuweb/wgsl/#structure-member-layout

        this._byteSize = 0;
        this._alignOf = 0;
        for (const [idx, member] of this.byIndex.entries()) {
            if (!member) {
                throw new Error(`missing member index ${idx}`);
            }
            if (idx > 0) {
                const prev = this.byIndex[idx - 1];
                member.offset = member.alignOf * Math.ceil((prev.offset + prev.sizeOf) / member.alignOf);
            }
            this._alignOf = Math.max(this._alignOf, member.alignOf);
        }

        const last = this.byIndex[this.byIndex.length - 1];
        this._byteSize = this._alignOf * Math.ceil((last.offset + last.sizeOf) / this._alignOf);
    }

    byteSize() { return this._byteSize; }
    alignOf() { return this._alignOf; }

    // Take an object containg the value for each member, and write it
    // in the provided data view.
    dataViewSet(dv: DataView, offset: number, v: MemberDescMapJSType<MDM>): void {
        for (const member of this.byIndex) {
            member.type.dataViewSet(dv, offset + member.offset, v[member.name]);
        }
    }

    // Refer to that structure type in a WGSL fragment. It will take care of
    // creating a name and inserting the struct declaration as needed.
    typename(): lang.WGSLCode {
        if (!this.typemod) {
            this.typemod = this.genModule("buffer struct", false);
        }
        return wgsl`${new lang.WGSLRef(this.typemod, "structname")}`;
    }

    // Refer to that structure in a WGSL fragment. Similar to typename(), but it
    // will als insert the appropriate `location` info, making it suitable to
    // use for vertex buffer representation.
    // Location is mapped to the index of the fields.
    vertexType(): lang.WGSLCode {
        if (!this.vertexmod) {
            this.vertexmod = this.genModule("vertex struct", true);
        }
        return wgsl`${new lang.WGSLRef(this.vertexmod, "structname")}`;
    }

    private genModule(label: string, locations: boolean): lang.WGSLModule {
        const lines = [
            wgsl`// sizeOf: ${this.byteSize().toString()} ; alignOf: ${this.alignOf().toString()}\n`,
            wgsl`struct @@structname {\n`,
        ];

        for (const member of this.byIndex) {
            lines.push(wgsl`  // offset: ${member.offset.toString()} sizeOf: ${member.sizeOf.toString()} ; alignOf: ${member.alignOf.toString()}\n`,);
            let location = "";
            if (locations) {
                location = `@location(${member.idx}) `;
            }
            lines.push(wgsl`  ${location}${member.name}: ${member.type.typename()},\n`);
        }

        lines.push(wgsl`};\n`);
        return new lang.WGSLModule({
            label: label,
            code: wgsl`${lines}`,
        });
    }

    // Return a list of vertex attribute, suitable for a GPUVertexBufferLayout.
    // Location is mapped to the index of the fields.
    vertexAttributes(): GPUVertexAttribute[] {
        const attrs: GPUVertexAttribute[] = [];
        for (const m of this.byIndex) {
            attrs.push({
                shaderLocation: m.idx,
                format: m.type.vertexFormat(),
                offset: m.offset,
            });
        }
        return attrs;
    }

    // Creates a vertex buffer layout for this struct, suitable for a
    // createRenderPipeline call. This assume that this struct will be layed out
    // in a simple array to represent the vertex buffer.
    vertexBufferLayout(): GPUVertexBufferLayout {
        return {
            arrayStride: this.stride(),
            attributes: this.vertexAttributes(),
        }
    }
}

// A structure representing in javascript the content of the provided MemberDescMap.
type MemberDescMapJSType<MDM> = {
    [k in keyof MDM]: WGSLJSType<MemberWGSLType<MDM[k]>>;
}

// Extract the type a MemberDesc holds - e.g.,
//    MemberDescType<typeof {type: F32, idx:0}> -> F32
type MemberDescType<MD> = MD extends MemberDesc<infer T> ? T : never;

// MemberMap takes a MemberDescMap and creates a map to the full member info
// (instead of the initial MemberDesc info).
type MemberMap<MDM> = {
    [k in keyof MDM]: Member<MemberDescType<MDM[k]>>;
}

// Extract the member map for the given struct type.
export type StructMemberDescMap<ST> = ST extends StructType<infer MDM> ? MDM : never;

// Type definition for a mapping member name / javascript value, suitable to
// feed into a descriptor value. I.e., the actual structure as javascript.
type StructJSType<ST> = MemberDescMapJSType<StructMemberDescMap<ST>>;

//-----------------------------------------------
// Basic test

function testBuffer() {
    console.group("testBuffer");
    const uniformsDesc = new StructType({
        elapsedMs: { type: F32, idx: 0 },
        renderWidth: { type: F32, idx: 1 },
        renderHeight: { type: F32, idx: 2 },
        plop: { type: new ArrayType(F32, 4), idx: 3 },
    })

    console.log("byteSize", uniformsDesc.byteSize);
    console.log("content", uniformsDesc.createArray({
        elapsedMs: 10,
        renderWidth: 320,
        renderHeight: 200,
        plop: [1, 2, 3],
    }));

    const foo = new ArrayType(uniformsDesc, 4);

    const a = new ArrayBuffer(foo.byteSize());
    foo.dataViewSet(new DataView(a), 0, [
        { elapsedMs: 10, renderWidth: 320, renderHeight: 200, plop: [0, 1, 3] },
    ]);

    console.groupEnd();
}
// testBuffer();