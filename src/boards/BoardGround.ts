import * as THREE from "three";

const grassURL = require("../assets/images/grass.png");

export class BoardGround {
    private _group = new THREE.Group();

    constructor(
        readonly width: number,
        readonly height: number,
        readonly cellSpace: number,
        readonly cellSize: number,
        readonly border: number,
        readonly depth) {
            this.buildIsland();
            this.buildCells();
    }

    private buildIsland() {
        const maxWidth = this.width * this.cellSize + (this.width-1)*this.cellSpace;
        const maxHeight = this.height * this.cellSize + (this.height - 1)*this.cellSpace;

        const radius = Math.hypot(maxWidth, maxHeight)/2 + this.border;
        const boardGeometry = new THREE.CylinderGeometry(radius, radius, this.depth, 100);
        const texture = new THREE.TextureLoader().load( grassURL );
        texture.repeat.set(1,1);

        const material = new THREE.MeshLambertMaterial({ map: texture });

        const mesh = new THREE.Mesh(boardGeometry, material);
        this._group.add(mesh);
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
            this._group.add(line);
            offsetX += this.cellSpace + this.cellSize;
        }

        for(let i = 0; i < this.height+1; ++i) {
            const geometry = new THREE.CylinderGeometry(this.cellSpace/2, this.cellSpace/2, fullWidth);
            const line = new THREE.Mesh(geometry, material);
            line.rotateZ(Math.PI/2)
            line.position.set(0, this.depth/2, offsetZ);
            this._group.add(line);
            offsetZ += this.cellSpace + this.cellSize;
        }
    }

    getGroup(): THREE.Group {
        return this._group;
    }
}
