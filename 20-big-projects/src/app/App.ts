import Sizes from "../utils/Sizes";

declare global {
  interface Window {
    app: App;
  }
}

export default class App {
  private canvas: HTMLCanvasElement | null;
  private sizes: Sizes;

  constructor(canvas: HTMLCanvasElement | null) {
    // Global access to app
    window.app = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
  }
  init() {
    console.log('App initialized');
  }
}
