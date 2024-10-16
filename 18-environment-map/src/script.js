import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x9400d3, 10);
directionalLight.position.set(3.5, 7, -1);
scene.add(directionalLight);
// directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshBasicMaterial()
);
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Models
 */

// gltf Model
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (model) => {
  model.scene.scale.setScalar(10);
  model.scene.position.set(-3, 0, 0);
  scene.add(model.scene);

  // Debug
  gui
    .add(model.scene.rotation, 'y')
    .min(0)
    .max(Math.PI * 2)
    .step(0.01)
    .name('rotation Normal');
});

// draco Model
gltfLoader.load('/models/FlightHelmet/glTF/helmet.glb', (model) => {
  model.scene.scale.setScalar(3);
  model.scene.position.set(3, 4, 0);
  scene.add(model.scene);

  // Debug
  gui
    .add(model.scene.rotation, 'y')
    .min(0)
    .max(Math.PI * 2)
    .step(0.01)
    .name('rotation Draco');
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // rotate the directional light around the scene
  const radius = 7;
  directionalLight.position.x = Math.sin(elapsedTime) * radius;
  directionalLight.position.z = Math.cos(elapsedTime) * radius;
  directionalLightHelper.update();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
