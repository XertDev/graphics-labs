import * as THREE from "three/src/Three"
import App from "../App";
export abstract class SceneContainer {
    protected scene: THREE.Scene = new THREE.Scene();
    protected camera: THREE.Camera;

    protected constructor(protected app: App) {

    };

    public abstract initResources(): Promise<void>;
    public abstract setup(): Promise<void>;

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

    public onKeyDown(event: KeyboardEvent): void {
    };

    public update(deltaTime: number): void {
    };
}
