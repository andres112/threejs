import * as THREE from 'three';
import GUI from 'lil-gui';
import App from '@/app/App';
import Helper from '@/gui/Helper';

export default class Environment {
  private gui: GUI;
  private sunlight!: THREE.DirectionalLight;

  constructor() {
    this.gui = Helper.addFolder('Lighting');
    this.setSunlight();
    console.info('Environment initialized');
  }

  private setSunlight() {
    this.sunlight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunlight.castShadow = true;
    this.sunlight.shadow.camera.far = 10;
    this.sunlight.shadow.mapSize.set(1024, 1024);
    this.sunlight.shadow.normalBias = 0.05;
    this.sunlight.position.set(3.5, 2, -1.25);
    App.instance.scene.add(this.sunlight);
    this.gui.add(this.sunlight, 'intensity', 0, 5, 0.01).name('Sunlight intensity');

    const sunlightHelper = new THREE.DirectionalLightHelper(this.sunlight, 0.2);
    App.instance.scene.add(sunlightHelper);
    this.gui.add(sunlightHelper, 'visible').name('Sunlight helper');

    // light shadow camera helper
    const shadowCameraHelper = new THREE.CameraHelper(this.sunlight.shadow.camera);
    App.instance.scene.add(shadowCameraHelper);
    this.gui.add(shadowCameraHelper, 'visible').name('Shadow camera helper');
  }
}
