import * as THREE from "three/src/Three";
import * as Cannon from "cannon"
import OptionNode from "./OptionNode";
import CallbackMenuOption from "../menu_config/CallbackMenuOption";
import BodyMesh from "../../utils/BodyMesh";
import {MeshLambertMaterial, TextBufferGeometry} from "three/src/Three";

export default class CallbackOptionNode extends OptionNode {
    private _letters= new Array<BodyMesh>();
    private _ground: Cannon.Body;
    private _world: Cannon.World;

    private _groundMaterial = new Cannon.Material("ground");
    private _letterMaterial = new Cannon.Material("letter");

    private _height = 0;
    private _width = 0;

    public readonly GROUND_HEIGHT = 0.1;

    constructor(menuOption: CallbackMenuOption, world: Cannon.World) {
        super();
        let lastOffset = 0;
        this._world = world;
        Array.from(menuOption.name).forEach((value, index) => {
            const material = new THREE.MeshLambertMaterial({color: menuOption.color});
            const geometry = new THREE.TextBufferGeometry(value, menuOption.textSettings);
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();

            const letterMesh: BodyMesh<TextBufferGeometry, MeshLambertMaterial>= new THREE.Mesh(geometry, material);

            this._letters.push(letterMesh);
            letterMesh.size = geometry.boundingBox.getSize(new THREE.Vector3());
            const {x, y, z} = letterMesh.size;
            const letterBox = new Cannon.Box(new Cannon.Vec3(x/2, y/2, z/2));
            letterMesh.body = new Cannon.Body(({
                mass: 1/menuOption.name.length,
                position: new Cannon.Vec3(lastOffset, 0, 0),
                angularDamping: 0.99,
                material: this._letterMaterial,
            }));

            const {center} = geometry.boundingSphere;
            letterMesh.body.addShape(letterBox, new Cannon.Vec3(center.x, center.y, center.z));
            world.addBody(letterMesh.body);

            this._height = Math.max(y, this._height);

            letterMesh.body.position.x += lastOffset;
            letterMesh.body.position.y += this.GROUND_HEIGHT;
            lastOffset += x/2;
            this._group.add(letterMesh);

            if(index > 0) {

                const constraint = new Cannon.ConeTwistConstraint(this._letters[index-1].body, this._letters[index].body, {
                    pivotA: new Cannon.Vec3(this._letters[index-1].size.x, 0, 0),
                    pivotB: new Cannon.Vec3(0, 0, 0),
                    maxForce: 1e30,
                });
                constraint.collideConnected = true;
                world.addConstraint(constraint);
            }
        });

        this._ground = new Cannon.Body({
            mass: 0,
            shape: new Cannon.Box(new Cannon.Vec3(lastOffset*2+2, this.GROUND_HEIGHT, 50)),
            position: new Cannon.Vec3(lastOffset/2, 0, -5),
            material: this._groundMaterial
        });
        world.addBody(this._ground);

        const contact = new Cannon.ContactMaterial(this._letterMaterial, this._groundMaterial, {
            friction: 0.002,
            frictionEquationStiffness: 1e6,
            frictionEquationRelaxation: 3,
            restitution: 0.2,
            contactEquationStiffness: 1e20,
            contactEquationRelaxation: 3,
        });
        world.addContactMaterial(contact);
        this._width = lastOffset;
    }

    getHeight(): number {
        return this._height;
    }

    getWidth(): number {
        return this._width
    }

    translateY(offset: number): void {
        this._letters.forEach(letter => {
            letter.body.position.y += offset;
        });
        this._ground.position.y += offset;
    }

    translateX(offset: number): void {
        this._letters.forEach(letter => {
            letter.body.position.x += offset;
        });
        this._ground.position.x += offset;
    }

    update(deltaTime: number): void {
        this._letters.forEach(letter => {
            {
                const {x, y, z} = letter.body.position;
                letter.position.set(x, y, z);
            }
            {
                const {x, y, z, w} = letter.body.quaternion;
                letter.quaternion.set(x, y, z, w);
            }
        })
    }

    fall(): void {
        this._world.remove(this._ground);
    }

    onClick(intersection: THREE.Intersection): boolean {
        for(let letter of this._letters) {
            if(letter === intersection.object) {
                const face = intersection.face;
                const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-60);
                letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                return true;
            }
        }
        return false;
    }
}
