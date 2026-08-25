import { useEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib";
import { CAPABILITIES } from "../data";

function NodeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none">
      <circle cx="20" cy="20" r="3.2" fill="currentColor" />
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="9" x2="20" y2="2" stroke="currentColor" strokeWidth="1" />
      <line x1="29.5" y1="25.5" x2="35.5" y2="29" stroke="currentColor" strokeWidth="1" />
      <line x1="10.5" y1="25.5" x2="4.5" y2="29" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="2" r="1.6" fill="currentColor" />
      <circle cx="35.5" cy="29" r="1.6" fill="currentColor" />
      <circle cx="4.5" cy="29" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cap-row").forEach((row, i) => {
        gsap.from(row, {
          y: 44,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: (i % 3) * 0.05,
          scrollTrigger: { trigger: row, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
      gsap.from(".cap-word", {
        x: -26,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ".cap-list", start: "top 80%", toggleActions: "play none none reverse" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="capabilities" ref={ref} className="relative scroll-mt-24 border-t border-line bg-paper-2/60">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">02</span>
            <span className="h-px w-16 bg-line-2" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Capabilities</span>
          </div>
          <p className="max-w-[30ch] text-sm leading-relaxed text-ink-2">
            What I do — six verbs, in the order a good ticket gets handled.
          </p>
        </div>

        <ul className="cap-list">
          {CAPABILITIES.map((cap, i) => (
            <li key={cap.word} className="border-t border-line last:border-b">
              <div className="cap-row group relative overflow-hidden">
                {/* ink sweep */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100"
                />
                <div className="relative z-[1] grid grid-cols-12 items-baseline gap-x-4 px-1 py-7 transition-colors duration-500 group-hover:text-paper md:py-10">
                  <span className="col-span-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 transition-colors duration-500 group-hover:text-paper/60 md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 md:col-span-5">
                    <span className="cap-word inline-block font-display text-[clamp(2rem,4.6vw,4.4rem)] font-light leading-none tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-3 md:group-hover:translate-x-5">
                      <span className={i % 2 === 1 ? "italic" : ""}>{cap.word}</span>
                      <span className="text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">.</span>
                    </span>
                  </span>
                  <span className="col-span-10 col-start-3 text-sm leading-relaxed text-ink-2 transition-colors duration-500 group-hover:text-paper/80 md:col-span-5 md:col-start-7">
                    {cap.detail}
                  </span>
                  <span className="pointer-events-none absolute right-1 top-1/2 hidden -translate-y-1/2 opacity-0 transition-all duration-500 group-hover:rotate-90 group-hover:opacity-100 md:block">
                    <NodeGlyph className="h-9 w-9 text-paper/70" />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
