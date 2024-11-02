import App from '@/app/App';
import * as THREE from 'three';

export default class Renderer {
  private instance!: THREE.WebGLRenderer;

  constructor() {
    this.createRenderer();
  }

  private createRenderer() {
    this.instance = new THREE.WebGLRenderer({
      canvas: App.instance.canvas as HTMLCanvasElement,
      antialias: window.devicePixelRatio < 2 ? false : true,
    });

    const { width, height, aspectRatio } = App.instance.sizes;
    this.instance.setSize(width, height);
    this.instance.setPixelRatio(aspectRatio);
    this.instance.setClearColor(0x000000);
  }
}
