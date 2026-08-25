import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useIsTouch } from "../lib";

/**
 * Minimal editorial cursor — a small ink dot that grows on interactive
 * elements and carries a contextual label (VIEW PROJECT / EMAIL / OPEN).
 * Disabled entirely on touch devices and for prefers-reduced-motion.
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (reduced || touch) {
      document.documentElement.classList.remove("ukd-cursor");
      return;
    }
    document.documentElement.classList.add("ukd-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: pos.x, y: pos.y };
    const tag = { x: pos.x, y: pos.y };
    let visible = false;
    let down = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible && dotRef.current && labelRef.current) {
        visible = true;
        dotRef.current.style.opacity = "1";
        labelRef.current.style.opacity = "1";
      }
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const hit = t?.closest?.<HTMLElement>("[data-cursor], a, button");
      if (hit) {
        setHot(true);
        setLabel(hit.dataset.cursor ?? null);
      } else {
        setHot(false);
        setLabel(null);
      }
    };

    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const tick = () => {
      dot.x += (pos.x - dot.x) * 0.32;
      dot.y += (pos.y - dot.y) * 0.32;
      tag.x += (pos.x - tag.x) * 0.16;
      tag.y += (pos.y - tag.y) * 0.16;
      if (dotRef.current) {
        const scale = down ? 0.7 : 1;
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%,-50%) scale(${scale})`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${tag.x}px, ${tag.y}px, 0) translate(14px, 14px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("ukd-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [reduced, touch]);

  if (reduced || touch) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] opacity-0 transition-opacity duration-300"
      >
        <div
          className={`rounded-full bg-ink transition-[width,height,background-color] duration-300 ease-out ${
            label ? "h-2 w-2 bg-accent" : hot ? "h-10 w-10 bg-ink/10 ring-1 ring-ink/60" : "h-2 w-2"
          }`}
        />
      </div>
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[121] opacity-0 transition-opacity duration-300"
      >
        <div
          className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-opacity duration-200 ${
            label ? "opacity-100" : "opacity-0"
          }`}
        >
          {label && (
            <span className="border border-ink/30 bg-paper px-2 py-1">
              {label} <span className="text-accent">↗</span>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
