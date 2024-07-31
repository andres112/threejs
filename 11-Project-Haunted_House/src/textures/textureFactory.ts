import { Texture, Vector2 } from 'three';
import { loadTexture } from './textureUtils';

export class TextureFactory {
  public static createFloorTextures(): { [key: string]: Texture } {
    return {
      alpha: loadTexture('../textures/floor/alpha.jpg'),
      color: loadTexture('../textures/floor/coast_sand_rocks_02_diff_1k.jpg', {
        repeat: new Vector2(8, 8),
        colorSpace: true,
      }),
      normal: loadTexture('../textures/floor/coast_sand_rocks_02_nor_gl_1k.png', {
        repeat: new Vector2(8, 8),
      }),
      displacement: loadTexture('../textures/floor/coast_sand_rocks_02_disp_1k.png', {
        repeat: new Vector2(8, 8),
      }),
      arm: loadTexture('../textures/floor/coast_sand_rocks_02_arm_1k.png', {
        repeat: new Vector2(8, 8),
      }),
    };
  }

  public static createHouseWallsTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/wall/castle_brick_broken_06_arm_1k.png'),
      color: loadTexture('../textures/wall/castle_brick_broken_06_diff_1k.jpg', {
        colorSpace: true,
      }),
      normal: loadTexture('../textures/wall/castle_brick_broken_06_nor_gl_1k.png'),
      displacement: loadTexture('../textures/wall/castle_brick_broken_06_disp_1k.png'),
    };
  }

  public static createHouseChimneyTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/chimney/rock_wall_10_arm_1k.png', {
        repeat: new Vector2(1, 4),
      }),
      color: loadTexture('../textures/chimney/rock_wall_10_diff_1k.jpg', {
        repeat: new Vector2(1, 4),
        angle: Math.PI * 0.5,
        colorSpace: true,
      }),
      normal: loadTexture('../textures/chimney/rock_wall_10_nor_gl_1k.png', {
        repeat: new Vector2(1, 4),
      }),
      displacement: loadTexture('../textures/chimney/rock_wall_10_disp_1k.png', {
        repeat: new Vector2(1, 4),
      }),
    };
  }

  public static createHouseRoofTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/roof/roof_07_arm_1k.png', { repeat: new Vector2(3, 1) }),
      color: loadTexture('../textures/roof/roof_07_diff_1k.jpg', {
        colorSpace: true,
        repeat: new Vector2(3, 1),
      }),
      normal: loadTexture('../textures/roof/roof_07_nor_gl_1k.png', {
        repeat: new Vector2(3, 1),
      }),
      displacement: loadTexture('../textures/roof/roof_07_disp_1k.png', {
        repeat: new Vector2(3, 1),
      }),
    };
  }

  public static createHouseDoorTextures(): { [key: string]: Texture } {
    return {
      ao: loadTexture('../textures/door/Wood_Door_002_ambientOcclusion.jpg'),
      color: loadTexture('../textures/door/Wood_Door_002_basecolor.jpg', { colorSpace: true }),
      normal: loadTexture('../textures/door/Wood_Door_002_normal.jpg'),
      displacement: loadTexture('../textures/door/Wood_Door_002_height.png'),
      metallic: loadTexture('../textures/door/Wood_Door_002_metallic.jpg'),
      roughness: loadTexture('../textures/door/Wood_Door_002_roughness.jpg'),
    };
  }

  public static createBushTextures(): { [key: string]: Texture } {
    return {
      ao: loadTexture('../textures/bush/Hedge_001_AmbientOcclusion.jpg', {
        repeat: new Vector2(3, 3),
      }),
      color: loadTexture('../textures/bush/Hedge_001_BaseColor.jpg', {
        repeat: new Vector2(3, 3),
        colorSpace: true,
      }),
      normal: loadTexture('../textures/bush/Hedge_001_Normal.jpg', { repeat: new Vector2(3, 3) }),
      roughness: loadTexture('../textures/bush/Hedge_001_Roughness.jpg', {
        repeat: new Vector2(3, 3),
      }),
      height: loadTexture('../textures/bush/Hedge_001_Height.png', { repeat: new Vector2(3, 3) }),
    };
  }

  public static createGraveTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/grave/plastered_stone_wall_arm_1k.jpg'),
      color: loadTexture('../textures/grave/plastered_stone_wall_diff_1k.jpg', {
        colorSpace: true,
      }),
      normal: loadTexture('../textures/grave/plastered_stone_wall_nor_gl_1k.jpg'),
      displacement: loadTexture('../textures/grave/plastered_stone_wall_disp_1k.png'),
    };
  }
}
