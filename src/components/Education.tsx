import { useEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib";
import { EDUCATION } from "../data";

export default function Education() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".edu-row").forEach((row) => {
        gsap.from(row.querySelectorAll(".edu-year > span"), {
          yPercent: 112,
          rotate: 3,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: row, start: "top 78%" },
        });
        gsap.from(row.querySelectorAll(".edu-detail"), {
          y: 26,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: row, start: "top 76%" },
        });
        /* years drift at different speeds while scrolling */
        gsap.to(row.querySelector(".edu-year"), {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="education" ref={ref} className="relative scroll-mt-20 border-t border-line bg-paper-2/60">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="mb-14 flex items-center gap-4 md:mb-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">06</span>
          <span className="h-px w-16 bg-line-2" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Education</span>
          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3 md:block">
            Two degrees, one direction
          </span>
        </div>

        <div>
          {EDUCATION.map((e, i) => (
            <div key={e.degree} className="edu-row grid grid-cols-1 items-end gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-8 md:py-16">
              <div className="md:col-span-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">
                  {i === 0 ? "Currently" : "Completed"}
                </p>
                <div className="edu-year mask-line mt-2">
                  <span
                    className={`block whitespace-nowrap font-display font-light leading-[0.9] tracking-[-0.02em] text-ink ${
                      i === 1 ? "text-outline" : ""
                    }`}
                    style={{ fontSize: "clamp(3.2rem, 9vw, 8.2rem)" }}
                  >
                    {e.years}
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 md:col-start-8">
                <h3 className="edu-detail font-display text-2xl font-light italic leading-snug text-ink md:text-3xl">
                  {e.degree}
                </h3>
                <p className="edu-detail mt-3 text-[15px] leading-relaxed text-ink-2">{e.school}</p>
                <p className="edu-detail mt-2 text-sm leading-relaxed text-ink-3">{e.note}</p>
                <p className="edu-detail mt-5 inline-block border border-line-2 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                  {e.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
