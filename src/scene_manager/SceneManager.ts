import * as THREE from "three/src/Three"
import {SceneContainer} from "./SceneContainer";

export class SceneManager {
    private _width: number;
    private _height: number;
    private _renderer: THREE.WebGLRenderer;

    private _clock: THREE.Clock = new THREE.Clock();

    private _sceneContainer: SceneContainer;

    constructor(container: HTMLElement) {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        let dpr = (window.devicePixelRatio) ? window.devicePixelRatio: 1;
        this._renderer.setPixelRatio(dpr);
        this._renderer.setSize(this._width, this._height);
        container.appendChild(this._renderer.domElement);
    }

    public setSceneContainer(nextScene: SceneContainer): void {
        this._sceneContainer = nextScene;
    }

    public onWindowResize(): void {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._renderer.setSize(this._width, this._height);
    }

    public update(): void {
        const elapsedTime: number = this._clock.getElapsedTime();
        this._sceneContainer.update(elapsedTime);
        this._renderer.render(this._sceneContainer.getScene(), this._sceneContainer.getCamera());
    }
}
