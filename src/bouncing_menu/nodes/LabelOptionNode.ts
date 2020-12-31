import * as THREE from "three/src/Three";
import * as Cannon from "cannon"
import LabelMenuOption from "../menu_config/LabelMenuOption";
import HangedTextNode from "./HangedTextNode";

export default class LabelOptionNode extends HangedTextNode {
    private _clipboardOnClick: boolean;
    private _value: string;

    constructor(menuOption: LabelMenuOption, world: Cannon.World, frustum: THREE.Frustum) {
        super(menuOption, world, frustum);

        this._clipboardOnClick = menuOption.clipboardOnClick;
        this._value = menuOption.name;

    }

    onClick(intersection: THREE.Intersection): boolean {
       if(super.onClick(intersection)) {
           navigator.clipboard.writeText(this._value);
       }
       return false;
    }
}
