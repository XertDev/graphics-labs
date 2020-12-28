import {BufferGeometry, Geometry, Material, Mesh, default as THREE} from "three";
import {Body} from "cannon"

export default class BodyMesh <
    TGeometry extends Geometry | BufferGeometry = Geometry | BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[]
    > extends Mesh<TGeometry, TMaterial> {

    body?: Body;
    size?: THREE.Vector3;
};
