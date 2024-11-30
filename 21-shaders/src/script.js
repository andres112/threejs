import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import vertexShader from './shaders/test/vertex.glsl';
import fragmentShader from './shaders/test/fragment.glsl';
// Shader patterns import
import patternVertexShader from './shaders/patterns/vertex.glsl';
import patternFragmentShader from './shaders/patterns/fragment.glsl';

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
const flagTexture = textureLoader.load('/textures/flag_swiss.png');

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// Exact number of vertices in the geometry
const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// print the geometry attributes
console.log("Geometry attributes", geometry.attributes);

// Shader Patterns Geometry ****************************************************
const patternGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
console.log("Pattern Geometry attributes", patternGeometry.attributes);


// Material
// Ideally we should use RawShaderMaterial for learning purposes
// but we can use ShaderMaterial directly for simplicity, 
// due to the fact that already includes the uniforms and attributes
// and precision in the glsl code
const material = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  wireframe: false,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#BD0000') },
    uTexture: { value: flagTexture },
  },
  side: THREE.DoubleSide,
});

const flagFolder = gui.addFolder('Flag');
flagFolder.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
flagFolder.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');
flagFolder.addColor(material.uniforms.uColor, 'value').name('color');

// Shader Patterns Material ****************************************************
const patternMaterial = new THREE.ShaderMaterial({
  vertexShader: patternVertexShader,
  fragmentShader: patternFragmentShader,
  transparent: true,
  wireframe: false,
  side: THREE.DoubleSide,
  uniforms:{
    uPatternIndex: { value: 0 },
  }
})

const patternFolder = gui.addFolder('Pattern');

// Add pattern index to the GUI
const patternOptions = {};
for (let i = 0; i < 50; i++) {
  patternOptions[`Pattern ${i + 1}`] = i;
}
patternOptions['auto'] = false;

patternFolder.add(patternMaterial.uniforms.uPatternIndex, 'value', patternOptions).name('Pattern');
patternFolder.add(patternOptions, 'auto').name('Auto change')

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 1;
mesh.position.x = -1
scene.add(mesh);

// Shader Patterns Mesh ****************************************************
const patternMesh = new THREE.Mesh(patternGeometry, patternMaterial);
patternMesh.position.x = 1;
scene.add(patternMesh);

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
camera.position.set(0, -0.25, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.zoomToCursor = true;
// with autoRotate enabled, the camera will rotate automatically NOT the object
// controls.autoRotate = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // uUpdate material
  material.uniforms.uTime.value = elapsedTime;

  // change patternMaterial.uniforms.uPatternIndex every 2 seconds from 0 to 34 and repeat
  if (patternOptions.auto) {
    const patternIndex = Math.floor(elapsedTime ) % 50;
    patternMaterial.uniforms.uPatternIndex.value = patternIndex > 34 ? 0 : patternIndex;
    console.log("Pattern Index", patternMaterial.uniforms.uPatternIndex.value);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
