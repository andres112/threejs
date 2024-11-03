import App from '@/app/App';
import { IAnimation } from '@/resources/Interfaces';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Character {
  private model!: THREE.Group<THREE.Object3DEventMap>;
  private animation: IAnimation = {} as IAnimation;

  constructor() {
    // setup
    this.setModel();
    this.setAnimation();
    console.info('Character initialized');
  }

  private setModel() {
    // Load character
    const gltfLoader = App.instance.resources.items['goblinModel'] as GLTF;
    this.model = gltfLoader.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.model.position.set(0, 0, 0);
    this.model.rotation.x = -Math.PI * 0.5;
    App.instance.scene.add(this.model);
  }

  private setAnimation() {
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(
      (App.instance.resources.items['goblinModel'] as GLTF).animations[0]
    );
    this.animation.action.play();

    console.log(this.animation);
  }
}
