import * as THREE from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const mesh1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x00aa11, wireframe: true })
);
mesh1.position.set(0, 1, 0);
scene.add(mesh1);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(1, 1, 5);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Clock
const clock = new THREE.Clock();

// Animation
const loop = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.rotation.y = elapsedTime * 5;
  mesh.position.x = Math.sin(elapsedTime) * 2;
  mesh.position.z = Math.cos(elapsedTime) * 3;
  camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

// Timeline using GSAP GreenSock
const timeline = gsap.timeline({ repeat: -1 });
timeline
  .to(mesh1.position, { duration: 1, delay: 1, x: 2 })
  .to(mesh1.position, { duration: 2, delay: 0, x: -2 })
  .to(mesh1.position, { duration: 1, delay: 0, x: 0 });
