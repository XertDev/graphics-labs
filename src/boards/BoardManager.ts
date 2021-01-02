import * as THREE from "three/src/Three"
import * as Cannon from "cannon";
import { BoardGround } from "./BoardGround";
import { Board } from "./Board";
import { FieldEntity} from "./FieldEntity";
import { BoardCellType } from "./Board";
import { DestroyableFieldEntity } from './DestroyableFieldEntity';
import { UndestroyableFieldEntity } from './UndestroyableFieldEntity';


export class BoardManager {
    private boardGround: BoardGround;
    private board: Board;
    readonly CELL_SIZE = 2;
    readonly CELL_SPACE = 0.1;
    readonly BORDER = 3;
    readonly DEPTH = 0.8;

    private entities = new Array<FieldEntity>();

    constructor(
        readonly width: number,
        readonly height: number,
        private scene: THREE.Scene,
        private world: Cannon.World,
        private stones: Array<THREE.Object3D>,
        private boxes: Array<THREE.Object3D>,
        private numOfStones: number,
        private numOfBoxes: number
    ){
        this.board = new Board(this.width, this.height);

        this.boardGround = new BoardGround(
            this.width, this.height,
            this.CELL_SPACE, this.CELL_SIZE,
            this.BORDER,
            this.DEPTH
        );

        scene.add(this.boardGround.getGroup());
    }

    public createFullMap() {
      this.entities.forEach(entity => {
        entity.dispose();
      });
      this.entities = new Array<FieldEntity>();

      for(let i = 0; i < this.height; ++i) {
        for(let j = 0; j < this.width; ++j) {
          const cellType = this.board.cellAt(i, j);
          if(cellType != BoardCellType.EMPTY) {
              const pos = this.boardGround.getCellCenter(i, j);
              let entity: FieldEntity = null;
              if(cellType == BoardCellType.UNDESTROYABLE) {
                entity = new UndestroyableFieldEntity(this.stones, this.scene, this.world, this.boardGround.cellSize);
              } else if(cellType == BoardCellType.DESTROYABLE) {
                entity = new DestroyableFieldEntity(this.boxes, this.scene, this.world, this.boardGround.cellSize);
              }
              entity.position = pos;
              this.entities.push(entity);
          }
        }
      }
    }
}
