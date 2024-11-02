import * as THREE from 'three';
import GUI from 'lil-gui';
import App from '@/app/App';
import Helper from '@/gui/Helper';

export default class Environment {
  private gui: GUI;

  constructor() {
    this.gui= Helper.addFolder('Environment');
    this.setSunlight();
    console.info('Environment initialized');
  }

  private setSunlight() {
    const sunlight = new THREE.DirectionalLight(0xffffff, 1);
    sunlight.position.set(2, 2, 2);
    App.instance.scene.add(sunlight);
    this.gui.add(sunlight, 'intensity', 0, 5, 0.01).name('Sunlight intensity');

    const sunlightHelper = new THREE.DirectionalLightHelper(sunlight, 0.2);
    App.instance.scene.add(sunlightHelper);
    this.gui.add(sunlightHelper, 'visible').name('Sunlight helper');
  }
}
