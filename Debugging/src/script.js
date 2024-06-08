import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import GUI from 'lil-gui';

gsap.registerPlugin(CustomEase);

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.SphereGeometry(1, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: '#ff0000', wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug cube
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('azimuth');
gui.add(mesh, 'visible');
gui.add(mesh.material, 'wireframe');
gui.addColor(mesh.material, 'color');
// Custom scale controller
let scaleValue = 1;
const scaleController = gui
  .add({ scale: scaleValue }, 'scale')
  .min(0.5)
  .max(3)
  .step(0.01)
  .name('scale');
scaleController.onChange(function (value) {
  mesh.scale.set(value, value, value);
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
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
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

CustomEase.create(
  'hop',
  'M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0'
);
const timeline = gsap.timeline({ repeat: -1 });
timeline
  .to(mesh.position, { duration: 2.5, y: 4, delay:1, ease: 'bounce.in' })
  .to(mesh.position, { duration: 3, y: 0, ease: 'bounce.out' });
