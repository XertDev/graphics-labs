import * as THREE from "three";
import * as Cannon from "cannon";
import {SceneContainer} from "../scene_manager/SceneContainer";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import { BoardManager } from '../boards/BoardManager';
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import Game from "../Game";

const nx = require("../assets/images/nx.png");
const ny = require("../assets/images/ny.png");
const nz = require("../assets/images/nz.png");
const px = require("../assets/images/px.png");
const py = require("../assets/images/py.png");
const pz = require("../assets/images/pz.png");

const stoneContext = require.context("../assets/models/stones/", false, /.glb$/);
const boxContext = require.context("../assets/models/boxes/", false, /.glb$/);

const stoneURLs: string[] = <string[]>stoneContext.keys().map(stoneContext);
const boxURLs: string[] = <string[]>boxContext.keys().map(boxContext);

export class BoardSceneContainer extends SceneContainer {
    private stones = new Array<THREE.Object3D>();
    private boxes = new Array<THREE.Object3D>();

    private world = new Cannon.World();

    constructor(game: Game) {
        super(game);
    };

    initResources() {
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
                const stone = <THREE.Object3D>(gltf.scene);
                stone.scale.set(2, 2, 2);
                this.stones[index] = stone;
            });
            modelPromises.push(promise);
        });

        boxURLs.map((url, index) => {
            const promise = gltfLoader.loadAsync(url).then( (gltf) => {
                this.boxes[index] = gltf.scene;
            });
            modelPromises.push(promise);
        });

        return Promise.all(modelPromises);
    }

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

            const board = new BoardManager(10, 10, this.scene, this.world, this.stones, this.boxes, 20, 30);
            board.createFullMap();
        })
    };

    update(deltaTime: number): void {
    };

}
