import * as THREE from "three";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {SkeletonUtils} from "three/examples/jsm/utils/SkeletonUtils";

export default class AnimatedObject {
    clips? = new Map<string, THREE.AnimationClip>();
    mixer: THREE.AnimationMixer;

    constructor(
        public root: THREE.Object3D,
    ){
        this.mixer = new THREE.AnimationMixer(root);
    };

    public update(deltaTime: number) {
        this.mixer.update(deltaTime);
    }

    public play(name: string) {
        const action = this.mixer.clipAction(this.clips[name]);
        action.play();
    }

    static processGLTF(gltf: GLTF, scale: number): AnimatedObject {
        const model = <THREE.Object3D> SkeletonUtils.clone(gltf.scene);
        const root = new THREE.Object3D();
        root.add(model);
        root.scale.multiplyScalar(scale);

        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3()).multiplyScalar(0.5);

        model.position.y += size.y;

        const object = new AnimatedObject(root);
        gltf.animations.forEach(clip => {
            object.clips[clip.name] = clip;
        });

        return object;
    }
}
