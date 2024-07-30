import GUI from 'lil-gui';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Group,
  AxesHelper,
  Vector2,
  Vector3,
} from 'three';
import { createCamera } from './components/camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createControls } from './components/controls';
import { createRenderer } from './components/renderer';
import { createAmbientLight, createDirectionalLight } from './components/light';
import { Timer } from 'three/examples/jsm/misc/Timer';

// Objects
import { House } from './Objects/house';
import { Floor } from './Objects/floor';

// Models
import { Size } from './models/main';
import { Graves } from './Objects/graves';

export class App {
  private scene: Scene;
  private meshGroup?: Group;
  private canvas: HTMLCanvasElement | null;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private renderer: WebGLRenderer;
  private sizes: Size;
  private timer: Timer;
  private gui: GUI;

  constructor() {
    this.scene = new Scene();
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
    this.setupObjects();
    this.setupEventListeners();
    this.animate();

    // Axes helper
    const axesHelper = new AxesHelper(10);
    this.scene.add(axesHelper);
  }

  private setupScene() {
    this.scene.add(this.camera);
    const ambientLight = createAmbientLight();
    const directionalLight = createDirectionalLight();
    this.scene.add(ambientLight, directionalLight);
  }

  private setupObjects() {
    // Create the plane terrain
    const floorDimension = new Vector2(25, 25);
    const floor = Floor.getInstance(floorDimension);
    this.scene.add(floor);

    // Create the houses
    const house = new House();
    this.scene.add(house);

    const farHouse = new House(new Vector3(-9, 0, -9), new Vector3(0.7, 0.7, 0.7));
    this.scene.add(farHouse);

    // Create the graves
    const housePositions = [house.position, farHouse.position];
    const graves = Graves.getInstance(floorDimension, housePositions);
    this.scene.add(graves);
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
