import { useEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib";
import { EXPERIENCE, EXPERIENCE_NOTE } from "../data";

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".exp-left > *", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });
      gsap.from(".exp-item", {
        y: 38,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".exp-list", start: "top 80%" },
      });
      gsap.from(".exp-line", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ".exp-list", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="experience" ref={ref} className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
          {/* sticky intro column */}
          <div className="exp-left md:col-span-4">
            <div className="md:sticky md:top-32">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">05</span>
                <span className="h-px w-16 bg-line-2" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Experience</span>
              </div>
              <h2 className="mt-8 font-display text-[clamp(2.6rem,4.8vw,4.6rem)] font-light uppercase leading-[0.95] tracking-tight text-ink">
                Technical
                <br />
                <span className="italic">experience</span>
              </h2>
              <p className="mt-7 max-w-[32ch] border-l border-line-2 pl-5 text-sm leading-relaxed text-ink-2">
                {EXPERIENCE_NOTE}
              </p>
              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">
                07 practices · Bommi Enterprises + study
              </p>
            </div>
          </div>

          {/* timeline */}
          <div className="relative md:col-span-7 md:col-start-6">
            <span className="exp-line absolute -left-6 top-2 hidden h-full w-px bg-line md:block" aria-hidden="true" />
            <ol className="exp-list">
              {EXPERIENCE.map((item, i) => (
                <li key={item.label} className="exp-item group relative border-t border-line py-7 first:border-t-0 md:py-8">
                  <span
                    className="absolute -left-6 top-1/2 hidden h-[7px] w-[7px] -translate-y-1/2 rounded-full border border-ink bg-paper transition-colors duration-300 group-hover:bg-accent md:block"
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline gap-5 transition-transform duration-500 ease-out group-hover:translate-x-2">
                    <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-light italic text-ink md:text-3xl">
                        {item.label}
                        <span className="text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">.</span>
                      </h3>
                      <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-2">{item.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
