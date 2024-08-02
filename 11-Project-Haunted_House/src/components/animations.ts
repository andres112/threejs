export class Animation {
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