import * as THREE from "three";
import * as Cannon from "cannon";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {SkeletonUtils} from "three/examples/jsm/utils/SkeletonUtils";
import AnimatedObject from "./AnimatedObject";

export default class AnimatedBodyObject extends AnimatedObject {

    constructor(
        root: THREE.Object3D,
        public body: Cannon.Body
    ){
        super(root);
    };

    update(deltaTime: number) {
        super.update(deltaTime);
        const {x, y, z} = this.body.position;
        this.root.position.set(x, y, z);
    }


    static processGLTF(gltf: GLTF, scale: number): AnimatedBodyObject {
        const model = <THREE.Object3D> SkeletonUtils.clone(gltf.scene);
        const root = new THREE.Object3D();
        root.add(model);
        root.scale.multiplyScalar(scale);

        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3()).multiplyScalar(0.5);
        const {x, y, z} = size;
        const body = new Cannon.Body({
            mass: 1,
            shape: new Cannon.Box(new Cannon.Vec3(x, y, z))
        });

        model.position.y += y;

        const object = new AnimatedBodyObject(root, body);
        gltf.animations.forEach(clip => {
            object.clips[clip.name] = clip;
        });

        return object;
    };
}
