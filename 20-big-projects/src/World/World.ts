import App from '@/app/App';
import * as THREE from 'three';

export default class World {
    private mesh!: THREE.Mesh;

    constructor() {
        this.createWorld();
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