import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  Vector3,
  WebGLRenderer,
  PCFSoftShadowMap,
} from 'three';

export const shadowInit = (renderer: WebGLRenderer): void => {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
};

export const createAmbientLight = (): AmbientLight => {
  return new AmbientLight('#86cdff', 0.25);
};

export const createDirectionalLight = (): DirectionalLight => {
  const directionalLight = new DirectionalLight('#86cdff', 2);
  directionalLight.position.set(5, 5, -10);
  directionalLight.castShadow = true;
  return directionalLight;
};

export const createPointLight = (
  color: string,
  intensity: number = 1,
  position: Vector3 = new Vector3(0, 0, 0),
  isCastShadow: boolean = true
): PointLight => {
  const pointLight = new PointLight(color, intensity, 4);
  pointLight.position.set(position.x, position.y, position.z);
  pointLight.castShadow = isCastShadow;
  return pointLight;
};
