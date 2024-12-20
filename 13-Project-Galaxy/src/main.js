import { GUI } from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// sizes
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
camera.position.set(3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enablePan = false;
// controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = 0;
controls.minDistance = 2;
controls.maxDistance = 20;

/**
 * Mesh - Galaxy
 */
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  spin: 0.5,
  branches: 10,
  randomness: 0.5,
  randomnessPower: 3,
  coreColor: '#ff6030',
  farColor: '#1b3984',
};

let geometry = null;
let material = null;
let points = null;

const computeShape = (vertex) => {
  const radius = Math.random() * parameters.radius;
  // push the vertex outwards according to the radius of the particle
  const spinAngle = radius * parameters.spin;
  const branchAngle = ((vertex % parameters.branches) * (Math.PI * 2)) / parameters.branches;
  return { radius, spinAngle, branchAngle };
};

const computeRandomness = (radius) => {
  return [computePower(), computePower(), computePower()];
};

const computePower = () => {
  const randomFactor = Math.random();
  const sign = Math.random() < 0.5 ? 1 : -1;
  const adjustedRandomness = Math.pow(randomFactor, parameters.randomnessPower);
  return sign * adjustedRandomness * parameters.randomness;
};

const generateGalaxy = () => {
  // If points already exist, remove them
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  // Geometry
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const coreColor = new THREE.Color(parameters.coreColor);
  const farColor = new THREE.Color(parameters.farColor);

  for (let i = 0; i < parameters.count * 3; i++) {
    const i3 = i * 3;

    // Position
    const { radius, branchAngle, spinAngle } = computeShape(i);
    const [randomX, randomY, randomZ] = computeRandomness(radius);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Color
    // Interpolate between coreColor and farColor based on the radius of the particle
    // mixedColor avoids modifying the original color
    const mixedColor = coreColor.clone();
    mixedColor.lerp(farColor, radius / parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  // Points
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

/**
 * GUI
 */
const parametersFolder = gui.addFolder('Parameters');
parametersFolder
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
parametersFolder
  .add(parameters, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
parametersFolder.add(parameters, 'radius').min(1).max(20).step(1).onFinishChange(generateGalaxy);
parametersFolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
parametersFolder.add(parameters, 'spin').min(-3).max(3).step(0.1).onFinishChange(generateGalaxy);
parametersFolder
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.01)
  .onFinishChange(generateGalaxy);
parametersFolder
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.1)
  .onFinishChange(generateGalaxy);

parametersFolder.addColor(parameters, 'coreColor').onFinishChange(generateGalaxy);
parametersFolder.addColor(parameters, 'farColor').onFinishChange(generateGalaxy);

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

  // Rotate the galaxy
  points.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
