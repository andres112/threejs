import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CANNON from 'cannon';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

const debugObj = {};
debugObj.createBox = () => {
  createBox(
    Math.random(),
    { x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 },
    { x: 0, y: 0, z: Math.random() * Math.PI }
  );
};

debugObj.reset = () => {
    // remove all the bodies
    bodies.forEach((element) => {
        world.removeBody(element.body);
        scene.remove(element.mesh);
    });
    bodies = [];
};

gui.add(debugObj, 'createBox');
gui.add(debugObj, 'reset');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

/**
 * Sounds
 */
const hitSound = new Audio('sounds/hit.mp3');
const collideBetweenBoxes = new Audio('sounds/boing.mp3');

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  let impactSound;
  // define the sound based on the object id 0 for the floor
  if (collision.body.id === 0) {
    impactSound = hitSound;
  } else {
    impactSound = collideBetweenBoxes;
  }

  if (impactStrength > 1.5) {    
    // Add a short delay to avoid overlapping sounds
    setTimeout(() => {
        // sert imapctSound volume based on the impactStrength but this volume is max 1 
        impactSound.volume = Math.min(impactStrength / 10, 1);
        impactSound.currentTime = 0;
        impactSound.play();
    }, 50); // 50 milliseconds delay
  }
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  'textures/environmentMaps/0/px.png',
  'textures/environmentMaps/0/nx.png',
  'textures/environmentMaps/0/py.png',
  'textures/environmentMaps/0/ny.png',
  'textures/environmentMaps/0/pz.png',
  'textures/environmentMaps/0/nz.png',
]);

/**
 * Physics
 */
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world); // broadphase is the algorithm to detect collisions PERFORMANCE
world.allowSleep = true; // allow objects to sleep when they are not moving PERFORMANCE
world.gravity.set(0, -9.82, 0);

// Physics material
// const concretePhysicsMaterial = new CANNON.Material('concrete');
// const plasticPhysicsMaterial = new CANNON.Material('plastic');

// // Contact material
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concretePhysicsMaterial,
//   plasticPhysicsMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.9,
//   }
// );
// world.addContactMaterial(concretePlasticContactMaterial);

// simpler way to create materials with default values
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 1,
  restitution: 0.5,
});
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// // create the body as sphere
// // for cannon the body is the mesh in three.js and the shape is the geometry
// const sphereShape = new CANNON.Sphere(0.5); // same radius as the sphere in three.js
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   //   material: plasticPhysicsMaterial,
// });

// // Apply force
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));

// // world in cannon is like the scene in three.js
// world.addBody(sphereBody);

// create the body for the floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body(); // no mass for the floor 0 by default
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // rotate the plane to be horizontal
// floorBody.material = concretePhysicsMaterial;
world.addBody(floorBody);

// /**
//  * Test sphere
//  */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Function to create a box
 */

let bodies = [];
// create only one geometry and material PERFORMANCE
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: '#fff',
  metalness: 0.6,
  roughness: 0.3,
  envMap: environmentMapTexture,
});

const createBox = (size, position, rotation) => {
  // three.js
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(size, size, size);
  mesh.castShadow = true;
  mesh.position.copy(position);
  if (rotation) {
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  }
  scene.add(mesh);

  // cannon.js
  const shape = new CANNON.Box(new CANNON.Vec3(size * 0.5, size * 0.5, size * 0.5));
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    shape: shape,
    // material: plasticPhysicsMaterial,
  });
  body.quaternion.setFromEuler(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
  body.addEventListener('collide', playHitSound);
  world.addBody(body);

  // save the body
  bodies.push({ body, mesh });
  return body;
};

const box1 = createBox(1, { x: 0, y: 3, z: 0 }, { x: 0, y: 0, z: -Math.PI * 0.2 });
createBox(1, { x: -2, y: 4, z: 0 }, { x: 0, y: 0, z: Math.PI * 0.2 });
createBox(1, { x: 2, y: 5, z: 0 }, { x: 0, y: 0, z: -Math.PI * 0.2 });

box1.applyLocalImpulse(new CANNON.Vec3(0, 0, 2), new CANNON.Vec3(0, 0, 0));

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);

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
camera.position.set(-3, 5, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.49;
controls.minPolarAngle = 0;
controls.minDistance = 3;
controls.maxDistance = 15;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

// for physics is required to keep track of time
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world
  //   // simulate wind
  //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

  world.step(1 / 60, deltaTime, 3); // 1/60 is the fixed time step, 3 is the max number of substeps

  bodies.forEach((element) => {
    element.mesh.position.copy(element.body.position);
    element.mesh.quaternion.copy(element.body.quaternion);
  });

  //   // Update sphere based on physics
  //   sphere.position.copy(sphereBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
