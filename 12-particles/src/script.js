import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/9.png')

/**
 * Particles
 */

// Geometry
// Create a spiral galaxy
const particlesGeometry = new THREE.BufferGeometry();
const count = 1000000;

const positions = new Float32Array(count * 3);

// Spiral parameters
const spiralTurns = 100;
const maxRadius = 50;
const heightVariation = 0.5; // To add some 3D depth to the spiral
const armOffset = Math.PI; // Offset for the second arm

for (let i = 0; i < count / 2; i++) {
    const angle = spiralTurns * Math.PI * 2 * (i / (count / 2));
    const radius = maxRadius * Math.sqrt(i / (count / 2)); // Logarithmic spiral
    const randomFactor = (Math.random() - 0.5) * 0.5;

    // First arm
    let x = (radius + randomFactor) * Math.cos(angle);
    let y = (Math.random() - 0.5) * heightVariation;
    let z = (radius + randomFactor) * Math.sin(angle);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Second arm
    x = (radius + randomFactor) * Math.cos(angle + armOffset);
    y = (Math.random() - 0.5) * heightVariation;
    z = (radius + randomFactor) * Math.sin(angle + armOffset);

    positions[(i + count / 2) * 3] = x;
    positions[(i + count / 2) * 3 + 1] = y;
    positions[(i + count / 2) * 3 + 2] = z;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const pointsMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: 0xff88cc,
    alphaMap: particleTexture,
    transparent: true,
    depthWrite: false, // To avoid depth fighting between particles
    // depthWrite generates a bug when another object is behind the particles
});

// Points
const particles = new THREE.Points(particlesGeometry, pointsMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.z = 25
camera.position.y = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    particles.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()