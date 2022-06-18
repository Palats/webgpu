/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import { vec3, mat4 } from 'gl-matrix';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as models from '../models';
import * as grouprender from '../grouprender';
import * as wg from '../../src';

// ---- Demo parameter

export const demo = {
    id: "manyducks",
    caption: "Multiple rotating ducks",

    async init(params: demotypes.InitParams) {
        const d = new Demo(params);
        return (f: demotypes.FrameInfo) => d.draw(f);
    }
}

const depthFormat = "depth24plus";

export const boidStateDesc = new wg.StructType({
    position: { idx: 0, type: wg.Vec3f32 },
    // units per milliseconds.
    velocity: { idx: 1, type: wg.Vec3f32 },
    // current rotation as quaternion.
    rotation: { idx: 2, type: wg.Vec4f32 },
});

const computeBG = new wg.layout.BindGroup({
    label: "data for compute",
    visibility: GPUShaderStage.COMPUTE,
    entries: {
        demo: { buffer: { type: 'uniform', wgtype: shaderlib.demoDesc } },
        boidsSrc: { buffer: { type: 'read-only-storage', wgtype: new wg.ArrayType(boidStateDesc) } },
        boidsDst: { buffer: { type: 'storage', wgtype: new wg.ArrayType(boidStateDesc) } },
        instances: { buffer: { type: 'storage', wgtype: new wg.ArrayType(grouprender.instanceStateDesc) } },
    },
});

const computeLayout = new wg.layout.Pipeline({
    label: "compute",
    entries: {
        all: { bindGroup: computeBG },
    }
});


class Demo {
    params: demotypes.InitParams;
    demoBuffer: shaderlib.DemoBuffer;
    groupRenderer: grouprender.GroupRenderer;

    camera: cameras.ArcBall;
    showBasis = true;
    basisBundle: GPURenderBundle;
    depthTextureView: GPUTextureView;

    private instances: number = 100;
    private box = 2.0;
    private duckScale = 0.1;
    private boidsStateBuffer1: GPUBuffer;
    private boidsStateBuffer2: GPUBuffer;
    private computePipeline: GPUComputePipeline;

    // Swap buffer state. true == 1->2.
    private isForward = true;

    constructor(params: demotypes.InitParams) {
        this.params = params;
        this.demoBuffer = new shaderlib.DemoBuffer(params);
        this.groupRenderer = new grouprender.GroupRenderer({
            demoParams: params,
            demoBuffer: this.demoBuffer,
            instances: this.instances,
            depthFormat: depthFormat,
        });

        const lightFolder = params.gui.addFolder("light");
        lightFolder.add(this.groupRenderer, 'useLight').name("use");
        lightFolder.add(this.groupRenderer, 'lightX', -20, 20).name("x");
        lightFolder.add(this.groupRenderer, 'lightY', -20, 20).name("y");
        lightFolder.add(this.groupRenderer, 'lightZ', -20, 20).name("z");
        params.gui.add(this, 'showBasis');
        params.gui.add(this.groupRenderer, 'debugCoords');

        // Setup basic render.
        this.depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();

        // Orthonormals.
        this.basisBundle = shaderlib.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: shaderlib.ortholines,
            demoBuffer: this.demoBuffer,
        });

        // Configuring camera.
        this.camera = new cameras.ArcBall(vec3.fromValues(0, 0, 4));
        params.setCamera(this.camera);

        // Configuring boid buffers and the like.
        this.boidsStateBuffer1 = this.params.device.createBuffer({
            label: "boid state 1",
            size: (new wg.ArrayType(boidStateDesc, this.instances)).byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        this.boidsStateBuffer2 = this.params.device.createBuffer({
            label: "boid state 2",
            size: (new wg.ArrayType(boidStateDesc, this.instances)).byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        // Set some random starting positions.
        const aDesc = new wg.types.ArrayType(boidStateDesc, this.instances);
        const objData: wg.types.WGSLJSType<typeof aDesc> = [];
        for (let i = 0; i < this.instances; i++) {
            objData.push({
                position: [
                    (Math.random() - 0.5) * this.box * 2,
                    (Math.random() - 0.5) * this.box * 2,
                    // (Math.random() - 0.5) * this.box * 2,
                    0,
                ],
                velocity: [
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    // (Math.random() - 0.5) * 0.1,
                    0,
                ],
                rotation: [
                    0, 0, 0, 0,
                ],
            });
        }
        this.params.device.queue.writeBuffer(this.boidsStateBuffer1, 0, aDesc.createArray(objData));

        // Create a pipeline to update boids state.
        this.computePipeline = this.params.device.createComputePipeline({
            label: "boids compute pipeline",
            layout: computeLayout.layout(this.params.device),
            compute: {
                entryPoint: "main",
                module: this.buildComputeShader(),
            }
        });

        // And trigger model loading.
        this.load();
    }

    async load() {
        const u = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';
        const cpuMeshes = await models.loadGLTF(u);
        const gpuMeshes = await Promise.all(cpuMeshes.map(m => models.buildGPUMesh(this.params, m)));
        this.groupRenderer.setMeshes(gpuMeshes);
    }

    buildComputeShader() {
        const refs = computeLayout.wgsl().all;
        return this.params.device.createShaderModule(new wg.WGSLModule({
            label: "boids compute shader",
            // Inspiration from
            //  https://en.wikipedia.org/wiki/Boids
            //  https://github.com/austinEng/webgpu-samples/blob/main/src/sample/computeBoids/updateSprites.wgsl
            code: wg.wgsl`
                @stage(compute) @workgroup_size(8, 1)
                fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                    // Guard against out-of-bounds work group sizes
                    if (global_id.x >= ${this.instances.toFixed(0)}u || global_id.y >= 1u) {
                        return;
                    }

                    let idx = global_id.x;
                    let src = ${refs.boidsSrc}[idx];
                    let cPos = src.position;
                    let cVel = src.velocity;

                    var mSep = vec3<f32>(0.);

                    var mVel = vec3<f32>(0.);
                    var mVelCount = 0.;

                    var mMass = vec3<f32>(0.);
                    var mMassCount = 0.;


                    for(var i: u32 = 0; i < ${this.instances.toFixed(0)}u; i++) {
                        if (i == idx) { continue; }
                        let other = ${refs.boidsSrc}[i];
                        let dist = distance(other.position, cPos);

                        // separation [R2]: steer to avoid crowding local flockmates
                        if (dist < 0.025) {
                            mSep += cPos - other.position;
                        }

                        // alignment [R3]: steer towards the average heading of local flockmates
                        if (dist < 0.025) {
                            mVel += other.velocity;
                            mVelCount += 1.0;
                        }

                        // cohesion [R1]: steer to move towards the average position (center of mass) of local flockmates
                        if (dist < 0.1) {
                            mMass += other.position;
                            mMassCount += 1.0;
                        }
                    }

                    var velSeparation = mSep;

                    var velAlignment = vec3<f32>(0.);
                    if (mVelCount > 0.) {
                        velAlignment = mVel / mVelCount;
                    }

                    var velCohesion = vec3<f32>(0.);
                    if (mMassCount > 0.) {
                        velCohesion = (mMass / mMassCount) - cPos;
                    }

                    var vel = cVel + 0.05 * velSeparation + 0.005 * velAlignment + 0.02 * velCohesion;
                    let len = length(vel);
                    vel = clamp(len, 0., 0.1) * vel / len;

                    var pos = cPos + (${refs.demo}.deltaMs / 100.) * vel;

                    let m = ${this.box.toFixed(1)};
                    if (pos.x < -m) { pos.x = m;}
                    if (pos.x > m) { pos.x = -m;}
                    if (pos.y < -m) { pos.y = m;}
                    if (pos.y > m) { pos.y = -m;}
                    if (pos.z < -m) { pos.z = m;}
                    if (pos.z > m) { pos.z = -m;}

                    // Calculate rotation to align toward velocity.
                    var cRot = src.rotation;
                    if (cRot.x == 0. && cRot.y == 0. && cRot.z == 0. && cRot.w == 0.) {
                        // Initial rotation for the velocity vector on initialization.
                        cRot = ${shaderlib.tr.refs.quatRotation}(normalize(vec3<f32>(1., 0., 0.)), normalize(cVel));
                    }

                    let q = ${shaderlib.tr.refs.quatRotation}(normalize(cVel), normalize(vel));
                    let rot = ${shaderlib.tr.refs.quatMul}(cRot, q);

                    ${refs.boidsDst}[idx].position = pos;
                    ${refs.boidsDst}[idx].velocity = vel;
                    ${refs.boidsDst}[idx].rotation = rot;

                    ${refs.instances}[idx].rotation = rot;
                    ${refs.instances}[idx].position = pos;
                    let scale = ${this.duckScale.toFixed(3)};
                    ${refs.instances}[idx].scale = vec3<f32>(scale, scale, scale);
                }
            `,
        }).toDesc());
    }

    // -- Single frame rendering.
    async draw(info: demotypes.FrameInfo) {
        const viewproj = mat4.perspective(
            mat4.create(),
            2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
            this.params.renderWidth / this.params.renderHeight, // aspect
            1.0, // near
            100.0, // far
        );
        this.camera.transform(viewproj, info.cameraMvt);

        this.demoBuffer.refresh(info, viewproj);

        const commandEncoder = this.params.device.createCommandEncoder();
        commandEncoder.pushDebugGroup('Frame time ${info.elapsedMs}');

        // Update boids state, only if a real frame advanced.
        if (info.deltaMs > 0 && info.deltaMs < 1000) {
            const computeEncoder = commandEncoder.beginComputePass({});
            computeLayout.setBindGroups(computeEncoder, {
                all: computeBG.Create(this.params.device, {
                    demo: this.demoBuffer.buffer,
                    boidsSrc: this.isForward ? this.boidsStateBuffer1 : this.boidsStateBuffer2,
                    boidsDst: this.isForward ? this.boidsStateBuffer2 : this.boidsStateBuffer1,
                    instances: this.groupRenderer.instancesStateBuffer,
                }),
            });
            computeEncoder.setPipeline(this.computePipeline);
            const c = Math.ceil(this.instances / 8);
            computeEncoder.dispatchWorkgroups(c);
            computeEncoder.end();

            this.isForward = !this.isForward;
        }

        // Generate the state for the group renderer.
        this.groupRenderer.compute(info, commandEncoder);

        const renderEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.params.context.getCurrentTexture().createView(),
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }],
            depthStencilAttachment: {
                view: this.depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });
        this.groupRenderer.draw(info, renderEncoder);
        if (this.showBasis) { renderEncoder.executeBundles([this.basisBundle]); }
        renderEncoder.end();

        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}