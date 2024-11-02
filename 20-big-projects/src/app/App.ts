import * as THREE from 'three';
import Sizes from '@/utils/Sizes';
import Time from '@/utils/Time';
import Camera from '@/components/Camera';
import Renderer from '@/components/Renderer';

declare global {
  interface Window {
    app: App;
  }
}

export default class App {
  // Singleton pattern
  private static _instance: App;

  public sizes!: Sizes;
  public time!: Time;
  public scene!: THREE.Scene;
  public canvas!: HTMLCanvasElement | null;
  private camera!: Camera;
  private renderer!: Renderer;

  constructor(canvas: HTMLCanvasElement | null) {
    // Singleton
    if (App._instance) return App._instance;
    App._instance = this;

    // Global access to app
    window.app = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();

    // Listen for resize event
    this.sizes.on('resize', () => this.resize());

    // Listen for tick event
    this.time.on('tick', () => this.update());
  }

  // getter for the instance
  static get instance(): App {
    if (App._instance === null) {
      try {
        throw new Error('App instance not found');
      } catch (e) {
        console.error(e);
      }
    }
    return App._instance;
  }

  private resize() {
    this.camera.resize();
  }

  private update() {
    this.camera.controls.update();
  }
}
