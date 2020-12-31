import * as THREE from "three";
import * as Cannon from "cannon";

export abstract class FieldEntity {
    public body: Cannon.Body;

    constructor(
        private scene: THREE.Scene,
        private world: Cannon.World,
        public mesh: THREE.Object3D,
        cellSize: number
    ) {
        this.scene.add(mesh);

        const box = new THREE.Box3().setFromObject(mesh);
        this.body = new Cannon.Body({
            shape: new Cannon.Box(new Cannon.Vec3(cellSize/2, cellSize/2, cellSize/2)),
            mass: 0
        });

        this.world.addBody(this.body);
    }

    get position() {
        return this.body.position;
    }

    set position(pos) {
        const {x, y, z} = pos;
        this.mesh.position.set(x, y, z);
        this.body.position = pos;
    }

    dispose() {
        this.scene.remove(this.mesh);
        this.world.remove(this.body);
    }

    update(elapsedTime: number) {

    }
}
