import * as THREE from "three";
import gsap, { Power2, Power3 } from "gsap";
import vertexShader from "./shaders/picture/vertex.glsl";
import fragmentShader from "./shaders/picture/fragment.glsl";
import barba from "@barba/core";
import { insideAnim } from "./inside";

class Scene {
  constructor(options) {
    this.canvasContainer = document.querySelector(".canvasContainer");
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = Math.tan((this.camera.fov / 2) * (Math.PI / 180));
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvasContainer.appendChild(this.renderer.domElement);

    this.addMesh();
    this.animate();
    this.barba();
  }

  async addMesh() {
    const textureLoader = new THREE.TextureLoader();
    const texture = await textureLoader.loadAsync("/textures/texture1.jpg");
    const textureWidth = texture.image.width;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 32, 32),
      new THREE.MeshBasicMaterial({
        map: texture,
        // wireframe: true,
      })
    );
    mesh.scale.set(1, 1, 1);
    this.scene.add(mesh);
  }

  init() {
    this.canvasContainer = document.querySelector(".canvasContainer");
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvasContainer.appendChild(this.renderer.domElement);

    this.addMesh();
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  cleanUp() {
    this.scene.remove(this.scene.children[0]);
    this.scene.remove();
    this.renderer.dispose();
  }

  barba() {
    let that = this;
    barba.init({
      debug: true,
      transitions: [
        {
          name: "opacity-transition",
          from: {
            namespace: ["home"],
          },
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.5,
            });
          },
          afterLeave() {
            that.cleanUp();
          },
          enter(data) {
            gsap.to(data.next.container, {
              opacity: 0.5,
              duration: 1,
            });
          },
        },
        {
          name: "inside-transition",
          from: {
            namespace: ["inside"],
          },
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.5,
            });
          },
          beforeEnter(data) {
            that.init();
            data.next.container.style.opacity = 0;
          },
          enter(data) {
            gsap.to(data.next.container, {
              opacity: 1,
              duration: 1,
            });
          },
        },
      ],
    });
  }
}

new Scene({ dom: document.querySelector(".canvasContainer") });
