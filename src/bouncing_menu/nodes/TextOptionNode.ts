import BodyMesh from "../../utils/BodyMesh";
import * as Cannon from "cannon";
import * as THREE from "three";
import LabelMenuOption from "../menu_config/LabelMenuOption";
import {TextBufferGeometry} from "three";
import {MeshLambertMaterial} from "three";
import OptionNode from "./OptionNode";

export default abstract class TextOptionNode extends OptionNode{
    protected _letters= new Array<BodyMesh>();
    protected _world: Cannon.World;
    protected _frustum: THREE.Frustum;

    protected _letterMaterial = new Cannon.Material("letter");

    protected _height = 0;
    protected _width = 0;

    constructor(menuOption: LabelMenuOption, world: Cannon.World, frustum: THREE.Frustum) {
        super();
        this._frustum = frustum;
        let lastOffset = 0;
        this._world = world;
        Array.from(menuOption.name).forEach((value, index) => {
            const material = new THREE.MeshLambertMaterial({color: menuOption.color});
            const geometry = new THREE.TextBufferGeometry(value, menuOption.textSettings);
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            const letterMesh: BodyMesh<TextBufferGeometry, MeshLambertMaterial> = new THREE.Mesh(geometry, material);

            this._letters.push(letterMesh);
            letterMesh.size = geometry.boundingBox.getSize(new THREE.Vector3());
            const {x, y, z} = letterMesh.size;
            const letterBox = new Cannon.Box(new Cannon.Vec3(x / 2, y / 2, z / 2));
            letterMesh.body = new Cannon.Body(({
                mass: 1 / menuOption.name.length,
                position: new Cannon.Vec3(lastOffset, 0, 0),
                angularDamping: 0.99,
                material: this._letterMaterial,
            }));

            const {center} = geometry.boundingSphere;
            letterMesh.body.addShape(letterBox, new Cannon.Vec3(center.x, center.y, center.z));
            world.addBody(letterMesh.body);

            this._height = Math.max(y, this._height);

            letterMesh.body.position.x += lastOffset;
            lastOffset += x / 2;
            this._group.add(letterMesh);

            if (index > 0) {

                const constraint = new Cannon.ConeTwistConstraint(this._letters[index - 1].body, this._letters[index].body, {
                    pivotA: new Cannon.Vec3(this._letters[index - 1].size.x, 0, 0),
                    pivotB: new Cannon.Vec3(0, 0, 0),
                    maxForce: 1e30,
                });
                constraint.collideConnected = true;
                world.addConstraint(constraint);
            }
        });
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
    }

    translateX(offset: number): void {
        this._letters.forEach(letter => {
            letter.body.position.x += offset;
        });
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

    onClick(intersection: THREE.Intersection): boolean {
        return false;
    }

    onDestroy() {
        this._letters.forEach(letter => {
            this._world.remove(letter.body);
        })
    }

    visible(): boolean {
        return this._letters.some(letter => {
            return this._frustum.containsPoint(letter.position);
        })
    }
}
