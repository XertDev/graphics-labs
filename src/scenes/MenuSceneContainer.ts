import * as THREE from "three";
import * as Cannon from "cannon"
import {SceneContainer} from "../scene_manager/SceneContainer";
import JellyMenu from "../bouncing_menu/JellyMenu";
import CallbackMenuOption from "../bouncing_menu/menu_config/CallbackMenuOption";

// @ts-ignore
import fontURL from "../assets/fonts/droid_sans_mono_regular.typeface.json";

export class MenuSceneContainer extends SceneContainer {
    private _menu: JellyMenu;
    private _world: Cannon.World;

    constructor() {
        super();
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

        return fontLoader.loadAsync(fontURL).then(responseFont => {
            const textGeometryParams: THREE.TextGeometryParameters = {
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
            this._menu = new JellyMenu(this._scene, this._camera, [
                new CallbackMenuOption("Tescikowe", ()=>{}, new THREE.Color("orange"),textGeometryParams ),
                new CallbackMenuOption("Test", ()=>{}, new THREE.Color("orange"),textGeometryParams ),
            ], 1, this._world)
        })
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
    }

    onMouseMove(event: MouseEvent): void {
    }
    onClick(event: MouseEvent): void {
        this._menu.onClick(event);
    }
}
