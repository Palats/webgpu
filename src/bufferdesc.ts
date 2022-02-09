// This file contains an attempt at making it easier to manipulate basic
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

// Specify that a field stores a WSGL `f32`.
export const F32 = new F32Type();

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