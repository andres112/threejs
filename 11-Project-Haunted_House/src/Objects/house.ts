import {
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
  Group,
  BoxGeometry,
  ConeGeometry,
} from 'three';

const WALLS_DIMENSION = { width: 4, height: 2.5, depth: 4 };
const ROOF_DIMENSION = { radius: 3.3, height: 1.5 };

export class House extends Group {
  private walls = new Mesh();
  private roof = new Mesh();

  constructor() {
    super();
    this.buildWalls();
    this.buildRoof();
    this.buildHouse();
  }

  private buildHouse(): void {
    this.add(this.walls as Mesh);
    this.add(this.roof as Mesh);
  }

  private buildWalls(): void {
    this.walls = new Mesh(
      new BoxGeometry(WALLS_DIMENSION.width, WALLS_DIMENSION.height, WALLS_DIMENSION.depth),
      new MeshStandardMaterial()
    );
    this.walls.position.y = WALLS_DIMENSION.height * 0.5;
  }

  private buildRoof(): void {
    this.roof = new Mesh(
      new ConeGeometry(ROOF_DIMENSION.radius, ROOF_DIMENSION.height, 4),
      new MeshStandardMaterial()
    );
    this.roof.position.y = WALLS_DIMENSION.height * 1.25;
    this.roof.rotation.y = Math.PI * 0.25
  }
}
