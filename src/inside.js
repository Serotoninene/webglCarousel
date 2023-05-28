import { Power3, gsap } from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export const insideAnim = () => {
  const image = document.querySelector(".image");
  const state = Flip.getState(".image");
  image.classList.remove("fullWidth");
  Flip.from(state, {
    duration: 1,
    delay: 0.5,
    ease: Power3.easeOut,
    onComplete: () => {
      gsap.to(".container", { opacity: 1 });
    },
  });
};
