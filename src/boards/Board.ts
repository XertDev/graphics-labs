import * as THREE from "three/src/Three"

enum BoardCellType {
  EMPTY = 0,
  DESTROYABLE = 1,
  UNDESTROYABLE = 2
}

export class Board {
    private _width: number;
    private _height: number;

    private _map = new Array<Array<BoardCellType>>();

    constructor(width: number, heigth: number) {
        this._map.fill(new Array<BoardCellType>().fill(BoardCellType.EMPTY));
        this.buildBorderWalls();

    }

    private buildBorderWalls() {
        for(let i = 0; i < this._map.length; ++i) {
            this._map[0][i] = BoardCellType.UNDESTROYABLE;
            this._map[this._height-1][i] = BoardCellType.UNDESTROYABLE;
        }
        for(let i = 1; i < this._map.length-1; ++i) {
            this._map[i][0] = BoardCellType.UNDESTROYABLE;
            this._map[i][this._width-1] = BoardCellType.UNDESTROYABLE;
        }
    }

    public cellAt(x: number, y: number) {
        return this._map[x][y];
    }
}
