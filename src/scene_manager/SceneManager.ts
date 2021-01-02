import * as THREE from "three/src/Three"
import {SceneContainer} from "./SceneContainer";

export class SceneManager {
    private width: number;
    private height: number;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock = new THREE.Clock();

    private sceneContainer: SceneContainer;

    constructor(container: HTMLElement) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        let dpr = (window.devicePixelRatio) ? window.devicePixelRatio: 1;
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(this.width, this.height);
        container.appendChild(this.renderer.domElement);
    }

    public setSceneContainer(nextScene: SceneContainer): Promise<void> {
        return nextScene.init().then(() => {
            this.sceneContainer = nextScene;
        });
    }

    public onWindowResize(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
    }

    public update(): void {
        const elapsedTime: number = this.clock.getElapsedTime();
        this.sceneContainer.update(elapsedTime);
        this.renderer.render(this.sceneContainer.getScene(), this.sceneContainer.getCamera());
    }

    onMouseMove(event: MouseEvent): void {
        if(this.sceneContainer) {
            this.sceneContainer.onMouseMove(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if(this.sceneContainer) {
            this.sceneContainer.onKeyUp(event);
        }
    }

    onClick(event: MouseEvent) : void {
        if(this.sceneContainer) {
            this.sceneContainer.onClick(event);
        }
    }
}
