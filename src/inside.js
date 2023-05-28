import * as THREE from "three";
import barba from "@barba/core";
import { gsap } from "gsap";
import vertexShader from "./shaders/insidePicture/vertex.glsl";
import fragmentShader from "./shaders/insidePicture/fragment.glsl";

let canvas;
let sizes;
let canvasSizes;
let scene;
let textureLoader;
let texture;
let camera;
let material;
let mesh;
let renderer;
let clock;

export function setup() {
  // Canvas
  canvas = document.querySelector("canvas.webglInside");

  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  canvasSizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  };

  // Scene
  scene = new THREE.Scene();

  // Texture
  textureLoader = new THREE.TextureLoader();
  texture = textureLoader.load("/textures/texture1.jpg");

  // Camera
  camera = new THREE.PerspectiveCamera(
    35,
    canvasSizes.width / canvasSizes.height,
    0.1,
    100
  );

  camera.position.z = 99;

  let aspect = canvasSizes.width / canvasSizes.height;

  let ndcHeight =
    2 * camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
  let ndcWidth = ndcHeight * aspect;

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uResolution: {
        value: new THREE.Vector2(ndcWidth, ndcHeight),
      },
      uTexture: { value: texture },
      uTextureSize: {
        value: new THREE.Vector2(0, 0),
      },
      uQuadSize: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 4, 4), material);
  mesh.position.set(0, 0.5, 0);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });

  renderer.setSize(canvasSizes.width, canvasSizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  clock = new THREE.Clock();
}

export function cleanup() {
  scene.remove(mesh);
  mesh.geometry.dispose();
  mesh.material.dispose();
  renderer.dispose();
}

export function animate() {
  material.uniforms.uTextureSize.value = new THREE.Vector2(
    texture.image?.width,
    texture.image?.height
  );

  // Update material
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);
}

setup();
animate();

// ============== EVENT LISTENER ==============
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
  let ndcHeight =
    2 * camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
  let ndcWidth = ndcHeight * camera.aspect;

  mesh.material.uniforms.uResolution.value = new THREE.Vector2(
    ndcWidth,
    ndcHeight
  );

  // Update renderer
  renderer.setSize(canvasSizes.width, canvasSizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
