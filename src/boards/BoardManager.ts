import * as THREE from "three/src/Three"
import { BoardGround } from "./BoardGround";
import { Board } from "./Board";

// export class BoardManager {
//     private _width: number;
//     private _height: number;
//     private _depth: number;

//     private _board: BoardContainer;

//     constructor(width: number, height: number, depth: number) {
//         this._width = width;
//         this._height = height;
//         this._depth = depth;

//         this._board = new BoardContainer(this._width, this._height, this._depth);
//     }

//     public getBoard(): BoardContainer {
//         return this._board;
//     }

//     // public update(): void {
//     // }
// }

export class BoardManager {
    private _boardGround: BoardGround;
    private _board: Board;
    readonly CELL_SIZE = 2;
    readonly CELL_SPACE = 0.1;
    readonly BORDER = 3;
    readonly DEPTH = 0.8;

    constructor(
        readonly width: number,
        readonly heigth: number,
        scene: THREE.Scene
    ){
        this._board = new Board(width, heigth);

        this._boardGround = new BoardGround(
            this.width, this.heigth,
            this.CELL_SPACE, this.CELL_SIZE,
            this.BORDER,
            this.DEPTH
        );

        scene.add(this._boardGround.getGroup());
    }
}
