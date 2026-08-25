import { useEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib";
import { PROJECT } from "../data";
import SystemGraph from "./SystemGraph";

/* abstract node glyphs for the system flow */
function UserGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="24" cy="19" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 38c2.5-6 7-9 12-9s9.5 3 12 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function KeyGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="34" height="34" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="21" cy="24" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M27 24h12M35 24v5M39 24v3.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function AppGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden="true">
      <rect x="7" y="9" width="34" height="30" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 17h34" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 24h16M12 29h10" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11.5" cy="13" r="1.3" fill="currentColor" />
      <circle cx="16" cy="13" r="1.3" fill="currentColor" />
    </svg>
  );
}
function DbGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden="true">
      <ellipse cx="24" cy="12" rx="15" ry="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 12v24c0 3 6.7 5.5 15 5.5S39 39 39 36V12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 24c0 3 6.7 5.5 15 5.5S39 27 39 24" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const NODES = [
  { label: "User", glyph: <UserGlyph />, sub: "signs in" },
  { label: "Authentication", glyph: <KeyGlyph />, sub: "verifies access" },
  { label: "Application", glyph: <AppGlyph />, sub: "Node.js / JS" },
  { label: "Database", glyph: <DbGlyph />, sub: "MongoDB" },
];

export default function CaseStudy() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.set(".cs-head-inner", { opacity: 0, y: 34 });
      gsap.set(".cs-title-line", { yPercent: 114 });
      gsap.set(".cs-sub", { opacity: 0, y: 18 });
      gsap.set(".cs-browser-inner", { opacity: 0, y: 60, scale: 0.9 });
      gsap.set(".cs-resp-inner", { opacity: 0 });
      gsap.set(".cs-resp-item", { opacity: 0, x: 34 });
      gsap.set(".cs-flow-inner", { opacity: 0, y: 36 });
      gsap.set(".cs-node", { opacity: 0, scale: 0.85 });
      gsap.set(".cs-line", { scaleX: 0 });
      gsap.set(".cs-packet", { opacity: 0 });
      gsap.set(".cs-caption", { opacity: 0, y: 12 });
      gsap.set(".cs-end-inner", { opacity: 0, y: 26 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.55 },
      });

      /* — 1 · title — */
      tl.to(".cs-head-inner", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(".cs-title-line", { yPercent: 0, duration: 0.85, stagger: 0.13, ease: "power4.out" }, 0.1)
        .to(".cs-sub", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 0.75);

      /* — 2 · browser composition — */
      tl.to(".cs-head-inner", { opacity: 0, y: -46, duration: 0.5, ease: "power2.in" }, 1.35)
        .to(".cs-browser-inner", { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" }, 1.55);

      /* — 3 · responsibilities join — */
      tl.to(".cs-browser-inner", { xPercent: -6, scale: 0.93, duration: 0.7, ease: "power2.inOut" }, 2.6)
        .to(".cs-resp-inner", { opacity: 1, duration: 0.4 }, 2.75)
        .to(".cs-resp-item", { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: "power2.out" }, 2.85);

      /* — 4 · system flow — */
      tl.to(".cs-browser-inner, .cs-resp-inner", { opacity: 0, y: -40, duration: 0.5, ease: "power2.in" }, 4.0)
        .to(".cs-flow-inner", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 4.25)
        .to(".cs-node", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: "back.out(2)" }, 4.4)
        .to(".cs-line", { scaleX: 1, duration: 0.5, stagger: 0.12, ease: "power2.inOut" }, 4.6)
        .to(".cs-packet", { opacity: 1, duration: 0.08 }, 5.0)
        .to(".cs-packet", { x: 120, duration: 0.85, stagger: 0.12, ease: "none" }, 5.05)
        .to(".cs-packet", { opacity: 0, duration: 0.12 }, 5.95)
        .to(".cs-caption", { opacity: 1, y: 0, duration: 0.4 }, 5.4);

      /* — 5 · release — */
      tl.to(".cs-flow-inner", { opacity: 0, y: -36, duration: 0.5, ease: "power2.in" }, 6.5)
        .to(".cs-end-inner", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 6.8);

      /* the network keeps turning underneath the whole film */
      tl.to(".cs-graph", { rotate: 60, scale: 1.2, transformOrigin: "50% 50%", ease: "none", duration: 7.4 }, 0);
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });
      gsap.from(".cs-title-line", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: ".cs-head-inner", start: "top 82%" },
      });
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section id="work" className="relative scroll-mt-20 border-t border-line" aria-label="Selected work — Bommi Enterprises">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between px-5 pt-10 md:px-10 md:pt-14">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">04</span>
          <span className="h-px w-16 bg-line-2" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Selected work</span>
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3 md:block">
          One project — documented properly
        </p>
      </div>

      <div ref={wrapRef} className="relative mt-4 lg:h-[640vh]">
        <div className="relative lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          {/* ambient sculpture */}
          <div className="cs-graph pointer-events-none absolute inset-[-14%] text-ink opacity-50" aria-hidden="true">
            <SystemGraph seed={53} density={0.8} pulses={!reduced} />
          </div>

          {/* stage */}
          <div className="relative mx-auto h-full max-w-[1600px] px-5 md:px-10">
            {/* ---- 1 · title ---- */}
            <div className="cs-head relative flex min-h-[70vh] items-center pt-10 lg:absolute lg:inset-0 lg:left-[7%] lg:min-h-0 lg:w-[72%] lg:pt-0">
              <div className="cs-head-inner" data-reveal>
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">
                  01 <span className="text-line-2">/</span> Selected Work
                </p>
                <h2 className="mt-6 font-display font-light uppercase leading-[0.88] tracking-[-0.01em] text-ink" style={{ fontSize: "clamp(3.4rem, 10.5vw, 10.5rem)" }}>
                  <span className="mask-line">
                    <span className="cs-title-line whitespace-nowrap">Bommi</span>
                  </span>
                  <span className="mask-line pl-[8vw]">
                    <span className="cs-title-line text-outline whitespace-nowrap">Enterprises</span>
                  </span>
                </h2>
                <div className="cs-sub mt-7 flex flex-wrap items-center gap-4">
                  <span className="font-display text-xl italic text-ink md:text-2xl">E-Commerce Website</span>
                  <span className="hidden h-px w-14 bg-line-2 md:block" aria-hidden="true" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
                    Support · Testing · Maintenance
                  </span>
                </div>
                <ul className="cs-sub mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
                  {PROJECT.stack.map((t) => (
                    <li key={t} className="border border-line-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---- 2 · browser abstraction ---- */}
            <div className="cs-browser relative mb-16 mt-4 lg:absolute lg:left-[6%] lg:top-1/2 lg:mb-0 lg:mt-0 lg:w-[47%] lg:-translate-y-1/2">
              <div className="cs-browser-inner" data-reveal>
                <div className="border border-ink/25 bg-paper">
                  <div className="flex h-9 items-center gap-2 border-b border-line px-3">
                    <span className="h-2 w-2 rounded-full border border-ink/30" aria-hidden="true" />
                    <span className="h-2 w-2 rounded-full border border-ink/30" aria-hidden="true" />
                    <span className="h-2 w-2 rounded-full border border-ink/30" aria-hidden="true" />
                    <span className="mx-auto font-mono text-[9px] tracking-[0.18em] text-ink-2">
                      https://{PROJECT.domain}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.18em] text-accent">TLS</span>
                  </div>
                  <div className="p-5 md:p-7">
                    <div className="flex items-baseline justify-between border-b border-line pb-3">
                      <span className="font-display text-lg italic">Bommi</span>
                      <div className="flex gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-2">
                        <span>Shop</span>
                        <span>Account</span>
                        <span>Cart · 0</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-5 py-6">
                      <div className="col-span-3">
                        <p className="font-display text-2xl leading-tight text-ink md:text-3xl">
                          Everyday goods, <span className="italic text-accent-deep">delivered.</span>
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="h-px w-4/5 bg-line-2" aria-hidden="true" />
                          <div className="h-px w-3/5 bg-line-2" aria-hidden="true" />
                        </div>
                        <span className="mt-5 inline-flex items-center gap-2 border border-ink px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink">
                          Add to cart <span className="text-accent">→</span>
                        </span>
                      </div>
                      <div className="col-span-2 grid grid-rows-2 gap-3">
                        <div className="relative bg-paper-3">
                          <span className="absolute right-2 top-2 h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                        </div>
                        <div className="bg-paper-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-line pt-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i}>
                          <div className={`aspect-[4/3] ${i === 1 ? "bg-paper-2" : "bg-paper-3"}`} />
                          <div className="mt-2 h-px w-3/4 bg-line-2" aria-hidden="true" />
                          <div className="mt-1.5 h-px w-1/3 bg-line" aria-hidden="true" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-right font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">
                  Fig. 01 — interface abstraction, no screenshots supplied
                </p>
              </div>
            </div>

            {/* ---- 3 · responsibilities ---- */}
            <div className="cs-resp relative mb-16 lg:absolute lg:right-[6%] lg:top-1/2 lg:mb-0 lg:w-[41%] lg:-translate-y-1/2">
              <div className="cs-resp-inner" data-reveal>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Responsibility</p>
                <h3 className="mt-3 font-display text-3xl font-light italic leading-tight text-ink md:text-4xl">
                  Support &amp; maintenance, end to end.
                </h3>
                <ul className="mt-7">
                  {PROJECT.responsibilities.map((r, i) => (
                    <li key={i} className="cs-resp-item flex items-baseline gap-4 border-t border-line py-3.5 last:border-b">
                      <span className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-relaxed text-ink-2">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---- 4 · system flow ---- */}
            <div className="cs-flow relative flex min-h-[70vh] items-center lg:absolute lg:inset-x-[6%] lg:top-1/2 lg:min-h-0 lg:-translate-y-1/2">
              <div className="cs-flow-inner w-full" data-reveal>
                <p className="mb-10 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">
                  Fig. 02 — how the system holds together
                </p>
                <div className="flex flex-col items-stretch gap-0 md:flex-row md:items-center md:gap-0">
                  {NODES.map((n, i) => (
                    <div key={n.label} className="contents">
                      <div className="cs-node flex flex-row items-center gap-4 md:flex-1 md:flex-col md:gap-4 md:text-center">
                        <span className="text-ink">{n.glyph}</span>
                        <span>
                          <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink">{n.label}</span>
                          <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">{n.sub}</span>
                        </span>
                      </div>
                      {i < NODES.length - 1 && (
                        <div className="relative ml-6 h-10 w-px md:ml-0 md:h-px md:w-auto md:flex-1 md:self-center">
                          <span className="cs-line absolute inset-0 origin-top bg-line-2 md:origin-left" aria-hidden="true" />
                          <span
                            className="cs-packet absolute left-1/2 top-0 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-accent md:left-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="cs-caption mt-10 max-w-[52ch] text-sm leading-relaxed text-ink-2">
                  Authentication guards the door; the application serves the shop; MongoDB keeps the ledger. My work sat
                  across all four — configuring, testing, and resolving so the path never breaks.
                </p>
              </div>
            </div>

            {/* ---- 5 · release ---- */}
            <div className="cs-end pointer-events-none relative flex min-h-[50vh] items-center justify-center lg:absolute lg:inset-0 lg:min-h-0">
              <div className="cs-end-inner text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-3">End of case study</p>
                <p className="mt-4 font-display text-3xl font-light italic text-ink md:text-5xl">
                  Next — technical experience <span className="not-italic text-accent">↓</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
