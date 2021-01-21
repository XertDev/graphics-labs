import * as THREE from "three";
import * as Cannon from "cannon";

import {BoardManager} from "./boards/BoardManager";
import AnimatedBodyObject from "../utils/AnimatedBodyObject";
import AnimatedObject from "../utils/AnimatedObject";
import ConnectionController from "../connection_controller/ConnectionController";

export default class GameManager {
    readonly MAP_WIDTH = 8;
    readonly MAP_HEIGHT = 8;

    private boardManager: BoardManager;

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
        camera: THREE.Camera,
        private connectionController: ConnectionController,
        private isHost: boolean,
        playerModel: AnimatedBodyObject,
        enemyModel: AnimatedBodyObject,
        eagleModel: AnimatedObject
    ) {
        this.boardManager = new BoardManager(
            this.MAP_WIDTH, this.MAP_HEIGHT,
            scene, world, camera,
            connectionController,
            this.isHost,
            playerModel, enemyModel,
            eagleModel
        );
    };


    public setup() {
        return new Promise<void>(resolve => {
            this.boardManager.generateBoard();
            this.boardManager.createFullMap();
            this.connectionController.subscribe("move", (data) => {
                const {startX, startY, endX, endY} = data;
                console.log(data);
                this.boardManager.moveCheeker(startX, startY, endX, endY, false);
            });

            if(this.isHost) {
                this.connectionController.sendToPeer("accept-connect", null);
            }
            resolve();

        });
    }

    update(elapsedTime: number) {
        this.prevPressed = this.pressed;
        this.boardManager.update(elapsedTime);
    }

    onClick(event: MouseEvent): void {
        this.boardManager.onClick(event);
    }
}
