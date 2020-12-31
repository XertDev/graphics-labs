import * as THREE from "three";
import MenuOption from "./MenuOption";

export default class TextInsertMenuOption extends MenuOption{
    constructor(
        public readonly defaultValue: string,
        public readonly length: number,
        color: THREE.Color,
        public readonly acceptColor: THREE.Color,
        textSettings: THREE.TextGeometryParameters,
        public readonly onAccept: (value: string) => void
    ) {
        super(color, textSettings);
    };
};
