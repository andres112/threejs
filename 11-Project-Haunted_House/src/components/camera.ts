import { PerspectiveCamera } from 'three';

export const createCamera = (sizes: { width: number; height: number }): PerspectiveCamera => {
  const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(5, 3, 9);
  return camera;
}
