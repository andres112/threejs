import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const createControls = (camera: PerspectiveCamera, canvas: HTMLCanvasElement | null): OrbitControls => {
  const controls = new OrbitControls(camera, canvas as HTMLCanvasElement);
  controls.enableDamping = true;
  return controls;
}