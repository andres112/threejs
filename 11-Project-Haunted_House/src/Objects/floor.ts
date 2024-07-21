import { PlaneGeometry, Mesh, MeshStandardMaterial } from 'three';

// Floor is a singleton class that creates only one instance of the floor
export class Floor extends Mesh {
  private static instance: Floor | null = null;

  private constructor(public width: number, public height: number) {
    super(new PlaneGeometry(width, height), new MeshStandardMaterial());
    this.rotation.x = -Math.PI * 0.5;
  }

  public static getInstance(width: number, height: number): Floor {
    if (!Floor.instance) {
      Floor.instance = new Floor(width, height);
    }
    return Floor.instance;
  }
}
