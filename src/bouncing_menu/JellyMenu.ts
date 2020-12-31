import * as THREE from "three";
import * as Cannon from "cannon"
import CallbackMenuOption from "./menu_config/CallbackMenuOption";
import OptionNode from "./nodes/OptionNode";
import CallbackOptionNode from "./nodes/CallbackOptionNode";
import LabelMenuOption from "./menu_config/LabelMenuOption";
import LabelOptionNode from "./nodes/LabelOptionNode";
import MenuOption from "./menu_config/MenuOption";
import TextInsertMenuOption from "./menu_config/TextInsertMenuOption";
import TextInsertOptionNode from "./nodes/TextInsertOptionNode";

export default class JellyMenu {
    private options = new Array<OptionNode>();
    private raycaster = new THREE.Raycaster();
    private frustum = new THREE.Frustum();

    private insertOptions = new Array<TextInsertOptionNode>();
    private currentInsertOptionIndex = 0;

    constructor(
        private readonly scene: THREE.Scene,
        world: Cannon.World,
        private readonly camera: THREE.Camera,
        menu: MenuOption[],
        offsetY=0
    ) {
        camera.updateMatrix();
        camera.updateMatrixWorld();

        this.frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

        let optionsHeight = offsetY * (menu.length-1);

        menu.forEach((option) => {
            let optionNode: OptionNode;
            if(option instanceof CallbackMenuOption) {
                optionNode = new CallbackOptionNode(option, scene, world, this.frustum);
            } else if(option instanceof LabelMenuOption) {
                optionNode = new LabelOptionNode(option, scene, world, this.frustum);

            } else if(option instanceof TextInsertMenuOption) {
                optionNode = new TextInsertOptionNode(option, scene, world, this.frustum);
                this.insertOptions.push(<TextInsertOptionNode>optionNode);
            }
            this.options.push(optionNode);
            optionNode.translateX(-optionNode.width/2);

            optionsHeight += optionNode.height;
        });

        const rowOffset = optionsHeight / menu.length;
        let currentOffset = optionsHeight/2;

        for(let i = 0; i < menu.length; ++i) {
            this.options[i].translateY(currentOffset);
            currentOffset -= rowOffset + offsetY;
        }
    };

    public update(deltaTime: number) {
        this.options.forEach(option => {
            option.update(deltaTime);
        });
    };

    public visible(): boolean {
        return this.options.some(option => {
            return option.visible();
        })
    }

    public dispose(): void {
        this.options.forEach(option => {
            option.dispose();
        })
    }

    onKeyUp(event: KeyboardEvent): void {
        if(this.insertOptions.length > 0) {
            if(event.key === "ArrowUp") {
                --this.currentInsertOptionIndex;
                this.currentInsertOptionIndex %= this.insertOptions.length;
            } else if(event.key ==="ArrowDown") {
                ++this.currentInsertOptionIndex;
                this.currentInsertOptionIndex %= this.insertOptions.length;
            } else if(event.key === "Backspace") {
                this.insertOptions[this.currentInsertOptionIndex].onKeyUp(event);
            } else if(
                event.key.length == 1
                && (
                    event.key >= "a" && event.key <= "z"
                    || event.key >= "0" && event.key <= "9"
                )
            ){
                this.insertOptions[this.currentInsertOptionIndex].onKeyUp(event);
            }
        }
    }

    public onClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersections = this.raycaster.intersectObjects(this.scene.children, true);
        if(intersections.length > 0) {
            const target = intersections[0];
            for(let option of this.options) {
                if(option.onClick(target)) {
                    setTimeout(() => {
                        this.options.forEach((op) => {
                            op.fall();
                        })
                    }, 500);
                    break;
                }
            }
        }

    }
}
