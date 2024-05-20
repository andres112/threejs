import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const cube = new THREE.BoxGeometry(1, 1, 2);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
// wireframe makes the cube hollow
const mesh = new THREE.Mesh(cube, material);

// Position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = -1;
mesh.position.set(1, -0.6, -1);

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

// Group
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x00aa11, wireframe: false })
);
cube1.position.set(0, 1, 0);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
);
cube2.position.set(0, 0, 1.5);
// transform and add cubes to the group
group.position.x = -0.5;
group.rotation.z = Math.PI * 0.5;
group.add(cube1, cube2);

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

// Change camera position
const mySwitch = document.getElementById('mySwitch');

const toggleCamera = () => {
  const target = mySwitch.checked ? group.position : mesh.position;
  camera.lookAt(target);
  renderer.render(scene, camera);
};

mySwitch.addEventListener('change', toggleCamera);
