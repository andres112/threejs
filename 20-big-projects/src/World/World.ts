import App from '@/app/App';
import Environment from './Environment';
import Resources from '@/utils/Resources';
import Floor from './Floor';
import Character from './Character';

export default class World {
  private character!: Character;
  private environment!: Environment;
  private floor!: Floor;
  private resources: Resources;

  constructor() {
    // Load resources
    this.resources = App.instance.resources;

    // Wait until Load resources
    this.resources.on('loaded', () => {
      // setup world components once resources are loaded
      this.character = new Character();
      this.floor = new Floor(); // Create floor first to avoid shadow issues
      this.environment = new Environment(); // because updateMaterial is called here
    });

    console.info('World initialized');
  }
}
