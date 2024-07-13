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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
// leave only the directional light
// scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2.5, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

/**
 * Textures
*/
const modifyTexture = (texture) => {
    texture.flipY = false
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(3, 2)
}

const textureLoader = new THREE.TextureLoader()
const brainColorTexture = textureLoader.load('/textures/brain/basecolor.png')
modifyTexture(brainColorTexture)
brainColorTexture.magFilter= brainColorTexture.minFilter = THREE.NearestFilter
brainColorTexture.mipmaps = false
const brainNormalTexture = textureLoader.load('/textures/brain/normal.png')
modifyTexture(brainNormalTexture)
const brainRoughnessTexture = textureLoader.load('/textures/brain/roughness.png')
modifyTexture(brainRoughnessTexture)
const brainAmbientOcclusionTexture = textureLoader.load('/textures/brain/ambientOcclusion.png')
modifyTexture(brainAmbientOcclusionTexture)
const brainHeightTexture = textureLoader.load('/textures/brain/height.png')
modifyTexture(brainHeightTexture)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
material.side = THREE.DoubleSide
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

const standardMaterial = new THREE.MeshStandardMaterial()
standardMaterial.map = brainColorTexture
standardMaterial.normalMap = brainNormalTexture
standardMaterial.roughnessMap = brainRoughnessTexture
standardMaterial.aoMap = brainAmbientOcclusionTexture
standardMaterial.aoMapIntensity = 1
standardMaterial.displacementMap = brainHeightTexture
standardMaterial.displacementScale = 0.25

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    standardMaterial
)
sphere.position.y = 0.75

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5


scene.add(sphere, plane)

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
camera.position.z = 4
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()