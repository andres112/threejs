import { Mesh, MeshStandardMaterial, Group, BoxGeometry, ConeGeometry, Vector3 } from 'three';
import { Bush } from './bush';
import { CustomTexture } from '../textures/main';
import { HouseFolder } from '../utils/gui';

const WALLS_DIMENSION = { width: 4, height: 2.5, depth: 4 };
const ROOF_DIMENSION = { radius: 3.5, height: 1.5 };
const DOOR_DIMENSION = { width: 1, height:1.6, depth: 0.05 };
const CHIMNEY_DIMENSION = { width: 0.5, height: 3.2, depth: 0.5 };

export class House extends Group {
  private walls = new Mesh();
  private roof = new Mesh();
  private chimney = new Mesh();
  private door = new Mesh();

  constructor(position: Vector3 = new Vector3(0, 0, 0), scale: Vector3 = new Vector3(1, 1, 1)) {
    super();
    this.buildWalls();
    this.buildRoof();
    this.buildChimney();
    this.buildDoor();
    this.buildHouse();
    this.setPosition(position);
    this.setScale(scale);

    this.setGui();
  }

  private buildHouse(): void {
    this.add(this.walls as Mesh);
    this.add(this.roof as Mesh);
    this.add(this.chimney as Mesh);
    this.add(this.door as Mesh);

    this.fillBushes();
  }

  private setPosition(position: Vector3): void {
    this.position.set(position.x, position.y, position.z);
  }

  private setScale(scale: Vector3): void {
    this.scale.set(scale.x, scale.y, scale.z);
  }

  private buildWalls(): void {
    this.walls = new Mesh(
      new BoxGeometry(
        WALLS_DIMENSION.width,
        WALLS_DIMENSION.height,
        WALLS_DIMENSION.depth,
        100,
        100,
        100
      ),
      new MeshStandardMaterial({
        map: CustomTexture.houseWalls.color,
        normalMap: CustomTexture.houseWalls.normal,
        aoMap: CustomTexture.houseWalls.arm,
        roughnessMap: CustomTexture.houseWalls.arm,
        metalnessMap: CustomTexture.houseWalls.arm,
        displacementMap: CustomTexture.houseWalls.displacement,
        displacementScale: 0.1,
        displacementBias: -0.1,
      })
    );
    this.walls.position.y = WALLS_DIMENSION.height * 0.5;
  }

  private buildRoof(): void {
    this.roof = new Mesh(
      new ConeGeometry(ROOF_DIMENSION.radius, ROOF_DIMENSION.height, 4, 50),
      new MeshStandardMaterial(
        {
          map: CustomTexture.houseRoof.color,
          normalMap: CustomTexture.houseRoof.normal,
          aoMap: CustomTexture.houseRoof.arm,
          roughnessMap: CustomTexture.houseRoof.arm,
          metalnessMap: CustomTexture.houseRoof.arm,
          bumpMap: CustomTexture.houseRoof.bump,
          displacementMap: CustomTexture.houseRoof.displacement,
          displacementScale: 0.3,
          displacementBias: -0.15,
        }
      )
    );
    this.roof.position.y = WALLS_DIMENSION.height + ROOF_DIMENSION.height * 0.5;
    this.roof.rotation.y = Math.PI * 0.25;
  }

  private buildChimney(): void {
    this.chimney = new Mesh(
      new BoxGeometry(
        CHIMNEY_DIMENSION.width,
        CHIMNEY_DIMENSION.height,
        CHIMNEY_DIMENSION.depth,
        50,
        50,
        50
      ),
      new MeshStandardMaterial({
        map: CustomTexture.houseChimney.color,
        normalMap: CustomTexture.houseChimney.normal,
        aoMap: CustomTexture.houseChimney.arm,
        roughnessMap: CustomTexture.houseChimney.arm,
        metalnessMap: CustomTexture.houseChimney.arm,
        displacementMap: CustomTexture.houseChimney.displacement,
        displacementScale: 0.1,
        displacementBias: -0.08,
      })
    );
    this.chimney.position.y = CHIMNEY_DIMENSION.height * 0.5;
    this.chimney.position.x = WALLS_DIMENSION.width * 0.5;
  }

  private buildDoor(): void {
    this.door = new Mesh(
      new BoxGeometry(DOOR_DIMENSION.width, DOOR_DIMENSION.height, DOOR_DIMENSION.depth),
      new MeshStandardMaterial({ color: 0x000000 })
    );
    this.door.position.y = DOOR_DIMENSION.height * 0.5;
    this.door.position.z = WALLS_DIMENSION.depth * 0.5;
  }

  private fillBushes(): void {
    // Add bushes around the house
    const bushes = [
      new Bush(new Vector3(-1.4, 0.1, 2.1), 0.25, new Vector3(-0.75, 0, 0)),
      new Bush(new Vector3(-2, 0.1, 2), 0.5, new Vector3(-0.75, 0, -0.25)),
      new Bush(new Vector3(-2.1, 0.2, -1.5), 0.4, new Vector3(0, 0, -0.5)),
      new Bush(new Vector3(-2, 0.1, -2), 0.25, new Vector3(0.5, 0, 0)),
      new Bush(new Vector3(-2.1, 0, -1), 0.2),

      new Bush(new Vector3(2, 0.2, 0.5), 0.5, new Vector3(0, 0, 0.5)),
      new Bush(new Vector3(2.1, 0.1, -0.4), 0.4 , new Vector3(0, 0, 0.5)),
    ];

    this.add(...bushes);
  }

  private setGui() {}
}
