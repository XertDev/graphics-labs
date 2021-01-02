import * as THREE from "three";
import * as Cannon from "cannon";

const grassURL = require("../assets/images/grass.png");

export class BoardGround {
    private group = new THREE.Group();

    public readonly boardWidth;
    public readonly boardHeight;

    constructor(
        readonly width: number,
        readonly height: number,
        readonly cellSpace: number,
        readonly cellSize: number,
        readonly border: number,
        readonly depth) {

            this.boardWidth = this.width * this.cellSize + (this.width-1)*this.cellSpace;
            this.boardHeight = this.height * this.cellSize + (this.height - 1)*this.cellSpace;
            this.buildIsland();
            this.buildCells();
    }

    private buildIsland() {


        const radius = Math.hypot(this.boardWidth, this.boardHeight)/2 + this.border;
        const boardGeometry = new THREE.CylinderGeometry(radius, radius, this.depth, 100);
        const texture = new THREE.TextureLoader().load( grassURL );
        texture.repeat.set(1,1);

        const material = new THREE.MeshLambertMaterial({ map: texture });

        const mesh = new THREE.Mesh(boardGeometry, material);
        this.group.add(mesh);
    }

    private buildCells() {
        const fullWidth = this.width * this.cellSize + this.width * this.cellSpace;
        const fullHeight = this.height * this.cellSize + this.height * this.cellSpace;

        let offsetX = -fullWidth/2;
        let offsetZ = -fullHeight/2;
        const material = new THREE.MeshBasicMaterial({
            color: 0xb86e14,
        });

        for(let i = 0; i < this.width+1; ++i) {
            const geometry = new THREE.CylinderGeometry(this.cellSpace/2, this.cellSpace/2, fullHeight);
            const line = new THREE.Mesh(geometry, material);
            line.rotateX(Math.PI/2)
            line.position.set(offsetX, this.depth/2, 0);
            this.group.add(line);
            offsetX += this.cellSpace + this.cellSize;
        }

        for(let i = 0; i < this.height+1; ++i) {
            const geometry = new THREE.CylinderGeometry(this.cellSpace/2, this.cellSpace/2, fullWidth);
            const line = new THREE.Mesh(geometry, material);
            line.rotateZ(Math.PI/2)
            line.position.set(0, this.depth/2, offsetZ);
            this.group.add(line);
            offsetZ += this.cellSpace + this.cellSize;
        }
    }

    public getCellCenter(x: number, y: number): Cannon.Vec3 {
        return new Cannon.Vec3(
            -this.boardWidth/2 + this.cellSpace * (x+1) + this.cellSize * x + this.cellSize/2,
            this.depth/2,
            -this.boardWidth/2 + this.cellSpace * (y+1) + this.cellSize * y + this.cellSize/2,
        )
    }

    getGroup(): THREE.Group {
        return this.group;
    }
}
