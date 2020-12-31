import * as THREE from "three/src/Three";
import * as Cannon from "cannon"
import LabelMenuOption from "../menu_config/LabelMenuOption";
import HangedTextNode from "./HangedTextNode";

export default class LabelOptionNode extends HangedTextNode {
    private clipboardOnClick: boolean;
    private readonly value: string;

    constructor(menuOption: LabelMenuOption, scene: THREE.Scene, world: Cannon.World, frustum: THREE.Frustum) {
        super(menuOption, scene, world, frustum);

        this.clipboardOnClick = menuOption.clipboardOnClick;
        this.value = menuOption.name;
    }

    onClick(intersection: THREE.Intersection): boolean {
       if(super.onClick(intersection)) {
           navigator.clipboard.writeText(this.value);
       }
       return false;
    }
}
