import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Group,
  AxesHelper,
  Vector2,
  Vector3,
  DirectionalLightHelper,
  PointLightHelper,
  CameraHelper,
  FogExp2,
  AudioListener,
  PositionalAudio,
  AudioLoader
} from 'three';
import { createCamera } from './components/camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createControls } from './components/controls';
import { createRenderer } from './components/renderer';
import { createAmbientLight, createDirectionalLight, shadowInit } from './components/light';
import { Timer } from 'three/examples/jsm/misc/Timer';

// Objects
import { House } from './Objects/house';
import { Floor } from './Objects/floor';
import { Graves } from './Objects/graves';
import { Ghost, ghostPaths } from './Objects/ghost';
import { Lamp } from './Objects/lamp';
import { SkyBox } from './Objects/sky';

// Models
import { Size } from './models/main';

// stats
import { stats } from './utils/gui';

const FLOOR_DIMENSIONS = new Vector2(25, 25);

export class App {
  private scene: Scene;
  private meshGroup?: Group;
  private canvas: HTMLCanvasElement | null;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private renderer: WebGLRenderer;
  private sizes: Size;
  private timer: Timer;
  private soundTrack: PositionalAudio;

  private ghosts: Ghost[] = [];

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
  }

  public init() {
    shadowInit(this.renderer); // must be called before any light is created
    this.setupScene();
    this.setupObjects();
    this.setupEventListeners();
    this.animate();

    // TODO: create a GUI for the helpers and move animations to its file
    // Axes helper
    // const axesHelper = new AxesHelper(10);
    // this.scene.add(axesHelper);

    // Stats
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

  }
  
  private setupScene() {
    this.scene.add(this.camera);

    // TODO: move this to a different file
    // Audio listener
    const listener = new AudioListener();
    this.camera.add(listener);
    this.soundTrack = new PositionalAudio(listener);

    const ambientLight = createAmbientLight();
    const directionalLight = createDirectionalLight();
    this.scene.add(ambientLight, directionalLight);

    // // light helper
    // const directionalLightHelper = new DirectionalLightHelper(directionalLight, 1);
    // this.scene.add(directionalLightHelper);
    // // Helpers
    // const directionalLightShadowCameraHelper = new CameraHelper(directionalLight.shadow.camera);
    // this.scene.add(directionalLightShadowCameraHelper);

    // Add the sky
    const sky = SkyBox.getInstance();
    this.scene.add(sky);

    // Add fog
    this.addFog();
  }

  private async setupObjects() {

    // Create the plane terrain
    const floor = Floor.getInstance(FLOOR_DIMENSIONS);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Create the houses
    const house = new House();
    this.scene.add(house);

    const farHouse = new House(new Vector3(-9, -0.1, -6), new Vector3(0.7, 0.7, 0.7));
    this.scene.add(farHouse);
    
    // Load a sound and set it as the PositionalAudio object's buffer
    const sound = this.soundTrack
    const audioLoader = new AudioLoader();
    audioLoader.load('./audios/soundtrack.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(1);
        sound.setLoop(true);
        sound.setVolume(0.9);
        sound.play();
    });

    house.add(this.soundTrack);

    // Create the graves
    const housePositions = [house.position, farHouse.position];
    const graves = Graves.getInstance(FLOOR_DIMENSIONS, housePositions);
    this.scene.add(graves);

    // Create the ghosts
    for (let i = 0; i < 5; i++) {
      const ghost = new Ghost('#c3e4e2', 3);
      this.scene.add(ghost);
      this.ghosts.push(ghost);

      // // ghost light helper
      // const ghostLightHelper = new PointLightHelper(ghost, 1);
      // this.scene.add(ghostLightHelper);
    }

    // Lamp
    const lamp = new Lamp();
    try {
      const lampInstance = await lamp.load();
      this.scene.add(lampInstance);
    } catch (error) {
      console.error(error);
    }
  }

  private addFog() {
    this.scene.fog = new FogExp2('#023e4b', 0.05);
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

      // animate ghosts
      this.ghosts.forEach((ghost, index) => {
        ghost.animateGhosts(
          elapsedTime * 0.2,
          FLOOR_DIMENSIONS,
          ghostPaths[index % ghostPaths.length]
        );
      });

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
