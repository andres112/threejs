import * as THREE from 'three';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: '#ffeded',
};

export class App {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private sizes: { width: number; height: number };

  private clock = new THREE.Clock();

  constructor() {
    this.canvas = document.querySelector('canvas.webgl')!;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.init();
  }

  init() {
    console.log('App initialized');
    this.setCamera();
    this.setRenderer();
    this.setDebug();
    this.setCube();

    // Resize listener
    this.resizeListener();

    // animate
    this.animate();
  }

  private setCamera() {
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  private setRenderer() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private setCube() {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 'red' })
    );
    this.scene.add(cube);
  }

  private setDebug() {
    gui.addColor(parameters, 'materialColor');
  }

  private resizeListener() {
    window.addEventListener('resize', () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  private animate() {
    const elapsedTime = this.clock.getElapsedTime();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

