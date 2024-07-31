import { TextureLoader } from 'three';
import { Texture, Vector2, RepeatWrapping, SRGBColorSpace } from 'three';

export const textureLoader = new TextureLoader();

interface LoadTextureOptions {
  repeat?: Vector2;
  colorSpace?: boolean;
  angle?: number;
}


export const loadTexture = (path: string, options?: LoadTextureOptions): Texture => {
  let texture = textureLoader.load(path);

  if (options?.repeat) {
    texture = repeatTexture(texture, options?.repeat);
  }

  if (options?.colorSpace) {
    texture = setColorSpace(texture);
  }

  if (options?.angle) {
    texture = rotateTexture(texture, options?.angle);
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

const rotateTexture = (texture: Texture, angle: number): Texture => {
  texture.rotation = angle;
  console.log(texture);
  
  return texture;
}
