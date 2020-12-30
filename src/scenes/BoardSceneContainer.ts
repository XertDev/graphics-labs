import * as THREE from "three/src/Three";
import {SceneContainer} from "../scene_manager/SceneContainer";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import { LineManager } from '../boards/LineManager';
import { BoardManager } from '../boards/BoardManager';

const nx = require("../assets/images/nx.png");
const ny = require("../assets/images/ny.png");
const nz = require("../assets/images/nz.png");
const px = require("../assets/images/px.png");
const py = require("../assets/images/py.png");
const pz = require("../assets/images/pz.png");

export class BoardSceneContainer extends SceneContainer {
    constructor() {
        super();
        {
            const loader = new THREE.CubeTextureLoader();
            this._scene.background = loader.load([
                px, nx,
                py, ny,
                pz, nz
            ]);
        }

        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.x = 10;
        this._camera.position.y = 15;
        this._camera.position.z = 10;

        const light = new THREE.DirectionalLight(0xffffff, 1.0);

        light.position.set(100, 100, 100);


        const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

        light2.position.set(-100, 100, -100);

        this._scene.add(light);
        this._scene.add(light2);

        const controls = new PointerLockControls( this._camera, document.body );
        document.addEventListener('click', () => {
            controls.lock();
        });
		this._scene.add( controls.getObject() );

        const board = new BoardManager(10, 10, this._scene);


        // var lines = new LineManager(0, 0, 20, 1, 20, 2).makeLines();
        // lines.forEach(line => {
        //     this._scene.add(line);
        // });


    };

    update(deltaTime: number): void {
        // this._camera.rotateZ(0.008);
        // this._camera.rotateX(0.008);
        // this._camera.rotateZ(0.008);
    };
}
