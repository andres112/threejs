import * as THREE from 'three';
import Sizes from '../utils/Sizes';
import Time from '../utils/Time';

declare global {
  interface Window {
    app: App;
  }
}

export default class App {
  private canvas: HTMLCanvasElement | null;
  private sizes: Sizes;
  private time: Time;
  private scene: THREE.Scene;

  constructor(canvas: HTMLCanvasElement | null) {
    // Global access to app
    window.app = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();

    // Listen for resize event
    this.sizes.on('resize', () => this.resize());

    // Listen for tick event
    this.time.on('tick', () => this.update());
  }
  init() {
    console.log('App initialized');
  }

  resize() {
    console.log('resize');
  }

  update() {
    console.log('update');
  }
}
