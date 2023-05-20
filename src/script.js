import * as THREE from "three";
import testVertexShader from "./shaders/picture/vertex.glsl";
import testFragmentShader from "./shaders/picture/fragment.glsl";
import gsap, { Power2, Power3 } from "gsap";
import { GUI } from "lil-gui";
import Stats from "stats-js";

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

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
  "/textures/texture3.jpg",
  "/textures/texture2.jpg",
  "/textures/texture1.jpg",
  "/textures/texture4.jpg",
  "/textures/texture5.jpg",
  "/textures/texture6.jpg",
  "/textures/texture7.jpg",
  "/textures/texture8.jpg",
  "/textures/texture9.jpg",
];

// ----------------- THREEJS PART -----------------  //

// ----------------- GUI -----------------  //
let settings = {
  lerpY: 0.324,
  progress: 1,
  meshWidth: 2.4,
  scale: 1,
  snapDelta: 0.717,
  uValue: [],
};
const gui = new GUI();
gui.add(settings, "lerpY", 0, 1, 0.001);
gui.add(settings, "snapDelta", 0, 1, 0.001);
gui.add(settings, "meshWidth", 0, 5, 0.1);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * Setting up values
 */
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

const meshWidth = settings.meshWidth;
const meshHeight = meshWidth;

const margin = 3.5;
const n = 8;
const wholeWidth = n * margin;
const group = new THREE.Group();

let currentPlane = 0;
let meshes = [];
let material = [];

// Scene
const scene = new THREE.Scene();

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
  ndcWidth = canvasSizes.width * r;

  meshes.forEach(
    (mesh) =>
      (mesh.material.uniforms.uResolution.value = new THREE.Vector2(
        ndcWidth,
        ndcHeight
      ))
  );
  // Update renderer
  renderer.setSize(canvasSizes.width, canvasSizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  canvasSizes.width / canvasSizes.height,
  0.1,
  100
);

camera.position.z = 6;

let aspect = canvasSizes.width / canvasSizes.height;

ndcHeight =
  2 * camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
ndcWidth = ndcHeight * aspect;

const r = ndcWidth / canvasSizes.width;

let uResolution = new THREE.Vector2(ndcWidth, ndcHeight);

//  ============ Objects ============
for (let i = 0; i < n; i++) {
  settings.uValue.push({ value: 0 });

  material[i] = new THREE.ShaderMaterial({
    uniforms: {
      uScrollY: { value: 0.0 },
      uTime: { value: 0.0 },
      uProgress: { value: 0.0 },
      uDistanceFromCenter: { value: 0.0 },
      uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
      uResolution: {
        value: uResolution,
      },
      uQuadSize: { value: new THREE.Vector2(meshWidth, meshHeight) },
      uTextureSize: { value: new THREE.Vector2(0, 0) },
      uTexture: { value: texture },
      uValue: { value: settings.uValue[i].value },
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    // wireframe: true,
  });

  Promise.all(texturePromises).then((textures) => {
    material[i].uniforms.uTexture.value = textures[i];

    material[i].uniforms.uTextureSize.value = new THREE.Vector2(
      textures[i].image.width,
      textures[i].image.height
    );
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(meshWidth, meshHeight, 16, 16),
    material[i]
  );
  mesh.position.y = 0.1;
  mesh.position.x = i * margin;

  meshes.push(mesh);
  group.add(mesh);
  scene.add(mesh);
}
const timelines = [];
meshes.forEach((mesh, i) => {
  const tl = gsap.timeline();

  timelines.push(tl);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(canvasSizes.width, canvasSizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
console.log(canvas.clientHeight);
/**
 * Scroll
 */
let scrollTarget = 0;
let scrollSpead = 0;
let currentScroll = 0;
let isInMotion = false;

// ============ Scroll ============
window.addEventListener("mousewheel", (e) => {
  scrollTarget = e.wheelDeltaY * 0.3;
});

// ============ Touch ============
let touchStart = 0;
let touchEnd = 0;

window.addEventListener("touchstart", (e) => {
  touchStart = e.touches[0].clientX;
});

window.addEventListener("touchmove", (e) => {
  touchEnd = e.touches[0].clientX;
  scrollTarget = (touchEnd - touchStart) * 0.2;
});

window.addEventListener("touchend", (e) => {
  touchStart = 0;
  touchEnd = 0;
});

/**
 * Mouse postion
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / canvasSizes.width) * 2 - 1;
  mouse.y = -(event.clientY / canvasSizes.height) * 2 + 1;
});

/**
 * Mouse click
 */
window.addEventListener("click", () => {
  if (currentIntersect) {
    const { x } = currentIntersect.object.position;
    if (Math.abs(x) >= 0.05) {
      ndcWidth =
        2 * camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
      // if the user click on a plane on the left/right side -> centers it
      scrollTarget = x * (ndcWidth - margin * 2) * 10;
      scrollTarget *= 0.8;
    } else {
      // if the user click on a plane on the center -> open the project
      if (settings.progress === 0) {
        // if the user click on a plane on the center -> open the project
        gsap.to(settings, {
          progress: 1,
          duration: 0.8,
          ease: Power3.easeInOut,
        });
      } else {
        gsap.to(settings, {
          progress: 0,
          duration: 0.8,
          ease: Power3.easeInOut,
        });
      }
    }
  }
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let currentIntersect = null;

const updateMeshes = () => {
  meshes.forEach((o, i) => {
    // ======== scroll effect ========
    o.position.x += currentScroll * 0.01;
    // // If the mesh goes out of bounds on the left side, move it to the right
    if (o.position.x < -wholeWidth / 2) o.position.x += wholeWidth;
    // // If the mesh goes out of bounds on the right side, move it to the left
    if (o.position.x > wholeWidth / 2) o.position.x -= wholeWidth;

    // ======== snapping effect ========
    let rounded = Math.round(o.position.x / margin) * margin;
    let diff = rounded - o.position.x;
    o.position.x += THREE.MathUtils.lerp(
      0,
      Math.sign(diff) * Math.pow(Math.abs(diff), 0.5) * 0.04,
      settings.snapDelta
    );

    // ======== rotation effect ========
    o.rotation.z = o.position.x * -0.1;

    // ======== position Y in function of distance from center effect ========
    o.position.y += THREE.MathUtils.lerp(
      o.position.y,
      Math.abs(Math.sin(o.position.x * 0.5)) * -1,
      settings.lerpY
    );
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

      currentIntersect.object.material.uniforms.uValue.value =
        settings.uValue[currentPlane].value;

      gsap.to(settings.uValue[currentPlane], {
        value: 1,
      });
    } else {
      document.body.style.cursor = "auto";
      currentIntersect.object.material.uniforms.uValue.value =
        settings.uValue[currentPlane].value;
      for (let i = 0; i < n; i++) {
        gsap.to(settings.uValue[i], {
          value: 0,
          duration: 0.4,
        });
      }
    }
  });

  handlingGSAP();
};

let previousTime = 0;

const tick = () => {
  stats.begin();
  const elapsedTime = clock.getElapsedTime();

  previousTime = elapsedTime;

  scrollSpead += (scrollTarget - scrollSpead) * 0.5;
  scrollSpead *= 0.9;
  scrollTarget *= 0.9;
  currentScroll = scrollSpead * 0.5;

  // Update uniforms
  meshes.forEach((_, i) => {
    material[i].uniforms.uScrollY.value = scrollTarget / canvasSizes.height;
    material[i].uniforms.uTime.value = elapsedTime;

    if (i === currentPlane) {
      timelines[i].progress(settings.progress);
      material[i].uniforms.uProgress.value = settings.progress;
      _.position.z = 0.1;
    } else {
      _.position.y += settings.progress * -10;
    }
  });

  updateMeshes();

  // Render
  renderer.render(scene, camera);
  stats.end();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// ----------------- GSAP PART -----------------  //

// ============== INTRO ANIMATION ==============
const introTl = gsap.timeline();
introTl.to(".body", { y: 0, duration: 0.8, ease: Power2.easeInOut }, 1);
introTl.to(settings, { progress: 0, duration: 1, ease: Power3.easeInOut });

// when isInMotion === true, project description
function handlingGSAP() {
  const projectIndex = document.querySelector(".project-index span");
  const projectName = document.querySelector(".project-name");
  const projectLocation = document.querySelector(".project-location");

  const array = [projectIndex, projectName, projectLocation];

  // ============== SCALE ANIMATION ==============

  // ============== WORDING ANIMATION ==============
  // if the user is scrolling, hide the project description
  if (isInMotion) {
    gsap.to(array, {
      stagger: 0.1,
      opacity: 0,
    });
  } else {
    // WHEN STOP SCROLLING, SHOW THE PROJECT DESCRIPTION with stagger and opacity back to 1
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
