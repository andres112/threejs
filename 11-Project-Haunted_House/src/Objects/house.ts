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
const DOOR_DIMENSION = { width: 1.5, height: 2, depth: 0.1 };
const CHIMNEY_DIMENSION = { width: 0.5, height: 3.2, depth: 0.5 };

export class House extends Group {
  private walls = new Mesh();
  private roof = new Mesh();
  private chimney = new Mesh();
  private door = new Mesh();

  constructor() {
    super();
    this.buildWalls();
    this.buildRoof();
    this.buildChimney();
    this.buildDoor();
    this.buildHouse();
  }

  private buildHouse(): void {
    this.add(this.walls as Mesh);
    this.add(this.roof as Mesh);
    this.add(this.chimney as Mesh);
    this.add(this.door as Mesh);
  }

  private buildWalls(): void {
    this.walls = new Mesh(
      new BoxGeometry(WALLS_DIMENSION.width, WALLS_DIMENSION.height, WALLS_DIMENSION.depth),
      new MeshStandardMaterial({ wireframe: true })
    );
    this.walls.position.y = WALLS_DIMENSION.height * 0.5;
  }

  private buildRoof(): void {
    this.roof = new Mesh(
      new ConeGeometry(ROOF_DIMENSION.radius, ROOF_DIMENSION.height, 4),
      new MeshStandardMaterial()
    );
    this.roof.position.y = WALLS_DIMENSION.height + ROOF_DIMENSION.height * 0.5;
    this.roof.rotation.y = Math.PI * 0.25;
  }

  private buildChimney(): void {
    this.chimney = new Mesh(
      new BoxGeometry(CHIMNEY_DIMENSION.width, CHIMNEY_DIMENSION.height, CHIMNEY_DIMENSION.depth),
      new MeshStandardMaterial()
    );
    this.chimney.position.y = CHIMNEY_DIMENSION.height * 0.5;
    this.chimney.position.x = WALLS_DIMENSION.width * 0.5;
  }

  private buildDoor(): void {
    this.door = new Mesh(
      new BoxGeometry(DOOR_DIMENSION.width, DOOR_DIMENSION.height, DOOR_DIMENSION.depth),
      new MeshStandardMaterial()
    );
    this.door.position.y = DOOR_DIMENSION.height * 0.5;
    this.door.position.z = WALLS_DIMENSION.depth * 0.5;
  }
}
