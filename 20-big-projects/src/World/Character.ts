import App from '@/app/App';
import { IAnimation } from '@/resources/Interfaces';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import Helper from '@/gui/Helper';
import GUI from 'lil-gui';

export default class Character {
  public model!: THREE.Group<THREE.Object3DEventMap>;
  private gui!: GUI | undefined;
  private modelName!: string;
  private animation: IAnimation = {} as IAnimation;
  private animations: THREE.AnimationClip[] = [];
  private debugObject: { [key: string]: any } = {};

  constructor(modelName: string, position?: THREE.Vector3) {
    // setup
    this.modelName = modelName;
    this.setModel(position);
    this.getAnimations();
    if (this.animations.length) {
      this.setAnimation();
    }
    if (Helper.active && this.animations.length > 1) {
      this.gui = Helper.addFolder(modelName.toUpperCase());
      this.debugObject['animation'] = 0;
      this.debugObject['crossFadeTime'] = 1;
      this.setGUIAnimations();
    }
    console.info('Character initialized');
  }

  public update() {
    // Update animation multiple delta by 0.001 to convert milliseconds to seconds
    this.animation.mixer.update(App.instance.time.delta * 0.001);
  }

  private setModel(position?: THREE.Vector3) {
    // Load character
    const gltfLoader = App.instance.resources.items[this.modelName] as GLTF;
    this.model = gltfLoader.scene;
    this.model.scale.setScalar(0.025);
    this.model.position.copy(position || new THREE.Vector3(0, 0, 0));
    this.model.rotation.y = Math.PI;
    App.instance.scene.add(this.model);
  }

  private getAnimations() {
    this.animations = (App.instance.resources.items[this.modelName] as GLTF).animations;
  }

  /**
   * 
   * Set animation with crossfade
   * This method requires to reset the animation and play it again
   * only when a previous animation is playing
   */
  private setAnimation(index: number = 0) {
    const oldAction = this.animation.action;
    if (!oldAction) {
      this.animation.mixer = new THREE.AnimationMixer(this.model);
      this.animation.action = this.animation.mixer.clipAction(this.animations[index]);
      this.animation.action.play();
    } else {
      this.animation.action = this.animation.mixer.clipAction(this.animations[index]);
      this.animation.action?.reset();
      this.animation.action?.play();
      this.animation.action?.crossFadeFrom(oldAction, this.debugObject.crossFadeTime, true);
    }
  }

  private setGUIAnimations() {
    if (!this.gui) return;
    this.gui
      .add(this.debugObject, 'animation', {
        ...this.animations.reduce((acc: { [key: string]: number }, _, index) => {
          acc[`Animation ${index}`] = index;
          return acc;
        }, {}),
      })
      .name('Animations')
      .onChange((index: number) => {
        this.setAnimation(index);
      });

    this.gui
      .add(this.debugObject, 'crossFadeTime', 0, 5, 1)
      .name('Crossfade time')
      .onChange((time: number) => (this.debugObject.crossFadeTime = time));
  }
}
