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
  setDirectionalLightShadow(directionalLight);
  return directionalLight;
};

const setDirectionalLightShadow = (directionalLight: DirectionalLight): void => {
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 256;
  directionalLight.shadow.mapSize.height = 256;
  directionalLight.shadow.camera.far = 25;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.left = -13;
  directionalLight.shadow.camera.right = 13;
  directionalLight.shadow.camera.top = 8;
  directionalLight.shadow.camera.bottom = -5;
}

export const createPointLight = (
  color: string,
  intensity: number = 1,
  position: Vector3 = new Vector3(0, 0, 0),
  isCastShadow: boolean = true
): PointLight => {
  const pointLight = new PointLight(color, intensity, 4);
  pointLight.position.set(position.x, position.y, position.z);
  setPointLightShadow(pointLight, isCastShadow);
  return pointLight;
};

export const setPointLightShadow = (pointLight: PointLight, isCastShadow = true): void => {
  pointLight.castShadow = isCastShadow;
  pointLight.shadow.mapSize.width = 256;
  pointLight.shadow.mapSize.height = 256;
  pointLight.shadow.camera.far = 10;
  pointLight.shadow.camera.near = 1;
}
