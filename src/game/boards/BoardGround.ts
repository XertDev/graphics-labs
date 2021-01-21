import * as THREE from "three";
import * as Cannon from "cannon";
import AnimatedObject from "../../utils/AnimatedObject";

const grassURL = require("../../assets/images/grass.png");

export class BoardGround {
    private islandGroup = new THREE.Group();
    private groundBody: Cannon.Body;

    public map: THREE.Mesh[][] = [];

    readonly groundMaterial = new Cannon.Material("groundMaterial");

    public readonly boardWidth;
    public readonly boardHeight;

    private eagleStep = 0;
    private radius: number;

    constructor(
        private scene: THREE.Scene,
        private world: Cannon.World,
        private readonly width: number,
        private readonly height: number,
        public readonly cellSpace: number,
        public readonly cellSize: number,
        private readonly border: number,
        private readonly depth,
        private eagle: AnimatedObject
    ) {

        this.boardWidth = this.width * this.cellSize + (this.width-1)*this.cellSpace;
        this.boardHeight = this.height * this.cellSize + (this.height - 1)*this.cellSpace;

        for(let i = 0; i < this.height; ++i) {
            this.map[i] = [];
        }

        this.buildIsland();
        this.buildCells();
        this.createGround();

        this.scene.add(this.islandGroup);
    }

    public setCellColor(x: number, y: number, color: string) {
        this.map[y][x].material = new THREE.MeshLambertMaterial({
            color: color,
            side: THREE.DoubleSide
        });
    }

    private buildIsland() {
        this.radius = Math.hypot(this.boardWidth, this.boardHeight)/2 + this.border;
        const boardGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.depth, 100);
        const texture = new THREE.TextureLoader().load( grassURL );
        texture.repeat.set(1,1);

        const material = new THREE.MeshLambertMaterial({ map: texture });

        const mesh = new THREE.Mesh(boardGeometry, material);
        this.islandGroup.add(mesh);
        this.eagle.play("Flying");

        this.scene.add(this.eagle.root)
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
            line.rotateX(Math.PI/2);
            line.position.set(offsetX, this.depth/2, 0);
            this.islandGroup.add(line);
            offsetX += this.cellSpace + this.cellSize;
        }

        for(let i = 0; i < this.height+1; ++i) {
            const geometry = new THREE.CylinderGeometry(this.cellSpace/2, this.cellSpace/2, fullWidth);
            const line = new THREE.Mesh(geometry, material);
            line.rotateZ(Math.PI/2);
            line.position.set(0, this.depth/2, offsetZ);
            this.islandGroup.add(line);
            offsetZ += this.cellSpace + this.cellSize;
        }

        const geometry = new THREE.PlaneGeometry(this.cellSize, this.cellSize);
        geometry.translate(-this.cellSpace/2, 0, -this.cellSpace/2);
        geometry.rotateX(Math.PI/2);

        const cellMaterialBlack = new THREE.MeshLambertMaterial({
            color: "black",
            side: THREE.DoubleSide
        });
        const cellMaterialWhite = new THREE.MeshLambertMaterial({
            color: "white",
            side: THREE.DoubleSide
        });

        const whiteCell = new THREE.Mesh(geometry, cellMaterialWhite);
        const blackCell = new THREE.Mesh(geometry, cellMaterialBlack);

        for(let i = 0; i < this.height; ++i) {
            for(let j = 0; j < this.width; ++j) {
                const center = this.getCellCenter(i, j);
                let cell: THREE.Mesh;
                if((i+j)%2 == 0) {
                    cell = whiteCell.clone();
                } else {
                    cell = blackCell.clone();
                }
                const {x, y, z} = center;
                cell.position.set(x, y + 0.1, z);
                this.map[i].push(cell);
                this.islandGroup.add(cell);
            }
        }
    }

    public createGround() {
        const groundShape = new Cannon.Plane();
        this.groundBody = new Cannon.Body({
            mass: 0,
            material: this.groundMaterial,
        });

        this.groundBody.addShape(groundShape);
        this.groundBody.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), -Math.PI/2);
        this.groundBody.position.set(0, 0, 0);

        this.world.addBody(this.groundBody);
    };

    public getCellCenter(x: number, y: number): Cannon.Vec3 {
        return new Cannon.Vec3(
            -this.boardWidth/2 + this.cellSpace * (x+1) + this.cellSize * x + this.cellSize/2,
            this.depth/2,
            -this.boardWidth/2 + this.cellSpace * (y+1) + this.cellSize * y + this.cellSize/2,
        );
    };

    public update(deltaTime: number) {
        this.eagle.root.position.set(
            Math.cos(this.eagleStep) * this.radius,
            10,
            Math.sin(this.eagleStep) * this.radius
            );
        this.eagle.update(deltaTime/2);
        this.eagle.root.lookAt(new THREE.Vector3());
        this.eagle.root.rotateY(-Math.PI/2);
        this.eagleStep += 0.01;
    };

    public dispose() {
        this.scene.remove(this.eagle.root);
        this.scene.remove(this.islandGroup);
        this.world.remove(this.groundBody);
    };
}
