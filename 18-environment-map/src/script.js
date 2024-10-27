import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

// environment map loaders
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();
const environmentOptions = {
  useHDRI: false,
  useEXR: false,
  useJPEG: false,
  realTimeEnvMap: true,
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
// scene properties
const setSceneProperties = () => {
  scene.environmentIntensity = 2;
  scene.backgroundBlurriness = 0;
  scene.backgroundIntensity = 1;
};

// Skybox - allows the environment map to be grounded
let skybox = null;
const setGroundedSkybox = () => {
  skybox = new GroundedSkybox(scene.environment, 15, 70);
  skybox.position.y = 15;
  scene.add(skybox);
};

gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.01).name('environment intensity');
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.01).name('background blurriness');
gui.add(scene, 'backgroundIntensity').min(0).max(1).step(0.01).name('background intensity');
gui
  .add(scene.backgroundRotation, 'y')
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name('background rotation Y');
gui
  .add(scene.backgroundRotation, 'x')
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name('background rotation X');
gui
  .add(scene.environmentRotation, 'y')
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name('environment rotation Y');
gui
  .add(scene.environmentRotation, 'x')
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name('environment rotation X');

/**
 * Holy Donut to demonstrate real-time environment map
 */
const holyDonut = new THREE.Mesh();
let cubeCamera = null;

const setHolyDonut = () => {
  holyDonut.geometry = new THREE.TorusGeometry(8, 0.5);
  holyDonut.material = new THREE.MeshBasicMaterial({ color: 'white' });
  // Enable layer 1 - allows the cube camera to render the holy donut
  holyDonut.layers.enable(1);
  holyDonut.position.y = 3.5;
  // Cube render target - WebGLCubeRenderTarget is used to render the holy donut
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    type: THREE.HalfFloatType,
  });

  // Cube camera - renders the holy donut with all the perspectives
  cubeCamera = new THREE.CubeCamera(1, 100, cubeRenderTarget);
  // Set the cube camera to layer 1 - this will render the holy donut
  cubeCamera.layers.set(1);

  scene.environment = cubeRenderTarget.texture;
};

/**
 * Environment map
 */
// Function to load the environment map
let currentEnvironmentMap = null;
const loadEnvironmentMap = () => {
  if (currentEnvironmentMap) {
    currentEnvironmentMap.dispose();
    if (skybox) {
      scene.remove(skybox);
    }
    if (holyDonut) {
      holyDonut.geometry.dispose();
      holyDonut.material.dispose();
      scene.remove(holyDonut);
      cubeCamera = null;
    }
  }

  if (environmentOptions.useHDRI) {
    // The use of HDRI is recommended for lights and reflections with small resolutions ONLY
    currentEnvironmentMap = rgbeLoader.load('/environmentMaps/empty-blender-2k.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envMap;
      // scene.background = envMap;
      setSceneProperties();
      setGroundedSkybox();
    });
  } else if (environmentOptions.useEXR) {
    currentEnvironmentMap = exrLoader.load('/environmentMaps/church.exr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.backgroundIntensity = 0.1;
      scene.environmentIntensity = 1;
      scene.environment = envMap;
      scene.background = envMap;
    });
  } else if (environmentOptions.useJPEG) {
    currentEnvironmentMap = textureLoader.load(
      '/environmentMaps/blockadesLabsSkybox/fantasy_lands_castles_at_night.jpg'
    );
    currentEnvironmentMap.mapping = THREE.EquirectangularReflectionMapping;
    currentEnvironmentMap.colorSpace = THREE.SRGBColorSpace;
    scene.environment = currentEnvironmentMap;
    scene.background = currentEnvironmentMap;
    setSceneProperties();
  } else if (environmentOptions.realTimeEnvMap) {
    currentEnvironmentMap = textureLoader.load(
      '/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg'
    );
    currentEnvironmentMap.mapping = THREE.EquirectangularReflectionMapping;
    currentEnvironmentMap.colorSpace = THREE.SRGBColorSpace;
    scene.background = currentEnvironmentMap;
    scene.add(holyDonut);
    setHolyDonut();
  } else {
    currentEnvironmentMap = cubeTextureLoader.load([
      '/environmentMaps/0/px.png',
      '/environmentMaps/0/nx.png',
      '/environmentMaps/0/py.png',
      '/environmentMaps/0/ny.png',
      '/environmentMaps/0/pz.png',
      '/environmentMaps/0/nz.png',
    ]);
    scene.environment = currentEnvironmentMap;
    scene.background = currentEnvironmentMap;
    setSceneProperties();
  }
};

// Add GUI switch
const environmentFolder = gui.addFolder('EquiRectangular Env Map');
environmentFolder.add(environmentOptions, 'useHDRI').name('Use HDRI').onChange(loadEnvironmentMap);
environmentFolder.add(environmentOptions, 'useEXR').name('Use EXR').onChange(loadEnvironmentMap);
environmentFolder.add(environmentOptions, 'useJPEG').name('Use JPEG').onChange(loadEnvironmentMap);
environmentFolder.add(environmentOptions, 'realTimeEnvMap').name('Real Time').onChange(loadEnvironmentMap);

// Initial load
loadEnvironmentMap();

// axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0x9400d3, 10);
// directionalLight.position.set(3.5, 7, -1);
// scene.add(directionalLight);
// // directional light helper
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
// scene.add(directionalLightHelper);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 150, 32),
  new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 1, color: 0xff5500 })
);
torusKnot.position.set(-2, 4, -5);
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
camera.position.set(5, 7, 10);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.7;
controls.minPolarAngle = Math.PI * 0.3;

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
  //   const radius = 7;
  //   directionalLight.position.x = Math.sin(elapsedTime) * radius;
  //   directionalLight.position.z = Math.cos(elapsedTime) * radius;
  //   directionalLightHelper.update();

  // Realtime holy donut
  if (holyDonut && cubeCamera) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2;
    cubeCamera.update(renderer, scene);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
