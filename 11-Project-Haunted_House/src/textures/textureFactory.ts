import { Texture, Vector2 } from 'three';
import { loadTexture } from './textureUtils';

export class TextureFactory {
  public static createFloorTextures(): { [key: string]: Texture } {
    return {
      alpha: loadTexture('../textures/floor/alpha.jpg'),
      color: loadTexture(
        '../textures/floor/coast_sand_rocks_02_diff_1k.jpg',
        new Vector2(8, 8),
        true
      ),
      normal: loadTexture('../textures/floor/coast_sand_rocks_02_nor_gl_1k.png', new Vector2(8, 8)),
      displacement: loadTexture(
        '../textures/floor/coast_sand_rocks_02_disp_1k.png',
        new Vector2(8, 8)
      ),
      arm: loadTexture('../textures/floor/coast_sand_rocks_02_arm_1k.png', new Vector2(8, 8)),
    };
  }

  public static createHouseWallsTextures(): { [key: string]: Texture } {
    return {
      arm: loadTexture('../textures/wall/castle_wall_varriation_arm_1k.png', new Vector2(2, 2)),
      color: loadTexture(
        '../textures/wall/castle_wall_varriation_diff_1k.jpg',
        new Vector2(2, 2),
        true
      ),
      normal: loadTexture(
        '../textures/wall/castle_wall_varriation_nor_gl_1k.png',
        new Vector2(2, 2)
      ),
      displacement: loadTexture(
        '../textures/wall/castle_wall_varriation_disp_1k.png',
        new Vector2(2, 2)
      ),
    };
  }

  public static createBushTextures(): { [key: string]: Texture } {
    return {
      ao: loadTexture('../textures/bush/Hedge_001_AmbientOcclusion.jpg', new Vector2(3, 3)),
      color: loadTexture('../textures/bush/Hedge_001_BaseColor.jpg', new Vector2(3, 3), true),
      normal: loadTexture('../textures/bush/Hedge_001_Normal.jpg', new Vector2(3, 3)),
      roughness: loadTexture('../textures/bush/Hedge_001_Roughness.jpg', new Vector2(3, 3)),
      height: loadTexture('../textures/bush/Hedge_001_Height.png', new Vector2(3, 3)),
    };
  }
}
