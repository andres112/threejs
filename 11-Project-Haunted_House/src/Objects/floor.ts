import { CustomTexture } from '../textures/main';
import { PlaneGeometry, Mesh, MeshStandardMaterial, Vector2 } from 'three';

// Floor is a singleton class that creates only one instance of the floor
export class Floor extends Mesh {
  private static instance: Floor | null = null;

  private constructor(size: Vector2) {
    super(new PlaneGeometry(size.width, size.height), new MeshStandardMaterial(
      {
        alphaMap: CustomTexture.floor.alpha,
        map: CustomTexture.floor.color,
        normalMap: CustomTexture.floor.normal,
        aoMap: CustomTexture.floor.arm,
        displacementMap: CustomTexture.floor.displacement,
        displacementScale: 0.15,
        transparent: true,
      }
    ));
    this.rotation.x = -Math.PI * 0.5;
  }

  public static getInstance(size: Vector2): Floor {
    if (!Floor.instance) {
      Floor.instance = new Floor(size);
    }
    return Floor.instance;
  }
}
