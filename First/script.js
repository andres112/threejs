import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const cube = new THREE.BoxGeometry(1, 1, 3);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true});
// wireframe makes the cube hollow
const mesh = new THREE.Mesh(cube, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 1280,
  height: 720,
};

// Camera
// field of view for web sites is around 35 to 45. 75 for games
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
