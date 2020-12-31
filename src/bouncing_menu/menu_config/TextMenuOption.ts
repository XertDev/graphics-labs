import * as THREE from "three";
import MenuOption from "./MenuOption";

export default class TextMenuOption extends MenuOption {
    constructor(
        public readonly name: string,
        color: THREE.Color,
        textSettings: THREE.TextGeometryParameters,
    ) {
        super(color, textSettings);
    }
}
