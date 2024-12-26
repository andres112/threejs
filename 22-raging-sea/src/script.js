import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
// shaders
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';
// loaders
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugParams = {
  depthColor: '#067fc1',
  surfaceColor: '#9bd8ff',
};

/**
 * Loaders
 */
const rgbeLoader = new RGBELoader();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Environment map
let skybox = null;
rgbeLoader.load('envMaps/autumn_field_puresky_2k.hdr', (envMap) => {
  envMap.colorSpace = THREE.SRGBColorSpace;
  scene.environment = envMap;
  scene.background = envMap;
  scene.environmentIntensity = 2;
  scene.backgroundBlurriness = 0;
  scene.position.y = -0.5;
});

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(20, 10, 512, 512);

// Material
// With a default shader material you have a red color, because has a vertex and fragment shader by default
const waterMaterial = new THREE.ShaderMaterial();
waterMaterial.vertexShader = waterVertexShader;
waterMaterial.fragmentShader = waterFragmentShader;
waterMaterial.uniforms = {
  uTime: { value: 0 },

  uBigWavesElevation: { value: 0.2 },
  uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
  uBigWavesSpeed: { value: 0.75 },

  uSmallWavesElevation: { value: 0.15 },
  uSmallWavesFrequency: { value: 3.0 },
  uSmallWavesSpeed: { value: 0.2 },
  uSmallWavesIterations: { value: 5 },

  uDepthColor: { value: new THREE.Color(debugParams.depthColor) },
  uSurfaceColor: { value: new THREE.Color(debugParams.surfaceColor) },
  uColorOffset: { value: 0.02 },
  uColorMultiplier: { value: 2.0 },
};
waterMaterial.transparent = true;

// Debug
const wavesFolder = gui.addFolder('Waves');
wavesFolder
  .add(waterMaterial.uniforms.uBigWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('wavesElevation');
wavesFolder
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
  .min(0)
  .max(10)
  .step(0.001)
  .name('wavesFrequencyX');
wavesFolder
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
  .min(0)
  .max(10)
  .step(0.001)
  .name('wavesFrequencyY');
wavesFolder
  .add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('wavesSpeed');

const colorFolder = gui.addFolder('Color');
colorFolder.addColor(debugParams, 'depthColor').onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(debugParams.depthColor);
});
colorFolder.addColor(debugParams, 'surfaceColor').onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value.set(debugParams.surfaceColor);
});
colorFolder
  .add(waterMaterial.uniforms.uColorOffset, 'value')
  .min(0)
  .max(0.1)
  .step(0.001)
  .name('colorOffset');
colorFolder
  .add(waterMaterial.uniforms.uColorMultiplier, 'value')
  .min(0)
  .max(5)
  .step(0.001)
  .name('colorMultiplier');

const perlinNoiseFolder = gui.addFolder('Perlin Noise');
perlinNoiseFolder
  .add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('smallWavesElevation');
perlinNoiseFolder
  .add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
  .min(0)
  .max(30)
  .step(0.001)
  .name('smallWavesFrequency');
perlinNoiseFolder
  .add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
  .min(0)
  .max(4)
  .step(0.001)
  .name('smallWavesSpeed');
perlinNoiseFolder
  .add(waterMaterial.uniforms.uSmallWavesIterations, 'value')
  .min(0)
  .max(5)
  .step(1)
  .name('smallWavesIterations');

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
water.receiveShadow = true;
water.castShadow = true;
scene.add(water);

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
camera.position.set(0, 0.75, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
