import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Base
 */
// Debug
const gui = new GUI();
const helperFolder = gui.addFolder('Helpers');
const foxFolder = gui.addFolder('Fox');
const debugObject = {};
debugObject.toggleShadows = true;
debugObject.foxAnimation = 0;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

helperFolder.add(axesHelper, 'visible').name('Axes Helper');

/**
 * External Model
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// move from node_modules three/examples/js/libs/draco/ to /draco/ in static folder
dracoLoader.setDecoderPath('/draco/');

// Set the loader to be used by the gltfLoader
gltfLoader.setDRACOLoader(dracoLoader);

// FlightHelmet model
gltfLoader.load(
  '/models/FlightHelmet/glTF/helmet.gltf',
  (gltf) => {
    console.log('FlightHelmet', gltf);

    // the model is in the gltf.scene property
    gltf.scene.scale.setScalar(3);
    gltf.scene.position.set(2, 0, 0);
    // cast shadows
    add3DModelShadow(gltf);

    /**Different ways to add the model */
    // Filtering scene.children
    // gltf.scene.children.forEach(child =>
    // {
    //     if(child.name.toLowerCase().includes('metal'))
    //     {
    //         child.visible = false
    //     }
    // })
    scene.add(gltf.scene);
  },
  () => {
    // onProgress callback
    console.log('FlightHelmet loading...');
  }
);

// Biomechanical Mutant model 1
gltfLoader.load('/models/Biomech_Mutant/Skin_1/Biomech_Mutant_Skin_1.gltf', (gltf) => {
  console.log('Biomech_Mutant_Skin_1', gltf);

  // the model is in the gltf.scene property
  gltf.scene.scale.setScalar(2.5);
  gltf.scene.position.set(0, 0, 0);

  // cast shadows
  add3DModelShadow(gltf);

  scene.add(gltf.scene);
});

// Biomechanical Mutant model 2
gltfLoader.load('/models/Biomech_Mutant/Skin_2/Biomech_Mutant_Skin_2.gltf', (gltf) => {
  console.log('Biomech_Mutant_Skin_2', gltf);

  // the model is in the gltf.scene property
  gltf.scene.scale.setScalar(2.5);
  gltf.scene.position.set(0, 0, -3);

  // cast shadows
  add3DModelShadow(gltf);

  scene.add(gltf.scene);
});

// Draco compression version of model - Is the most light model
// Duck model
gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
  console.log('Duck', gltf);

  // the model is in the gltf.scene property
  gltf.scene.scale.setScalar(0.3);
  gltf.scene.position.set(-2, 0, 1);

  // cast shadows
  add3DModelShadow(gltf);

  scene.add(gltf.scene);
});

// External model Created with Blender by Myself - LESSON 23
gltfLoader.load('/models/hamburger.glb', (gltf) => {
  console.log('Hamburger', gltf);
  gltf.scene.scale.setScalar(0.05);
  gltf.scene.position.set(-3, -0.1, 2);

  // cast shadows
  add3DModelShadow(gltf);
  scene.add(gltf.scene);
});

// create a mixer for the animations
let mixer = null;
let fox;
//Animated model - Fox
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
  fox = gltf;
  console.log('Fox', gltf);

  mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(fox.animations[debugObject.foxAnimation]).play();

  // the model is in the gltf.scene property
  gltf.scene.scale.setScalar(0.02);
  gltf.scene.rotation.y = Math.PI * 0.25;
  gltf.scene.position.set(-3.5, 0, -0.5);

  // cast shadows
  add3DModelShadow(gltf);

  scene.add(gltf.scene);
});

foxFolder
  .add(debugObject, 'foxAnimation', {
    Idle: 0,
    Walk: 1,
    Run: 2,
  })
  .name('Fox Animation')
  .onChange(() => {
    if (mixer && fox.animations) {
      mixer.stopAllAction();
      // play the selected animation
      mixer.clipAction(fox.animations[debugObject.foxAnimation]).play();
    }
  });

/**
 * Shadows
 */
const add3DModelShadow = (object) => {
  object.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });
};

// add gui to hide shadows
helperFolder
  .add(debugObject, 'toggleShadows')
  .name('Toggle Shadows')
  .onChange(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = !child.castShadow;
        child.receiveShadow = !child.receiveShadow;
      }
    });
  });

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x000000, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(512, 512);
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.radius = 5;
directionalLight.shadow.bias = 0;
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

helperFolder.add(directionalLightHelper, 'visible').name('Directional Light Helper');

const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
helper.visible = false;
scene.add(helper);

helperFolder.add(directionalLight.shadow, 'bias').min(-0.01).max(0.01).step(0.0001).name('Shadow Bias');

helperFolder.add(helper, 'visible').name('Camera Helper');

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
camera.position.set(3, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
controls.minDistance = 1;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI * 0.5;

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
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Rotate directional light around scene slowly
  directionalLight.position.x = Math.sin(elapsedTime * 0.1) * 5;
  directionalLight.position.z = Math.cos(elapsedTime * 0.1) * 5;

  // Update mixer - fox animation
  if (mixer) {
    mixer.update(deltaTime);
    if (debugObject.foxAnimation === 1) {
      fox.scene.position.z = Math.sin(elapsedTime) * 0.5;
    }
    if (debugObject.foxAnimation === 2) {
      fox.scene.position.z = Math.sin(elapsedTime) * 1;
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
