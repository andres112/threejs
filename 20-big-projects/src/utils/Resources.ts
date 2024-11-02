import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import EventEmitter from './EventEmitter';
import { ISource } from '@/resources/Interfaces';

export default class Resources extends EventEmitter {
  public items: {[key: string]: any};
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
          this.loaders['gltfLoader'].load(source.path, (file: GLTF) => {
            this.sourceLoaded(source, file);
          });
          break;
        case 'texture':
          this.loaders['textureLoader'].load(source.path, (file: THREE.Texture) => {
            this.sourceLoaded(source, file);
          });
          break;
        case 'cubeTexture':
          this.loaders['cubeTextureLoader'].load(source.path, (file: THREE.CubeTexture) => {
            this.sourceLoaded(source, file);
          });
          break;
        default:
          console.warn(`Type ${source.type} is not supported`);
      }
    });
  }

    /**
     * Called when all resource are loaded.
     * @private
     * @memberof Resources
     * @returns {void}
     */
    private sourceLoaded(source: ISource, file: any) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            console.info('Resources loaded');
            this.trigger('loaded');
        }
    }
}
