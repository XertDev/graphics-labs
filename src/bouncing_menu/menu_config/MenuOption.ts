import * as THREE from "three";

export default class MenuOption {
    constructor(
        public readonly color: THREE.Color,
        public readonly textSettings: THREE.TextGeometryParameters
    ) {};
};
