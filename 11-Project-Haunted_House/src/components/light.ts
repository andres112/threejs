import { AmbientLight, DirectionalLight, PointLight, Vector3 } from 'three';

export const createAmbientLight = (): AmbientLight => {
  return new AmbientLight('#86cdff', 0.25);
};

export const createDirectionalLight = (): DirectionalLight => {
  const directionalLight = new DirectionalLight('#86cdff', 1.5);
  directionalLight.position.set(5, 3, -8);
  return directionalLight;
};

export const createPointLight = (
  color: string,
  intensity: number = 1,
  position: Vector3 = new Vector3(0, 0, 0)
): PointLight => {
  const pointLight = new PointLight(color, intensity, 4);
  pointLight.position.set(position.x, position.y, position.z);
  return pointLight;
};
