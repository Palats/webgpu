// A WebGPU helper libraries. For now, providers:
//   - WGSLModule: A way to import / manage a library of reusable WGSL code.
//   - A way to manage mapping between Javascript types and WGSL types, for
//     simple buffer translation.

export * as types from './types';
export * as lang from './lang';
export * as layout from './layout';

export {
    WGSLModule,
    wgsl,
} from './lang';

export {
    U16,
    U32, U32Max,
    I32, I32Max,
    F32,
    StructType,
    ArrayType,
    Mat4x4F32,
    Vec2f32,
    Vec3f32,
    Vec4f32,
} from './types';