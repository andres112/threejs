import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/9.png');
const sunTexture = textureLoader.load('/textures/2k_sun.jpg');
sunTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Lights
 */
const sunLight = new THREE.PointLight(0xffcc00, 30, 100, 1.5);
sunLight.position.set(0, 2, 0);
scene.add(sunLight);

/**
 * Particles
 */

// Geometry
// Create a spiral galaxy
const particlesGeometry = new THREE.BufferGeometry();
const count = 1000000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

// Spiral parameters
const spiralTurns = 100;
const maxRadius = 100;
const heightVariation = 1; // To add some 3D depth to the spiral
const armOffset = Math.PI; // Offset for the second arm

for (let i = 0; i < count * 0.5; i++) {
  const angle = spiralTurns * Math.PI * 2 * (i / (count * 0.5));
  const radius = maxRadius * Math.sqrt((3*i) / (count * 0.5)); // Logarithmic spiral
  const randomFactor = (Math.random() - 0.5) * 0.5;

  // First arm
  let x = (radius + randomFactor) * Math.cos(angle);
  let y = (Math.random() - 0.5) * heightVariation;
  let z = (radius + randomFactor) * Math.sin(angle);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  // Second arm
  x = (radius + randomFactor) * Math.cos(angle + armOffset);
  y = (Math.random() - 0.5) * heightVariation;
  z = (radius + randomFactor) * Math.sin(angle + armOffset);

  positions[(i + count * 0.5) * 3] = x;
  positions[(i + count * 0.5) * 3 + 1] = y;
  positions[(i + count * 0.5) * 3 + 2] = z;

  // Colors
  colors[i * 3] = colors[i + count * 0.5 * 3] = Math.random();
  colors[i * 3 + 1] = colors[i + count * 0.5 * 3 + 1] = Math.random();
  colors[i * 3 + 2] = colors[i + count * 0.5 * 3 + 2] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const pointsMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  alphaMap: particleTexture,
  transparent: true,
  // alphaTest: 0.001, // To avoid rendering the background of the texture, using a threshold
  // alphaTest generates not an ideal result, but it's a good approximation
  // depthTest: false, // To avoid depth fighting between particles
  // depthTest generates a bug when another object is behind the particles
  depthWrite: false, // To avoid depth fighting between particles
  // depth and blending(transparency) do not work together. If you want to use both, you need to use a custom shader.
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

// Points
const particles = new THREE.Points(particlesGeometry, pointsMaterial);
scene.add(particles);

/**
 * Object: Sun
 */

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({
    map: sunTexture,
    emissive: 0xffcc00, // Emissive color to simulate self-illumination
    emissiveIntensity: 1,
  })
);
scene.add(sun);

// Plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 'white' })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -5;
scene.add(plane);

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500);
camera.position.z = 50;
camera.position.y = 15;
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
 * Post-processing
 */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(sizes.width, sizes.height),
  1.5, // strength
  1.2, // radius
  0.5 // threshold
);
composer.addPass(bloomPass);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  particles.rotation.y = elapsedTime * 0.2;
  sun.rotation.y = -elapsedTime * 0.1;

  // The following is Heavy on the GPU
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    const z = particlesGeometry.attributes.position.array[i3 + 2];

    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x + z) * 0.5;
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  //   // Render
  //   renderer.render(scene, camera);
  // Render
  composer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
