import App from '@/app/App';
import * as THREE from 'three';

export default class Renderer {
  private instance!: THREE.WebGLRenderer;

  constructor() {
    this.createRenderer();
    console.info('Renderer initialized');
  }

  public resize() {
    const { width, height, aspectRatio } = App.instance.sizes;

    this.instance.setSize(width, height);
    this.instance.setPixelRatio(aspectRatio);
  } 
  
  public update() {
    this.instance.render(App.instance.scene, App.instance.camera.instance);
  }

  /**
   * Create a renderer
   * @private
   * @memberof Renderer
   * @returns {void}
   */
  private createRenderer() {
    const { width, height, aspectRatio } = App.instance.sizes;

    this.instance = new THREE.WebGLRenderer({
      canvas: App.instance.canvas as HTMLCanvasElement,
      antialias: true,
    });
    this.instance.setSize(width, height);
    this.instance.setPixelRatio(aspectRatio);
    this.instance.setClearColor('#211d20');
    // Enable tone mapping
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    // Enable shadows
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
  }
}
