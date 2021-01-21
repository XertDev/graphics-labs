export enum BoardCellType {
  EMPTY = 0,
  HOST = 1,
  CLIENT = 2
}

export class Board {
    private map: BoardCellType[][];

    constructor(readonly width: number, readonly height: number) {
    }

    public generate() {
        this.map = [];
        for(let i = 0; i < this.height; ++i) {
            this.map[i] = [];
            for(let j = 0; j < this.width; ++j) {
                this.map[i][j] = BoardCellType.EMPTY;
            }
        }

        this.placeHostCheckers();
        this.placePeerCheckers();
    }

    get boardMap() {
        return this.map;
    }

    set boardMap(map: BoardCellType[][]) {
        this.map = map;
    }

    public isWhiteCell(x: number, y: number) {
        return (x+y) % 2 == 0;
    }

    private placePeerCheckers() {
        for(let i = 0; i < 3; ++i) {
            for(let j = 0; j < this.width; ++j) {
                if(this.isWhiteCell(this.height - i - 1, j)){
                    this.map[this.height - i - 1][j] = BoardCellType.CLIENT;
                }
            }
        }
    }

    private placeHostCheckers() {
        for(let i = 0; i < 3; ++i) {
            for(let j = 0; j < this.width; ++j) {
                if(this.isWhiteCell(i, j)){
                    this.map[i][j] = BoardCellType.HOST;
                }
            }
        }
    }

    public cellAt(x: number, y: number) {
        return this.map[y][x];
    }

    public isEmptyCell(x: number, y:number) {
        return this.map[y][x] == BoardCellType.EMPTY;
    }

    public setCellAt(x: number, y: number, type: BoardCellType){
        this.map[y][x] = type;
    }
}
