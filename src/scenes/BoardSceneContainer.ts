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

const stoneContext = require.context("../assets/models/stones/", false, /.glb$/);
const boxContext = require.context("../assets/models/boxes/", false, /.glb$/);

const stoneURLs: string[] = <string[]>stoneContext.keys().map(stoneContext);
const boxURLs: string[] = <string[]>boxContext.keys().map(boxContext);


export class BoardSceneContainer extends SceneContainer {
    private world = new Cannon.World();

    private playerModel: AnimatedBodyObject;
    private enemyModel: AnimatedBodyObject;

    private eagleModel: AnimatedObject;

    private stones = new Array<THREE.Object3D>();
    private boxes = new Array<THREE.Object3D>();

    private gameManager: GameManager;


    constructor(app: App) {
        super(app);
	this.world.gravity.set(0, -100, 0);
    };

    private initResources() {
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
        stoneURLs.map((url, index) => {
            const promise = gltfLoader.loadAsync(url).then((gltf) => {
                const stone = new THREE.Box3().setFromObject(gltf.scene);
                const size = stone.getSize(new THREE.Vector3());
                const maxBorder = Math.max(size.x, size.y);
                const scale = BoardManager.CELL_SIZE / maxBorder * 0.9;

                const stone_gltf = <THREE.Object3D>(gltf.scene);

                stone_gltf.scale.set(scale, scale, scale);
                this.stones[index] = stone_gltf;
            });
            modelPromises.push(promise);
        });

        boxURLs.map((url, index) => {
            const promise = gltfLoader.loadAsync(url).then( (gltf) => {
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const size = box.getSize(new THREE.Vector3());
                const maxBorder = Math.max(size.x, size.y);
                const scale = BoardManager.CELL_SIZE / maxBorder * 0.8;

                const box_gltf = <THREE.Object3D>(gltf.scene);

                box_gltf.scale.set(scale, scale, scale);
                this.boxes[index] = box_gltf;
            });
            modelPromises.push(promise);
        });

	let promise = gltfLoader.loadAsync(foxURL).then(gltf => {
            this.playerModel = AnimatedBodyObject.processGLTF(gltf, 0.018);
        });
        modelPromises.push(promise);

        promise = gltfLoader.loadAsync(wolfURL).then(gltf => {
            this.enemyModel = AnimatedBodyObject.processGLTF(gltf, 0.19);
        });
        modelPromises.push(promise);

        promise = gltfLoader.loadAsync(eagleURL).then(gltf => {
            this.eagleModel = AnimatedObject.processGLTF(gltf, 1);
        });
        modelPromises.push(promise);

	return Promise.all(modelPromises);
    };

    init() {
        return this.initResources().then(() => {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.x = 10;
            this.camera.position.y = 15;
            this.camera.position.z = 10;

            const light = new THREE.DirectionalLight(0xffffff, 1.0);

            light.position.set(100, 100, 100);


            const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

            light2.position.set(-100, 100, -100);

            this.scene.add(light);
            this.scene.add(light2);

            const controls = new PointerLockControls( this.camera, document.body );
            document.addEventListener('click', () => {
                controls.lock();
            });
            this.scene.add( controls.getObject() );

            this.gameManager = new GameManager(
                this.scene, this.world,
                this.stones, this.boxes,
                this.playerModel, this.enemyModel, this.eagleModel
            );
        })
    };

   onKeyDown(event: KeyboardEvent): void {
        this.gameManager.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.gameManager.onKeyUp(event);
    }

    update(deltaTime: number): void {
        this.world.step(1/60);
        this.gameManager.update(deltaTime);
    };
}
