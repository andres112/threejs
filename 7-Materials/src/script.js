import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// GUI
const gui = new GUI();

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

const rockColorTexture = textureLoader.load('/textures/rock/basecolor.jpg')

// Material Capture
/**
 - Static Lighting: Since the lighting is pre-baked into the texture, it does not change dynamically with the scene lighting or object movement.
 - Specific Use Cases: Best suited for scenarios where a consistent appearance is desired, rather than dynamic and realistic lighting effects.
 */
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

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

// Mesh Matcap Material
const matcapMaterial = new THREE.MeshMatcapMaterial()
matcapMaterial.matcap = matcapTexture
// Avoid use DoubleSide, because it will require more processing power !!!
matcapMaterial.side = THREE.DoubleSide

// Mesh Depth Material
const depthMaterial = new THREE.MeshDepthMaterial()
depthMaterial.displacementMap = metalHeightTexture
depthMaterial.displacementScale = 0.05
// Avoid use DoubleSide, because it will require more processing power !!!
depthMaterial.side = THREE.DoubleSide

// Mesh Lambert Material
// this material requires light to be visible
const lambertMaterial = new THREE.MeshLambertMaterial()
lambertMaterial.map = metalColorTexture
lambertMaterial.aoMap = metalAmbientOcclusionTexture
lambertMaterial.aoMapIntensity = 1
// Avoid use DoubleSide, because it will require more processing power !!!
lambertMaterial.side = THREE.DoubleSide

// Mesh Phong Material
// this material requires light to be visible
const phongMaterial = new THREE.MeshPhongMaterial()
phongMaterial.map = metalColorTexture
phongMaterial.shininess = 100
phongMaterial.specular = new THREE.Color(0x1188ff)
phongMaterial.specularMap = metalRoughnessTexture
// Avoid use DoubleSide, because it will require more processing power !!!
phongMaterial.side = THREE.DoubleSide

// Mesh Toon Material
// this material requires light to be visible
const toonMaterial = new THREE.MeshToonMaterial()
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false
toonMaterial.map = rockColorTexture
toonMaterial.gradientMap = gradientTexture
toonMaterial.side = THREE.DoubleSide

// Mesh Standard Material
// this material requires light to be visible
const standardMaterial = new THREE.MeshStandardMaterial()
standardMaterial.map = metalColorTexture
standardMaterial.roughness= 0.2
standardMaterial.metalness = 0.7
standardMaterial.normalMap = metalNormalTexture
standardMaterial.roughnessMap = metalRoughnessTexture
standardMaterial.metalnessMap = metalMetalnessTexture
standardMaterial.aoMap = metalAmbientOcclusionTexture
standardMaterial.aoMapIntensity = 1
standardMaterial.alphaMap = metalAlphaTexture
// Avoid use DoubleSide, because it will require more processing power !!!
standardMaterial.side = THREE.DoubleSide

gui.add(standardMaterial, 'metalness').min(0).max(1).step(0.0001).name('Metalness')
gui.add(standardMaterial, 'roughness').min(0).max(1).step(0.0001).name('Roughness')



const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    standardMaterial
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    standardMaterial
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 32),
    standardMaterial
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// GUI
const tweaks = {
    material: 'Standard',
    matcap: '1'
}
const materials = {
    Standard: standardMaterial,
    Basic: basicMaterial,
    Normal: normalMaterial,
    Matcap: matcapMaterial,
    Depth: depthMaterial,
    Lambert: lambertMaterial,
    Phong: phongMaterial,
    Toon: toonMaterial
}

gui
.add(tweaks, 'material', [
    'Standard',
    'Basic',
    'Normal',
    'Matcap',
    'Depth',
    'Lambert',
    'Phong',
    'Toon'
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

gui.add(tweaks, 'matcap', {
    Matcap1: '1',
    Matcap2: '2',
    Matcap3: '3',
    Matcap4: '4',
    Matcap5: '5',
    Matcap6: '6',
    Matcap7: '7',
    Matcap8: '8',
    Matcap9: '9',
    Matcap10: '10',
}).name('MatCap').onChange(() => {
    matcapTexture.dispose()
    // Load the new texture and then update the material
    textureLoader.load(`/textures/matcaps/${tweaks.matcap}.png`, function(loadedTexture) {
        matcapTexture.image = loadedTexture.image;
        matcapTexture.needsUpdate = true;
    });
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 2
scene.add(pointLight)


/**
 * Environment map
 */
const rgbeloader = new RGBELoader()
rgbeloader.load('/textures/environmentMap/studio_garden_2k.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    scene.environment = envMap
})

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