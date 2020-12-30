import * as THREE from "three";
import * as Cannon from "cannon"
import CallbackMenuOption from "../menu_config/CallbackMenuOption";
import TextOptionNode from "./TextOptionNode";

export default class CallbackOptionNode extends TextOptionNode {
    protected _ground: Cannon.Body;
    public readonly GROUND_HEIGHT = 0.1;
    private _callback: () => void;

    private _groundMaterial = new Cannon.Material("ground");
    private _contact: CANNON.ContactMaterial;

    constructor(menuOption: CallbackMenuOption, world: Cannon.World, frustum: THREE.Frustum) {
        super(menuOption, world, frustum);
        this._callback = menuOption.callback;
        this._letters.forEach(letter => {
            letter.body.position.y += this.GROUND_HEIGHT * 8;
        });
        this._ground = new Cannon.Body({
            mass: 0,
            shape: new Cannon.Box(new Cannon.Vec3(this._width * 2 + 2, this.GROUND_HEIGHT, 50)),
            position: new Cannon.Vec3(this._width / 2, 0, -5),
            material: this._groundMaterial
        });
        world.addBody(this._ground);

        this._contact = new Cannon.ContactMaterial(this._letterMaterial, this._groundMaterial, {
            friction: 0.002,
            frictionEquationStiffness: 1e6,
            frictionEquationRelaxation: 3,
            restitution: 0.2,
            contactEquationStiffness: 1e20,
            contactEquationRelaxation: 3,
        });
        world.addContactMaterial(this._contact);
    }

    onClick(intersection: THREE.Intersection): boolean {
        for(let letter of this._letters) {
            if(letter === intersection.object) {
                const face = intersection.face;
                const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-60);
                letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                this._callback();
                return true;
            }
        }
        return false;
    }

    fall(): void {
        this._world.remove(this._ground);
    }


    translateY(offset: number): void {
        super.translateY(offset);
        this._ground.position.y += offset;
    }

    translateX(offset: number): void {
        super.translateX(offset);

        this._ground.position.x += offset;
    }

    onDestroy() {
        super.onDestroy();
        this._world.remove(this._ground);
    }
}
