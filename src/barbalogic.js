import barba from "@barba/core";
import Sketch from "./scriptv2.js";
import { setup, animate, cleanup } from "./inside.js";
console.log(Sketch);

// ============== BARBA TRANSITION ==============
barba.init({
  transitions: [
    {
      name: "from-home-page-transition",
      from: {
        namespace: ["home"],
      },
      beforeLeave(data) {
        // LEAVING HOME
        const tl = gsap.timeline();
        return tl.to(this.settings, {
          progress: 1,
          duration: 0.8,
          ease: Power3.easeInOut,
        });
      },

      leave(data) {},
      beforeEnter(data) {
        new Sketch();
      },
      enter(data) {
        //     // ENTERING PROJECT PAGE
        //     const tl = gsap.timeline();
        //     tl.from(data.next.container, {
        //       opacity: 0,
        //     });
        //   },
        // },
        // {
        //   name: "from-project-page-transition",
        //   from: {
        //     namespace: ["inside"],
      },
      leave(data) {
        // return gsap.timeline().to(data.current.container, {
        //   onComplete: () => {
        //     // clean up the THREEjs scene
        //     meshes.forEach((mesh, i) => {
        //       scene.remove(mesh);
        //     });
        //     // clean up the event listeners
        //     window.removeEventListener("mousewheel", handleMouseWheel);
        //     window.removeEventListener("touchstart", handleTouchStart);
        //     window.removeEventListener("touchmove", handleTouchMove);
        //     window.removeEventListener("touchend", handleTouchEnd);
        //     window.removeEventListener("mousemove", handleMouseMove);
        //     window.removeEventListener("click", handleClick);
        //     window.removeEventListener("resize", handleResize);
        //   },
        // });
      },
      beforeEnter(data) {
        setup();
        animate();
      },
      enter(data) {
        // setup the THREEjs scene
        // setup threejs scene
        // const tl = gsap.timeline().from(data.next.container, { x: "-100%" });
      },
    },
  ],
});
