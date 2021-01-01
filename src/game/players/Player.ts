import * as Cannon from "cannon";
import AnimatedBodyObject from "../../utils/AnimatedBodyObject";
import * as THREE from "three";

export default class Player {
    private _model: AnimatedBodyObject;
    private _scene: THREE.Scene;
    private _world: Cannon.World;

    constructor(
        scene: THREE.Scene,
        world: Cannon.World,
        model: AnimatedBodyObject,
        material: Cannon.Material
    ) {
        this._model = model;
        this._scene = scene;
        this._world = world;
        this._model.body.material = material;

        scene.add(model.root);
        world.addBody(model.body);
    }

    setPos(pos: Cannon.Vec3) {
        this._model.body.position = pos;
    }

    update(deltaTime: number) {
        this._model.update(deltaTime);
    }

    dispose() {
        this._scene.remove(this._model.root);
        this._world.remove(this._model.body);
    }
}
