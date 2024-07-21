import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

const GRAVE_DIMENSIONS = { width: 0.6, height: 0.8, depth: 0.2 };
export class Grave extends Mesh {
  constructor() {
    super(
      new BoxGeometry(GRAVE_DIMENSIONS.width, GRAVE_DIMENSIONS.height, GRAVE_DIMENSIONS.depth),
      new MeshStandardMaterial({ color: 0x666666 })
    );
  }
}
