import { TextureLoader, Texture } from 'three';

const textureLoader = new TextureLoader();

const setAlphaMap = (path: string): Texture => {
  return textureLoader.load(path);
};

export class CustomTexture {
  public static readonly floor: { [k: string]: Texture } = {
    alpha: setAlphaMap('../textures/floor/alpha.jpg'),
  };
}
