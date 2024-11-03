export interface ISource {
  name: string;
  type: 'texture' | 'cubeTexture' | 'gltf';
  path: string | string[];
}
