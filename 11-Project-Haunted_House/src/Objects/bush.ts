import { Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from 'three';
import { CustomTexture } from '../textures/main';

export class Bush extends Mesh {
  constructor(position: Vector3, scale: number = 1, rotation: Vector3 = new Vector3(0, 0, 0)) {
    super(new SphereGeometry(1, 32, 32), new MeshStandardMaterial({ 
      map: CustomTexture.bush.color,
      aoMap: CustomTexture.bush.ao,
      normalMap: CustomTexture.bush.normal,
      roughnessMap: CustomTexture.bush.roughness,
      displacementMap: CustomTexture.bush.height,
      displacementScale: 0.5,
     }));
    this.position.set(position.x, position.y, position.z);
    this.scale.setScalar(scale);
    this.rotation.set(rotation.x, rotation.y, rotation.z);
  }
}
