import * as THREE from "three";
import MenuOption from "./MenuOption";

export default class LabelMenuOption extends MenuOption {
    textSettings: THREE.TextGeometryParameters;
    name: string;

    constructor(name: string, color: THREE.Color, textSettings: THREE.TextGeometryParameters) {
        super(color);
        this.textSettings = textSettings;
        this.name = name;
    }

}
