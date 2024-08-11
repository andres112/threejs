import * as THREE from 'three';
import GUI from 'lil-gui';
import { CustomMesh } from './CustomMesh';

/**
 * Debug
 */
const gui = new GUI();

export const parameters = {
  materialColor: '#ed6f35',
};

const DISTANCE_BETWEEN_MESHES = 4;
let previousTime = 0;

export class App {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private cameraGroup: THREE.Group;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private dirLight: THREE.DirectionalLight;
  private sizes: { container: HTMLBodyElement; width: number; height: number };
  private scrollY: number = 0;
  private cursor: { x: number; y: number } = { x: 0, y: 0 };

  private Meshes: CustomMesh[] = [];

  private clock = new THREE.Clock();

  constructor() {
    this.canvas = document.querySelector('canvas.webgl')!;
    this.scene = new THREE.Scene();
    this.cameraGroup = new THREE.Group();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });

    const body = document.querySelector('body')!;
    this.sizes = {
      container: body,
      width: body.clientWidth,
      height: window.innerHeight,
    };
    this.dirLight = new THREE.DirectionalLight();
    this.init();
  }

  init() {
    console.log('App initialized');
    this.setCamera();
    this.setRenderer();
    this.setDebug();
    this.setObjects();
    this.setLight();

    // Resize listener
    this.setListeners();

    // animate
    this.animate();
  }

  private setCamera() {
    this.camera.fov = 35;
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.near = 0.1;
    this.camera.far = 100;
    this.camera.position.z = 6;

    this.scene.add(this.cameraGroup);
    this.cameraGroup.add(this.camera);
  }

  private setRenderer() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private setObjects() {
    const torusKnot = new CustomMesh();
    torusKnot.createTorusKnot();
    torusKnot.initialRotation(new THREE.Vector3(Math.PI * 0.25, 0, Math.PI * 0.25));
    this.Meshes.push(torusKnot);

    const torus = new CustomMesh();
    torus.createTorus();
    torus.initialRotation(new THREE.Vector3(Math.PI * 0.25, 0, 0));
    this.Meshes.push(torus);

    const sphere = new CustomMesh();
    sphere.createSphere();
    sphere.initialRotation(new THREE.Vector3(0, 0, Math.PI * 0.25));
    this.Meshes.push(sphere);

    this.positionMeshes();

    this.scene.add(...this.Meshes);
  }

  private positionMeshes() {
    this.Meshes.forEach((mesh, index) => {
      mesh.position.y = index * -DISTANCE_BETWEEN_MESHES;
      mesh.position.x = Math.pow(-1, index) * 1.75;
    });
  }

  private setLight() {
    this.dirLight = new THREE.DirectionalLight(0xffffff, 4);
    this.dirLight.position.set(2, 2, 0);
    this.scene.add(this.dirLight);
  }

  private setDebug() {
    gui.addColor(parameters, 'materialColor').onChange(() => {
      this.Meshes.forEach((mesh) => {
        const child = mesh.children[0] as THREE.Mesh;
        child.material.color.set(parameters.materialColor);
      });
    });
  }

  private setListeners() {
    window.addEventListener('resize', () => {
      // Update sizes
      this.sizes.width = this.sizes.container.clientWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    window.addEventListener('mousemove', (event) => {
      // Normalize the mouse position and reduce the value to 25% and 50%
      this.cursor.x = (event.clientX / this.sizes.width - 0.5) * 0.25;
      this.cursor.y = (event.clientY / this.sizes.height - 0.5) * 0.5;
    });
  }

  private animate() {
    const elapsedTime = this.clock.getElapsedTime();
    // Delta time - time between frames regardless of the frame rate
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update camera
    // scrolling effect
    this.camera.position.y = (-this.scrollY / this.sizes.height) * DISTANCE_BETWEEN_MESHES;

    // mouse effect - parallax
    // smooth effect just moving the camera a percentage of the distance between the cursor and the camera
    this.cameraGroup.position.x += (this.cursor.x - this.cameraGroup.position.x) * deltaTime * 2;
    this.cameraGroup.position.y += (-this.cursor.y - this.cameraGroup.position.y) * deltaTime * 4;

    // Update objects
    this.Meshes.forEach((mesh) => {
      mesh.rotation.y = elapsedTime * 0.2;
      mesh.rotation.z = elapsedTime * 0.1;
    });

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.animate.bind(this));
  }
}
