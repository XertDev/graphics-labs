import BodyMesh from "../../utils/BodyMesh";
import * as Cannon from "cannon";
import * as THREE from "three";
import {TextBufferGeometry} from "three";
import {MeshLambertMaterial} from "three";
import OptionNode from "./OptionNode";
import TextMenuOption from "../menu_config/TextMenuOption";

export default abstract class TextOptionNode extends OptionNode {
    protected letters= new Array<BodyMesh>();
    protected world: Cannon.World;
    protected frustum: THREE.Frustum;

    protected letterMaterial = new Cannon.Material("letter");

    public readonly height;
    public readonly width;

    protected constructor(menuOption: TextMenuOption, world: Cannon.World, frustum: THREE.Frustum) {
        super();

        this.frustum = frustum;
        this.world = world;

        let lastOffset = 0;
        let height = 0;
        Array.from(menuOption.name).forEach((value, index) => {
            const material = new THREE.MeshLambertMaterial({color: menuOption.color});
            const geometry = new THREE.TextBufferGeometry(value, menuOption.textSettings);
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            const letterMesh: BodyMesh<TextBufferGeometry, MeshLambertMaterial> = new THREE.Mesh(geometry, material);

            this.letters.push(letterMesh);
            letterMesh.size = geometry.boundingBox.getSize(new THREE.Vector3());
            const {x, y, z} = letterMesh.size;
            const letterBox = new Cannon.Box(new Cannon.Vec3(x / 2, y / 2, z / 2));
            letterMesh.body = new Cannon.Body(({
                mass: 1 / menuOption.name.length,
                position: new Cannon.Vec3(lastOffset, 0, 0),
                angularDamping: 0.99,
                material: this.letterMaterial,
            }));

            const {center} = geometry.boundingSphere;
            letterMesh.body.addShape(letterBox, new Cannon.Vec3(center.x, center.y, center.z));
            world.addBody(letterMesh.body);

            height = Math.max(y, height);

            letterMesh.body.position.x += lastOffset;
            lastOffset += x / 2;
            this._group.add(letterMesh);

            if (index > 0) {

                const constraint = new Cannon.ConeTwistConstraint(this.letters[index - 1].body, this.letters[index].body, {
                    pivotA: new Cannon.Vec3(this.letters[index - 1].size.x, 0, 0),
                    pivotB: new Cannon.Vec3(0, 0, 0),
                    maxForce: 1e30,
                });
                constraint.collideConnected = true;
                world.addConstraint(constraint);
            }
        });
        this.height = height;
        this.width = lastOffset;
    }

    translateY(offset: number): void {
        this.letters.forEach(letter => {
            letter.body.position.y += offset;
        });
    }

    translateX(offset: number): void {
        this.letters.forEach(letter => {
            letter.body.position.x += offset;
        });
    }

    update(deltaTime: number): void {
        this.letters.forEach(letter => {
            {
                const {x, y, z} = letter.body.position;
                letter.position.set(x, y, z);
            }
            {
                const {x, y, z, w} = letter.body.quaternion;
                letter.quaternion.set(x, y, z, w);
            }
        })
    };

    dispose() {
        this.letters.forEach(letter => {
            this.world.remove(letter.body);
        })
    };

    visible(): boolean {
        return this.letters.some(letter => {
            return this.frustum.containsPoint(letter.position);
        })
    };
};
