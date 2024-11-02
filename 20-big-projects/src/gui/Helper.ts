import GUI from 'lil-gui';

// Helper class - singleton
export default class Helper {
  private static instance: Helper;
  private gui!: GUI;

  constructor() {
    if (Helper.instance) return Helper.instance;
    Helper.instance = this;
    this.gui = new GUI();

    console.info('Helper initialized');
  }

  public static addFolder(name: string): GUI {
    const folder = Helper.instance.gui.folders.find((x) => x._title === name);
    if (folder) {
      console.warn(`Folder ${name} already exists`);
      return folder;
    }
    return Helper.instance.gui.addFolder(name);
  }
}
