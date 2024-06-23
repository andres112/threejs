import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {
  matcap: 3,
};
const matcapFolder = gui.addFolder('Matcaps');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Axes helper
const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTextures = [];
for (let i = 0; i < 9; i++) {
  matcapTextures.push(textureLoader.load(`/textures/matcaps/${i}.png`));
  //   matcapTextures[i].colorSpace = THREE.sRGBEncoding;
}

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const BEVEL_SIZE = 0.02;
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Andres Dorado', {
    font,
    size: 0.3,
    depth: 0.2,
    curveSegments: 5, // defines the resolution of the curve
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: BEVEL_SIZE,
    bevelOffset: 0,
    bevelSegments: 4, // defines the resolution of the bevel curve
  });
  //   // compute bounding box for getting the size of the text
  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);

  //   // center the text
  //   textGeometry.translate(
  //     (textGeometry.boundingBox.max.x - BEVEL_SIZE) * -0.5,
  //     (textGeometry.boundingBox.max.y - BEVEL_SIZE) * -0.5,
  //     (textGeometry.boundingBox.max.z - BEVEL_SIZE) * -0.5
  //   );

  // center the text
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.wireframe = false;
  textMaterial.matcap = matcapTextures[3];
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  // Debug
  matcapFolder
    .add(debugObject, 'matcap')
    .min(1)
    .max(matcapTextures.length - 1)
    .step(1)
    .name('Matcap')
    .onChange(() => {
      textMaterial.dispose();
      textMaterial.matcap = matcapTextures[debugObject.matcap];
    });
});

/**
 * Object
 */

for (let i = 0; i < 100; i++) {
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial();
  donutMaterial.matcap = matcapTextures[Math.floor(Math.random() * matcapTextures.length + 1)];
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  donut.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12
  );
  donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  scene.add(donut);
}

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
camera.position.z = 2;
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
