import { TextureLoader, Texture, RepeatWrapping, Vector2 } from 'three';

const textureLoader = new TextureLoader();

const loadTexture = (path: string, repeat?: Vector2): Texture => {
  let texture = textureLoader.load(path);

  if (repeat) {
    texture = repeatTexture(texture, repeat);
  }
  return texture;
};

const repeatTexture = (texture: Texture, repeat: Vector2): Texture => {
  texture.repeat.set(repeat.x, repeat.y);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
};

export class CustomTexture {
  public static readonly floor: { [k: string]: Texture } = {
    alpha: loadTexture('../textures/floor/alpha.jpg'),
    color: loadTexture('../textures/floor/coast_sand_rocks_02_diff_1k.jpg', new Vector2(8, 8)),
    normal: loadTexture('../textures/floor/coast_sand_rocks_02_nor_gl_1k.png', new Vector2(8, 8)),
    displacement: loadTexture(
      '../textures/floor/coast_sand_rocks_02_disp_1k.png',
      new Vector2(8, 8)
    ),
    arm: loadTexture('../textures/floor/coast_sand_rocks_02_arm_1k.png', new Vector2(8, 8)),
  };
  public static readonly bush: { [k: string]: Texture } = {
    ao: loadTexture('../textures/bush/Hedge_001_AmbientOcclusion.jpg', new Vector2(4, 4)),
    color: loadTexture('../textures/bush/Hedge_001_BaseColor.jpg', new Vector2(4, 4)),
    normal: loadTexture('../textures/bush/Hedge_001_Normal.jpg', new Vector2(4, 4)),
    roughness: loadTexture('../textures/bush/Hedge_001_Roughness.jpg', new Vector2(4, 4)),
    height: loadTexture('../textures/bush/Hedge_001_Height.png', new Vector2(4, 4)),
  };
}
