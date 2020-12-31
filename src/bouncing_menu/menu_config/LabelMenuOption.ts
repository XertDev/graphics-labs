import * as THREE from "three";
import TextMenuOption from "./TextMenuOption";

export default class LabelMenuOption extends TextMenuOption {
    constructor(
        name: string,
        color: THREE.Color,
        textSettings: THREE.TextGeometryParameters,
        public readonly clipboardOnClick: boolean
    ) {
        super(name, color, textSettings);
    }

}
