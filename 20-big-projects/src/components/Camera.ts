import App from '@/app/App';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
    public instance!: THREE.PerspectiveCamera;
    private controls!: OrbitControls;

  constructor() {
    this.createCamera();
    this.setOrbitControls();
    console.info('Camera initialized');
  }

  public resize() {
    const { width, height } = App.instance.sizes;
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }

  public update() {
    this.controls.update();
  }

  /**
   * Create a camera
   * @private
   * @memberof Camera
   * @returns {void}
   */
  private createCamera() {
    const { width, height } = App.instance.sizes;
    this.instance = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    this.instance.position.set(6, 7, 10);

    App.instance.scene.add(this.instance);
  }

  /**
   * Set orbit controls
   * @private
   * @memberof Camera
   * @returns {void}
   */
  private setOrbitControls() {
    this.controls = new OrbitControls(this.instance, App.instance.canvas);
    this.controls.enableDamping = true; // set smooth movement
    this.controls.maxDistance = 20;
  }
}
