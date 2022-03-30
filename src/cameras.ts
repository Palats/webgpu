import * as glmatrix from 'gl-matrix';

// Give information about pointer to help calculate camera transformation when
// modifying it.
export type MoveInfo = {
    // Position of the cursor / click.
    // Screen coordinate from [0, 1].
    // X left to right. Y top to bottom.
    x: number;
    y: number;
    // Was shift pressed?
    shift: boolean;
    // The event that triggered this move.
    evt: PointerEvent;
}

export interface Camera {
    // Apply the transformations of this camera on the provided matrix,
    // including potential active pointer movement.
    // This does not update the state of this Camera object.
    transform(camera: glmatrix.mat4, start?: MoveInfo, current?: MoveInfo): void;

    // Update the state of this Camera object when the pointer operation is
    // finished.
    update(start: MoveInfo, end: MoveInfo): void;

    // Reset camera to initial stance.
    reset(): void;
}

// A null camera, doing nothing.
export class Null {
    transform(camera: glmatrix.mat4, start?: MoveInfo, current?: MoveInfo) { }
    update(start: MoveInfo, end: MoveInfo) { }
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

    transform(camera: glmatrix.mat4, start?: MoveInfo, current?: MoveInfo) {
        const q = glmatrix.quat.create();
        glmatrix.quat.fromEuler(q, this.rot[0], this.rot[1], this.rot[2]);
        const chg = glmatrix.mat4.create();
        glmatrix.mat4.fromRotationTranslation(chg, q, this.tr);
        glmatrix.mat4.mul(camera, camera, chg);
    }

    update(start: MoveInfo, end: MoveInfo) { }
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

    transform(camera: glmatrix.mat4, start?: MoveInfo, current?: MoveInfo) {
        const [eye, up] = this.currentEye(start, current);
        const view = glmatrix.mat4.lookAt(glmatrix.mat4.create(), eye, this.lookAt, up);
        glmatrix.mat4.mul(camera, camera, view);
    }

    update(start: MoveInfo, end: MoveInfo) {
        [this.eye, this.up] = this.currentEye(start, end);
    }

    // Return eye & up.
    private currentEye(start?: MoveInfo, end?: MoveInfo): [glmatrix.vec3, glmatrix.vec3] {
        if (!start || !end) {
            return [this.eye, this.up];
        }
        const eye = glmatrix.vec3.clone(this.eye);
        const up = glmatrix.vec3.clone(this.up);

        const right = glmatrix.vec3.sub(glmatrix.vec3.create(), this.lookAt, this.eye);
        glmatrix.vec3.cross(right, right, up);

        const angx = - (end.x - start.x) * 2 * Math.PI;
        const angy = - (end.y - start.y) * Math.PI;
        const r = glmatrix.mat4.fromRotation(glmatrix.mat4.create(), angx, up);
        glmatrix.mat4.rotate(r, r, angy, right);
        glmatrix.vec3.transformMat4(eye, eye, r);

        // This accumulate rotations on `up`, which likely leads to errors.
        glmatrix.vec3.transformMat4(up, up, r);
        glmatrix.vec3.transformMat4(right, right, r);
        return [eye, up];
    }
}

