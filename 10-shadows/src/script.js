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
ambientLight.visible = false
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
gui.add(ambientLight, 'visible').name('ambientLightVisible')
// leave only the directional light
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2.5, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)
// *** Manage shadows
// castShadow - Set to true if the light will cast shadows. Warning: This is expensive and requires tweaking to get shadows looking right.
directionalLight.castShadow = true
// shadow.mapSize - Set the shadow map size in pixels. The higher the resolution, the better the shadows, but the more computational power is needed.
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
// shadow.camera - Configures the camera used to create shadows.
// In Three.js, this property allows you to adjust the parameters of the shadow camera,
// including the field of view (FOV), aspect ratio, and near and far planes.
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 7
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 3
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 3
// shadow.radius - The shadow map's radius. Increase this for softer shadows, but at the cost of precision.
// this radios is not supported by all shadow types (PCFSoftShadowMap, VSMShadowMap) defined in the renderer.shadowMap.type
directionalLight.shadow.radius = 10

// Helpers
const directionalLightShadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightShadowCameraHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

// Spot light
const spotLight = new THREE.SpotLight(0x990011, 3)
spotLight.angle = Math.PI * 0.2
spotLight.penumbra = 0.2
spotLight.decay = 2
spotLight.distance = 10
spotLight.position.set(-2, 3, 1)
// Shadow management
spotLight.castShadow = true
spotLight.shadow.mapSize.set(1024, 1024)
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 5
scene.add(spotLight)

spotLight.target.position.x = 0
spotLight.target.position.y = 0.5
scene.add(spotLight.target)


// Spot light helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const spotLightShadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightShadowCameraHelper)

/**
 * Textures
*/
const modifyTexture = (texture) => {
    texture.flipY = false
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 2)
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
    new THREE.SphereGeometry(0.75, 64, 64),
    standardMaterial
)
sphere.position.y = 0.5
// If set to true the object will cast shadows.
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
// If set to true the object will receive shadows.
plane.receiveShadow = true


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
// BasicShadowMap gives unfiltered shadow maps - fastest, but lowest quality.
// PCFShadowMap filters shadow maps using the Percentage-Closer Filtering (PCF) algorithm (default).
// PCFSoftShadowMap filters shadow maps using the Percentage-Closer Filtering (PCF) algorithm with better soft shadows especially when using low-resolution shadow maps.
// VSMShadowMap filters shadow maps using the Variance Shadow Map (VSM) algorithm. When using VSMShadowMap all shadow receivers will also cast shadows.
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

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