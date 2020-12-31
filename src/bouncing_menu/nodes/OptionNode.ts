import * as THREE from "three";
import * as Cannon from "cannon";

export default abstract class OptionNode {
    protected constructor(
        protected scene: THREE.Scene,
        protected world: Cannon.World) {
    }

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
