import GUI from "lil-gui";

const gui = new GUI({
    title: "Haunted House",
    width: 300,
    closeFolders: true,
});

export const FloorFolder = gui.addFolder("Floor");
export const HouseFolder = gui.addFolder("House");