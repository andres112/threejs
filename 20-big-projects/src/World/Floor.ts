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
    this.geometry = new THREE.CircleGeometry(10, 64);
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

    this.texture['normal'] = App.instance.resources.items['grassNormalTexture'];

    this.texture['arm'] = App.instance.resources.items['grassARMTexture'];

    this.texture['displacement'] = App.instance.resources.items['grassDisplacementTexture'];

    for (const key of Object.keys(this.texture)) {
      const texture = this.texture[key];
      if (texture instanceof THREE.Texture) {
        texture.repeat.set(2, 2);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    }
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
      aoMap: this.texture.arm,
      displacementMap: this.texture.displacement,
      displacementScale: 0.2,
      displacementBias: -0.05,
      metalnessMap: this.texture.arm,
      roughnessMap: this.texture.arm,
      side: THREE.DoubleSide,
      shadowSide: THREE.FrontSide,
    });
  }

  private setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = -0.511;
    this.mesh.receiveShadow = true;
    App.instance.scene.add(this.mesh);
  }
}
