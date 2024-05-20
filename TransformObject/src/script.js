import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const cube = new THREE.BoxGeometry(1, 1, 2);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true});
// wireframe makes the cube hollow
const mesh = new THREE.Mesh(cube, material);

// Position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = -1;
mesh.position.set(0.7, -0.6, -1);

// Scale
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
mesh.scale.set(2, 0.5, 0.5);

// Rotation
// When you rotate an object, axes are rotated with it!!!
// the order of rotation is important
mesh.rotation.reorder('YXZ');
mesh.rotation.x = Math.PI * 0.5;
mesh.rotation.y = Math.PI * 0.25;

scene.add(mesh);

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Methods of mesh position object
console.log('Distance to the center ' + mesh.position.length());

// Sizes
const sizes = {
  width: 1280,
  height: 720,
};

// Camera
// field of view for web sites is around 35 to 45. 75 for games
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = 1;
scene.add(camera);

// look at
camera.lookAt(mesh.position);

// Methods of mesh position object
console.log('Distance to the center ' + mesh.position.distanceTo(camera.position));

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
