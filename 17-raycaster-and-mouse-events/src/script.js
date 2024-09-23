import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {
  castARay: 'mouse',
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object1.position.x = -2;
object1.name = 'object1';

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object2.name = 'object2';

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object3.position.x = 3;
object3.position.y = 1;
object3.name = 'object3';

scene.add(object1, object2, object3);

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

// // like a laser beam, define the origin and direction
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 1, 0)
// console.log(rayDirection.length()) // 10.049
// rayDirection.normalize() // ALWAYS normalize the direction vector
// console.log(rayDirection.length()) // 1
// raycaster.set(rayOrigin, rayDirection)

// // Intersection - Cast a ray
// const intersect = raycaster.intersectObject(object1)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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
 * Mouse events
 */
const mouse = new THREE.Vector2();
let color = '#ff0000';
let isMouseDown = false;

canvas.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

canvas.addEventListener('click', () => {
  if (currentIntersect) {
    // accelerate the object in the direction of the ray
    const acceleration = new THREE.Vector3(0, 0, 1);
    acceleration.applyQuaternion(currentIntersect.object.quaternion);
    currentIntersect.object.position.add(acceleration);
    console.log('Clicked on object', currentIntersect.object.name);
  }
});

// right click
canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault(); // prevent the context menu from appearing

  if (currentIntersect) {
    // decelerate the object in the direction of the ray
    const acceleration = new THREE.Vector3(0, 0, -1);
    acceleration.applyQuaternion(currentIntersect.object.quaternion);
    currentIntersect.object.position.add(acceleration);
    console.log('Right clicked on object', currentIntersect.object.name);
  }
});

canvas.addEventListener('mousedown', () => {
  if (currentIntersect) {
    isMouseDown = true;
  }
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
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

// Check the intersected object
let currentIntersect = null;

// cast a ray from static position or from mouse position
const castARay = (source) => {
  if (source === 'mouse') {
    raycaster.setFromCamera(mouse, camera);
    color = isMouseDown ? '#ffff00' : '#00ff00';
  }

  if (source === 'static') {
    const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(10, 1, 0);
    rayDirection.normalize();
    raycaster.set(rayOrigin, rayDirection);
    color = '#0000ff';
  }

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  // Capture the intersected object with mouse
  if (source === 'mouse' && intersects.length) {
    currentIntersect = intersects[0];
  } else {
    currentIntersect = null;
  }

  // Reset colors
  objectsToTest.forEach((object) => object.material.color.set('#ff0000'));

  // Change color of intersected objects
  intersects.forEach((intersect) => intersect.object.material.color.set(color));
};

gui
  .add(debugObject, 'castARay')
  .name('Cast a ray')
  .options(['mouse', 'static'])
  .onFinishChange(() => {
    castARay(debugObject.castARay);
  });
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray using mouse position
  castARay(debugObject.castARay);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
