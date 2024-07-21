import { Mesh, SphereGeometry, MeshStandardMaterial } from 'three';

export const createSphere = (): Mesh => {
  const mesh = new Mesh(
    new SphereGeometry(1, 32, 32),
    new MeshStandardMaterial({ roughness: 0.7 })
  );
  return mesh;
};
