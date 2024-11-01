export default class Sizes {
  width: number = 0;
  height: number = 0;
  aspectRatio: number = 1;

  constructor() {
    this.resize();
    // Resize event
    window.addEventListener('resize', this.resize.bind(this));
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspectRatio = Math.min(window.devicePixelRatio, 2);
  }
}
