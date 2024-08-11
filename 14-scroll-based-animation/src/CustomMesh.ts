import * as THREE from 'three';
import { parameters } from './app';

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

export class CustomMesh extends THREE.Mesh {
  constructor() {
    super();
    this.material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture,
    });
  }

  public createTorus() {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
    const torus = new THREE.Mesh(geometry, this.material);
    this.add(torus);
  }

  public createCone() {
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 100);
    const cone = new THREE.Mesh(geometry, this.material);
    this.add(cone);
  }

  public createTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 200, 16);
    const torusKnot = new THREE.Mesh(geometry, this.material);
    this.add(torusKnot);
  }

  public initialRotation(rotation: THREE.Vector3) {
    this.rotation.reorder('YXZ');
    this.rotation.set(rotation.x, rotation.y, rotation.z);
  }
}
