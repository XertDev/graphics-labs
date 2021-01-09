import * as THREE from "three";
import * as Cannon from "cannon"
import {SceneContainer} from "../scene_manager/SceneContainer";
import JellyMenu from "../bouncing_menu/JellyMenu";
import CallbackMenuOption from "../bouncing_menu/menu_config/CallbackMenuOption";
import LabelMenuOption from "../bouncing_menu/menu_config/LabelMenuOption";
import App from "../App";
import TextInsertMenuOption from "../bouncing_menu/menu_config/TextInsertMenuOption";
import {BoardSceneContainer} from "./BoardSceneContainer";

// @ts-ignore
import fontURL from "../assets/fonts/droid_sans_mono_regular.typeface.json";
const nz = require("../assets/images/nz.png");

export class MenuSceneContainer extends SceneContainer {
    private menu: JellyMenu;
    private world: Cannon.World;
    private textGeometryParams: THREE.TextGeometryParameters;
    private menuTransition: () => void;

    constructor(game: App) {
        super(game);
    }

    public initResources() {
        const fontLoader = new THREE.FontLoader();
        this.scene.background = new THREE.TextureLoader().load(nz);

        return fontLoader.loadAsync(fontURL).then(responseFont => {
            this.textGeometryParams  = {
                font: responseFont,
                size: 3,
                height: 0.4,
                curveSegments: 24,
                bevelEnabled: true,
                bevelThickness: 0.9,
                bevelSize: 0.3,
                bevelOffset: 0,
                bevelSegments: 10
            };
        })
    }

    public setup() {
        this.scene.fog = new THREE.Fog(0x202533, -1, 100);
        const aspect = window.innerWidth / window.innerHeight;
        const distance = 15;

        this.camera = new THREE.OrthographicCamera(-distance * aspect, distance * aspect, distance, -distance, -1, 100)

        this.camera.position.set(-6, 5, 20);
        this.camera.lookAt(new THREE.Vector3());

        this.world = new Cannon.World();
        this.world.gravity.set(0, -50, 0);
        this.setupLights();

        this.initMainMenu();
        return Promise.resolve();
    }

    private initMainMenu(): void {
        this.menu = new JellyMenu(this.scene, this.world, this.camera, [
            new LabelMenuOption("SuperGra", new THREE.Color("blue"), this.textGeometryParams, false),
            new CallbackMenuOption("HostGame", new THREE.Color("orange"), this.textGeometryParams, () => {
                this.transiteMenu(() => this.initHostMenu());
            }),
            new CallbackMenuOption("JoinGame", new THREE.Color("orange"), this.textGeometryParams, () => {
                this.transiteMenu(() => this.initJoinMenu());
            }),
        ], 1)
    }

    private initHostMenu(): void {
        this.menu = new JellyMenu(this.scene, this.world, this.camera,[
            new LabelMenuOption("YourKey", new THREE.Color("blue"), this.textGeometryParams, false),
            new LabelMenuOption(this.app.getInstanceID(), new THREE.Color("cyan"), this.textGeometryParams, true),
            new CallbackMenuOption("Back", new THREE.Color("red"), this.textGeometryParams, () => {
                this.app.getConnectionController().stopHosting();
                this.transiteMenu(() => this.initMainMenu());
            })
        ], 1);
        const connectionController = this.app.getConnectionController();
        connectionController.startHosting();
        const onConnect = (() => {
            connectionController.sendToPeer("accept-connection", null);
            connectionController.unsubscribe("connect", onConnect);
            this.app.sceneManager.setSceneContainer(new BoardSceneContainer(this.app, true));
        })
        connectionController.subscribe("connect", onConnect);
    }

    private initJoinMenu(): void {
        this.menu = new JellyMenu(this.scene, this.world, this.camera, [
            new LabelMenuOption("InsertKey", new THREE.Color("blue"), this.textGeometryParams, false),
            new TextInsertMenuOption(
                "_", 6,
                new THREE.Color("green"), new THREE.Color("yellow"), this.textGeometryParams,
                value => {
                    console.log(value);
                    const connectionController = this.app.getConnectionController();
                    const onConnect = (() => {
                        connectionController.unsubscribe("accept-connection", onConnect);
                        this.app.sceneManager.setSceneContainer(new BoardSceneContainer(this.app, false));
                    })
                    connectionController.subscribe("accept-connection", onConnect);
                    connectionController.connectToHost(value).then(() => {
                        connectionController.sendToPeer("connect", null);
                    });

            }),
            new CallbackMenuOption("Back", new THREE.Color("red"), this.textGeometryParams, () => {
                this.transiteMenu(() => this.initMainMenu());
            })
        ], 2);
    }

    private transiteMenu(menuInitializer: () => void) {
        this.menuTransition = (() => {
            this.menuTransition = null;
            this.menu.dispose();
            setTimeout(() => menuInitializer(), 100);
        });
    }

    private setupLights() {
        const ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        const foreLight = new THREE.DirectionalLight(0xffffff, 0.5);
        foreLight.position.set(5, 5, 20);
        this.scene.add(foreLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 1);
        backLight.position.set(-5, -5, -10);
        this.scene.add(backLight);
    }

    update(deltaTime: number): void {
        super.update(deltaTime);
        this.menu.update(deltaTime);

        // todo: change for real time
        this.world.step(1/60);
        if(this.menuTransition) {
            if(!this.menu.visible()) {
                this.menuTransition();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.menu.onKeyUp(event);
    }


    onClick(event: MouseEvent): void {
        this.menu.onClick(event);
    }
}
