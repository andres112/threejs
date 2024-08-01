import {
  Texture,
  Vector2,
  RepeatWrapping,
  SRGBColorSpace,
  NearestFilter,
  TextureLoader,
} from 'three';

export const textureLoader = new TextureLoader();

interface LoadTextureOptions {
  repeat?: Vector2;
  colorSpace?: boolean;
  angle?: number;
  magFilter?: boolean;
  minFilter?: boolean;
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

  if (options?.magFilter) {
    texture = setMagFilter(texture);
  }

  if (options?.minFilter) {
    texture = setMinFilter(texture);
  }

  return texture;
};

const repeatTexture = (texture: Texture, repeat: Vector2): Texture => {
  texture.repeat.set(repeat.x, repeat.y);
  if (repeat.x > 1) {
    texture.wrapS = RepeatWrapping;
  }
  if (repeat.y > 1) {
    texture.wrapT = RepeatWrapping;
  }
  return texture;
};

const setMagFilter = (texture: Texture): Texture => {
  texture.magFilter = NearestFilter;
  texture.mipmaps = false;
  return texture;
};

const setMinFilter = (texture: Texture): Texture => {
  texture.minFilter = NearestFilter;
  texture.mipmaps = false;
  return texture;
};

const setColorSpace = (texture: Texture): Texture => {
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

const rotateTexture = (texture: Texture, angle: number): Texture => {
  texture.rotation = angle;

  return texture;
};
