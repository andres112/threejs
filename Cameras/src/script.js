import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener('mousemove', (event) => {
 cursor.x = event.clientX / sizes.width - 0.5;
 cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 50, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(mesh);

// Cameras
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100);

// solve the problem of the object being clipped by the camera
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 100);
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target = mesh.position;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.z = elapsedTime;
  // mesh.rotation.y = elapsedTime;
  mesh.rotation.x = elapsedTime;

  // Comment because Orbit Built in camera
  // // Update camera
  // camera.position.x = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  // Update controls
  controls.update(); // useful for damping
  
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// Resize event
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.left = -camera.aspect;
  camera.right = camera.aspect;
  camera.top = 1;
  camera.bottom = -1;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});
