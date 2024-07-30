import { TextureLoader } from 'three';
import { Texture, Vector2, RepeatWrapping, SRGBColorSpace } from 'three';

export const textureLoader = new TextureLoader();

export const loadTexture = (path: string, repeat?: Vector2, colorSpace?: boolean): Texture => {
  let texture = textureLoader.load(path);

  if (repeat) {
    texture = repeatTexture(texture, repeat);
  }

  if (colorSpace) {
    texture = setColorSpace(texture);
  }
  return texture;
};

const repeatTexture = (texture: Texture, repeat: Vector2): Texture => {
  texture.repeat.set(repeat.x, repeat.y);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
};

const setColorSpace = (texture: Texture): Texture => {
  texture.colorSpace = SRGBColorSpace;
  return texture;
};
