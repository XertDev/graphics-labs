import * as THREE from "three";
import * as Cannon from "cannon";

import {BoardManager} from "./boards/BoardManager";
import PlayerManager from "./players/PlayerManager";
import AnimatedBodyObject from "../utils/AnimatedBodyObject";
import AnimatedObject from "../utils/AnimatedObject";

const keyAction = {
    up: ["ArrowUp", "w"],
    down: ["ArrowDown", "s"],
    left: ["ArrowLeft", "a"],
    right: ["ArrowRight", "d"],
    bomb: ["Space"]
};

export default class GameManager {
    readonly MAP_WIDTH = 15;
    readonly MAP_HEIGHT = 15;

    private boardManager: BoardManager;
    private playerManager: PlayerManager;

    private pressed = {
        up: false,
        down: false,
        left: false,
        right: false,
        bomb: false
    };

    private prevPressed = {
        up: false,
        down: false,
        left: false,
        right: false,
        bomb: false
    };

    constructor(
        scene: THREE.Scene,
        world: Cannon.World,
        stones: Array<THREE.Object3D>,
        boxes: Array<THREE.Object3D>,
        playerModel: AnimatedBodyObject,
        enemyModel: AnimatedBodyObject,
        eagleModel: AnimatedObject
    ) {
        this.boardManager = new BoardManager(
            this.MAP_WIDTH, this.MAP_HEIGHT,
            scene, world,
            stones, boxes,
            eagleModel,
            10, 10
        );

        const playerStartPos = this.boardManager.getBoardCellCenter(6, 6);

        const enemyStartPos = this.boardManager.getBoardCellCenter(3, 3);

        this.playerManager = new PlayerManager(
            scene,
            world,
            playerModel,
            enemyModel,
            playerStartPos,
            enemyStartPos
        );


        world.addContactMaterial(new Cannon.ContactMaterial(this.playerManager.playerMaterial, this.boardManager.boardMaterial, {
            friction: 0.002,
            restitution: 0,

        }))
    };

    onKeyDown(event: KeyboardEvent): void {
        for (const [action, keys] of Object.entries(keyAction)) {
            if(keys.includes(event.key)) {
                this.pressed[action] = true;
                break;
            }
        }
    };

    onKeyUp(event: KeyboardEvent): void {
        for (const [action, keys] of Object.entries(keyAction)) {
            if(keys.includes(event.key)) {
                this.pressed[action] = false;
                break;
            }
        }
    };

    update(elapsedTime: number) {
        this.prevPressed = this.pressed;
        this.boardManager.update(elapsedTime)
        this.playerManager.update(elapsedTime);
    }
}
