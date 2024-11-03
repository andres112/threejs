import App from '@/app/App';
import * as THREE from 'three';

export default class Floor {
  private geometry!: THREE.CircleGeometry;
  private texture: { [key: string]: THREE.Texture } = {};
  private material!: THREE.MeshStandardMaterial;
  private mesh!: THREE.Mesh;

  constructor() {
    this.setGeometry();
    this.setTexture();
    this.setMaterial();
    this.setMesh();
    console.info('Floor initialized');
  }

  private setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  /**
   * Set the texture for the floor
   * @private
   * @memberof Floor
   * @returns {void}
   */
  private setTexture() {
    this.texture['color'] = App.instance.resources.items['grassColorTexture'];
    this.texture.color.colorSpace = THREE.SRGBColorSpace;
    this.texture.color.repeat.set(1.5, 1.5);
    this.texture.color.wrapS = this.texture.color.wrapT = THREE.RepeatWrapping;

    this.texture['normal'] = App.instance.resources.items['grassNormalTexture'];
    this.texture.normal.repeat.set(1.5, 1.5);
    this.texture.normal.wrapS = this.texture.normal.wrapT = THREE.RepeatWrapping;
  }

  /**
   * Set the material for the floor
   * @private
   * @memberof Floor
   * @returns {void}
   */
  private setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture.color,
      normalMap: this.texture.normal,
      side: THREE.DoubleSide,
      shadowSide: THREE.FrontSide,
    });
  }

  private setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = -0.51;
    App.instance.scene.add(this.mesh);
  }
}
