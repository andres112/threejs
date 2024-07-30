import { FloorFolder } from '../utils/gui';
import { CustomTexture } from '../textures/main';
import { PlaneGeometry, Mesh, MeshStandardMaterial, Vector2 } from 'three';

// Floor is a singleton class that creates only one instance of the floor
export class Floor extends Mesh {
  private static instance: Floor | null = null;

  private constructor(size: Vector2) {
    super(
      new PlaneGeometry(size.width, size.height, 100, 100),
      new MeshStandardMaterial({
        alphaMap: CustomTexture.floor.alpha,
        map: CustomTexture.floor.color,
        normalMap: CustomTexture.floor.normal,
        aoMap: CustomTexture.floor.arm,
        roughnessMap: CustomTexture.floor.arm,
        metalnessMap: CustomTexture.floor.arm,
        // displacement or height moves the vertices of the geometry along the normal of the vertex
        // therefore is required to set more vertices to the geometry
        displacementMap: CustomTexture.floor.displacement,
        displacementScale: 0.3,
        displacementBias: -0.2,
        transparent: true,
      })
    );
    this.rotation.x = -Math.PI * 0.5;

    this.setGui();
  }

  public static getInstance(size: Vector2): Floor {
    if (!Floor.instance) {
      Floor.instance = new Floor(size);
    }
    return Floor.instance;
  }

  private setGui() {
    FloorFolder.add(this.material, 'displacementScale')
      .min(0)
      .max(1)
      .step(0.01)
      .name('Displacement scale');
    FloorFolder.add(this.material, 'displacementBias')
      .min(-1)
      .max(1)
      .step(0.01)
      .name('Displacement bias');
  }
}
