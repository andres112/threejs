import { Size } from "@/models/main";
import {WebGLRenderer } from 'three'


export const createRenderer = (canvas: HTMLCanvasElement | null, sizes:Size ): WebGLRenderer => {
  const renderer = new WebGLRenderer({
    canvas: canvas as HTMLCanvasElement,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
};
