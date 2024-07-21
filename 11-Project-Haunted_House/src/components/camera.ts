import { PerspectiveCamera } from 'three';

export function createCamera(sizes: { width: number; height: number }): PerspectiveCamera {
  const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(4, 2, 5);
  return camera;
}
