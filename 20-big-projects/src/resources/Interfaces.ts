import { AnimationMixer, AnimationAction } from 'three';

export interface ISource {
  name: string;
  type: 'texture' | 'cubeTexture' | 'gltf' | 'equiRectangularTexture';
  path: string | string[];
}

export interface IAnimation {
  mixer: AnimationMixer;
  action?: AnimationAction;
}
