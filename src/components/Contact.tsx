import { useEffect, useRef } from "react";
import { gsap, useReducedMotion, useIsTouch, scrollToId } from "../lib";
import { PROFILE } from "../data";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const btnInnerRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-line > span", {
        yPercent: 114,
        rotate: 3,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.13,
        scrollTrigger: { trigger: ".contact-head", start: "top 76%" },
      });
      gsap.from(".contact-row", {
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".contact-rows", start: "top 85%" },
      });
      gsap.from(".contact-cta", {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-cta", start: "top 88%" },
      });
      gsap.from(".footer-line > span", {
        yPercent: 112,
        duration: 1,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".site-footer", start: "top 92%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  /* magnetic CTA */
  useEffect(() => {
    if (reduced || touch) return;
    const btn = btnRef.current;
    const inner = btnInnerRef.current;
    if (!btn || !inner) return;
    const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
    const ixTo = gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3" });
    const iyTo = gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
      xTo(Math.max(-16, Math.min(16, dx)));
      yTo(Math.max(-16, Math.min(16, dy)));
      ixTo(Math.max(-8, Math.min(8, dx * 0.5)));
      iyTo(Math.max(-8, Math.min(8, dy * 0.5)));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      ixTo(0);
      iyTo(0);
    };
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, touch]);

  return (
    <section id="contact" ref={ref} className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-24 md:px-10 md:pt-36">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">09</span>
          <span className="h-px w-16 bg-line-2" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Contact</span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-16 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2
              className="contact-head font-display font-light uppercase leading-[0.92] tracking-[-0.01em] text-ink"
              style={{ fontSize: "clamp(3rem, 8.5vw, 8rem)" }}
            >
              <span className="contact-line mask-line">
                <span>Let's solve</span>
              </span>
              <span className="contact-line mask-line pl-[9vw]">
                <span className="italic">
                  something<span className="not-italic text-accent">.</span>
                </span>
              </span>
            </h2>

            <div className="contact-rows mt-14 max-w-xl">
              <a
                href={`mailto:${PROFILE.email}`}
                data-cursor="EMAIL"
                className="contact-row group flex items-baseline justify-between gap-6 border-t border-line py-5"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Email</span>
                <span className="link-line text-right font-display text-lg italic text-ink transition-colors group-hover:text-accent-deep md:text-2xl">
                  {PROFILE.email}
                </span>
              </a>
              <a
                href={PROFILE.phoneHref}
                data-cursor="CALL"
                className="contact-row group flex items-baseline justify-between gap-6 border-t border-line py-5"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Phone</span>
                <span className="link-line font-display text-lg italic text-ink transition-colors group-hover:text-accent-deep md:text-2xl">
                  {PROFILE.phone}
                </span>
              </a>
              <div className="contact-row flex items-baseline justify-between gap-6 border-t border-line py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Location</span>
                <span className="font-display text-lg italic text-ink md:text-2xl">{PROFILE.location}</span>
              </div>
              <div className="contact-row flex items-baseline justify-between gap-6 border-t border-b border-line py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">LinkedIn</span>
                <span className="text-sm text-ink-2">Profile shared on request</span>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-start md:col-span-4 md:justify-end md:pt-10">
            <a
              ref={btnRef}
              href={`mailto:${PROFILE.email}?subject=Technical%20Support%20opportunity`}
              data-cursor="EMAIL"
              className="contact-cta group relative flex h-44 w-44 items-center justify-center rounded-full border border-ink transition-colors duration-500 hover:bg-ink md:h-52 md:w-52"
              aria-label="Get in touch by email"
            >
              <span className="absolute inset-2 rounded-full border border-line-2 transition-transform duration-500 group-hover:scale-95" aria-hidden="true" />
              <span ref={btnInnerRef} className="flex flex-col items-center gap-2 text-center transition-colors duration-500 group-hover:text-paper">
                <span className="font-display text-xl italic">Get in touch</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink-2 transition-colors duration-500 group-hover:text-paper/70">
                  reply within 24h
                </span>
                <span className="text-accent">↗</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="site-footer border-t border-line">
        <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-14">
          <div className="footer-line overflow-hidden">
            <span
              className="block select-none whitespace-nowrap font-display font-light uppercase leading-none tracking-[-0.01em] text-ink"
              style={{ fontSize: "clamp(2rem, 7.4vw, 7rem)" }}
            >
              Udhaya Kumara Devan <span className="text-outline">S</span>
            </span>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3">
            <span>© {new Date().getFullYear()} Udhaya Kumara Devan S</span>
            <span className="hidden items-center gap-2 md:flex">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent blink-dot" aria-hidden="true" />
              Systems nominal — Chennai, {PROFILE.coords}
            </span>
            <button onClick={() => scrollToId("top")} data-cursor="TOP" className="link-line text-ink-2 hover:text-ink">
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
