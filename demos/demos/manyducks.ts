/// <reference types="@webgpu/types" />
import * as demotypes from '../demotypes';
import { vec3, mat4 } from 'gl-matrix';
import * as shaderlib from '../shaderlib';
import * as cameras from '../cameras';
import * as models from '../models';
import * as grouprender from '../grouprender';

// ---- Demo parameter

export const demo = {
    id: "manyducks",
    caption: "Multiple rotating ducks",

    async init(params: demotypes.InitParams) {
        const d = new Demo(params);
        return (f: demotypes.FrameInfo) => d.draw(f);
    }
}


// ---- Rendering setup & UI

const depthFormat = "depth24plus";

class Demo {
    params: demotypes.InitParams;
    demoBuffer: shaderlib.DemoBuffer;
    groupRenderer: grouprender.GroupRenderer;

    camera: cameras.ArcBall;
    showBasis = true;
    basisBundle: GPURenderBundle;
    depthTextureView: GPUTextureView;

    constructor(params: demotypes.InitParams) {
        this.params = params;
        this.demoBuffer = new shaderlib.DemoBuffer(params);
        this.groupRenderer = new grouprender.GroupRenderer({
            demoParams: params,
            demoBuffer: this.demoBuffer,
            instances: 100,
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

        this.groupRenderer.setPosition();

        this.load();
    }

    async load() {
        const u = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';
        const cpuMeshes = await models.loadGLTF(u);
        const gpuMeshes = await Promise.all(cpuMeshes.map(m => models.buildGPUMesh(this.params, m)));
        this.groupRenderer.setMeshes(gpuMeshes);
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

        const computeEncoder = commandEncoder.beginComputePass({});
        this.groupRenderer.compute(info, computeEncoder);
        computeEncoder.end();

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