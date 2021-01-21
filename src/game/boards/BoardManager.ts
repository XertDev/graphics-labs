import * as THREE from "three/src/Three"
import * as Cannon from "cannon";
import {BoardGround} from "./BoardGround";
import {Board, BoardCellType} from "./Board";
import {FieldEntity} from "./FieldEntity";
import AnimatedObject from "../../utils/AnimatedObject";
import AnimatedBodyObject from "../../utils/AnimatedBodyObject";
import ConnectionController from "../../connection_controller/ConnectionController";


export class BoardManager {
    private selectedFieldX;
    private selectedFieldY;
    private selected = false;

    private map: AnimatedBodyObject[][] = [];

    private boardGround: BoardGround;
    private board: Board;
    static readonly CELL_SIZE = 2;
    static readonly CELL_SPACE = 0.1;
    static readonly BORDER = 3;
    static readonly DEPTH = 0.8;

    private raycaster = new THREE.Raycaster();

    private entities = new Array<FieldEntity>();

    constructor(
        readonly width: number,
        readonly height: number,
        private scene: THREE.Scene,
        private world: Cannon.World,
        private camera: THREE.Camera,
        private connectionController: ConnectionController,
        private isHost: boolean,
        private hostModel: AnimatedBodyObject,
        private clientModel: AnimatedBodyObject,
        eagle: AnimatedObject
    ){
        this.boardGround = new BoardGround(
            scene, world,
            this.width, this.height,
            BoardManager.CELL_SPACE, BoardManager.CELL_SIZE,
            BoardManager.BORDER,
            BoardManager.DEPTH,
            eagle
        );
        for(let i = 0; i < this.height; ++i) {
            this.map[i] = [];
            for(let j = 0; j < this.width; ++j) {
                this.map[i].push(null);
            }
        }
    }

    public generateBoard() {
        this.board = new Board(this.width, this.height);
        this.board.generate();
    }

    public get boardWidth() {
        return this.boardGround.boardWidth;
    }

    public get boardHeight() {
        return this.boardGround.boardHeight;
    }

    public get boardMaterial() {
        return this.boardGround.groundMaterial;
    }

    public getBoardCellCenter(x: number, y: number) {
        return this.boardGround.getCellCenter(x, y);
    }

    public isWhiteCell(x: number, y: number) {
        return this.board.isWhiteCell(x, y);
    }

    public loadBoard(map: BoardCellType[][]) {
        this.board = new Board(this.width, this.height);
        this.board.boardMap = map;
    }

    public get boardMap() {
        return this.board.boardMap;
    }

    public createFullMap() {
        this.entities.forEach(entity => {
            entity.dispose();
        });
        this.entities = new Array<FieldEntity>();

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < this.width; ++j) {
                if (this.isWhiteCell(this.height - i - 1, j)) {
                    const checker = this.clientModel.clone();
                    checker.position = this.boardGround.getCellCenter(this.height - i - 1, j);
                    this.map[this.height - i - 1][j] = checker;
                    this.scene.add(checker.root);
                }
            }
        }

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < this.width; ++j) {
                if (this.isWhiteCell(i, j)) {
                    const checker = this.hostModel.clone();
                    checker.position = this.boardGround.getCellCenter(i, j);
                    this.map[i][j] = checker;
                    this.scene.add(checker.root);
                }
            }
        }
    }

    update(elapsedTime: number) {
        this.boardGround.update(elapsedTime);
    }

    moveCheeker(startX: number, startY: number, endX: number, endY: number, local: boolean) {
        if(
            Math.abs( endY - startY) == 1
            && Math.abs(endX - startX) == 1
            && (
                (this.board.cellAt(endY, endX) != BoardCellType.HOST && this.isHost)
                || (this.board.cellAt(endY, endX) != BoardCellType.CLIENT && !this.isHost)
            )
        )   {
            if(this.map[endY][endX] == null) {
                const cheeker = this.map[startY][startX];
                this.map[startY][startX] = null;
                if((this.board.cellAt(endY, endX) == BoardCellType.HOST && !this.isHost)
                    || (this.board.cellAt(endY, endX) == BoardCellType.CLIENT && this.isHost)
                ) {
                    this.scene.remove(this.map[endY][endX].root);
                }
                this.map[endY][endX] = cheeker;
                this.board.setCellAt(endY, endX, (this.isHost && local)? BoardCellType.HOST: BoardCellType.CLIENT);
                this.board.setCellAt(startY, startX, BoardCellType.EMPTY);
                if(local) {
                    this.connectionController.sendToPeer(
                        "move",
                        {
                            "startX": startX,
                            "startY": startY,
                            "endX": endX,
                            "endY": endY
                        }

                    )
                }

                cheeker.position =  this.getBoardCellCenter(endY, endX);
            }
        }
    }

    onClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersections = this.raycaster.intersectObjects(this.scene.children, true);
        for(let i = 0; i < this.height; ++i) {
            for(let j = 0; j < this.width; ++j) {
                if(intersections.length > 0) {
                    const target = intersections[0].object;
                    if(target === this.boardGround.map[i][j]) {
                        if(this.selected) {
                            if(this.isWhiteCell(this.selectedFieldX, this.selectedFieldY)) {
                                this.boardGround.setCellColor(this.selectedFieldX, this.selectedFieldY, "white")
                            } else {
                                this.boardGround.setCellColor(this.selectedFieldX, this.selectedFieldY, "black")
                            }
                        }
                        if(this.selectedFieldY != i || this.selectedFieldX != j) {
                            if(
                                (this.board.cellAt(j, i) == BoardCellType.HOST && this.isHost)
                                || (this.board.cellAt(j, i) == BoardCellType.CLIENT && !this.isHost)
                            ) {
                                this.selectedFieldX = j;
                                this.selectedFieldY = i;
                                this.boardGround.setCellColor(this.selectedFieldX, this.selectedFieldY, "grey");
                                this.selected = true;
                            } else {
                                this.moveCheeker(this.selectedFieldX, this.selectedFieldY, j, i, true);
                            }
                        } else {
                            this.selectedFieldY = undefined;
                            this.selectedFieldX = undefined;
                            this.selected = false;
                        }
                    }
                }
            }
        }
    }
}

