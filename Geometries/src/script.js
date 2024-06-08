import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';

const stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');
const fps = document.querySelector('.fps');

// Scene
const scene = new THREE.Scene();

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
const geometry = new THREE.SphereGeometry(1, 50, 50);
const material = new THREE.MeshBasicMaterial({ color: 0xf34f00, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.z = 0.7;
mesh.rotation.reorder('YXZ');
scene.add(mesh);

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  stats.begin();
  const elapsedTime = clock.getElapsedTime();
  mesh.rotation.y = elapsedTime * 0.5;
  mesh.position.y = Math.sin(elapsedTime);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  stats.end();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
