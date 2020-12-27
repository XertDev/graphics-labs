import * as THREE from "three/src/Three"

export abstract class SceneContainer {
    protected _scene: THREE.Scene = new THREE.Scene();
    protected _camera: THREE.Camera;

    public getScene(): THREE.Scene {
        return this._scene;
    }

    public getCamera(): THREE.Camera {
        return this._camera;
    }

    update(deltaTime: number): void {};
}
