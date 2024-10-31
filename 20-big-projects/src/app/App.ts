export default class App {
  constructor() {
    // Global access
    window.app = this;
  }
  init() {
    console.log('App initialized');
  }
}
