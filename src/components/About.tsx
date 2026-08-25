import { useEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-line > span", {
        yPercent: 114,
        rotate: 3,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".about-statement", start: "top 76%" },
      });
      gsap.from(".about-copy > *", {
        y: 26,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".about-copy", start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="about" ref={ref} className="relative scroll-mt-20 overflow-hidden border-t border-line bg-paper-2/50">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">08</span>
          <span className="h-px w-16 bg-line-2" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">About</span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-14 md:mt-20 md:grid-cols-12 md:gap-8">
          <h2
            className="about-statement font-display font-light uppercase leading-[0.95] tracking-[-0.01em] text-ink md:col-span-8"
            style={{ fontSize: "clamp(2.6rem, 6.2vw, 6rem)" }}
          >
            <span className="about-line mask-line">
              <span>Technical thinking.</span>
            </span>
            <span className="about-line mask-line pl-[7vw]">
              <span className="italic">
                Human problem solving<span className="not-italic text-accent">.</span>
              </span>
            </span>
          </h2>

          <div className="about-copy flex flex-col gap-7 md:col-span-4 md:pt-6">
            <p className="text-[15px] leading-relaxed text-ink-2">
              I combine technical learning with practical troubleshooting — the kind you only get from sitting with a
              problem until it's genuinely resolved. Communication, adaptability and continuous learning aren't soft
              extras; they're how support actually gets delivered.
            </p>
            <p className="text-[15px] leading-relaxed text-ink-2">
              Based in Chennai, completing my MCA, and looking for a team where careful, efficient support is valued as
              much as the fix itself.
            </p>
            <p className="font-mono text-[10px] uppercase leading-loose tracking-[0.22em] text-ink-3">
              Quick learner · clear communicator
              <br />
              calm under a broken system
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
