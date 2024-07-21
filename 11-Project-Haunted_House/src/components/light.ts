import { AmbientLight, DirectionalLight } from 'three';

export const createAmbientLight = (): AmbientLight => {
  return new AmbientLight('#ffffff', 0.5);
}

export const createDirectionalLight = (): DirectionalLight => {
  const directionalLight = new DirectionalLight('#ffffff', 1.5);
  directionalLight.position.set(3, 2, -8);
  return directionalLight;
}