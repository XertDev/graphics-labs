import * as Cannon from "cannon";
import * as THREE from "three";
import TextInsertMenuOption from "../menu_config/TextInsertMenuOption";
import HangedTextNode from "./HangedTextNode";
import TextMenuOption from "../menu_config/TextMenuOption";

export default class TextInsertOptionNode extends HangedTextNode {
    private currentPos = 0;
    private readonly defaultValue: string;
    private readonly fullLength;
    private currentValue: string;
    private acceptable = false;

    private readonly textSettings: THREE.TextGeometryParameters;
    private readonly acceptColor: THREE.Color;
    private readonly color: THREE.Color;

    private readonly onAccept: (value: string) => void;

    constructor(menuOption: TextInsertMenuOption, scene: THREE.Scene, world: Cannon.World, frustum: THREE.Frustum) {
        super(
            new TextMenuOption(
                menuOption.defaultValue.repeat(menuOption.length),
                menuOption.color,
                menuOption.textSettings,
            ),
            scene, world, frustum
        );

        this.textSettings = menuOption.textSettings;
        this.currentValue = "";
        this.fullLength = menuOption.length;
        this.defaultValue = menuOption.defaultValue;
        this.color = menuOption.color;
        this.acceptColor = menuOption.acceptColor;
        this.onAccept = menuOption.onAccept;
    }

    public onKeyUp(event: KeyboardEvent): void {
        if(event.key === "Backspace") {
            if(this.currentPos > 0) {
                --this.currentPos;
                this.updateValue(this.currentPos, this.defaultValue);
                this.currentValue = this.currentValue.slice(0, -1);
                if(this.acceptable) {
                    this.letters.forEach(letter => {
                        letter.material = new THREE.MeshLambertMaterial({color: this.color});
                    })
                }
                this.acceptable = false;
            }

        } else if(this.currentPos < this.fullLength) {
            this.updateValue(this.currentPos, event.key);
            ++this.currentPos;
            this.currentValue += event.key;
            if(this.currentPos == this.fullLength) {
                this.acceptable = true;
                this.letters.forEach(letter => {
                    letter.material = new THREE.MeshLambertMaterial({color: this.acceptColor});
                })
            }
        }
    };

    onClick(intersection: THREE.Intersection): boolean {
        for(let letter of this.letters) {
            if(letter === intersection.object) {
                const face = intersection.face;
                if(this.acceptable) {
                    const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-50);
                    letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                    this.onAccept(this.currentValue);
                    return true;
                } else {
                    const impulse = new Cannon.Vec3(face.normal.x, face.normal.y, face.normal.z).scale(-10);
                    letter.body.applyLocalImpulse(impulse, new Cannon.Vec3());
                    return false;
                }
            }
        }
    };

    private updateValue(index:number, val: string) {
        const letter = this.letters[index];
        letter.geometry = new THREE.TextBufferGeometry(val, this.textSettings);
        letter.geometry.computeBoundingBox();
        letter.geometry.computeBoundingSphere();

        letter.size = letter.geometry.boundingBox.getSize(new THREE.Vector3());
        const {x, y, z} = letter.size;
        const letterBox = new Cannon.Box(new Cannon.Vec3(x / 2, y / 2, z / 2));

        letter.body.shapes = [];

        const {center} = letter.geometry.boundingSphere;
        letter.body.addShape(letterBox, new Cannon.Vec3(center.x, center.y, center.z));
        letter.body.updateMassProperties();
    };
};
