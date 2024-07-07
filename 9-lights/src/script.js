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

// Axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Lights
 */
// Ambient light: it comes from all directions, it's like a global light
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 1
ambientLight.color = new THREE.Color(0xffffff)
scene.add(ambientLight)

gui.add(ambientLight, 'intensity').min(0).max(5).step(0.1).name('ambientLightIntensity')

// Directional light: it comes from a specific direction, it's like the sun
const directionalLight = new THREE.DirectionalLight()
directionalLight.intensity = 0.9
directionalLight.color = new THREE.Color(0xF7DC6F)
directionalLight.position.set(-1, 1, 0)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(5).step(0.1).name('directionalLightIntensity')

// Hemisphere light: it's like the sun, but it's not directional, it's like a gradient
const hemisphereLight = new THREE.HemisphereLight()
hemisphereLight.intensity = 0.9
hemisphereLight.color = new THREE.Color(0x27BABD)
hemisphereLight.groundColor = new THREE.Color(0x60BD27  )
hemisphereLight.position.set(0, 2, 0)
scene.add(hemisphereLight)

gui.add(hemisphereLight, 'intensity').min(0).max(5).step(0.1).name('hemisphereLightIntensity')

// Point light: it comes from a specific point, it's like a light bulb
const pointLight = new THREE.PointLight()
pointLight.intensity = 2
pointLight.color = new THREE.Color(0xB127BD)
pointLight.position.set(1, -0.5, 1)
// distance - Maximum range of the light. Default is 0 (no limit).
// decay - The amount the light dims along the distance of the light. Default is 2.
pointLight.distance = 10
pointLight.decay = 0.5
scene.add(pointLight)

gui.add(pointLight, 'intensity').min(0).max(5).step(0.1).name('pointLightIntensity')
gui.add(pointLight, 'distance').min(0).max(10).step(0.1).name('pointLightDistance')
gui.add(pointLight, 'decay').min(0).max(2).step(0.1).name('pointLightDecay')

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()