declare global {
  interface Window {
    app: App;
  }
}

export default class App {
  private canvas: HTMLCanvasElement | null;

  constructor(canvas: HTMLCanvasElement | null) {
    // Global access to app
    window.app = this;

    // Options
    this.canvas = canvas;
  }
  init() {
    console.log('App initialized');
  }
}
