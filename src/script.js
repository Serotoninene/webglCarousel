import * as THREE from 'three'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })



/**
 * Setting up values 
 */
const meshWidth = 3
const margin = 4.5
const n = 9
const wholeWidth = n  * margin

let centerX = window.innerWidth / 2
let meshes = []
let material = []


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/texture1.jpg')

const texturesToLoad = [
  '/textures/texture1.jpg', 
  '/textures/texture2.jpg', 
  '/textures/texture3.jpg', 
  '/textures/texture4.jpg', 
  '/textures/texture5.jpg', 
  '/textures/texture6.jpg', 
  '/textures/texture7.jpg', 
  '/textures/texture8.jpg',
  '/textures/texture9.jpg'
];

const texturePromises = texturesToLoad.map((textureToLoad) =>
  new Promise((resolve) => {
    textureLoader.load(textureToLoad, (texture) => {
      resolve(texture);
    });
  })
);

//

// Objects
for(let i = 0; i < n; i++){
  material[i] = new THREE.ShaderMaterial({
    uniforms:{
      uScrollY: { value: 0.0 },
      uDistanceFromCenter : {value : 0.0},
      uTexture : {value : texture}
    },
    vertexShader: testVertexShader,
    fragmentShader:testFragmentShader,
  })

  Promise.all(texturePromises).then((textures) => {
    material[i].uniforms.uTexture.value = textures[i]
    console.log(textures);
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(meshWidth, 3,64,64),
    material[i]
  )

  meshes.push(mesh)
  scene.add(mesh)
}

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

  centerX = window.innerWidth / 2

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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */

let currentPlane = 0

let scrollTarget = 0
let scrollSpead = 0 
let currentScroll = 0

window.addEventListener('mousewheel', (e) =>
{
  scrollTarget = e.wheelDeltaY * 0.3;

  if (scrollTarget > 0) {
    currentPlane = Math.ceil(currentScroll / sizes.height *2);
  } else {
    currentPlane = Math.floor(currentScroll / sizes.height *2);
  }
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const updateMeshes = () => {
  meshes.forEach((o,i)=> {   
    o.position.x = (i * margin % wholeWidth +currentScroll * 0.01 +42069*wholeWidth)%wholeWidth - 2 * margin
    const distanceFromCenter = o.position.x / centerX




    material[i].uniforms.uDistanceFromCenter.value = distanceFromCenter;

    o.rotation.z = distanceFromCenter * 100
    o.position.y =THREE.MathUtils.lerp(o.position.y, Math.abs(distanceFromCenter * 250) * -1, 0.7)
  })

}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    scrollSpead += (scrollTarget - scrollSpead) * 0.8
    scrollSpead *= 0.9
    scrollTarget *= 0.9
    currentScroll += scrollSpead * 0.5


    meshes.forEach((_,i) => {
      material[i].uniforms.uScrollY.value = scrollTarget / sizes.height ;
    })

    

    updateMeshes()
    // Animate camera
    // camera.position.x = 1.1 * -currentScroll / sizes.height * objectsDistance

    const parallaxX = 0
    const parallaxY = 0
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()