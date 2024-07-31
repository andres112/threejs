import GUI from "lil-gui";
import Stats from 'stats.js';

export const stats = new Stats();

const gui = new GUI({
    title: "Haunted House",
    width: 300,
    closeFolders: true,
});

export const FloorFolder = gui.addFolder("Floor");
export const HouseFolder = gui.addFolder("House");