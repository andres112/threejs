import { Vector3 } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export class SkyBox extends Sky {
  private static instance: Sky;

  private constructor() {
    super();
  }

  public static getInstance(): Sky {
    if (!SkyBox.instance) {
      SkyBox.instance = new Sky();
      SkyBox.instance.scale.setScalar(30);
      SkyBox.instance.material.uniforms['turbidity'].value = 10;
      SkyBox.instance.material.uniforms['rayleigh'].value = 3;
      SkyBox.instance.material.uniforms['mieCoefficient'].value = 0.1;
      SkyBox.instance.material.uniforms['mieDirectionalG'].value = 0.95;
      SkyBox.instance.material.uniforms['sunPosition'].value = new Vector3(0.5, -0.038 , -0.95);
      console.log('Sky created ', SkyBox.instance.material);
    }
    return SkyBox.instance;
  }

}
