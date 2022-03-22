import * as glmatrix from 'gl-matrix';

// Give information about pointer to help calculate camera transformation when
// modifying it.
export type MoveInfo = {
    // Position of the cursor / click.
    // Screen coordinate from [0, 1].
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
export class FirstPerson {
    private tr;
    private rot;

    constructor(tr: glmatrix.vec3 = glmatrix.vec3.fromValues(0, 0, 0), rot: glmatrix.vec3 = glmatrix.vec3.fromValues(0, 0, 0)) {
        this.tr = tr;
        this.rot = rot;
    }

    transform(camera: glmatrix.mat4, start?: MoveInfo, current?: MoveInfo) {
        const { tr, rot } = this.current(start, current);

        const q = glmatrix.quat.create();
        glmatrix.quat.fromEuler(q, rot[0], rot[1], rot[2]);
        const chg = glmatrix.mat4.create();
        glmatrix.mat4.fromRotationTranslation(chg, q, tr);
        glmatrix.mat4.mul(camera, camera, chg);
    }

    update(start: MoveInfo, end: MoveInfo) {
        const { tr, rot } = this.current(start, end);
        this.tr = tr;
        this.rot = rot;
    }

    reset() {
        this.tr = glmatrix.vec3.fromValues(0, 0, 0);
        this.rot = glmatrix.vec3.fromValues(0, 0, 0);
    }

    private current(start?: MoveInfo, end?: MoveInfo) {
        const tr = glmatrix.vec3.clone(this.tr);
        const rot = glmatrix.vec3.clone(this.rot);
        if (start && end) {
            if (end.shift) {
                glmatrix.vec3.add(tr, tr, glmatrix.vec3.fromValues(
                    20 * (end.x - start.x),
                    -20 * (end.y - start.y),
                    0,
                ));
            } else {
                glmatrix.vec3.add(rot, rot, glmatrix.vec3.fromValues(
                    -10 * Math.PI * (end.y - start.y),
                    -10 * Math.PI * (end.x - start.x),
                    0,
                ));
            }
        }
        return { tr, rot };
    }
}

