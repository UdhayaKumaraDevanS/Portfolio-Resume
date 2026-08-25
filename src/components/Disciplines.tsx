import { useEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib";
import { DISCIPLINES } from "../data";
import SystemGraph from "./SystemGraph";

/**
 * Pinned method scene — GSAP ScrollTrigger holds the viewport while the
 * four states of the support method trade places: Support → Systems →
 * Tools → People. The network sculpture keeps rotating underneath.
 */
export default function Disciplines() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const layers = gsap.utils.toArray<HTMLElement>(".disc-layer");
      const titles = layers.map((l) => l.querySelector<HTMLElement>(".disc-title")!);
      const itemSets = layers.map((l) => gsap.utils.toArray<HTMLElement>(l.querySelectorAll(".disc-item")));

      gsap.set(layers, { opacity: 0, yPercent: 0 });
      gsap.set(layers[0], { opacity: 1 });
      gsap.set(layers.slice(1), { yPercent: 7 });
      itemSets.forEach((items, i) => i > 0 && gsap.set(items, { opacity: 0, x: 28 }));
      gsap.set(titles.slice(1), { yPercent: 112 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });

      for (let i = 1; i < layers.length; i++) {
        const pos = i - 1;
        tl.to(layers[i - 1], { opacity: 0, yPercent: -7, duration: 0.5, ease: "none" }, pos)
          .to(layers[i], { opacity: 1, yPercent: 0, duration: 0.5, ease: "none" }, pos)
          .to(titles[i], { yPercent: 0, duration: 0.55, ease: "power3.out" }, pos + 0.08)
          .to(itemSets[i], { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, pos + 0.14);
      }

      /* the sculpture keeps evolving underneath the states */
      tl.to(".disc-graph", { rotate: 96, scale: 1.28, transformOrigin: "50% 50%", ease: "none", duration: 3 }, 0);
      /* rail marker travels the four states */
      tl.to(".disc-marker", { y: 117, ease: "none", duration: 3 }, 0);
    });

    mm.add("(max-width: 767px)", () => {
      gsap.from(".disc-layer", {
        opacity: 0,
        y: 44,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: wrap, start: "top 78%" },
      });
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section className="relative border-t border-line bg-paper-2/70" aria-label="Method — support, systems, tools, people">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between px-5 pt-10 md:px-10 md:pt-14">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">03</span>
          <span className="h-px w-16 bg-line-2" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Skills — the method</span>
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3 md:block">
          Keep scrolling — the viewport holds, the state changes
        </p>
      </div>

      <div ref={wrapRef} className="relative mt-4 md:h-[340vh]">
        <div className="relative flex flex-col md:sticky md:top-0 md:h-screen md:justify-center md:overflow-hidden">
          {/* rotating sculpture */}
          <div className="disc-graph pointer-events-none absolute inset-[-12%] text-ink opacity-60" aria-hidden="true">
            <SystemGraph seed={31} density={0.85} pulses={!reduced} />
          </div>

          {/* progress rail */}
          {!reduced && (
            <div className="absolute right-9 top-1/2 z-[3] hidden -translate-y-1/2 flex-col items-center gap-0 md:flex" aria-hidden="true">
              <div className="relative flex h-[124px] flex-col justify-between">
                <span className="disc-marker absolute -left-[3.5px] top-0 h-[10px] w-[10px] bg-accent" />
                {DISCIPLINES.map((d) => (
                  <span key={d.index} className="h-px w-[18px] bg-line-2" />
                ))}
              </div>
            </div>
          )}

          {DISCIPLINES.map((d) => (
            <div
              key={d.index}
              className={`disc-layer relative border-t border-line py-14 md:absolute md:inset-0 md:flex md:items-center md:border-0 md:py-0 ${
                !reduced ? "md:opacity-0" : ""
              }`}
            >
              {/* oversized state number */}
              <span
                aria-hidden="true"
                className="text-outline-faint pointer-events-none absolute -right-[5vw] top-1/2 hidden -translate-y-1/2 select-none font-display text-[46vw] font-light leading-none md:block"
              >
                {d.index}
              </span>

              <div className="relative z-[2] mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-8 px-5 md:grid-cols-12 md:gap-6 md:px-10">
                <div className="md:col-span-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-3">
                    State {d.index} <span className="text-line-2">/</span> 04
                  </p>
                  <span className="mask-line mt-4">
                    <span className="disc-title font-display text-[clamp(3rem,7.5vw,7rem)] font-light italic leading-none tracking-tight text-ink">
                      {d.title}
                    </span>
                  </span>
                  <p className="mt-5 max-w-[36ch] text-[15px] leading-relaxed text-ink-2">{d.line}</p>
                </div>
                <ul className="flex flex-col gap-3 md:col-span-5 md:col-start-8 md:self-center">
                  {d.items.map((item, j) => (
                    <li key={item} className="disc-item flex items-baseline gap-4 border-b border-line pb-3">
                      <span className="inline-block h-[7px] w-[7px] translate-y-[-1px] bg-accent" aria-hidden="true" />
                      <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink md:text-[13px]">{item}</span>
                      <span className="ml-auto font-mono text-[9px] tracking-[0.2em] text-ink-3">{String(j + 1).padStart(2, "0")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
