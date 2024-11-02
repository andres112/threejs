import App from '../app/App';

export default class Camera {
  private sizes: App['sizes'];
  private scene: App['scene'];

  constructor() {
    this.sizes = App.instance.sizes;
    this.scene = App.instance.scene;
  }
}
