import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import GUI from 'lil-gui';

gsap.registerPlugin(CustomEase);

/**
 * Debug
 */
const gui = new GUI({
  title: 'My GUI',
  closeFolders: true,
});
// gui.close();

let keys = [];

// Show and hide the GUI with the keyboard
window.addEventListener('keydown', (e) => {
  keys.push(e.key);
  if (keys.length > 4) {
    keys.shift();
  }

  if (keys.join('') === 'hide') {
    gui.hide();
  } else if (keys.join('') === 'show') {
    gui.show();
  }
});

const debugObject = {
  scale: 1,
  color: 0xbac520,
  spin: () => {
    const timeline = gsap.timeline({ repeat: 0 });
    timeline.to(mesh.rotation, { duration: 2, y: mesh.rotation.y + Math.PI * 2 }).to(
      mesh.material.color,
      {
        duration: 2,
        r: 1,
        g: 0,
        b: 0,
        ease: 'power4.inOut',
        onUpdate: () => {
          mesh.material.needsUpdate = true;
        },
      },
      '-=2'
    );
  },
  subdivision: 6,
  animate: () => {
    const timeline = gsap.timeline({ repeat: 0 });
    timeline
      .to(camera.position, { duration: 1, x: 1, y: 2, z: 8, ease: 'power2.in' })
      .to(mesh.position, { duration: 2.5, x: 2, y: 2, z: 3, ease: 'power2.inOut' })
      .to(
        mesh.rotation,
        { duration: 2.5, x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2, ease: 'power2.inOut' },
        '-=2.5'
      )
      .to(mesh.scale, { duration: 1, x: 1.5, y: 1.5, z: 1.5, ease: 'elastic.out(1, 0.3)' })
      .to(mesh.position, { duration: 3, x: -3, y: 0, z: 0, ease: 'bounce.out' })
      .to(mesh.rotation, { duration: 3, x: 0, y: 0, z: 0, ease: 'power2.inOut' }, '-=3')
      .to(mesh.scale, { duration: 1, x: 1, y: 1, z: 1, ease: 'power2.inOut' })
      .to(camera.position, { duration: 1, x: 1, y: 1, z: 5, ease: 'power2.out' });
  },
};

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
const geometry = new THREE.SphereGeometry(1, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(-3, 0, 0);
scene.add(mesh);

// Debug cube
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('azimuth');
gui.add(mesh, 'visible');
gui.add(mesh.material, 'wireframe');
// This method gives different results
gui.addColor(mesh.material, 'color').name('fake color');

const folder = gui.addFolder('Custom Tweaks');

// This method gives the real color
folder
  .addColor(debugObject, 'color')
  .onChange(() => {
    mesh.material.color.set(debugObject.color);
  })
  .name('real color');
// Custom scale controller
folder
  .add(debugObject, 'scale')
  .min(0.5)
  .max(3)
  .step(0.01)
  .name('scale')
  .onChange(function (value) {
    mesh.scale.set(value, value, value);
  });

folder
  .add(debugObject, 'subdivision')
  .min(3)
  .max(32)
  .step(1)
  .onFinishChange(() => {
    const newGeometry = new THREE.SphereGeometry(
      1,
      debugObject.subdivision,
      debugObject.subdivision
    );
    // IMPORTANTY: Dispose the old geometry to avoid memory leaks
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
  });

folder.add(debugObject, 'spin');
folder.add(debugObject, 'animate');

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
