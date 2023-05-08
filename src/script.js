import * as THREE from "three";
import testVertexShader from "./shaders/picture/vertex.glsl";
import testFragmentShader from "./shaders/picture/fragment.glsl";
import gsap from "gsap";
import { GUI } from "lil-gui";

// ----------------- CONTENT -----------------  //
const content = [
  {
    id: 1,
    name: "Extension d’une maison sur le port",
    location: "description",
    image: "/textures/texture1.jpg",
  },
  {
    id: 2,
    name: "Titre 1",
    location: "description",
    image: "/textures/texture2.jpg",
  },
  {
    id: 3,
    name: "Titre 2",
    location: "description",
    image: "/textures/texture3.jpg",
  },
  {
    id: 4,
    name: "Titre 3",
    location: "description",
    image: "/textures/texture4.jpg",
  },
  {
    id: 5,
    name: "Titre 4",
    location: "description",
    image: "/textures/texture5.jpg",
  },
  {
    id: 6,
    name: "Titre 5",
    location: "description",
    image: "/textures/texture6.jpg",
  },
  {
    id: 7,
    name: "Titre 6",
    location: "description",
    image: "/textures/texture7.jpg",
  },
  {
    id: 8,
    name: "Titre 7",
    location: "description",
    image: "/textures/texture8.jpg",
  },
  {
    id: 9,
    name: "Titre 8",
    location: "description",
    image: "/textures/texture9.jpg",
  },
];

const texturesToLoad = [
  "/textures/texture1.jpg",
  "/textures/texture2.jpg",
  "/textures/texture3.jpg",
  "/textures/texture4.jpg",
  "/textures/texture5.jpg",
  "/textures/texture6.jpg",
  "/textures/texture7.jpg",
  "/textures/texture8.jpg",
  "/textures/texture9.jpg",
];

// ----------------- THREEJS PART -----------------  //

// ----------------- GUI -----------------  //
const settings = {
  progress: 0,
  cameraZ: 100,
};
const gui = new GUI();
gui.add(settings, "progress", 0, 1, 0.001);
gui.add(settings, "cameraZ", 10, 1000, 1);

/**
 * Setting up values
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const meshWidth = 30;
const meshHeight = 30;
const margin = 3.5;
const n = 9;
const wholeWidth = n * (margin * 2) + meshWidth;
const group = new THREE.Group();

let currentPlane = 0;
let meshes = [];
let material = [];

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// By wich value must I multiply  the meshWidth to make it fit the screen

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/texture1.jpg");

const texturePromises = texturesToLoad.map(
  (textureToLoad) =>
    new Promise((resolve) => {
      textureLoader.load(textureToLoad, (texture) => {
        resolve(texture);
      });
    })
);

/**
 * Handling resize
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Objects
for (let i = 0; i < n; i++) {
  material[i] = new THREE.ShaderMaterial({
    uniforms: {
      uScrollY: { value: 0.0 },
      uTime: { value: 0.0 },
      uProgress: { value: 0.0 },
      uDistanceFromCenter: { value: 0.0 },
      uResolution: {
        value: new THREE.Vector2(sizes.width, sizes.height),
      },
      uQuadSize: { value: new THREE.Vector2(meshWidth, meshHeight) },
      uTexture: { value: texture },
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    // wireframe: true,
  });

  Promise.all(texturePromises).then((textures) => {
    material[i].uniforms.uTexture.value = textures[i];
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(meshWidth, meshHeight, 128, 128),
    material[i]
  );

  mesh.position.x = i * margin * (meshWidth / 2);

  meshes.push(mesh);
  group.add(mesh);
  scene.add(mesh);
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  10,
  1000
);
camera.position.z = settings.cameraZ;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollTarget = 0;
let scrollSpead = 0;
let currentScroll = 0;
let isInMotion = false;

window.addEventListener("mousewheel", (e) => {
  scrollTarget = e.wheelDeltaY * 0.3;
});

/**
 * Mouse postion
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

/**
 * Mouse click
 */
// window.addEventListener("click", () => {
//   if (currentIntersect) {
//     const { x } = currentIntersect.object.position;
//     if (Math.abs(x) >= 0.05) {
//       // if the user click on a plane on the left/right side -> centers it
//       scrollTarget = x * -1 * (wholeWidth - margin * 2.8);
//     } else {
//       // if the user click on a plane on the center -> open the project
//     }
//   }
// });

/**
 * Animate
 */
const clock = new THREE.Clock();
let currentIntersect = null;

const updateMeshes = () => {
  meshes.forEach((o, i) => {
    console.log(currentScroll);
    o.position.x += currentScroll;
    // // If the mesh goes out of bounds on the left side, move it to the right
    if (o.position.x < -wholeWidth / 2) o.position.x += wholeWidth * n;
    // If the mesh goes out of bounds on the right side, move it to the left
    if (o.position.x > wholeWidth / 2) o.position.x -= wholeWidth * n;

    // ======== snapping effect ========
    let rounded = Math.round(o.position.x / margin) * margin;
    let diff = rounded - o.position.x;
    // o.position.x += Math.sign(diff) * Math.pow(Math.abs(diff), 0.5) * 0.04;

    // ======== rotation effect ========
    // o.rotation.z = o.position.x * -0.1;

    // ======== position Y in function of distance from center effect ========
    o.position.y = 0.2;
    o.position.y += Math.abs(o.position.x * 0.5) * -1;
    // o.position.y += Math.abs(Math.sin(o.position.x * 0.5)) * -1;
    o.position.y *= 0.5;

    // define the index of the currentPlane in the center
    if (rounded === 0) {
      currentPlane = i;
    }

    // define if the user is currently scrolling or no
    if (Math.abs(diff) <= 0.002) {
      isInMotion = false;
    } else {
      isInMotion = true;
    }

    // RayCaster and moseEvents
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length) {
      currentIntersect = intersects[0];
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
  });

  handlingGSAP();
};

let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  previousTime = elapsedTime;
  camera.position.z = settings.cameraZ;

  scrollSpead += (scrollTarget - scrollSpead) * 0.8;
  scrollSpead *= 0.9;
  scrollTarget *= 0.9;
  currentScroll = scrollSpead * 0.05;

  // Update uniforms
  meshes.forEach((_, i) => {
    material[i].uniforms.uScrollY.value = scrollTarget / sizes.height;
    material[i].uniforms.uProgress.value = settings.progress;
    material[i].uniforms.uTime.value = elapsedTime;
  });

  updateMeshes();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// ----------------- GSAP PART -----------------  //

// when isInMotion === true, project description
function handlingGSAP() {
  const projectIndex = document.querySelector(".project-index span");
  const projectName = document.querySelector(".project-name");
  const projectLocation = document.querySelector(".project-location");

  const array = [projectIndex, projectName, projectLocation];

  if (isInMotion) {
    gsap.to(array, {
      stagger: 0.1,
      opacity: 0,
    });
  } else {
    // can you refactor the next 3 lines
    const index = content[currentPlane].id.toString().padStart(2, "0");
    const name = content[currentPlane].name;
    const location = content[currentPlane].location;
    projectIndex.textContent = `[${index}]`;
    projectName.textContent = name;
    projectLocation.textContent = location;
    gsap.to(array, {
      stagger: 0.1,
      opacity: 1,
    });
  }
}
