import * as THREE from "three";

export default abstract class OptionNode {
    protected _group: THREE.Group = new THREE.Group();

    get group(): THREE.Group {
        return this._group;
    };

    abstract get height(): number;
    abstract get width(): number;

    abstract translateY(offset: number): void;
    abstract translateX(offset: number): void;

    onClick(intersection: THREE.Intersection): boolean {
        return false;
    }

    fall(): void {
    };

    dispose(): void {};

    visible(): boolean {
        return true;
    };

    abstract update(deltaTime: number): void;
}
