import { Texture, Vector2 } from 'three';
import { loadTexture } from './textureUtils';

export class TextureFactory {
  public static createFloorTextures(): { [key: string]: Texture } {
    return {
      alpha: loadTexture('../textures/floor/alpha.jpg'),
      color: loadTexture('../textures/floor/coast_sand_rocks_02_diff_1k.webp', {
        repeat: new Vector2(8, 8),
        colorSpace: true,
        magFilter: true,
      }),
      normal: loadTexture('../textures/floor/coast_sand_rocks_02_nor_gl_1k.webp', {
        repeat: new Vector2(8, 8),
      }),
      displacement: loadTexture('../textures/floor/coast_sand_rocks_02_disp_1k.webp', {
        repeat: new Vector2(8, 8),
      }),
      arm: loadTexture('../textures/floor/coast_sand_rocks_02_arm_1k.webp', {
        repeat: new Vector2(8, 8),
      }),
    };
  }

  public static createHouseWallsTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/wall/castle_brick_broken_06_arm_1k.webp'),
      color: loadTexture('../textures/wall/castle_brick_broken_06_diff_1k.webp', {
        colorSpace: true,
        magFilter: true,
      }),
      normal: loadTexture('../textures/wall/castle_brick_broken_06_nor_gl_1k.webp'),
      displacement: loadTexture('../textures/wall/castle_brick_broken_06_disp_1k.webp'),
    };
  }

  public static createHouseChimneyTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/chimney/rock_wall_10_arm_1k.webp', {
        repeat: new Vector2(1, 4),
      }),
      color: loadTexture('../textures/chimney/rock_wall_10_diff_1k.webp', {
        repeat: new Vector2(1, 4),
        angle: Math.PI * 0.5,
        colorSpace: true,
      }),
      normal: loadTexture('../textures/chimney/rock_wall_10_nor_gl_1k.webp', {
        repeat: new Vector2(1, 4),
      }),
      displacement: loadTexture('../textures/chimney/rock_wall_10_disp_1k.webp', {
        repeat: new Vector2(1, 4),
      }),
    };
  }

  public static createHouseRoofTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/roof/roof_07_arm_1k.webp', { repeat: new Vector2(3, 1) }),
      color: loadTexture('../textures/roof/roof_07_diff_1k.webp', {
        colorSpace: true,
        repeat: new Vector2(3, 1),
        magFilter: true,
      }),
      normal: loadTexture('../textures/roof/roof_07_nor_gl_1k.webp', {
        repeat: new Vector2(3, 1),
      }),
      displacement: loadTexture('../textures/roof/roof_07_disp_1k.webp', {
        repeat: new Vector2(3, 1),
      }),
    };
  }

  public static createHouseDoorTextures(): { [key: string]: Texture } {
    return {
      ao: loadTexture('../textures/door/Wood_Door_002_ambientOcclusion.webp'),
      color: loadTexture('../textures/door/Wood_Door_002_basecolor.webp', {
        colorSpace: true,
      }),
      normal: loadTexture('../textures/door/Wood_Door_002_normal.webp'),
      displacement: loadTexture('../textures/door/Wood_Door_002_height.webp'),
      metallic: loadTexture('../textures/door/Wood_Door_002_metallic.webp'),
      roughness: loadTexture('../textures/door/Wood_Door_002_roughness.webp'),
    };
  }

  public static createBushTextures(): { [key: string]: Texture } {
    return {
      ao: loadTexture('../textures/bush/Hedge_001_AmbientOcclusion.webp', {
        repeat: new Vector2(3, 3),
      }),
      color: loadTexture('../textures/bush/Hedge_001_BaseColor.webp', {
        repeat: new Vector2(3, 3),
        colorSpace: true,
        magFilter: true,
      }),
      normal: loadTexture('../textures/bush/Hedge_001_Normal.webp', { repeat: new Vector2(3, 3) }),
      roughness: loadTexture('../textures/bush/Hedge_001_Roughness.webp', {
        repeat: new Vector2(3, 3),
      }),
      height: loadTexture('../textures/bush/Hedge_001_Height.webp', { repeat: new Vector2(3, 3) }),
    };
  }

  public static createGraveTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/grave/plastered_stone_wall_arm_1k.webp'),
      color: loadTexture('../textures/grave/plastered_stone_wall_diff_1k.webp', {
        colorSpace: true,
        magFilter: true,
      }),
      normal: loadTexture('../textures/grave/plastered_stone_wall_nor_gl_1k.webp'),
      displacement: loadTexture('../textures/grave/plastered_stone_wall_disp_1k.webp'),
    };
  }

  public static createLampTextures(): { [key: string]: Texture } {
    return {
      color: loadTexture('../textures/lamp/wood_texture.webp', {
        colorSpace: true,
        magFilter: true,
      }),
    };
  }
}
