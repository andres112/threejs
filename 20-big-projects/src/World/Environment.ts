import * as THREE from 'three';
import GUI from 'lil-gui';
import App from '@/app/App';
import Helper from '@/gui/Helper';

export default class Environment {
  private guiLights: GUI | undefined;
  private guiEnvMap: GUI | undefined;
  private sunlight!: THREE.DirectionalLight;

  constructor() {
    if (Helper.active) {
      this.guiLights = Helper.addFolder('Lighting');
      this.guiEnvMap = Helper.addFolder('Environment map');
    }
    this.setSunlight();
    this.setEnvironmentMap();
    console.info('Environment initialized');
  }

  private setSunlight() {
    this.sunlight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunlight.castShadow = true;
    this.sunlight.shadow.camera.far = 15;
    this.sunlight.shadow.mapSize.set(1024, 1024);
    this.sunlight.shadow.normalBias = 0.05;
    this.sunlight.shadow.bias = -0.001;
    this.sunlight.position.set(-1, 3, -4);
    App.instance.scene.add(this.sunlight);

    this.guiLights?.add(this.sunlight, 'intensity', 0, 10, 0.01).name('Sunlight intensity');

    if (Helper.active) {
      // light helper
      const sunlightHelper = new THREE.DirectionalLightHelper(this.sunlight, 0.2);
      App.instance.scene.add(sunlightHelper);
      this.guiLights?.add(sunlightHelper, 'visible').name('Sunlight helper');

      // light shadow camera helper
      const shadowCameraHelper = new THREE.CameraHelper(this.sunlight.shadow.camera);
      App.instance.scene.add(shadowCameraHelper);
      this.guiLights?.add(shadowCameraHelper, 'visible').name('Shadow camera helper');
    }
  }

  private setEnvironmentMap() {
    let environmentMap = {
      intensity: 1,
      texture: App.instance.resources.items['environmentMapTexture'],
    };

    // Since the version 0.152 of Three.js encoding has been replaced by colorSpace:
    environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

    if (environmentMap.texture instanceof THREE.DataTexture) {
      environmentMap.texture.mapping = THREE.EquirectangularReflectionMapping;
    }

    App.instance.scene.environment = App.instance.scene.background = environmentMap.texture;

    this.guiEnvMap
      ?.add(App.instance.scene, 'environmentIntensity')
      .min(0)
      .max(10)
      .step(0.001)
      .name('Intensity');
    this.guiEnvMap
      ?.add(App.instance.scene, 'backgroundIntensity')
      .min(0)
      .max(10)
      .step(0.001)
      .name('Background intensity');

    // checkbox for removing the environment map
    this.guiEnvMap
      ?.add({ show: true }, 'show')
      .name('Show EnvMap')
      .onChange((value: boolean) => {
        if (!value) {
          App.instance.scene.environment = App.instance.scene.background = null;
        } else {
          App.instance.scene.environment = App.instance.scene.background = environmentMap.texture;
        }
      });

    const updateMaterial = () => {
      App.instance.scene.traverse((child) => {
        // Update environment map for all meshes
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = environmentMap.texture;
          child.material.envMapIntensity = environmentMap.intensity;
          child.castShadow = true;
          child.material.needsUpdate = true;
        }
      });
    };

    // Update material when texture is loaded
    updateMaterial();
  }
}
