import {SceneManager} from "./scene_manager/SceneManager";
import Peer from "peerjs";
import {MenuSceneContainer} from "./scenes/MenuSceneContainer";


export default class Game {
    private _instanceID: string;
    private _peer: Peer;
    private _sceneManager: SceneManager;

    constructor(gameContainer: HTMLElement) {
        const randomBytes = new Uint8Array(3);
        window.crypto.getRandomValues(randomBytes);
        this._instanceID =  Array.from(randomBytes).map(value => ("00" + value.toString(16)).slice(-2)).join("");
        console.log(this._instanceID);
        this._peer = new Peer("agh-bomb-it-"+this._instanceID);

        this._sceneManager = new SceneManager(gameContainer);
    }

    public init(): Promise<void> {
        document.addEventListener("click", (e) => this._sceneManager.onClick(e));
        window.addEventListener('mousemove', (e) => this._sceneManager.onMouseMove(e));

        return this._sceneManager.setSceneContainer(new MenuSceneContainer(this))
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this._sceneManager.update();
    }

    public run(): void {
        this.animate();
    }

    public getInstanceID(): string {
        return this._instanceID;
    }
}
