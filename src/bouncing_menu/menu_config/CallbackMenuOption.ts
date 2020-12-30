import {Color, TextGeometryParameters} from "three/src/Three";
import LabelMenuOption from "./LabelMenuOption";

export default class CallbackMenuOption extends LabelMenuOption{
    name: string;
    callback: () => void;

    constructor(name: string, color: Color, textSettings: TextGeometryParameters, callback: () => void) {
        super(name, color, textSettings);
        this.name = name;
        this.callback = callback;
        this.textSettings = textSettings;
    }
}
