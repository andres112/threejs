import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {
  directionalHelper: () => {
    directionalLightHelper.visible = !directionalLightHelper.visible;
    directionalLightShadowCameraHelper.visible = !directionalLightShadowCameraHelper.visible;
  },
  spotHelper: () => {
    spotLightHelper.visible = !spotLightHelper.visible;
    spotLightShadowCameraHelper.visible = !spotLightShadowCameraHelper.visible;
  },
  pointHelper: () => {
    pointLightHelper.visible = !pointLightHelper.visible;
    pointLightShadowCameraHelper.visible = !pointLightShadowCameraHelper.visible;
  },
};
const helperFolder = gui.addFolder('helpers');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
ambientLight.visible = false;
const ambientLightFolder = gui.addFolder('ambientLight');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(3).step(0.001);
ambientLightFolder.add(ambientLight, 'visible').name('ambientLightVisible');
// leave only the directional light
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0x005599, 1);
directionalLight.position.set(2, 2.5, -1);
const directionalLightFolder = gui.addFolder('directionalLight');
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
directionalLightFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
directionalLightFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
directionalLightFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(directionalLight);
// *** Manage shadows
// castShadow - Set to true if the light will cast shadows. Warning: This is expensive and requires tweaking to get shadows looking right.
directionalLight.castShadow = true;
// shadow.mapSize - Set the shadow map size in pixels. The higher the resolution, the better the shadows, but the more computational power is needed.
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// shadow.camera - Configures the camera used to create shadows.
// In Three.js, this property allows you to adjust the parameters of the shadow camera,
// including the field of view (FOV), aspect ratio, and near and far planes.
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.right = 3;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -3;
// shadow.radius - The shadow map's radius. Increase this for softer shadows, but at the cost of precision.
// this radios is not supported by all shadow types (PCFSoftShadowMap, VSMShadowMap) defined in the renderer.shadowMap.type
directionalLight.shadow.radius = 10;

// Helpers
const directionalLightShadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightShadowCameraHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

helperFolder.add(debugObject, 'directionalHelper');

// Spot light
const spotLight = new THREE.SpotLight(0xaa0000, 5);
spotLight.angle = Math.PI * 0.2;
spotLight.penumbra = 0.2;
spotLight.decay = 1;
spotLight.distance = 7;
spotLight.position.set(-2.5, 3, 1);
// Shadow management
spotLight.castShadow = true;
spotLight.shadow.mapSize.set(1024, 1024);
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;
scene.add(spotLight);

spotLight.target.position.x = -0.5;
spotLight.target.position.y = 0;
scene.add(spotLight.target);

// Spot light helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const spotLightShadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightShadowCameraHelper);

helperFolder.add(debugObject, 'spotHelper');

// Point light
const pointLight = new THREE.PointLight(0x00dd00, 4, 7);
pointLight.position.set(0, 3, 0);

// Shadow management
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 6;
scene.add(pointLight);

//Point light helper
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const pointLightShadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightShadowCameraHelper);

helperFolder.add(debugObject, 'pointHelper');

/**
 * Textures
 */
const modifyTexture = (texture) => {
  texture.flipY = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
};

const textureLoader = new THREE.TextureLoader();
const brainColorTexture = textureLoader.load('/textures/brain/basecolor.png');
modifyTexture(brainColorTexture);
brainColorTexture.magFilter = brainColorTexture.minFilter = THREE.NearestFilter;
brainColorTexture.mipmaps = false;
const brainNormalTexture = textureLoader.load('/textures/brain/normal.png');
modifyTexture(brainNormalTexture);
const brainRoughnessTexture = textureLoader.load('/textures/brain/roughness.png');
modifyTexture(brainRoughnessTexture);
const brainAmbientOcclusionTexture = textureLoader.load('/textures/brain/ambientOcclusion.png');
modifyTexture(brainAmbientOcclusionTexture);
const brainHeightTexture = textureLoader.load('/textures/brain/height.png');
modifyTexture(brainHeightTexture);

// Backed texture. MapCap texture
const backedTexture = textureLoader.load('/textures/bakedShadow.jpg');
backedTexture.colorSpace = THREE.SRGBColorSpace;

// Simple shadow texture
const simpleShadowTexture = textureLoader.load('/textures/simpleShadow.jpg');
simpleShadowTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.map = backedTexture;

const standardMaterial = new THREE.MeshStandardMaterial();
standardMaterial.map = brainColorTexture;
standardMaterial.normalMap = brainNormalTexture;
standardMaterial.roughnessMap = brainRoughnessTexture;
standardMaterial.aoMap = brainAmbientOcclusionTexture;
standardMaterial.aoMapIntensity = 1;
standardMaterial.displacementMap = brainHeightTexture;
standardMaterial.displacementScale = 0.25;
// standardMaterial.side = THREE.DoubleSide;

const materialFolder = gui.addFolder('material');
materialFolder.add(standardMaterial, 'metalness').min(0).max(1).step(0.001);
materialFolder.add(standardMaterial, 'roughness').min(0).max(1).step(0.001);
materialFolder.add(standardMaterial, 'displacementScale').min(0).max(1).step(0.001);
materialFolder.add(standardMaterial, 'displacementBias').min(-1).max(1).step(0.001);

/**
 * Objects
 */
// Load the GLTF model
const loader = new GLTFLoader();
let brain;
loader.load(
  'model/ImageToStl.com_brain.gltf', // Replace with the path to your exported model
  function (gltf) {
    brain = gltf.scene;
    brain.scale.set(0.02, 0.02, 0.02);
    brain.position.set(0, 0.5, 0);
    brain.rotation.reorder('YXZ');
    brain.rotation.x = -Math.PI * 0.5;

    brain.traverse((node) => {
      if (node.isMesh) {
        node.material = standardMaterial;
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // Add the loaded model to the scene
    scene.add(brain);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
// If set to true the object will receive shadows.
plane.receiveShadow = true;

scene.add(plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({
    alphaMap: simpleShadowTexture,
    transparent: true,
    color: 0x000000,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

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
camera.position.z = 4;
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
// BasicShadowMap gives unfiltered shadow maps - fastest, but lowest quality.
// PCFShadowMap filters shadow maps using the Percentage-Closer Filtering (PCF) algorithm (default).
// PCFSoftShadowMap filters shadow maps using the Percentage-Closer Filtering (PCF) algorithm with better soft shadows especially when using low-resolution shadow maps.
// VSMShadowMap filters shadow maps using the Variance Shadow Map (VSM) algorithm. When using VSMShadowMap all shadow receivers will also cast shadows.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update brain
  if (brain) {
    brain.position.y = Math.abs(Math.sin(elapsedTime * 3)) + 0.25;
    brain.position.x = Math.cos(elapsedTime * 0.5) * 2;
    brain.position.z = Math.sin(elapsedTime * 0.5) * 2;
    brain.rotation.y = elapsedTime * 0.5;
    // Update sphere shadow
    sphereShadow.position.x =brain.position.x;
    sphereShadow.position.z = brain.position.z;
    sphereShadow.material.opacity = 1.5 - brain.position.y;
  }


  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
