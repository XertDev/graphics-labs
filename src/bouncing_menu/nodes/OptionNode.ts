import * as THREE from "three/src/Three";

export default abstract class OptionNode {
    protected _group: THREE.Group = new THREE.Group();

    getGroup(): THREE.Group {
        return this._group;
    }

    abstract getHeight(): number
    abstract getWidth(): number;

    abstract translateY(offset: number): void;
    abstract translateX(offset: number): void;

    onClick(intersection: THREE.Intersection): boolean {
        return false;
    }

    fall(): void {

    };

    onDestroy(): void {};

    visible(): boolean {
        return true;
    }

    abstract update(deltaTime: number): void;
}
