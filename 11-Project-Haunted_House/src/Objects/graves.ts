import { Group, Vector2, Vector3 } from 'three';
import { Grave } from './grave';

export class Graves extends Group {
  private static instance: Graves | null = null;
  private floorSize?: Vector2;
  private housePositions?: Vector2[];

  private constructor(floorSize: Vector2, housePositions: Vector3[]) {
    super();
    this.floorSize = floorSize;
    this.setHousePositions(housePositions);
    this.buildGraves();
  }

  public static getInstance(floorSize: Vector2, housePositions: Vector3[]): Graves {
    if (!Graves.instance) {
      Graves.instance = new Graves(floorSize, housePositions);
    }
    return Graves.instance;
  }

  private setHousePositions(housePositions: Vector3[]) {
    console.log('Setting house positions');
    this.housePositions = housePositions.map((position) => {
      return new Vector2(position.x, position.z);
    });
  }

  private buildGraves() {
    // Create the graves
    for (let i = 0; i < 35; i++) {
      const gravePosition = this.gravePosition();
      const grave = new Grave();
      grave.position.set(gravePosition.x, gravePosition.y, gravePosition.z);
      // add small random rotation positive or negative in z axis
        grave.rotation.z = (Math.random() - 0.5) * 0.3 ;
        grave.rotation.y = (Math.random() - 0.5) * 0.7 ;
        grave.rotation.x = (Math.random() - 0.5) * 0.5 ;
      this.add(grave);
    }
  }

  private gravePosition(): Vector3 {
    const radius = 3; // Radius around each house to avoid
    let positionValid = false;
    let position = new Vector2();

    while (!positionValid) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (Math.min(this.floorSize!.x, this.floorSize!.y) * 0.5 - 1);
      position.set(Math.cos(angle) * distance, Math.sin(angle) * distance);

      positionValid = !this.housePositions!.some((housePosition) => {
        return position.distanceTo(housePosition) < radius;
      });
    }
    return new Vector3(position.x, 0.3, position.y);
  }
}
