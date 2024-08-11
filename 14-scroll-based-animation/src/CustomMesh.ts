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

  public createBox() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const box = new THREE.Mesh(geometry, this.material);
    this.add(box);
  }

  public createTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 200, 16);
    const torusKnot = new THREE.Mesh(geometry, this.material);
    this.add(torusKnot);
  }
}
