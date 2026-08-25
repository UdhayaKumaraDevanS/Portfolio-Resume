import { useEffect, useRef } from "react";
import { gsap, onIntroDone, isIntroDone, useReducedMotion } from "../lib";
import portraitCut from "../assets/1.png";
import portraitFallback from "../assets/portrait.jpg";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: "power4.out" }, paused: true });
      entrance
        .fromTo(".hero-decor", { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0)
        .fromTo(".hero-kicker", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.15)
        .fromTo(".hero-name .hero-name-line", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "power4.out" }, 0.25)
        .fromTo(".hero-sub", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }, 0.65)
        .fromTo(".hero-desc", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.8)
        .fromTo(".hero-cta > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" }, 0.95)
        .fromTo(".hero-portrait", { clipPath: "inset(0 0 100% 0)", opacity: 0 }, { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.2, ease: "power4.inOut" }, 0.4)
        .fromTo(".hero-portrait img", { scale: 1.06 }, { scale: 1, duration: 1.5, ease: "power3.out" }, 0.4)
        .fromTo(".hero-stepper > *", { x: 14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" }, 0.8)
        .fromTo(".hero-bottom", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 1.1);

      // Play entrance when intro completes, or immediately if intro is already done
      if (isIntroDone()) {
        entrance.play();
      } else {
        const off = onIntroDone(() => entrance.play());
        const timer = window.setTimeout(() => {
          entrance.play();
        }, 2000);

        return () => {
          off();
          window.clearTimeout(timer);
        };
      }

      // Parallax scrolling
      gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 },
      })
        .to(".hero-name", { yPercent: -8, ease: "none" }, 0)
        .to(".hero-portrait", { yPercent: 8, ease: "none" }, 0)
        .to(".hero-portrait img", { yPercent: -4, scale: 1.03, ease: "none" }, 0)
        .to(".hero-decor", { yPercent: 6, rotate: 1, ease: "none" }, 0)
        .to(".hero-kicker, .hero-sub, .hero-desc, .hero-cta", { yPercent: -6, opacity: 0.7, ease: "none" }, 0);
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-visible bg-[#f4eee2] lg:min-h-screen"
    >
      {/* Decorative architectural background circle & vertex node dots */}
      <div className="hero-decor pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Main large circle centered on the standing figure */}
        <div
          className="absolute left-[70%] top-[38%] hidden h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2f5a46]/25 lg:block xl:h-[680px] xl:w-[680px]"
        >
          {/* Node dots on perimeter */}
          <span className="absolute -top-1 left-[24%] h-2.5 w-2.5 rounded-full bg-[#2f5a46]" />
          <span className="absolute top-[48%] -left-1.5 h-2.5 w-2.5 rounded-full bg-[#2f5a46]" />
          <span className="absolute top-[78%] right-[14%] h-2.5 w-2.5 rounded-full bg-[#2f5a46]" />
        </div>

        {/* Floating geometric accent glyphs */}
        <span className="absolute left-[47%] top-[30%] font-mono text-[16px] font-light text-[#5a6a62]/60 select-none max-lg:hidden">
          +
        </span>
        <span className="absolute right-[21%] top-[18%] h-2.5 w-2.5 rounded-full border border-[#5a6a62]/60 max-lg:hidden" />
        <span className="absolute right-[11%] top-[29%] h-2 w-2 rounded-full bg-[#2f5a46]/70 max-lg:hidden" />
        <span className="absolute right-[11%] top-[38%] h-2 w-2 rotate-45 border border-[#5a6a62]/60 max-lg:hidden" />
        <span className="absolute left-[49%] top-[16%] h-1.5 w-1.5 rounded-full bg-[#2f5a46]/80 max-lg:hidden" />
        <span className="absolute left-[58%] top-[23%] h-2 w-2 rounded-full bg-[#2f5a46]/80 max-lg:hidden" />
        <span className="absolute left-[56%] top-[47%] h-2 w-2 rounded-full bg-[#2f5a46]/80 max-lg:hidden" />
        <span className="absolute left-[67%] top-[12%] h-1.5 w-1.5 rounded-full bg-[#2f5a46]/80 max-lg:hidden" />
        <span className="absolute right-[12%] top-[63%] h-2 w-2 rounded-full bg-[#2f5a46]/80 max-lg:hidden" />
        <span className="absolute right-[20%] top-[76%] h-1.5 w-1.5 rounded-full bg-[#2f5a46]/80 max-lg:hidden" />
        <span className="absolute left-[47%] top-[85%] h-1.5 w-1.5 rounded-full bg-[#2f5a46]/80 max-lg:hidden" />
      </div>

      {/* Subtle vertical architectural guides */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[4%] hidden w-px bg-[#8ea498]/25 lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[4%] hidden w-px bg-[#8ea498]/25 lg:block" />

      {/* Main Content Shell */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pb-6 pt-[74px] md:px-10 md:pb-8 md:pt-[84px]">
        <div className="flex flex-1 flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          
          {/* LEFT: Typography & Information */}
          <div className="flex flex-1 flex-col justify-center py-4 lg:w-[54%] lg:max-w-[760px] lg:py-6">
            
            {/* Kicker */}
            <p className="hero-kicker inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#55645d] font-semibold">
              <span className="inline-block h-2 w-2 rounded-full bg-[#2f5a46]" aria-hidden="true" />
              Technical Support Professional
            </p>

            {/* Stacked Name with Stepped Borders - Extended with generous spacing */}
            <div className="hero-name mt-6 select-none font-serif font-light leading-[0.90] tracking-[-0.015em] text-[#1b1915] md:mt-8">
              <h1 className="sr-only">Udhaya Kumara Devan S — Technical Support, MCA student, problem solver.</h1>
              <div aria-hidden="true" className="flex flex-col items-start gap-1">
                <div className="hero-name-line relative border-b border-[#8ea498] pr-10 pb-2 md:pr-20 lg:pr-24">
                  <span className="block whitespace-nowrap text-[clamp(3rem,6.2vw,5.75rem)] leading-none font-normal">
                    Udhaya
                  </span>
                </div>
                <div className="hero-name-line -mt-px ml-[18%] flex border-b border-l border-[#8ea498] pl-5 pr-10 pt-1 pb-2 md:ml-[20%] md:pl-8 md:pr-20 lg:pr-24">
                  <span className="block whitespace-nowrap text-[clamp(3rem,6.2vw,5.75rem)] leading-none font-normal">
                    Kumara
                  </span>
                </div>
                <div className="hero-name-line -mt-px ml-[36%] flex border-b border-l border-[#8ea498] pl-5 pr-10 pt-1 pb-2 md:ml-[40%] md:pl-8 md:pr-20 lg:pr-24">
                  <span className="block whitespace-nowrap text-[clamp(3rem,6.2vw,5.75rem)] leading-none font-normal">
                    Devan S
                  </span>
                </div>
              </div>
            </div>

            {/* Subtitle & Focus Badges */}
            <div className="hero-sub mt-7 md:mt-8">
              <p className="font-mono text-[11.5px] font-bold uppercase tracking-[0.20em] text-[#1b1915]">
                MCA STUDENT
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#55645d]">
                <span>Problem Solver</span>
                <span className="h-1 w-1 rounded-full bg-[#2f5a46]" aria-hidden="true" />
                <span>Quick Learner</span>
                <span className="h-1 w-1 rounded-full bg-[#2f5a46]" aria-hidden="true" />
                <span>Technical Support</span>
              </p>
            </div>

            {/* Description */}
            <p className="hero-desc mt-5 max-w-[52ch] text-[13.5px] leading-[1.75] text-[#4a5a54] md:text-[14.5px]">
              MCA student with a strong foundation in troubleshooting, system support, and user assistance. Passionate
              about solving problems and delivering reliable{" "}
              <span className="font-medium text-[#244e3d]">technical solutions.</span>
            </p>

            {/* CTAs */}
            <div className="hero-cta mt-8 flex flex-wrap items-center gap-6 md:mt-9">
              <button
                onClick={() => scrollTo("work")}
                data-cursor="VIEW"
                className="group inline-flex items-center gap-3.5 rounded-[4px] bg-[#2a4d3f] px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.20em] text-white shadow-sm transition-all duration-300 hover:bg-[#203c31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a4d3f]"
              >
                <span>View My Work</span>
                <span className="inline-block text-[13px] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
              
              <a
                href="/resume.pdf"
                download
                data-cursor="FILE"
                className="inline-flex items-center gap-2.5 border-b border-[#1b1915] pb-1 font-mono text-[11px] uppercase tracking-[0.20em] text-[#1b1915] transition-colors hover:text-[#2a4d3f] hover:border-[#2a4d3f]"
              >
                <span>Download Resume</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 4v12M8 12l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Bottom Metadata */}
            <div className="hero-bottom mt-8 flex items-center gap-3 pt-2 md:mt-10">
              <svg width="13" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[#2f5a46]" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <p className="flex flex-wrap items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.20em] text-[#55645d]">
                <span>Chennai, Tamil Nadu</span>
                <span className="h-3 w-px bg-[#8ea498]/60" aria-hidden="true" />
                <span>Available for opportunities</span>
              </p>
            </div>
          </div>

          {/* RIGHT: Standing Portrait & Vertical Stepper */}
          <div className="hero-side relative mt-6 flex flex-1 items-center justify-center lg:mt-0 lg:w-[46%]">
            
            {/* Subtle atmospheric stipple field behind the transparent cutout */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[46%] h-[580px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-[40%_60%_55%_45%_/_48%_44%_56%_52%] bg-[radial-gradient(ellipse_at_center,_rgba(47,90,70,0.09)_0%,_rgba(142,164,152,0.06)_40%,_transparent_72%)] blur-[8px]"
            />

            {/* Portrait Image — slightly increased size */}
            <figure className="hero-portrait relative mx-auto flex w-full max-w-[440px] items-center justify-center overflow-visible lg:mx-0 lg:max-w-[520px] xl:max-w-[560px]">
              <img
                src={portraitCut}
                alt="Udhaya Kumara Devan S"
                className="relative z-10 h-auto max-h-[620px] w-full object-contain object-bottom drop-shadow-[0_18px_32px_rgba(27,25,21,0.18)] md:max-h-[680px] lg:max-h-[86vh] xl:max-h-[90vh]"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = portraitFallback;
                }}
              />
            </figure>

            {/* Vertical Stepper — Right Rail (Desktop) */}
            <div className="hero-stepper absolute right-[-24px] top-[42%] hidden -translate-y-1/2 flex-col items-start gap-6 lg:flex xl:right-[-36px]" aria-hidden="true">
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#2a4d3f]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#2a4d3f] font-semibold">
                  Observe
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full border border-[#2a4d3f] bg-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#2a4d3f] font-medium">
                  Analyze
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full border border-[#2a4d3f] bg-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#2a4d3f] font-medium">
                  Resolve
                </span>
              </div>
            </div>

            {/* Mobile Stepper */}
            <div className="mt-4 flex items-center justify-center gap-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#2a4d3f] lg:hidden" aria-hidden="true">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#2a4d3f]" /> Observe
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-[#2a4d3f]" /> Analyze
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-[#2a4d3f]" /> Resolve
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

