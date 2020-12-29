import * as THREE from "three/src/Three";
import MenuOption from "./MenuOption";
import {Color, TextGeometryParameters} from "three/src/Three";

export default class CallbackMenuOption extends MenuOption{
    name: string;
    callback: () => void;
    textSettings: THREE.TextGeometryParameters;

    constructor(name: string, color: Color, textSettings: TextGeometryParameters, callback: () => void) {
        super(color);
        this.name = name;
        this.callback = callback;
        this.textSettings = textSettings;
    }
}
