import * as THREE from "three/src/Three"
import Game from "../Game";

export abstract class SceneContainer {
    protected _scene: THREE.Scene = new THREE.Scene();
    protected _camera: THREE.Camera;
    protected _game: Game;

    protected constructor(game: Game) {
        this._game = game;
    }

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

    onKeyUp(event: KeyboardEvent): void {
    }

    update(deltaTime: number): void {};
}
