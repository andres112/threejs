import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import Stats from 'stats.js';

const stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log('loading started');
};
loadingManager.onLoad = () => {
  console.log('loading finished');
  // Start the animation loop once the textures are loaded
  tick();
};
loadingManager.onProgress = () => {
  console.log('loading progressing');
};
loadingManager.onError = (error) => {
  console.log('loading error', error);
};
// One textureLoader can load multiple textures
const textureLLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLLoader.load(
  '/textures/wall/basecolor.jpg'
  // Control the loading process with callbacks. But the LoadingManager is more powerful
  //   () => {
  //     console.log('loaded');
  //   },
  //   () => {
  //     console.log('progress');
  //   },
  //   () => {
  //     console.log('error');
  //   }
);
// const ambientOcclusionTexture = textureLLoader.load('/textures/wall/ambientOcclusion.jpg');
// const heightTexture = textureLLoader.load('/textures/wall/height.png');
// const normalTexture = textureLLoader.load('/textures/wall/normal.jpg');
// const roughnessTexture = textureLLoader.load('/textures/wall/roughness.jpg');

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 2

// colorTexture.offset.y = 0.2

// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// All textures
const wallColorTexture = textureLLoader.load('/textures/wall/basecolor.jpg');
const woodColorTexture = textureLLoader.load('/textures/wood/basecolor.jpg');
const rockColorTexture = textureLLoader.load('/textures/rock/basecolor.jpg');
const metalColorTexture = textureLLoader.load('/textures/metal/basecolor.png');
const checkerboardColorTexture = textureLLoader.load('/textures/checkerboard-1024x1024.png');
checkerboardColorTexture.mipmaps = false;
checkerboardColorTexture.minFilter = THREE.NearestFilter;
const minecraftColorTexture = textureLLoader.load('/textures/minecraft.png');
minecraftColorTexture.mipmaps = false;
minecraftColorTexture.magFilter = THREE.NearestFilter;

/**
 * Debug
 */
const tweaks = {
  texture: 'Wall',
};

const textures = {
  Wall: wallColorTexture,
  Rock: rockColorTexture,
  Wood: woodColorTexture,
  Metal: metalColorTexture,
  Big:checkerboardColorTexture ,
  Small: minecraftColorTexture,
};

const gui = new GUI();
const textureFolder = gui.addFolder('Textures');
textureFolder
  .add(tweaks, 'texture', ['Wall', 'Rock', 'Wood', 'Metal', 'Big', 'Small'])
  .name('Base Color')
  .listen()
  .onChange(() => {
    // colorTexture.image = new Image();
    // colorTexture.image.src = textures[tweaks.texture];
    // colorTexture.generateMipmaps = true;
    // if (tweaks.texture === 'Big') {
    //   colorTexture.generateMipmaps = false
    //   colorTexture.minFilter = THREE.NearestFilter
    // }
    // if (tweaks.texture === 'Small') {
    //   colorTexture.generateMipmaps = false
    //   colorTexture.magFilter = THREE.NearestFilter
    // }
    // colorTexture.needsUpdate = true;
    mesh.material.map = textures[tweaks.texture];
  });

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
const geometry = new THREE.BoxGeometry(1, 1, 1);
console.log(geometry.attributes.uv);
// itemSize: 2 means each vertex has 2 values
// count: 4 means 4 vertices
// array: 48 means 4 vertices * 6 values (2 values for each vertex)

// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
  stats.begin();
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  stats.end();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
