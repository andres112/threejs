import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import App from '@/app/App';
import EventEmitter from './EventEmitter';
import { ISource } from '@/resources/Interfaces';

export default class Resources extends EventEmitter {
  public items: {[key: string]: string};
  public toLoad: number;
  public loaded: number;
  private sources: ISource[];
  private loaders!: { [key: string]: any };

  constructor(sources: ISource[]) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
    console.info('Resources initialized');
  }

  private setLoaders() {
    this.loaders = {};
    this.loaders['gltfLoader'] = new GLTFLoader();
    this.loaders['textureLoader'] = new THREE.TextureLoader();
    this.loaders['cubeTextureLoader'] = new THREE.CubeTextureLoader();

    // Draco loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    this.loaders['gltfLoader'].setDRACOLoader(dracoLoader);
  }

  /**
   * Starts loading the resources specified in the sources array.
   * Handles different resource types: 'gltf', 'texture', and 'cubeTexture'.
   * @private
   * @memberof Resources
   * @returns {void}
   */
  private startLoading() {
    this.sources.forEach((source) => {
      switch (source.type) {
        case 'gltf':
          this.loaders['gltfLoader'].load(source.path, (gltf: GLTF) => {
            console.log('GLTF loaded', gltf);
          });
          break;
        case 'texture':
          this.loaders['textureLoader'].load(source.path, (texture: THREE.Texture) => {
            console.log('Texture loaded', texture);
          });
          break;
        case 'cubeTexture':
          this.loaders['cubeTextureLoader'].load(source.path, (cubeTexture: THREE.CubeTexture) => {
            console.log('Cube texture loaded', cubeTexture);
          });
          break;
        default:
          console.warn(`Type ${source.type} is not supported`);
      }
    });
  }

    /**
     * Called when a resource is loaded.
     * @private
     * @memberof Resources
     * @returns {void}
     */
    private onResourceLoaded(source: ISource, file: string) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            console.info('Resources loaded');
            this.trigger('loaded');
        }
    }
}
