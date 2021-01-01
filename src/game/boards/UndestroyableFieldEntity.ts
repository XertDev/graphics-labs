import * as THREE from "three";
import * as Cannon from "cannon";
import {FieldEntity} from "./FieldEntity";

export class UndestroyableFieldEntity extends FieldEntity{
  constructor(stones: Array<THREE.Object3D>, scene: THREE.Scene, world: Cannon.World, cellSize: number) {
      const mesh = stones[Math.floor(Math.random() * stones.length)].clone(true);
      super(scene, world, mesh, cellSize);
  }
}
