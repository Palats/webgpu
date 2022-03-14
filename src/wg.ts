// A WebGPU helper libraries. For now, providers:
//   - WGSLModule: A way to import / manage a library of reusable WGSL code.
//   - A way to manage mapping between Javascript types and WGSL types, for
//     simple buffer translation.

export * as types from './wg/types';
export * as lang from './wg/lang';

export {
    WGSLModule,
    wgsl,
} from './wg/lang';

export {
    Member,
    U16,
    U32,
    F32,
    StructType,
    ArrayType,
    Mat4x4F32,
    Vec3f32,
    Vec4f32,
} from './wg/types';