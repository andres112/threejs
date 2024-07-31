import { CustomTexture } from '../textures/main';
import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

const GRAVE_DIMENSIONS = { width: 0.6, height: 0.8, depth: 0.2 };
export class Grave extends Mesh {
  constructor() {
    super(
      new BoxGeometry(GRAVE_DIMENSIONS.width, GRAVE_DIMENSIONS.height, GRAVE_DIMENSIONS.depth, 50, 50, 50),
      new MeshStandardMaterial({
        map: CustomTexture.grave.color,
        normalMap: CustomTexture.grave.normal,
        aoMap: CustomTexture.grave.arm,
        roughnessMap: CustomTexture.grave.arm,
        metalnessMap: CustomTexture.grave.arm,
        displacementMap: CustomTexture.grave.displacement,
        displacementScale: 0.05,
        displacementBias: -0.03,
      })
    );
  }
}
