import * as THREE from "three";
import gsap, { Power2, Power3 } from "gsap";
import vertexShader from "./shaders/picture/vertex.glsl";
import fragmentShader from "./shaders/picture/fragment.glsl";
import barba from "@barba/core";
import { insideAnim } from "./inside";

class Scene {
  constructor(options) {
    this.container = options.dom;
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
    this.container.appendChild(this.renderer.domElement);

    this.addMesh();
    this.animate();
  }

  addMesh() {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      })
    );
    mesh.scale.set(1, 1, 1);
    this.scene.add(mesh);
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}

new Scene({ dom: document.querySelector(".container") });
