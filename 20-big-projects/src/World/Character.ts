import App from '@/app/App';
import { IAnimation } from '@/resources/Interfaces';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Character {
  public model!: THREE.Group<THREE.Object3DEventMap>;
  private animation: IAnimation = {} as IAnimation;

  constructor(modelName: string) {
    // setup
    this.setModel(modelName);
    this.setAnimation(modelName);
    console.info('Character initialized');
  }

  public update() {
    // Update animation multiple delta by 0.001 to convert milliseconds to seconds
    this.animation.mixer.update(App.instance.time.delta * 0.001);
  }

  private setModel(modelName: string) {
    // Load character
    const gltfLoader = App.instance.resources.items[modelName] as GLTF;
    this.model = gltfLoader.scene;
    this.model.scale.setScalar(0.025);
    this.model.rotation.y = Math.PI;
    App.instance.scene.add(this.model);
  }

  private setAnimation(modelName: string) {
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(
      (App.instance.resources.items[modelName] as GLTF).animations[0]
    );
    this.animation.action.play();
  }
}
