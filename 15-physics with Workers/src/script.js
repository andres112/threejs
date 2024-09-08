import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';


// Canvas and Scene setup
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Axes Helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Initialize worker
const worker = new Worker(new URL('./physicsWorker.js', import.meta.url), { type: 'module' });

/**
 * Debug UI
 */
const gui = new GUI();
const debugObj = {};
debugObj.createBox = () => {
    worker.postMessage({
        type: 'createBox',
        size: Math.random(),
        position: { x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 },
        rotation: { x: 0, y: 0, z: Math.random() * Math.PI }
    });
};

debugObj.reset = () => {
    worker.postMessage({ type: 'reset' });
    boxes.forEach((box) => scene.remove(box.mesh));
    boxes = [];
};
gui.add(debugObj, 'createBox');
gui.add(debugObj, 'reset');


// Floor

// Three.js floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: '#777777', metalness: 0.3, roughness: 0.4 })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Cannon.js floor in Worker
worker.postMessage({ type: 'createFloor' });


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.castShadow = true;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Handle canvas resizing
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3, 5, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Environment map
 */
const rgbeloader = new RGBELoader()
rgbeloader.load('/textures/environmentMap/2k.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    scene.environment = envMap
})

/**
 * Animate
 */
const clock = new THREE.Clock();
let boxes = [];

worker.onmessage = (e) => {
    const { type, data } = e.data;

    if (type === 'update') {
        data.forEach((box, index) => {
            boxes[index].mesh.position.set(box.position.x, box.position.y, box.position.z);
            boxes[index].mesh.quaternion.set(box.rotation.x, box.rotation.y, box.rotation.z, box.rotation.w);
        });
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhysicalMaterial();
    material.roughness= 0
    material.metalness = 0
    material.side = THREE.DoubleSide
    material.transparent = true;
    material.transmission = 0.9
    material.ior = 1.5
    material.thickness = 0.1
    material.iridescence = 0.8
    material.iridescenceIOR = 1
    material.iridescenceThicknessRange = [100, 400]

    if (type === 'createBox') {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(data.size, data.size, data.size);
        mesh.position.copy(data.position);
        if (data.rotation) {
          mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        }
        mesh.castShadow = true;

        scene.add(mesh);
        boxes.push({ mesh });
    }
};

const tick = () => {
    const deltaTime = clock.getDelta();

    // Send deltaTime to worker to step the physics world
    worker.postMessage({ type: 'updatePhysics', deltaTime });

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);

    // Call tick again on the next frame
    requestAnimationFrame(tick);
};

tick();
