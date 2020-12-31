import * as THREE from "three/src/Three"
import Game from "../Game";
export abstract class SceneContainer {
    protected scene: THREE.Scene = new THREE.Scene();
    protected camera: THREE.Camera;

    protected constructor(protected game: Game) {
    };

    public abstract init(): Promise<void>;

    public getScene(): THREE.Scene {
        return this.scene;
    };

    public getCamera(): THREE.Camera {
        return this.camera;
    };

    public onMouseMove(event: MouseEvent): void {
    };

    public onClick(event: MouseEvent) : void {
    };

    public onKeyUp(event: KeyboardEvent): void {
    };

    public update(deltaTime: number): void {
    };
}
