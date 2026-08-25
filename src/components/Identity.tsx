import { useEffect, useRef } from "react";
import { gsap, useReducedMotion, splitWords } from "../lib";

const STATEMENT = "I solve problems by understanding how systems work.";
const EMPHASIS = new Set(["systems", "work."]);

const DOMAINS = [
  "Troubleshooting",
  "Installation & Configuration",
  "Hardware Support",
  "End-User Support",
  "Windows",
  "Linux",
  "Remote Support",
];

export default function Identity() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".identity-word > span", {
        yPercent: 118,
        rotate: 4,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.028,
        scrollTrigger: { trigger: ".identity-statement", start: "top 78%", toggleActions: "play none none reverse" },
      });
      gsap.from(".identity-aside > *", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".identity-aside", start: "top 82%", toggleActions: "play none none reverse" },
      });
      gsap.from(".identity-domain", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.05,
        scrollTrigger: { trigger: ".identity-domains", start: "top 90%", toggleActions: "play none none reverse" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="identity" ref={ref} className="relative scroll-mt-24">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
        {/* kicker */}
        <div className="mb-14 flex items-center gap-4 md:mb-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">01</span>
          <span className="h-px w-16 bg-line-2" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Identity</span>
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
          {/* the statement */}
          <h2
            className="identity-statement font-display text-[clamp(2.5rem,5.6vw,5.4rem)] font-light leading-[1.02] tracking-[-0.01em] text-ink md:col-span-8"
          >
            {splitWords(STATEMENT).map(({ word, trailing }, i) => (
              <span key={i} className="identity-word inline-block overflow-hidden pb-[0.08em] align-top">
                <span
                  className={`inline-block will-change-transform ${EMPHASIS.has(word) ? "italic text-accent-deep" : ""}`}
                >
                  {word}
                  {trailing ? "\u00A0" : ""}
                </span>
              </span>
            ))}
          </h2>

          {/* supporting column */}
          <div className="identity-aside flex flex-col gap-8 md:col-span-4 md:pt-4">
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-ink-2">
              I'm Udhaya Kumara Devan — an MCA student oriented toward technical support. My practice covers
              troubleshooting, software installation &amp; configuration, hardware support, and desktop &amp; end-user
              support across Windows and Linux, including remote sessions.
            </p>
            <div className="border-l border-line-2 pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Objective</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                An entry-level technical support role — efficient support for users, continuous learning for me.
              </p>
            </div>
            <p className="text-sm leading-relaxed text-ink-2">
              A quick learner with strong communication and problem-solving skills, committed to growing inside a
              professional IT environment.
            </p>
          </div>
        </div>

        {/* domain strip */}
        <div className="identity-domains mt-16 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6 md:mt-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">In practice —</span>
          {DOMAINS.map((d) => (
            <span key={d} className="identity-domain flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">
              {d}
              <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
