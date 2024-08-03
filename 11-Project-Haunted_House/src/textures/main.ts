import { Texture } from 'three';
import { TextureFactory } from './textureFactory';

export class CustomTexture {
  public static readonly floor: { [k: string]: Texture } = TextureFactory.createFloorTextures();
  public static readonly houseWalls: { [k: string]: Texture } = TextureFactory.createHouseWallsTextures();
  public static readonly houseChimney: { [k: string]: Texture } = TextureFactory.createHouseChimneyTextures();
  public static readonly houseRoof: { [k: string]: Texture } = TextureFactory.createHouseRoofTextures();
  public static readonly door: { [k: string]: Texture } = TextureFactory.createHouseDoorTextures();
  public static readonly bush: { [k: string]: Texture } = TextureFactory.createBushTextures();
  public static readonly grave: { [k: string]: Texture } = TextureFactory.createGraveTextures();
  public static readonly lamp: { [k: string]: Texture } = TextureFactory.createLampTextures();
}
