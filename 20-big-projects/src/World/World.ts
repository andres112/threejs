import * as THREE from 'three';
import App from '@/app/App';
import Environment from './Environment';

export default class World {
    private mesh!: THREE.Mesh;
    private environment!: Environment;

    constructor() {
        this.createWorld();

        // setup environment
        this.environment = new Environment();
        console.info('World initialized');
    }

    private createWorld() {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        );
        App.instance.scene.add(this.mesh);
    }
}