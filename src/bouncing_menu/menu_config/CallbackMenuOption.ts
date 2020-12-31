import {Color, TextGeometryParameters} from "three/src/Three";
import TextMenuOption from "./TextMenuOption";

export default class CallbackMenuOption extends TextMenuOption{
    constructor(
        name: string,
        color: Color,
        textSettings: TextGeometryParameters,
        public readonly callback: () => void
    ) {
        super(name, color, textSettings);
    }
}
