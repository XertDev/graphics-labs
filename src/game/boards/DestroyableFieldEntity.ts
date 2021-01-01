import * as Cannon from "cannon";
import * as THREE from "three";
import {FieldEntity} from "./FieldEntity";

export class DestroyableFieldEntity extends FieldEntity{
    constructor(boxes: Array<THREE.Object3D>, scene: THREE.Scene, world: Cannon.World, cellSize: number) {
        const mesh = boxes[Math.floor(Math.random() * boxes.length)].clone(true);
        super(scene, world, mesh, cellSize);
    }

}
