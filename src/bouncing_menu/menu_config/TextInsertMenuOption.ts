import * as THREE from "three";
import MenuOption from "./MenuOption";

export default class TextInsertMenuOption extends MenuOption{
    defaultValue: string;
    length: number;
    onAccept: (value: string) => void;
    acceptColor: THREE.Color;


    constructor(
        defaultValue: string, length: number,
        color: THREE.Color, acceptColor: THREE.Color,
        textSettings: THREE.TextGeometryParameters,
        onAccept: (value: string) => void
    ) {
        super(color, textSettings);
        this.acceptColor = acceptColor;
        this.defaultValue = defaultValue;
        this.length = length;
        this.onAccept = onAccept;
    }
}
