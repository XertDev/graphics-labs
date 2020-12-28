import * as THREE from "three";
import * as Cannon from "cannon"
import CallbackMenuOption from "./menu_config/CallbackMenuOption";
import OptionNode from "./nodes/OptionNode";
import CallbackOptionNode from "./nodes/CallbackOptionNode";
import set = Reflect.set;

export default class JellyMenu {
    private _options = new Array<OptionNode>();
    private _camera: THREE.Camera;
    private _scene: THREE.Scene;
    private _raycaster = new THREE.Raycaster();

    constructor(scene: THREE.Scene, camera: THREE.Camera, menu: CallbackMenuOption[], offsetY: number, world: Cannon.World) {
        this._camera = camera;
        this._scene = scene;
        let optionsHeight = offsetY * (menu.length-1);
        const menuGroup = new THREE.Group();

        menu.reverse().forEach((option, index) => {
            let optionNode: OptionNode;
            if(option instanceof CallbackMenuOption) {
                optionNode = new CallbackOptionNode(option, world);
                this._options.push(optionNode);
                const nodeGroup = optionNode.getGroup();
                optionNode.translateX(-optionNode.getWidth()/2);
                menuGroup.add(nodeGroup);
            }
            optionsHeight += optionNode.getHeight();
        });
        scene.add(menuGroup);
        const rowOffset = optionsHeight / menu.length;
        let currentOffset = optionsHeight/2;

        for(let i = 0; i < menu.length; ++i) {
            this._options[i].translateY(currentOffset);
            currentOffset -= rowOffset + offsetY;
        }
    };

    public update(deltaTime: number) {
        this._options.forEach(option => {
            option.update(deltaTime);
        });
    };

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
