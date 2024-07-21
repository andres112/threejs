import { PlaneGeometry, Mesh, MeshStandardMaterial } from 'three';

export const createFloor = (): Mesh => {
  const mesh = new Mesh(new PlaneGeometry(30, 30), new MeshStandardMaterial());
    mesh.rotation.x = -Math.PI * 0.5;
  return mesh;
};
