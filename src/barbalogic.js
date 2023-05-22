import barba from "@barba/core";
import { gsap } from "gsap";

barba.init({
  transitions: [
    {
      name: "opacity-transition",
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
        });
      },
      enter(data) {
        console.log(data);
        return gsap.to(data.next.container, {
          opacity: 1,
        });
      },
    },
  ],
});
