import type { HeroRig } from "@/types";

/** Per-frame values of the hero WebGL scene; written by scene/HeroRig, read by the meshes. */
export const heroRig: HeroRig = {
  width: 1,
  height: 1,
  dpr: 1,
  time: 0,
  reveal: 0,
  yaw: 0,
  pitch: 0,
  lightX: 0,
  lightY: 0,
  lightOn: 0,
};
