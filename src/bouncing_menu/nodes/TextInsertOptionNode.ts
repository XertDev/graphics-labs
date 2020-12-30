import * as Cannon from "cannon";
import * as THREE from "three";
import LabelMenuOption from "../menu_config/LabelMenuOption";
import TextInsertMenuOption from "../menu_config/TextInsertMenuOption";
import LabelOptionNode from "./LabelOptionNode";

export default class TextInsertOptionNode extends LabelOptionNode {
    private _currentPos = 0;
    private _default: string;
    private _fullLength = 0;
    private _value: string;
    private _acceptable = false;

    private _textSettings: THREE.TextGeometryParameters;
    private _acceptColor: THREE.Color;
    private _color: THREE.Color;

    private _onAccept: (value: string) => void;

    constructor(menuOption: TextInsertMenuOption, world: Cannon.World, frustum: THREE.Frustum) {
        super(
            new LabelMenuOption(menuOption.defaultValue.repeat(menuOption.length), menuOption.color, menuOption.textSettings),
            world, frustum
        );

        this._textSettings = menuOption.textSettings;
        this._value = "";
        this._fullLength = menuOption.length;
        this._default = menuOption.defaultValue;
        this._color = menuOption.color;
        this._acceptColor = menuOption.acceptColor;
        this._onAccept = menuOption.onAccept;
    }

    public onKeyUp(event: KeyboardEvent): void {
        if(event.key === "Backspace") {
            if(this._currentPos > 0) {
                --this._currentPos;
                this.updateValue(this._currentPos, this._default);
                this._value = this._value.slice(-1);
                if(this._acceptable) {
                    this._letters.forEach(letter => {
                        letter.material = new THREE.MeshLambertMaterial({color: this._color});
                    })
                }
                this._acceptable = false;
            }

        } else if(this._currentPos < this._fullLength) {
            this.updateValue(this._currentPos, event.key);
            ++this._currentPos;
            this._value += event.key;
            if(this._currentPos == this._fullLength) {
                this._acceptable = true;
                this._letters.forEach(letter => {
                    letter.material = new THREE.MeshLambertMaterial({color: this._acceptColor});
                })
            }
        }
    }
    onClick(intersection: THREE.Intersection): boolean {
        for(let letter of this._letters) {
            if(letter === intersection.object) {
                const face = intersection.face;
                if(this._acceptable) {
                    const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-50);
                    letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                    this._onAccept(this._value);
                    return true;
                } else {
                    const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-10);
                    letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                    return false;
                }
            }
        }
    }

    private updateValue(index:number, val: string) {
        const letter = this._letters[index];
        letter.geometry = new THREE.TextBufferGeometry(val, this._textSettings);
        letter.geometry.computeBoundingBox();
        letter.geometry.computeBoundingSphere();
        letter.size = letter.geometry.boundingBox.getSize(new THREE.Vector3());
        const {x, y, z} = letter.size;
        const letterBox = new Cannon.Box(new Cannon.Vec3(x / 2, y / 2, z / 2));

        const {center} = letter.geometry.boundingSphere;
        letter.body.shapes = [];
        letter.body.addShape(letterBox, new Cannon.Vec3(center.x, center.y, center.z));
        letter.body.updateMassProperties();
    }

    public fall(): void {
        super.fall();
    }
}
