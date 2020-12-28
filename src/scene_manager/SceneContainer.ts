import * as THREE from "three/src/Three"

export abstract class SceneContainer {
    protected _scene: THREE.Scene = new THREE.Scene();
    protected _camera: THREE.Camera;

    public abstract init(): Promise<void>;

    public getScene(): THREE.Scene {
        return this._scene;
    }

    public getCamera(): THREE.Camera {
        return this._camera;
    }

    onMouseMove(event: MouseEvent): void {
    }

    onClick(event: MouseEvent) : void {
    }

    update(deltaTime: number): void {};
}
