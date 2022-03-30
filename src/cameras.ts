import * as glmatrix from 'gl-matrix';

// Give information about pointer to help calculate camera transformation when
// modifying it.
export type MoveInfo = {
    // Position of the cursor / click.
    // Screen coordinate from [0, 1].
    // X left to right. Y top to bottom.
    deltaX?: number;
    deltaY?: number;
    // Changes in zoom (mouse wheel), normalized to display height.
    // Negative when zooming, positive when unzooming.
    deltaZoom?: number;
    // Was shift pressed?
    shift: boolean;
}

export interface Camera {
    // Apply the transformations of this camera on the provided matrix,
    // including potential active pointer movement.
    // This does not update the state of this Camera object.
    transform(camera: glmatrix.mat4, mvt?: MoveInfo): void;

    // Update the state of this Camera object when the pointer operation is
    // finished.
    update(mvt: MoveInfo): void;

    // Reset camera to initial stance.
    reset(): void;
}

// A null camera, doing nothing.
export class Null {
    transform(camera: glmatrix.mat4, mvt?: MoveInfo) { }
    update(mvt: MoveInfo) { }
    reset() { }
}

// A static camera, which cannot be moved.
export class Static {
    private tr;
    private rot;

    constructor(tr: glmatrix.vec3 = glmatrix.vec3.fromValues(0, 0, 0), rot: glmatrix.vec3 = glmatrix.vec3.fromValues(0, 0, 0)) {
        this.tr = tr;
        this.rot = rot;
    }

    transform(camera: glmatrix.mat4, mvt?: MoveInfo) {
        const q = glmatrix.quat.create();
        glmatrix.quat.fromEuler(q, this.rot[0], this.rot[1], this.rot[2]);
        const chg = glmatrix.mat4.create();
        glmatrix.mat4.fromRotationTranslation(chg, q, this.tr);
        glmatrix.mat4.mul(camera, camera, chg);
    }

    update(mvt: MoveInfo) { }
    reset() { }
}


// A camera where the pointer allows to rotate from the current position.
// Inspiration from http://asliceofrendering.com/camera/2019/11/30/ArcballCamera/
export class ArcBall {
    private eye!: glmatrix.vec3;
    private up!: glmatrix.vec3;

    private lookAt: glmatrix.vec3;
    private startEye: glmatrix.vec3;


    constructor(eye: glmatrix.vec3, lookAt: glmatrix.vec3 = glmatrix.vec3.fromValues(0, 0, 0)) {
        this.lookAt = lookAt;
        this.startEye = eye;
        this.reset();
    }

    reset() {
        this.eye = this.startEye;
        this.up = glmatrix.vec3.fromValues(0, 1, 0);
    }

    transform(camera: glmatrix.mat4, mvt?: MoveInfo) {
        const [eye, up] = this.currentEye(mvt);
        const view = glmatrix.mat4.lookAt(glmatrix.mat4.create(), eye, this.lookAt, up);
        glmatrix.mat4.mul(camera, camera, view);
    }

    update(mvt: MoveInfo) {
        [this.eye, this.up] = this.currentEye(mvt);
    }

    // Return eye & up.
    private currentEye(mvt?: MoveInfo): [glmatrix.vec3, glmatrix.vec3] {
        if (!mvt) {
            return [this.eye, this.up];
        }
        const eye = glmatrix.vec3.clone(this.eye);
        const up = glmatrix.vec3.clone(this.up);

        const lookVec = glmatrix.vec3.sub(glmatrix.vec3.create(), this.lookAt, this.eye);
        glmatrix.vec3.normalize(lookVec, lookVec);
        const right = glmatrix.vec3.cross(glmatrix.vec3.create(), lookVec, up);

        const r = glmatrix.mat4.create();
        if (mvt.deltaX) {
            const angx = -mvt.deltaX * 2 * Math.PI;
            glmatrix.mat4.rotate(r, r, angx, up);
        }
        if (mvt.deltaY) {
            const angy = -mvt.deltaY * Math.PI;
            glmatrix.mat4.rotate(r, r, angy, right);
        }
        glmatrix.vec3.transformMat4(eye, eye, r);
        if (mvt.deltaZoom) {
            glmatrix.vec3.add(eye, eye, glmatrix.vec3.scale(glmatrix.vec3.create(), lookVec, -10 * mvt.deltaZoom))
        }
        // This accumulate rotations on `up`, which likely leads to errors.
        glmatrix.vec3.transformMat4(up, up, r);
        return [eye, up];
    }
}

