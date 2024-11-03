import * as THREE from 'three';
import Sizes from '@/utils/Sizes';
import Time from '@/utils/Time';
import Camera from '@/components/Camera';
import Renderer from '@/components/Renderer';
import World from '@/world/World';
import Resources from '@/utils/Resources';
import Helper from '@/gui/Helper';

import sources from '@/resources/sources';
import { ISource } from '@/resources/Interfaces';
import GUI from 'lil-gui';

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
  public camera!: Camera;
  public resources!: Resources;
  private renderer!: Renderer;
  private world!: World;
  private gui!: GUI;

  constructor(canvas: HTMLCanvasElement | null) {
    // Singleton
    if (App._instance) return App._instance;
    App._instance = this;

    // Global access to app
    window.app = this;

    // Options
    this.canvas = canvas;
    this.gui = Helper.addFolder('General');

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources as ISource[]);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Listen for resize event
    this.sizes.on('resize', () => this.resize());

    // Listen for tick event
    this.time.on('tick', () => this.update());

    // GUI setup
    this.setAxisHelpers();
    // this gui checkbox for axis helpers
    this.gui.add({ axisHelpers: true }, 'axisHelpers').onChange((value: boolean) => {
      console.log('axisHelpers', value);
      if (value) {
        this.setAxisHelpers();
      } else {
        this.removeAxisHelpers();
      }
    });
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

  private setAxisHelpers() {
    const axesHelper = new THREE.AxesHelper(3);
    const gridHelper = new THREE.GridHelper(10, 10);
    App.instance.scene.add(gridHelper, axesHelper);
  }

  private removeAxisHelpers() {
      App.instance.scene.children = App.instance.scene.children.filter(
      (child) => !(child instanceof THREE.AxesHelper || child instanceof THREE.GridHelper)
    );
  }

  private resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  private update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
}
