import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Stats from 'stats.js';

const stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

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
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTextures = [];
for (let i = 0; i < 9; i++) {
  const texture = textureLoader.load(`./textures/matcaps/${i}.png`);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  matcapTextures.push(texture);
  //   matcapTextures[i].colorSpace = THREE.sRGBEncoding;
}

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const BEVEL_SIZE = 0.02;
fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
  // date in format 'YYYY-MM-DD'
  const date = new Date().toISOString().split('T')[0];
  const textGeometry = new TextGeometry(date, {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 40, // defines the resolution of the curve
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: BEVEL_SIZE,
    bevelOffset: 0,
    bevelSegments: 8, // defines the resolution of the bevel curve
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
  textMaterial.matcap = matcapTextures[7];
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

const randomPosition = (geometry) => {
  geometry.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
  );
  geometry.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  const randomScale = Math.random();
  geometry.scale.set(randomScale, randomScale, randomScale);
};

console.time('generateObjects');

// Cache geometries for performance optimization
const cacheGeometries = {};

const donuts = [];

for (let i = 0; i < 1000; i++) {
  const randomIndex = Math.floor(Math.random() * matcapTextures.length + 1);

  if (!cacheGeometries[randomIndex]) {
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const donutMaterial = new THREE.MeshMatcapMaterial();
    const sphereMaterial = new THREE.MeshMatcapMaterial();
    donutMaterial.matcap = matcapTextures[Math.floor(Math.random() * matcapTextures.length + 1)];
    sphereMaterial.matcap = matcapTextures[Math.floor(Math.random() * matcapTextures.length + 1)];
    cacheGeometries[randomIndex] = {
      donutGeometry,
      sphereGeometry,
      donutMaterial,
      sphereMaterial,
    };
  }

  const { donutGeometry, sphereGeometry, donutMaterial, sphereMaterial } =
    cacheGeometries[randomIndex];
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  randomPosition(donut);
  randomPosition(sphere);
  scene.add(donut);
  donuts.push(donut);
  scene.add(sphere);
}
console.timeEnd('generateObjects');

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
camera.position.x = -1;
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  stats.begin();
  const elapsedTime = clock.getElapsedTime();

  // Rotate donuts
  donuts.forEach((donut, index) => {
    const factors = [0.1, 0.5, 1, 1.5, 2, 2.5];
    const factor = factors[index % factors.length] * (index % 2 === 0 ? 1 : -1);
    donut.rotation.x = elapsedTime * factor;
    donut.rotation.y = elapsedTime * factor;
    donut.rotation.z = elapsedTime * factor;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  stats.end();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
