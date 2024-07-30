import { TextureLoader, Texture } from 'three';

const textureLoader = new TextureLoader();

const loadTexture = (path: string): Texture => {
  return textureLoader.load(path);
};

export class CustomTexture {
  public static readonly floor: { [k: string]: Texture } = {
    alpha: loadTexture('../textures/floor/alpha.jpg'),
  };
}
