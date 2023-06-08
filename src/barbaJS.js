//// Retravail V retour home --------------------------------

function barbaInit() {
  let that = this;
  barba.init({
    transitions: [
      {
        name: "from-page-to-home",
        to: {
          namespace: ["home"],
        },
        leave(data) {
          // LEAVING PROJECT PAGE
          const tl = gsap.timeline();
          return tl.to(data.current.container, {
            x: "-100%",
          });
        },
        beforeEnter() {
          that.onHome = true;
          that.init();
        },
        enter() {},
      },
      {
        name: "from-home-page-transition",
        from: {
          namespace: ["home"],
        },
        to: { namespace: ["cms-projet"] },
        leave() {
          // LEAVING HOME
          const tl = gsap.timeline();
          tl.to(that.settings, {
            progress: 1,
            duration: 0.8,
            ease: Power3.easeInOut,
          });
          that.cleanUp();
          return tl;
        },
        afterLeave() {
          that.onHome = false;
        },
        enter() {
          $(".is-first-img").addClass("full-width");
          //const image = document.querySelector(".is-first-img");
          let state = Flip.getState($(".is-first-img"));
          $(".is-first-img").removeClass("full-width");
          Flip.from(state, {
            //absolute: true,
            duration: 1,
            ease: "power3.inOut",
          });
        },
      },
    ],
  });
}

//  end Barba ___________
