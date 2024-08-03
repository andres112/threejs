import { setPointLightShadow } from '../components/light';
import { PointLight, Vector2 } from 'three';

// Define the array of strings
export const ghostPaths = ['diagonal', 'circle', 'figure8', 'invdiagonal', 'zigzag'] as const;

// Create the type from the array
type GhostPath = (typeof ghostPaths)[number];

const LIMIT_FACTOR = 0.3;

export class Ghost extends PointLight {
  constructor(color: string, intensity: number) {
    super(color, intensity);
    setPointLightShadow(this);
  }

  public animateGhosts(speed: number, limits: Vector2, pattern: GhostPath): void {
    switch (pattern) {
      case 'diagonal':
        this.diagonal(speed, limits);
        break;
      case 'invdiagonal':
        this.diagonal(-speed, limits);
        break;
      case 'circle':
        this.circle(speed, limits);
        break;
      case 'figure8':
        this.figure8(speed, limits);
        break;
      case 'zigzag':
        this.zigzag(speed, limits);
        break;
    }
  }

  private diagonal(speed: number, limits: Vector2): void {
    this.position.x = limits.x * LIMIT_FACTOR * Math.sin(speed);
    this.position.z = limits.y * LIMIT_FACTOR * Math.sin(speed);
    this.position.y = Math.sin(speed) * Math.sin(speed * 1.5) * Math.sin(speed * 2.5);
  }

  private circle(speed: number, limits: Vector2): void {
    this.position.x = Math.sin(speed) * limits.x * LIMIT_FACTOR;
    this.position.z = Math.cos(speed) * limits.y * LIMIT_FACTOR;
    this.position.y = Math.sin(speed) * Math.sin(speed * 2.5) * Math.sin(speed * 3.5);
  }

  private figure8(speed: number, limits: Vector2): void {
    this.position.x = Math.sin(speed) * limits.x * LIMIT_FACTOR;
    this.position.z = Math.sin(speed * 2) * limits.y * LIMIT_FACTOR;
    this.position.y = Math.sin(speed) * Math.sin(speed * 2.5) * Math.sin(speed * 3.5);
  }

  private zigzag(speed: number, limits: Vector2): void {
    const frequency = 5; // Frequency of the zigzag pattern

    this.position.x = Math.sin(speed) * limits.x * LIMIT_FACTOR;
    this.position.z = Math.sin(frequency * speed) * limits.y * LIMIT_FACTOR;
    this.position.y = Math.sin(speed) * Math.sin(speed * 2.5) * Math.sin(speed * 3.5);
  }
}
