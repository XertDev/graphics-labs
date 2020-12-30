import * as THREE from "three";

export default class MenuOption{
    color: THREE.Color;
    textSettings: THREE.TextGeometryParameters;


    constructor(color: THREE.Color, textSettings: THREE.TextGeometryParameters) {
        this.color = color;
        this.textSettings = textSettings;
    }
}
