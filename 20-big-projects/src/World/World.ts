import * as THREE from 'three';
import App from '@/app/App';
import Environment from './Environment';
import Resources from '@/utils/Resources';
import Floor from './Floor';

export default class World {
  private mesh!: THREE.Mesh;
  private environment!: Environment;
  private floor!: Floor;
  private resources: Resources;

  constructor() {
    // Load resources
    this.resources = App.instance.resources;

    this.createWorld();

    // Wait until Load resources
    this.resources.on('loaded', () => {
      // setup world components once resources are loaded
      this.environment = new Environment();
      this.floor = new Floor();
    });

    console.info('World initialized');
  }

  private createWorld() {
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({
    }));
    App.instance.scene.add(this.mesh);
  }
}
