import * as THREE from "three/src/Three";

export default class CallbackMenuOption {
    name: string;
    callback: () => void;
    color: THREE.Color;
    textSettings: THREE.TextGeometryParameters;

    constructor(name: string, callback: () => void, color: THREE.Color, textSettings: THREE.TextGeometryParameters) {
        this.name = name;
        this.callback = callback;
        this.color = color;
        this.textSettings = textSettings;
    }
}
