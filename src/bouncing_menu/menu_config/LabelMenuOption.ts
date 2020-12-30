import * as THREE from "three";
import MenuOption from "./MenuOption";

export default class LabelMenuOption extends MenuOption {
    name: string;

    constructor(name: string, color: THREE.Color, textSettings: THREE.TextGeometryParameters) {
        super(color, textSettings);
        this.textSettings = textSettings;
        this.name = name;
    }

}
