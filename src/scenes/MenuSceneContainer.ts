import * as THREE from "three";
import * as Cannon from "cannon"
import {SceneContainer} from "../scene_manager/SceneContainer";
import JellyMenu from "../bouncing_menu/JellyMenu";
import CallbackMenuOption from "../bouncing_menu/menu_config/CallbackMenuOption";
import LabelMenuOption from "../bouncing_menu/menu_config/LabelMenuOption";
import Game from "../Game";
import TextInsertMenuOption from "../bouncing_menu/menu_config/TextInsertMenuOption";

// @ts-ignore
import fontURL from "../assets/fonts/droid_sans_mono_regular.typeface.json";

const nz = require("../assets/images/nz.png");

export class MenuSceneContainer extends SceneContainer {
    private _menu: JellyMenu;
    private _world: Cannon.World;
    private _textGeometryParams: THREE.TextGeometryParameters;
    private _menuTransition: () => void;

    constructor(game: Game) {
        super(game);
    }

    public init() {
        this._scene.fog = new THREE.Fog(0x202533, -1, 100);
        const aspect = window.innerWidth / window.innerHeight;
        const distance = 15;

        this._camera = new THREE.OrthographicCamera(-distance * aspect, distance * aspect, distance, -distance, -1, 100)

        this._camera.position.set(-6, 5, 20);
        this._camera.lookAt(new THREE.Vector3());

        this._world = new Cannon.World();
        this._world.gravity.set(0, -50, 0);
        this.setupLights();


        const fontLoader = new THREE.FontLoader();
        this._scene.background = new THREE.TextureLoader().load(nz);

        return fontLoader.loadAsync(fontURL).then(responseFont => {
            this._textGeometryParams  = {
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
            this.initMainMenu();
        })
    }

    private initMainMenu(): void {
        this._menu = new JellyMenu(this._scene, this._camera, [
            new LabelMenuOption("SuperGra", new THREE.Color("blue"), this._textGeometryParams),
            new CallbackMenuOption("HostGame", new THREE.Color("orange"), this._textGeometryParams, () => {
                this.transiteMenu(() => this.initHostMenu());
            }),
            new CallbackMenuOption("JoinGame", new THREE.Color("orange"), this._textGeometryParams, () => {
                this.transiteMenu(() => this.initJoinMenu());
            }),
        ], 1, this._world)
    }

    private initHostMenu(): void {
        this._menu = new JellyMenu(this._scene, this._camera, [
            new LabelMenuOption("YourKey", new THREE.Color("blue"), this._textGeometryParams),
            new LabelMenuOption(this._game.getInstanceID(), new THREE.Color("cyan"), this._textGeometryParams),
            new CallbackMenuOption("Back", new THREE.Color("red"), this._textGeometryParams, () => {
                this.transiteMenu(() => this.initMainMenu());
            })
        ], 1, this._world)
        this._game.getConnectionController().startHosting();
    }

    private initJoinMenu(): void {
        this._menu = new JellyMenu(this._scene, this._camera, [
            new LabelMenuOption("InsertKey", new THREE.Color("blue"), this._textGeometryParams),
            new TextInsertMenuOption(
                "_", 6,
                new THREE.Color("green"), new THREE.Color("yellow"), this._textGeometryParams,
                value => {
                    console.log(value);
                    this._game.getConnectionController().connectToHost(value);
            }),
            new CallbackMenuOption("Back", new THREE.Color("red"), this._textGeometryParams, () => {
                this.transiteMenu(() => this.initMainMenu());
            })
        ], 2, this._world)
    }

    private transiteMenu(menuInitializer: () => void) {
        this._menuTransition = (() => {
            this._menuTransition = null;
            this._menu.onDestroy();
            setTimeout(() => menuInitializer(), 100);
        });
    }

    private setupLights() {
        const ambientLight = new THREE.AmbientLight(0xcccccc);
        this._scene.add(ambientLight);

        const foreLight = new THREE.DirectionalLight(0xffffff, 0.5);
        foreLight.position.set(5, 5, 20);
        this._scene.add(foreLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 1);
        backLight.position.set(-5, -5, -10);
        this._scene.add(backLight);
    }

    update(deltaTime: number): void {
        super.update(deltaTime);
        this._menu.update(deltaTime);

        // todo: change for real time
        this._world.step(1/60);
        if(this._menuTransition) {
            if(!this._menu.visible()) {
                this._menuTransition();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this._menu.onKeyUp(event);
    }


    onClick(event: MouseEvent): void {
        this._menu.onClick(event);
    }
}
