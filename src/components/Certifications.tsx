import { useEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib";
import { CERTIFICATIONS } from "../data";

export default function Certifications() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".cert-row", {
        y: 34,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".cert-list", start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="certifications" ref={ref} className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">07</span>
            <span className="h-px w-16 bg-line-2" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Certifications</span>
          </div>
          <p className="max-w-[34ch] text-sm leading-relaxed text-ink-2">
            Six credentials — service desk, cloud, security and the web.
          </p>
        </div>

        <ol className="cert-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="border-t border-line last:border-b">
              <div className="cert-row group grid grid-cols-12 items-baseline gap-x-4 py-5 transition-colors duration-300 hover:bg-paper-2 md:py-6">
                <span className="col-span-2 origin-left font-display text-xl font-light tabular-nums text-ink-3 transition-all duration-500 ease-out group-hover:scale-[1.6] group-hover:text-accent md:col-span-1 md:text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-10 transition-transform duration-500 ease-out group-hover:translate-x-2 md:col-span-7">
                  <h3 className="font-display text-lg font-light leading-snug text-ink md:text-2xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-ink-2">{c.issuer}</p>
                </div>
                <span className="col-span-10 col-start-3 mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3 transition-colors duration-300 group-hover:text-accent md:col-span-3 md:col-start-10 md:mt-0 md:text-right">
                  {c.tag}
                  <span className="ml-3 inline-block translate-y-[1px] text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
