import App from "@/app/App";

export default class Character {
    constructor() {
        // setup
        this.setModel();
        console.info('Character initialized');
    }

    private setModel() {

        // Load character
        const gltfLoader = App.instance.resources.items['goblinModel'];
        const model = gltfLoader.scene;
        model.scale.set(0.02, 0.02, 0.02);
        model.position.set(0, 0, 0);
        model.rotation.x = -Math.PI * 0.5;
        App.instance.scene.add(model);
    }
}