import TextOptionNode from "./TextOptionNode";
import * as Cannon from "cannon";
import * as THREE from "three";
import TextMenuOption from "../menu_config/TextMenuOption";

export default class HangedTextNode extends TextOptionNode{
    private startAnchor: Cannon.Body;
    private endAnchor: Cannon.Body;
    private startConstraint: CANNON.ConeTwistConstraint;
    private endConstraint: CANNON.ConeTwistConstraint;

    constructor(menuOption: TextMenuOption, world: Cannon.World, frustum: THREE.Frustum) {
        super(menuOption, world, frustum);

        const startLetter = this.letters[0];
        const endLetter = this.letters[this.letters.length - 1];

        this.startAnchor = new Cannon.Body({
            mass: 0,
            position: new Cannon.Vec3(
                startLetter.body.position.x - 1,
                startLetter.body.position.y + startLetter.geometry.boundingSphere.center.y,
                startLetter.geometry.boundingSphere.center.z
            ),
            shape: new Cannon.Sphere(0.01),
        });
        this.endAnchor = new Cannon.Body({
            mass: 0,
            position: new Cannon.Vec3(
                endLetter.body.position.x + 1,
                endLetter.body.position.y + endLetter.geometry.boundingSphere.center.y,
                endLetter.geometry.boundingSphere.center.z
            ),
            shape: new Cannon.Sphere(0.01),
        });

        this.startConstraint = new Cannon.ConeTwistConstraint(this.startAnchor, startLetter.body, {
            pivotA: new Cannon.Vec3(0.1, 0.2, 0.2),
            pivotB: new Cannon.Vec3(
                0,
                startLetter.geometry.boundingSphere.center.y,
                startLetter.geometry.boundingSphere.center.z
            )
        });

        this.endConstraint= new Cannon.ConeTwistConstraint(this.endAnchor, endLetter.body, {
            pivotA: new Cannon.Vec3(-endLetter.size.x/3 - 0.5, 0.2, 0.2),
            pivotB: new Cannon.Vec3(
                0,
                endLetter.geometry.boundingSphere.center.y,
                endLetter.geometry.boundingSphere.center.z
            )
        });

        this.world.addConstraint(this.startConstraint);
        this.world.addConstraint(this.endConstraint);
        this.world.addBody(this.startAnchor);
        this.world.addBody(this.endAnchor);
    }

    onClick(intersection: THREE.Intersection): boolean {
        for(let letter of this.letters) {
            if(letter === intersection.object) {
                const face = intersection.face;
                const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-10);
                letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                return true;
            }
        }
        return false;
    }

    fall(): void {
        this.world.remove(this.startAnchor);
        this.world.remove(this.endAnchor);
        this.world.removeConstraint(this.startConstraint);
        this.world.removeConstraint(this.endConstraint);
    }

    translateY(offset: number): void {
        super.translateY(offset);
        this.startAnchor.position.y += offset;
        this.endAnchor.position.y += offset;
    }

    translateX(offset: number): void {
        super.translateX(offset);
        this.startAnchor.position.x += offset;
        this.endAnchor.position.x += offset;
    }
}
