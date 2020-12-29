import * as THREE from "three/src/Three";
import * as Cannon from "cannon"
import LabelMenuOption from "../menu_config/LabelMenuOption";
import TextOptionNode from "./TextOptionNode";

export default class LabelOptionNode extends TextOptionNode {
    private _startAnchor: Cannon.Body;
    private _endAnchor: Cannon.Body;
    private _startConstraint: CANNON.ConeTwistConstraint;
    private _endConstraint: CANNON.ConeTwistConstraint;


    constructor(menuOption: LabelMenuOption, world: Cannon.World, frustum: THREE.Frustum) {
        super(menuOption, world, frustum);
        const startLetter = this._letters[0];
        const endLetter = this._letters[this._letters.length - 1];

        this._startAnchor = new Cannon.Body({
            mass: 0,
            position: new Cannon.Vec3(
                startLetter.body.position.x - 1,
                startLetter.body.position.y + startLetter.geometry.boundingSphere.center.y,
                startLetter.geometry.boundingSphere.center.z
            ),
            shape: new Cannon.Sphere(0.01),
        });
        this._endAnchor = new Cannon.Body({
            mass: 0,
            position: new Cannon.Vec3(
                endLetter.body.position.x + 1,
                endLetter.body.position.y + endLetter.geometry.boundingSphere.center.y,
                endLetter.geometry.boundingSphere.center.z
            ),
            shape: new Cannon.Sphere(0.01),
        });

        this._startConstraint = new Cannon.ConeTwistConstraint(this._startAnchor, startLetter.body, {
            pivotA: new Cannon.Vec3(0.1, 0.2, 0.2),
            pivotB: new Cannon.Vec3(
                0,
                startLetter.geometry.boundingSphere.center.y,
                startLetter.geometry.boundingSphere.center.z
            )
        });

        this._endConstraint= new Cannon.ConeTwistConstraint(this._endAnchor, endLetter.body, {
            pivotA: new Cannon.Vec3(-endLetter.size.x/3 - 0.2, 0.2, 0.2),
            pivotB: new Cannon.Vec3(
                0,
                endLetter.geometry.boundingSphere.center.y,
                endLetter.geometry.boundingSphere.center.z
            )
        });

        this._world.addConstraint(this._startConstraint);
        this._world.addConstraint(this._endConstraint);
        this._world.addBody(this._startAnchor);
        this._world.addBody(this._endAnchor);
    }

    fall(): void {
        this._world.remove(this._startAnchor);
        this._world.remove(this._endAnchor);
        this._world.removeConstraint(this._startConstraint);
        this._world.removeConstraint(this._endConstraint);
    }

    onClick(intersection: THREE.Intersection): boolean {
        for(let letter of this._letters) {
            if(letter === intersection.object) {
                const face = intersection.face;
                const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-10);
                letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                return false;
            }
        }
        return false;
    }

    translateY(offset: number): void {
        super.translateY(offset);
        this._startAnchor.position.y += offset;
        this._endAnchor.position.y += offset;
    }

    translateX(offset: number): void {
        super.translateX(offset);
        this._startAnchor.position.x += offset;
        this._endAnchor.position.x += offset;
    }

    onDestroy() {
        this._letters.forEach(letter => {
            this._world.remove(letter.body);
        })
    }
}
