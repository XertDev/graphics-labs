import * as THREE from "three";
import * as Cannon from "cannon"
import CallbackMenuOption from "./menu_config/CallbackMenuOption";
import OptionNode from "./nodes/OptionNode";
import CallbackOptionNode from "./nodes/CallbackOptionNode";
import set = Reflect.set;
import LabelMenuOption from "./menu_config/LabelMenuOption";
import LabelOptionNode from "./nodes/LabelOptionNode";
import MenuOption from "./menu_config/MenuOption";
import TextInsertMenuOption from "./menu_config/TextInsertMenuOption";
import TextInsertOptionNode from "./nodes/TextInsertOptionNode";

export default class JellyMenu {
    private _options = new Array<OptionNode>();
    private _camera: THREE.Camera;
    private _scene: THREE.Scene;
    private _raycaster = new THREE.Raycaster();
    private _frustum = new THREE.Frustum();
    private _menuGroup = new THREE.Group();

    private _insertOptions = new Array<TextInsertOptionNode>();
    private _currentInsertOptionIndex = 0;

    constructor(scene: THREE.Scene, camera: THREE.Camera, menu: MenuOption[], offsetY: number, world: Cannon.World) {
        this._camera = camera;
        camera.updateMatrix();
        camera.updateMatrixWorld();
        this._frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        this._scene = scene;
        let optionsHeight = offsetY * (menu.length-1);

        menu.forEach((option) => {
            let optionNode: OptionNode;
            if(option instanceof CallbackMenuOption) {
                optionNode = new CallbackOptionNode(option, world, this._frustum);
            } else if(option instanceof LabelMenuOption) {
                optionNode = new LabelOptionNode(option, world, this._frustum);

            } else if(option instanceof TextInsertMenuOption) {
                optionNode = new TextInsertOptionNode(option, world, this._frustum);
                this._insertOptions.push(<TextInsertOptionNode>optionNode);
            }
            this._options.push(optionNode);
            const nodeGroup = optionNode.getGroup();
            optionNode.translateX(-optionNode.getWidth()/2);
            this._menuGroup.add(nodeGroup);

            optionsHeight += optionNode.getHeight();
        });
        const rowOffset = optionsHeight / menu.length;
        let currentOffset = optionsHeight/2;

        for(let i = 0; i < menu.length; ++i) {
            this._options[i].translateY(currentOffset);
            currentOffset -= rowOffset + offsetY;
        }
        this._scene.add(this._menuGroup);
    };

    public update(deltaTime: number) {
        this._options.forEach(option => {
            option.update(deltaTime);
        });
    };

    public visible(): boolean {
        return this._options.some(option => {
            return option.visible();
        })
    }

    public onDestroy(): void {
        this._scene.remove(this._menuGroup);
        this._options.forEach(option => {
            option.onDestroy();
        })
    }

    onKeyUp(event: KeyboardEvent): void {
        if(this._insertOptions.length > 0) {
            if(event.key === "ArrowUp") {
                --this._currentInsertOptionIndex;
                this._currentInsertOptionIndex %= this._insertOptions.length;
            } else if(event.key ==="ArrowDown") {
                ++this._currentInsertOptionIndex;
                this._currentInsertOptionIndex %= this._insertOptions.length;
            } else if(event.key === "Backspace") {
                this._insertOptions[this._currentInsertOptionIndex].onKeyUp(event);
            } else if(
                event.key.length == 1
                && (
                    event.key >= "a" && event.key <= "z"
                    || event.key >= "0" && event.key <= "9"
                )
            ){
                this._insertOptions[this._currentInsertOptionIndex].onKeyUp(event);
            }
        }
    }

    public onClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this._raycaster.setFromCamera(mouse, this._camera);
        const intersections = this._raycaster.intersectObjects(this._scene.children, true);
        if(intersections.length > 0) {
            const target = intersections[0];
            for(let option of this._options) {
                if(option.onClick(target)) {
                    setTimeout(() => {
                        this._options.forEach((op) => {
                            op.fall();
                        })
                    }, 500);
                    break;
                }
            }
        }

    }
}