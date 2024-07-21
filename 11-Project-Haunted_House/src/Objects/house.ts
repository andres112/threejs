import { Mesh, SphereGeometry, MeshStandardMaterial, Group, BoxGeometry } from 'three';

export class House extends Group {
  private walls= new Mesh();

  constructor() {
    super();
    this.buildWalls();
    this.buildHouse();
  }

  private buildHouse(): void {
    this.add(this.walls as Mesh);
  }

  private buildWalls(): void {
    this.walls = new Mesh(
      new BoxGeometry(4, 2.5, 4), 
      new MeshStandardMaterial()
    );
  }
}
