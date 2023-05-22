import * as THREE from "three";
import vertexShader from "./shaders/insidePicture/vertex.glsl";
import fragmentShader from "./shaders/insidePicture/fragment.glsl";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webglInside");

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let ndcWidth;
let ndcHeight;

const canvasSizes = {
  width: canvas.clientWidth,
  height: canvas.clientHeight,
};

// Scene
const scene = new THREE.Scene();
let textureWidth = 0;
let textureHeight = 0;

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/texture1.jpg");
/**
 * Handling resize
 */

window.addEventListener("resize", () => {
  const widthRatio = canvasSizes.width / sizes.width;
  const heightRatio = canvasSizes.height / sizes.height;

  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  canvasSizes.width = sizes.width * widthRatio;
  canvasSizes.height = sizes.height * heightRatio;

  // Update camera
  camera.aspect = canvasSizes.width / canvasSizes.height;
  camera.updateProjectionMatrix();

  // update ndcWidth and ndcHeight
  ndcHeight =
    2 * camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
  ndcWidth = ndcHeight * aspect;

  mesh.material.uniforms.uResolution.value = new THREE.Vector2(
    ndcWidth,
    ndcHeight
  );

  // Update renderer
  renderer.setSize(canvasSizes.width, canvasSizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// **
//  * Camera
//  */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  canvasSizes.width / canvasSizes.height,
  0.1,
  100
);

camera.position.z = 99;

let aspect = canvasSizes.width / canvasSizes.height;

ndcHeight =
  2 * camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
ndcWidth = ndcHeight * aspect;

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0.0 },
    uResolution: {
      value: new THREE.Vector2(ndcWidth, ndcHeight),
    },
    uTexture: { value: texture },
    uTextureSize: {
      value: new THREE.Vector2(textureWidth, textureHeight),
    },
    uQuadSize: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 4, 4), material);
mesh.position.set(0, 0.5, 0);

scene.add(mesh);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

renderer.setSize(canvasSizes.width, canvasSizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  material.uniforms.uTextureSize.value = new THREE.Vector2(
    texture.image?.width,
    texture.image?.height
  );

  // Update material
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
