import GUI from 'lil-gui';

// Helper class - singleton
export default class Helper {
  static active = false;
  private static instance: Helper;
  private gui!: GUI;

  constructor() {
    // Helper.active if query string contains 'gui'
    Helper.active = window.location.search.includes('debug');

    if (!Helper.active) return;
    
    if (Helper.instance) return Helper.instance;
    Helper.instance = this;
    this.gui = new GUI();

    console.info('Helper initialized');
  }

  public static addFolder(name: string): GUI | undefined {
    if(!Helper.instance) return;

    const folder = Helper.instance.gui.folders.find((x) => x._title === name);
    if (folder) {
      console.warn(`Folder ${name} already exists`);
      return folder;
    }
    // Add folder but closed by default
    const newFolder = Helper.instance.gui.addFolder(name);
    newFolder.close();
    return newFolder;
  }

  public static destroy() {
    if (!Helper.instance) return;
    Helper.instance.gui.destroy();
  }


}
