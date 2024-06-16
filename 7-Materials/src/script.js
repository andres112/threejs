import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const metalColorTexture = textureLoader.load('/textures/metal/basecolor.png')
const metalAlphaTexture = textureLoader.load('/textures/metal/opacity.png')
const metalAmbientOcclusionTexture = textureLoader.load('/textures/metal/ambientOcclusion.png')
const metalHeightTexture = textureLoader.load('/textures/metal/height.png')
const metalNormalTexture = textureLoader.load('/textures/metal/normal.png')
const metalMetalnessTexture = textureLoader.load('/textures/metal/metallic.png')
const metalRoughnessTexture = textureLoader.load('/textures/metal/roughness.png')

// Material Capture
/**
 - Static Lighting: Since the lighting is pre-baked into the texture, it does not change dynamically with the scene lighting or object movement.
 - Specific Use Cases: Best suited for scenarios where a consistent appearance is desired, rather than dynamic and realistic lighting effects.
 */
const matcapTexture = textureLoader.load('/textures/matcaps/2.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

// map and matcap types require the colorSpace to be set to SRGBColorSpace
metalColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Objects
 */
// Mesh Basic Material
const basicMaterial = new THREE.MeshBasicMaterial()
basicMaterial.map = metalColorTexture
// basicMaterial.color = new THREE.Color(0xf123a2)
basicMaterial.wireframe = false
basicMaterial.transparent = true
// basicMaterial.opacity = 1
basicMaterial.alphaMap = metalAlphaTexture
// Avoid use DoubleSide, because it will require more processing power !!!
basicMaterial.side = THREE.DoubleSide

// Mesh Normal Material
const normalMaterial = new THREE.MeshNormalMaterial()
normalMaterial.normalMap = metalNormalTexture
normalMaterial.flatShading = true
// Avoid use DoubleSide, because it will require more processing power !!!
normalMaterial.side = THREE.DoubleSide

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    basicMaterial
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    basicMaterial
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 32),
    basicMaterial
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// GUI
const tweaks = {
    material: 'Basic'
}
const materials = {
    Basic: basicMaterial,
    Normal: normalMaterial
}
const gui = new GUI()
gui
.add(tweaks, 'material', [
    'Basic',
    'Normal'
])
.name('Material')
.onFinishChange(() =>{
    sphere.material.dispose()
    sphere.material = materials[tweaks.material]
    plane.material.dispose()
    plane.material = materials[tweaks.material]
    torus.material.dispose()
    torus.material = materials[tweaks.material]
});


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
    sphere.rotation.y = 0.3 * elapsedTime
    plane.rotation.y = 0.3 * elapsedTime
    plane.rotation.x = 0.1 * elapsedTime
    torus.rotation.y = 0.3 * elapsedTime
    torus.rotation.x = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()