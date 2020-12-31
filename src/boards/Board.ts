export enum BoardCellType {
  EMPTY = 0,
  DESTROYABLE = 1,
  UNDESTROYABLE = 2
};

export class Board {
    private map: BoardCellType[][];

    constructor(readonly width: number, readonly height: number) {
        this.map = [];
        for(let i = 0; i < height; ++i) {
            this.map[i] = [];
            for(let j = 0; j < width; ++j) {
                this.map[i][j] = BoardCellType.EMPTY;
            }
        }

        this.buildBorderWalls();
    }

    private buildBorderWalls() {
        for(let i = 0; i < this.width; ++i) {
            this.map[0][i] = BoardCellType.UNDESTROYABLE;
            this.map[this.height-1][i] = BoardCellType.UNDESTROYABLE;
        }
        for(let i = 1; i < this.height-1; ++i) {
            this.map[i][0] = BoardCellType.UNDESTROYABLE;
            this.map[i][this.width-1] = BoardCellType.UNDESTROYABLE;
        }
    }

    public cellAt(x: number, y: number) {
        return this.map[x][y];
    }

    public isEmptyCell(x: number, y:number) {
        return this.map[x][y] == BoardCellType.EMPTY;
    }

    public setCellAt(x: number, y: number, type: BoardCellType){
        this.map[x][y] = type;
    }
}
