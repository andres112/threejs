import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

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
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Textures
 */
// Floor
const floorColorTexture = textureLoader.load(
  '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg'
);
const floorNormalTexture = textureLoader.load(
  '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png'
);
const floorAORoughnessMetallicTexture = textureLoader.load(
  '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg'
);

// Wall
const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg');
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png');
const wallAORoughnessMetallicTexture = textureLoader.load(
  '/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1kF.jpg'
);


/**
 * Meshes
 */

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    normalMap: floorNormalTexture,
    aoMap: floorAORoughnessMetallicTexture,
    roughnessMap: floorAORoughnessMetallicTexture,
    metalnessMap: floorAORoughnessMetallicTexture,
    transparent: true,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.01;
scene.add(floor);

// Wall
const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    aoMap: wallAORoughnessMetallicTexture,
    roughnessMap: wallAORoughnessMetallicTexture,
    metalnessMap: wallAORoughnessMetallicTexture,
  })
);
wall.position.z = -5;
wall.position.y = 5;
scene.add(wall);

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1;
gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001);

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
directionalLight.position.set(-5, 12, 2.5);
scene.add(directionalLight);

const lightsFolder = gui.addFolder('Lights');
lightsFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('light intensity');
lightsFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('light x');
lightsFolder.add(directionalLight.position, 'y').min(-5).max(20).step(0.001).name('light y');
lightsFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('light z');

// Light shadows
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(512, 512);
directionalLight.shadow.camera.far = 20;
lightsFolder.add(directionalLight, 'castShadow').name('light shadow');

// helpers
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);
lightsFolder.add(directionalLightCameraHelper, 'visible').name('Directional Light Camera Helper');

// Light target
directionalLight.target.position.set(0, 5, 0);
directionalLight.target.updateMatrixWorld(); // necessary to update the world matrix

/**
 * Models
 */
// Helmet
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);

  // add shadow to all meshes
  updateAllMaterials();
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
  antialias: true, // if screen already has pixel ratio bigger than 1, is not necessary to set it here
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;

const toneMappingFolder = gui.addFolder('Tone mapping');

toneMappingFolder.add(renderer, 'toneMapping', {
  None: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

toneMappingFolder.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
