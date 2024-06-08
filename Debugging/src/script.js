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
const debugObject = {
  scale: 1,
  color: 0xbac520,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 2, y: mesh.rotation.y + Math.PI * 2 });
  },
  subdivision: 6,
};

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
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(-5, 0, 0);
scene.add(mesh);

// Debug cube
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('azimuth');
gui.add(mesh, 'visible');
gui.add(mesh.material, 'wireframe');
// This method gives different results
gui.addColor(mesh.material, 'color').name('fake color');

const folder = gui.addFolder('Custom Tweaks');

// This method gives the real color
folder
  .addColor(debugObject, 'color')
  .onChange(() => {
    mesh.material.color.set(debugObject.color);
  })
  .name('real color');
// Custom scale controller
folder
  .add(debugObject, 'scale')
  .min(0.5)
  .max(3)
  .step(0.01)
  .name('scale')
  .onChange(function (value) {
    mesh.scale.set(value, value, value);
  });

folder.add(debugObject, 'spin');

folder
  .add(debugObject, 'subdivision')
  .min(3)
  .max(32)
  .step(1)
  .onFinishChange(() => {
    const newGeometry = new THREE.SphereGeometry(
      1,
      debugObject.subdivision,
      debugObject.subdivision
    );
    // IMPORTANTY: Dispose the old geometry to avoid memory leaks
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
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
camera.position.z = 8;
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

// const timeline = gsap.timeline({ repeat: -1 });
// timeline
//   .to(mesh.position, { duration: 2.5, x: 2, y: 2, z: 3, delay:1, ease: 'power2.inOut' })
//   .to(mesh.rotation, { duration: 2.5, x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2, ease: 'power2.inOut' }, '-=2.5')
//   .to(mesh.scale, { duration: 1, x: 1.5, y: 1.5, z: 1.5, ease: 'elastic.out(1, 0.3)' })
//   .to(mesh.position, { duration: 3, x: -5, y: 0, z: 0, ease: 'bounce.out' })
//   .to(mesh.rotation, { duration: 3, x: 0, y: 0, z: 0, ease: 'power2.inOut' }, '-=3')
//   .to(mesh.scale, { duration: 1, x: 1, y: 1, z: 1, ease: 'power2.inOut' });
