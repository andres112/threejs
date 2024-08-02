import { PerspectiveCamera } from 'three';

export const createCamera = (sizes: { width: number; height: number }): PerspectiveCamera => {
  const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(-2, 3, 12);
  return camera;
}
