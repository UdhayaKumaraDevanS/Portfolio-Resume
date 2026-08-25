import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };

/* ------------------------------------------------------------------ */
/*  Environment helpers                                                */
/* ------------------------------------------------------------------ */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(isTouchDevice);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const onChange = () => setTouch(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return touch;
}

declare global {
  interface Window {
    __UKD_INTRO_DONE__?: boolean;
  }
}

/* Intro-overlay handshake: Hero waits for the sheet to lift. */
export const INTRO_DONE = "ukd:intro-done";

export function isIntroDone(): boolean {
  if (typeof window === "undefined") return true;
  return !!window.__UKD_INTRO_DONE__;
}

export function announceIntroDone() {
  if (typeof window !== "undefined") {
    window.__UKD_INTRO_DONE__ = true;
    window.dispatchEvent(new CustomEvent(INTRO_DONE));
  }
}

export function onIntroDone(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.__UKD_INTRO_DONE__) {
    fn();
    return () => {};
  }
  const handler = () => fn();
  window.addEventListener(INTRO_DONE, handler, { once: true });
  return () => window.removeEventListener(INTRO_DONE, handler);
}

/* ------------------------------------------------------------------ */
/*  Smooth anchor scrolling                                            */
/* ------------------------------------------------------------------ */

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (prefersReducedMotion()) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }
  gsap.to(window, {
    scrollTo: { y: el, offsetY: 0, autoKill: true },
    duration: 1.15,
    ease: "power3.inOut",
    overwrite: true,
  });
}

/* ------------------------------------------------------------------ */
/*  Deterministic randomness for generative visuals                    */
/* ------------------------------------------------------------------ */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Word splitting for editorial reveals                               */
/* ------------------------------------------------------------------ */

export function splitWords(text: string): { word: string; trailing: boolean }[] {
  return text.split(" ").map((word, i, arr) => ({ word, trailing: i < arr.length - 1 }));
}

/* Clamp helper */
export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
