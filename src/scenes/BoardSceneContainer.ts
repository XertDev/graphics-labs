import * as THREE from "three";
import * as Cannon from "cannon";
import {SceneContainer} from "../scene_manager/SceneContainer";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import App from "../App";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import GameManager from "../game/GameManager";
import AnimatedBodyObject from "../utils/AnimatedBodyObject";
import AnimatedObject from "../utils/AnimatedObject";
import { BoardManager } from '../game/boards/BoardManager';

const nx = require("../assets/images/nx.png");
const ny = require("../assets/images/ny.png");
const nz = require("../assets/images/nz.png");
const px = require("../assets/images/px.png");
const py = require("../assets/images/py.png");
const pz = require("../assets/images/pz.png");

const foxURL = require("../assets/models/fox.glb");
const wolfURL = require("../assets/models/wolf.glb");
const eagleURL = require("../assets/models/eagle.glb");


export class BoardSceneContainer extends SceneContainer {
    private world = new Cannon.World();

    private playerModel: AnimatedBodyObject;
    private enemyModel: AnimatedBodyObject;

    private eagleModel: AnimatedObject;

    private gameManager: GameManager;


    constructor(app: App, private isHost: boolean) {
        super(app);
        this.world.gravity.set(0, -100, 0);
    };

    public initResources() {
        {
            const loader = new THREE.CubeTextureLoader();
            this.scene.background = loader.load([
                px, nx,
                py, ny,
                pz, nz
            ]);
        }

        const gltfLoader = new GLTFLoader();
        const modelPromises = new Array<Promise<void>>();

        let promise = gltfLoader.loadAsync(foxURL).then(gltf => {
            gltf.scene.rotateY(Math.PI/2);
            this.playerModel = AnimatedBodyObject.processGLTF(gltf, 0.014);
        });
        modelPromises.push(promise);

        promise = gltfLoader.loadAsync(wolfURL).then(gltf => {
            gltf.scene.rotateY(Math.PI);
            this.enemyModel = AnimatedBodyObject.processGLTF(gltf, 0.19);
        });
        modelPromises.push(promise);

        promise = gltfLoader.loadAsync(eagleURL).then(gltf => {
            this.eagleModel = AnimatedObject.processGLTF(gltf, 1);
        });
        modelPromises.push(promise);

        return Promise.all(modelPromises).then(() => {});
    };

    setup() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.y = 15;

        this.camera.position.x = this.isHost ? -10 : 10;
        this.camera.position.z = this.isHost ? -10 : 10;

        const light = new THREE.DirectionalLight(0xffffff, 1.0);

        light.position.set(100, 100, 100);


        const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

        light2.position.set(-100, 100, -100);

        this.scene.add(light);
        this.scene.add(light2);

        this.scene.add( this.camera );
        this.camera.lookAt(0, 0, 0);


        this.gameManager = new GameManager(
            this.scene, this.world, this.camera,
            this.app.getConnectionController(),
            this.isHost,
            this.playerModel, this.enemyModel, this.eagleModel
        );

        return this.gameManager.setup();
    };

   onKeyDown(event: KeyboardEvent): void {
    }

    onKeyUp(event: KeyboardEvent): void {
    }

    update(deltaTime: number): void {
        this.world.step(1/60);
        this.gameManager.update(deltaTime);
    };

   onClick(event: MouseEvent): void {
       this.gameManager.onClick(event);
   }
}
