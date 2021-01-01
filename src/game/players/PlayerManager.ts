import * as THREE from "three";
import * as Cannon from "cannon";
import Player from "./Player";
import AnimatedBodyObject from "../../utils/AnimatedBodyObject";

export default class PlayerManager {
    private _hostPlayer: Player;
    private _enemyPlayer: Player;

    public playerMaterial = new Cannon.Material("player");

    constructor(
        scene: THREE.Scene,
        world: Cannon.World,
        playerModel: AnimatedBodyObject,
        enemyModel: AnimatedBodyObject,
        playerStartingPos: Cannon.Vec3,
        enemyStartingPos: Cannon.Vec3,
    ) {
        this._hostPlayer = new Player(scene, world, playerModel, this.playerMaterial);
        this._hostPlayer.setPos(playerStartingPos);

        this._enemyPlayer = new Player(scene, world, enemyModel, this.playerMaterial);
        this._enemyPlayer.setPos(enemyStartingPos)
    }

    dispose() {
        this._hostPlayer.dispose();
        this._enemyPlayer.dispose();
    }

    update(deltaTime) {
        this._hostPlayer.update(deltaTime);
        this._enemyPlayer.update(deltaTime);
    }
}
