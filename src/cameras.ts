import * as glmatrix from 'gl-matrix';

export type CameraMoveInfo = {
    // Position of the cursor / click.
    // Screen coordinate from [0, 1].
    x: number;
    y: number;
    // Was shift pressed?
    shift: boolean;
    // The event that triggered this move.
    evt: PointerEvent;
}

export class Camera {
    private tr = glmatrix.vec3.fromValues(0, 0, 0);
    private rot = glmatrix.vec3.fromValues(0, 0, 0);

    // Apply the transformations of this camera on the provided matrix,
    // including potential active pointer movement.
    // This does not update the state of this Camera object.
    chain(camera: glmatrix.mat4, start?: CameraMoveInfo, current?: CameraMoveInfo) {
        const { tr, rot } = this.current(start, current);

        const q = glmatrix.quat.create();
        glmatrix.quat.fromEuler(q, rot[0], rot[1], rot[2]);
        const chg = glmatrix.mat4.create();
        glmatrix.mat4.fromRotationTranslation(chg, q, tr);
        glmatrix.mat4.mul(camera, camera, chg);
    }

    // Update the state of this Camera object when the pointer operation is
    // finished.
    update(start: CameraMoveInfo, end: CameraMoveInfo) {
        const { tr, rot } = this.current(start, end);
        this.tr = tr;
        this.rot = rot;
    }

    // Reset camera to initial stance.
    reset() {
        this.tr = glmatrix.vec3.fromValues(0, 0, 0);
        this.rot = glmatrix.vec3.fromValues(0, 0, 0);
    }

    private current(start?: CameraMoveInfo, end?: CameraMoveInfo) {
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

