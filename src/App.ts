import {SceneManager} from "./scene_manager/SceneManager";
import {BoardSceneContainer} from "./scenes/BoardSceneContainer";
import ConnectionController from "./connection_controller/ConnectionController";
import {MenuSceneContainer} from "./scenes/MenuSceneContainer";


export default class App {
    private readonly instanceID: string;
    private readonly connectionController: ConnectionController;
    private sceneManager: SceneManager;

    constructor(gameContainer: HTMLElement) {
        const randomBytes = new Uint8Array(3);
        window.crypto.getRandomValues(randomBytes);
        this.instanceID =  Array.from(randomBytes).map(value => ("00" + value.toString(16)).slice(-2)).join("");
        console.log(this.instanceID);
        this.connectionController = new ConnectionController(this.instanceID);

        this.sceneManager = new SceneManager(gameContainer);
    }

    public init(): Promise<void> {
        document.addEventListener("click", (e) => this.sceneManager.onClick(e));
        document.addEventListener("keyup", (e) => this.sceneManager.onKeyUp(e));
        document.addEventListener("keydown", (e) => this.sceneManager.onKeyDown(e));
        window.addEventListener('mousemove', (e) => this.sceneManager.onMouseMove(e));
        window.addEventListener("resize", (e) => this.sceneManager.onWindowResize());

        return this.sceneManager.setSceneContainer(new BoardSceneContainer(this))
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.sceneManager.update();
    }

    public run(): void {
        this.animate();
    }

    public getInstanceID(): string {
        return this.instanceID;
    }

    public getConnectionController(): ConnectionController {
        return this.connectionController;
    }
}
