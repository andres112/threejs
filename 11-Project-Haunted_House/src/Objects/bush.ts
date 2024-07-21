import { Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from 'three';

export class Bush extends Mesh {
  constructor(position: Vector3, scale: number = 1) {
    super(new SphereGeometry(1, 16, 16), new MeshStandardMaterial({ color: 0x00ff00 }));
    this.position.set(position.x, position.y, position.z);
    this.scale.setScalar(scale);
  }
}
