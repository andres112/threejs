import GUI from 'lil-gui';
import { PerspectiveCamera, Scene, WebGLRenderer, Mesh } from 'three';
import { createCamera } from './components/camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createControls } from './components/controls';
import { createRenderer } from './components/renderer';
import { createAmbientLight, createDirectionalLight } from './components/light';
import { createMesh } from './components/mesh';
import { Size } from './models/main';
import { Timer } from 'three/examples/jsm/misc/Timer';

export class App {
  private scene: Scene;
  private mesh: Mesh;
  private canvas: HTMLCanvasElement | null;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private renderer: WebGLRenderer;
  private sizes: Size;
  private timer: Timer;
  private gui: GUI;

  constructor() {
    this.scene = new Scene();
    this.mesh = createMesh();
    this.canvas = document.querySelector('canvas.webgl');
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.camera = createCamera(this.sizes);
    this.controls = createControls(this.camera, this.canvas);
    this.renderer = createRenderer(this.canvas, this.sizes);
    this.timer = new Timer();
    this.gui = new GUI();

    this.init();
  }

  public init() {
    this.setupScene();
    this.setupEventListeners();
    this.animate();
  }

  private setupScene() {
    this.scene.add(this.camera);
    this.scene.add(this.mesh);
    const ambientLight = createAmbientLight();
    const directionalLight = createDirectionalLight();
    this.scene.add(ambientLight, directionalLight);
  }

  private setupEventListeners() {
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

  private animate(): void {
    const tick = () => {
      // Timer
      this.timer.update();
      const elapsedTime = this.timer.getElapsed();

      // Update controls
      this.controls.update();

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
