import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  width: number = 0;
  height: number = 0;
  aspectRatio: number = 1;

  constructor() {
    super();

    this.resize();
    // Resize event
    //use arrow function to keep the context of this
    window.addEventListener('resize', () => this.resize()); 
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspectRatio = Math.min(window.devicePixelRatio, 2);

    this.trigger('resize');
  }
}
