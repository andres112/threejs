import { createPointLight } from '../components/light';
import { CustomTexture } from '../textures/main';
import { Group, Object3D, Object3DEventMap, PointLightHelper, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

export class Lamp {
  public instance!: Group<Object3DEventMap>;

  constructor() {}

  public load = (): Promise<Group<Object3DEventMap>> =>
    new Promise((resolve, reject) =>
      loader.load(
        'models/lamp.glb',
        (gltf) => {
          this.instance = gltf.scene;
          this.instance.scale.set(0.09, 0.09, 0.09);
          this.instance.position.set(1.3, -0.4, 3);
          this.instance.rotation.y = -Math.PI * 0.5;

          this.instance.traverse((child: Object3D<Object3DEventMap>) => {
            console.log(child);
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
            if(['Cube006', 'Cylinder'].includes(child.name)) {
              child.material.color.set('#000010');
            }
            if(['Cube001', 'Cube002', 'Cube003', 'Cube004'].includes(child.name)) {
              child.material.map = CustomTexture.lamp.color;
              child.material.bumpMap = CustomTexture.lamp.bump;
            }
            // add point light on the top of this cylinder
            if(child.name === 'Cylinder004') {
              const pointLight = createPointLight('#d3aa14', 6, new Vector3(0, 0.5, 0));
              pointLight.position.set(0, 0.1, 1);
              child.add(pointLight);
            }
          });
          resolve(this.instance);
        },
        undefined,
        (error) => {
          console.error(error);
          reject(error);
        }
      )
    );
}
