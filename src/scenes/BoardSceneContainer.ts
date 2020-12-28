import * as THREE from "three/src/Three";
import {SceneContainer} from "../scene_manager/SceneContainer";

const nx = require("../assets/images/nx.png");
const ny = require("../assets/images/ny.png");
const nz = require("../assets/images/nz.png");
const px = require("../assets/images/px.png");
const py = require("../assets/images/py.png");
const pz = require("../assets/images/pz.png");

export class BoardSceneContainer extends SceneContainer {
    constructor() {
        super();

    };

    update(deltaTime: number): void {
        this._camera.rotateY(0.008);
    };

    init() {
        {
            const loader = new THREE.CubeTextureLoader();
            this._scene.background = loader.load([
                px, nx,
                py, ny,
                pz, nz
            ]);
        }

        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.x = 5;
        this._camera.position.y = 5;
        this._camera.position.z = 5;

        const light = new THREE.DirectionalLight(0xffffff, 1.0);

        light.position.set(100, 100, 100);


        const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

        light2.position.set(-100, 100, -100);

        this._scene.add(light);
        this._scene.add(light2);
        return Promise.resolve();
    }
}
