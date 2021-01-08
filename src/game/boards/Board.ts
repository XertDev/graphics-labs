export enum BoardCellType {
  EMPTY = 0,
  DESTROYABLE = 1,
  UNDESTROYABLE = 2
}

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
        this.buildStoneInsideMap();
        this.buildBoxInsideMap();
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

    private buildStoneInsideMap() {
        for (let i = 2; i < this.width; i = i+2) {
            for (let j = 2; j < this.height; j = j+2) {
                this.map[j][i] = BoardCellType.UNDESTROYABLE;
            }
        }
    }

    private buildBoxInsideMap() {
        const numOfBoxes= Math.floor(this.width * this.height / 10);
        for (let num = 0; num < numOfBoxes; num++){
            let x;
            let y;
            do {
            x = Math.floor(Math.random() * (this.width - 2)) + 1;
            y = Math.floor(Math.random() * (this.height - 2)) + 1;
            } while(
                (x == 1 && y == 1)
                || (x == 1 && y == 2)
                || (x == 2 && y == 1)
                || (x == this.width-2 && y == this.height - 2)
                || (x == this.width-3 && y == this.height - 2)
                || (x == this.width-2 && y == this.height - 3)
                || this.map[x][y] != BoardCellType.EMPTY)
            this.map[x][y] = BoardCellType.DESTROYABLE;
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
