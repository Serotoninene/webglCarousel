import * as THREE from "three";
import gsap, { Power3 } from "gsap";
import vertexShader from "./shaders/picture/vertex.glsl";
import barba from "@barba/core";
import { insideAnim } from "./inside";

const content = [
  {
    id: 1,
    h2: "Extension d’une maison sur le port",
    h3: "description",
    img: "/textures/texture1.jpg",
  },
  {
    id: 2,
    h2: "Titre 1",
    h3: "description",
    img: "/textures/texture2.jpg",
  },
  {
    id: 3,
    h2: "Titre 2",
    h3: "description",
    img: "/textures/texture3.jpg",
  },
  {
    id: 4,
    h2: "Titre 3",
    h3: "description",
    img: "/textures/texture4.jpg",
  },
  {
    id: 5,
    h2: "Titre 4",
    h3: "description",
    img: "/textures/texture5.jpg",
  },
];

class Scene {
  constructor(data) {
    this.data = data;
    this.settings = {
      lerpY: 0.324,
      progress: 1,
      meshWidth: 1.4,
      meshHeight: 2.2,
      snapDelta: 0.717,
    };

    // Params
    this.n = this.data.length;
    this.margin = 3.5;
    this.currentPlane = 0;
    this.wholeWidth = this.n * this.margin;
    this.positionY = 0;
    this.onHome = true;
    this.scrollDelta = 0;

    // Events
    this.scrollTarget = 0;
    this.scrollSpead = 0;
    this.currentScroll = 0;
    this.touchStart = 0;
    this.touchEnd = 0;
    this.isInMotion = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.currentIntersect = null;

    // Setting up the threejs scene
    this.scene = new THREE.Scene();
    this.meshes = [];
    this.material = [];
    this.canvas = document.querySelector(".canvas-container");
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      canvasWidth: this.canvas?.clientWidth,
      canvasHeight: this.canvas?.clientHeight,
    };
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.canvasWidth / this.sizes.canvasHeight,
      0.1,
      100
    );
    this.camera.position.z = 6;
    this.camera.aspect = this.sizes.canvasWidth / this.sizes.canvasHeight;

    this.ndcHeight =
      2 *
      this.camera.position.z *
      Math.tan((this.camera.fov / 2) * (Math.PI / 180));
    this.ndcWidth = this.ndcHeight * this.camera.aspect;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    this.canvas.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.sizes.canvasWidth, this.sizes.canvasHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Resize event
    this.handleResize = this.handleResize.bind(this);

    // Init
    this.handleSettings();
    this.addObjects();
    this.handleEventListeners();
    this.animate();
    this.introAnim();
  }

  async init() {
    this.canvas = document.querySelector(".canvas-container");
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvas.appendChild(this.renderer.domElement);

    // Init
    this.handleSettings();
    await this.addObjects();
    this.handleEventListeners();
    this.animate();
    this.introAnim();
  }

  handleSettings() {
    if (this.sizes.width < 768) {
      this.settings.meshWidth = 1.4;
      this.settings.meshHeight = 2.2;
      this.margin = 1.8;
      this.wholeWidth = this.n * this.margin;
      this.positionY = 0.35;
    } else {
      this.settings.meshWidth = 2.4;
      this.settings.meshHeight = 2.4;
      this.margin = 3.5;
      this.wholeWidth = this.n * this.margin;
      this.positionY = 0.3;
    }
  }

  async addObjects() {
    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < this.n; i++) {
      const texture = await textureLoader.loadAsync(this.data[i].img);
      this.material[i] = new THREE.ShaderMaterial({
        uniforms: {
          uScrollY: { value: 0.0 },
          uProgress: { value: 0.0 },
          uResolution: {
            value: new THREE.Vector2(this.ndcWidth, this.ndcHeight),
          },
          uQuadSize: {
            value: new THREE.Vector2(
              this.settings.meshWidth,
              this.settings.meshHeight
            ),
          },
          uTexture: { value: texture },
          uTextureSize: {
            value: new THREE.Vector2(texture.image.width, texture.image.height),
          },
          uValue: { value: 0 },
        },
        vertexShader: vertexShader,
        fragmentShader: `precision highp float;
        uniform vec2 uTextureSize;
        uniform sampler2D uTexture;
        uniform vec2 uQuadSize;
        uniform float uValue;
        
        varying vec2 vUv;
        varying vec2 vSize;
        
        vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize){
          vec2 tempUV = uv - vec2(0.5);
        
          float quadAspect = quadSize.x / quadSize.y;
          float textureAspect = textureSize.x / textureSize.y;
        
          if(quadAspect < textureAspect){
            tempUV *= vec2(quadAspect / textureAspect, 1.);
          }else{
            tempUV*= vec2(1., textureAspect / quadAspect);
          }
        
          tempUV += vec2(0.5);
          return tempUV;
        }
        
        void main()
        {
          vec2 correctUV = getUV(vUv, uTextureSize, vSize);
          vec4 color = texture2D(uTexture, correctUV);
          gl_FragColor = vec4(color);
          // gl_FragColor = vec4(vUv.xy, 0.0, 1.0);
        }`,
      });

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, 32, 32),
        this.material[i]
      );

      mesh.position.x = i * this.margin;
      mesh.position.y = 2;

      mesh.scale.set(this.settings.meshWidth, this.settings.meshHeight, 1);
      this.meshes.push(mesh);
      this.scene.add(mesh);
    }
    return this.meshes;
  }

  handleRaycaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.meshes);
    // when nothing is hovered, back to basics
    document.body.style.cursor = "auto";
    for (const mesh of this.meshes) {
      gsap.to(mesh.material.uniforms.uValue, {
        value: 0,
        duration: 0.4,
      });
    }

    // when a mesh is hovered
    if (intersects.length) {
      document.body.style.cursor = "pointer";
      this.currentIntersect = intersects[0];
      if (this.sizes.width > 768) {
        gsap.to(this.currentIntersect.object.material.uniforms.uValue, {
          value: 2,
        });
      }
    }
  }

  handleEventListeners() {
    window.addEventListener("resize", this.handleResize);

    // ============ Scroll ============
    const handleMouseWheel = (event) => {
      this.scrollTarget = event.wheelDeltaY * 0.2;
    };
    document.addEventListener("mousewheel", handleMouseWheel);

    // ============ Touch ============
    const handleTouchStart = (event) => {
      this.touchStart = event.touches[0].clientX;
    };
    document.addEventListener("touchstart", handleTouchStart);

    const handleTouchMove = (e) => {
      this.touchEnd = e.touches[0].clientX;
      this.scrollTarget = (this.touchEnd - this.touchStart) * 0.07;
    };
    document.addEventListener("touchmove", handleTouchMove);

    const handleTouchEnd = (event) => {
      this.touchStart = 0;
      this.touchEnd = 0;
    };
    document.addEventListener("touchend", handleTouchEnd);

    // ============ Mouse ============
    const handleMouseMove = (event) => {
      this.mouse.x = (event.clientX / this.sizes.canvasWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.canvasHeight) * 2 + 1;
    };
    document.addEventListener("mousemove", handleMouseMove);

    const handleClick = () => {
      if (this.currentIntersect) {
        const { x } = this.currentIntersect.object.position;
        if (Math.abs(x) >= 0.05) {
          // if the user click on a plane on the left/right side -> centers it
          if (this.sizes.width < 768) {
            this.scrollTarget = -1 * (x * this.ndcWidth);
          } else if (this.sizes.width > 768 && this.sizes.width < 1600) {
            this.scrollTarget = -1 * (x * this.ndcWidth) * 0.5;
          } else {
            this.scrollTarget = -1 * (x * this.ndcWidth) * 0.3;
          }
        }
      }
    };
    window.addEventListener("click", handleClick);
  }

  handleResize() {
    this.handleSettings();
    const widthRatio = this.sizes.canvasWidth / this.sizes.width;
    const heightRatio = this.sizes.canvasHeight / this.sizes.height;

    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.sizes.canvasWidth = this.sizes.width * widthRatio;
    this.sizes.canvasHeight = this.sizes.height * heightRatio;

    this.camera.aspect = this.sizes.canvasWidth / this.sizes.canvasHeight;
    this.camera.updateProjectionMatrix();

    this.ndcHeight =
      2 *
      this.camera.position.z *
      Math.tan((this.camera.fov / 2) * (Math.PI / 180));
    this.ndcWidth = this.ndcHeight * this.camera.aspect;

    // Handle mesh adjustments and other resizing tasks
    if (this.sizes.width < 768) {
      this.settings.meshWidth = 1.4;
      this.settings.meshHeight = 2.2;
    } else {
      this.settings.meshWidth = 2.4;
      this.settings.height = 2.4;
    }
    this.meshes.forEach((mesh, i) => {
      mesh.scale.set(this.settings.meshWidth, this.settings.meshHeight, 1);
      mesh.position.x = i * this.margin;
      mesh.material.uniforms.uQuadSize.value = new THREE.Vector2(
        this.settings.meshWidth,
        this.settings.meshHeight
      );
      mesh.material.uniforms.uResolution.value = new THREE.Vector2(
        this.ndcWidth,
        this.ndcHeight
      );
    });

    this.renderer.setSize(this.sizes.canvasWidth, this.sizes.canvasHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  handleScroll() {
    this.scrollSpead += this.scrollTarget - this.scrollSpead * 0.3;
    this.scrollTarget *= 0.9;
    this.currentScroll = this.scrollSpead;
  }

  handleInfiniteCarousel() {
    this.meshes.forEach((mesh, i) => {
      // ======== infinite carousel ========
      mesh.position.x += this.currentScroll * 0.01;
      // If the mesh goes out of bounds on the left side, move it to the right
      if (mesh.position.x < -this.wholeWidth / 2)
        mesh.position.x += this.wholeWidth;
      // // If the mesh goes out of bounds on the right side, move it to the left
      if (mesh.position.x > this.wholeWidth / 2)
        mesh.position.x -= this.wholeWidth;

      // ======== snapping ========
      let rounded = Math.round(mesh.position.x / this.margin) * this.margin;
      let diff = rounded - mesh.position.x;
      mesh.position.x += THREE.MathUtils.lerp(
        0,
        Math.sign(diff) * Math.pow(Math.abs(diff), 0.5) * 0.04,
        this.settings.snapDelta
      );

      // ======== rotation  ========
      mesh.rotation.z = mesh.position.x * -0.1;

      // ======== position Y (function of position X) ========
      mesh.position.y += this.sizes.width > 768 ? 0.1 : 0;
      mesh.position.y += Math.abs(mesh.position.x * 0.5) * -1;
      mesh.position.y *= this.positionY;

      // define the index of the currentPlane in the center
      if (rounded === 0) {
        this.currentPlane = i;
      }

      // define if the user is currently scrolling or no
      if (Math.abs(diff) <= 0.002) {
        this.isInMotion = false;
      } else {
        this.isInMotion = true;
      }
    });
  }

  handleWording() {
    if (!this.onHome) return;
    const projectIndex = document.querySelector(".project-index");
    const projectName = document.querySelector(".project-name");
    const projectLocation = document.querySelector(".project-location");
    const array = [projectIndex, projectName, projectLocation];
    // ============== WORDING ANIMATION ==============
    // if the user is scrolling, hide the project description
    if (this.isInMotion) {
      gsap.to(array, {
        stagger: 0.1,
        opacity: 0,
      });
    } else {
      // WHEN STOP SCROLLING, SHOW THE PROJECT DESCRIPTION with stagger and opacity back to 1
      const index = this.data[this.currentPlane].id.toString().padStart(2, "0");
      const name = this.data[this.currentPlane].h2;
      const location = this.data[this.currentPlane].h3;
      projectIndex.textContent = `[${index}]`;
      projectName.textContent = name;
      projectLocation.textContent = location;
      gsap.to(array, {
        stagger: 0.1,
        opacity: 1,
      });
    }
  }

  updateMeshes() {
    this.meshes.forEach((mesh, i) => {
      mesh.material.uniforms.uScrollY.value =
        this.scrollTarget / this.sizes.canvasHeight;

      if (i === this.currentPlane) {
        mesh.material.uniforms.uProgress.value = this.settings.progress;
      } else {
        mesh.material.uniforms.uProgress.value = 0;
        mesh.position.y += this.settings.progress * -10;
      }
    });
  }

  introAnim() {
    const introTl = gsap.timeline();
    // introTl.from(
    //   ".body",
    //   { y: "100%", duration: 0.8, ease: Power2.easeInOut },
    //   1
    // );
    introTl.to(this.settings, {
      progress: 0,
      duration: 1,
      delay: 1,
      ease: Power3.easeInOut,
    });
  }

  animate() {
    this.handleScroll();
    this.handleInfiniteCarousel();
    this.handleRaycaster();
    this.updateMeshes();
    this.handleWording();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  cleanUp() {
    // Clean up tasks
    window.removeEventListener("resize", this.handleResize);
    window.cancelAnimationFrame(this.animate);
    this.meshes = [];
    this.material = [];
    this.scene.remove(this.scene.children);
    this.scene.remove();
    this.renderer.dispose();
  }
}

const scene = new Scene(content);

console.log(scene);

async function barbaInit() {
  barba.init({
    transitions: [
      {
        name: "from-home-page-transition",
        from: {
          namespace: ["home"],
        },
        leave() {
          // LEAVING HOME
          const tl = gsap.timeline();
          return tl.to(scene.settings, {
            progress: 1,
            duration: 0.8,
            ease: Power3.easeInOut,
          });
        },
        afterLeave() {
          scene.cleanUp();
          scene.onHome = false;
        },
        enter() {
          insideAnim();
        },
      },
      {
        name: "from-page-to-home",
        from: {
          namespace: ["inside"],
        },
        leave(data) {
          // LEAVING PROJECT PAGE
          const tl = gsap.timeline();
          return tl.to(data.current.container, {
            x: "-100%",
          });
        },
        beforeEnter(data) {
          scene.onHome = true;
          scene.init();
          data.next.container.style.transform = "translateX(100%)";
        },
        enter(data) {
          gsap.to(data.next.container, {
            x: "0%",
            duration: 0.8,
            ease: Power3.easeInOut,
          });
        },
      },
    ],
  });
}

barbaInit();

// Create an instance of the Scene class

// Export the Scene class if needed
export default Scene;
