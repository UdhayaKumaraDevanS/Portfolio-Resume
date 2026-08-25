import { useEffect, useState } from "react";
import { gsap, ScrollTrigger, announceIntroDone, useReducedMotion } from "./lib";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Identity from "./components/Identity";
import Capabilities from "./components/Capabilities";
import SkillsField from "./components/SkillsField";
import Disciplines from "./components/Disciplines";
import CaseStudy from "./components/CaseStudy";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import About from "./components/About";
import Contact from "./components/Contact";
import { WordmarkDraw } from "./components/LogoArt";

/** UKD page opening — SVG loader inspired by PageOpeningSVG, then lifts away.
 *  Screen stays locked (overflow hidden) until the SVG draw + sheet lift finish.
 */
function Intro({ onGone }: { onGone: () => void }) {
  const reduced = useReducedMotion();
  const [gone, setGone] = useState(false);

  // Lock scroll while loader visible — hard unlock when gone.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (!gone) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
      window.scrollTo(0, 0);
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.overscrollBehavior = "";
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    return () => {
      // fail-safe: always clear on unmount
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.overscrollBehavior = "";
    };
  }, [gone]);

  // fail-safe: force unlock after 3.2s even if GSAP stalls
  useEffect(() => {
    if (gone) return;
    const t = window.setTimeout(() => {
      if (!gone) {
        // eslint-disable-next-line no-console
        console.warn("Intro fail-safe unlock");
        setGone(true);
        onGone();
        announceIntroDone();
      }
    }, 3400);
    return () => window.clearTimeout(t);
  }, [gone, onGone]);

  useEffect(() => {
    if (reduced) {
      announceIntroDone();
      setGone(true);
      onGone();
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // lift finished — now unlock happens via the effect above, then announce
          announceIntroDone();
          setGone(true);
          onGone();
        },
      });
      // Stepped U/K/D signature pattern, full name and Portfolio subtitle
      tl.from(".intro-topbar > *", { y: 10, opacity: 0, duration: 0.55, stagger: 0.07, ease: "power3.out" }, 0.08)
        .fromTo(
          ".intro-progress > span",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.65, ease: "power2.inOut", transformOrigin: "left center" },
          0.22
        )
        .to(".intro-count", { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.6)
        .to(".intro-sheet", { yPercent: -100, duration: 0.88, ease: "power4.inOut" }, 2.3);
    });
    return () => ctx.revert();
  }, [reduced, onGone]);

  if (gone) return null;

  return (
    <div className="intro-sheet fixed inset-0 z-[110] flex flex-col bg-paper text-ink" aria-hidden="true">
      {/* Top micro metadata bar */}
      <div className="intro-topbar grid w-full grid-cols-6 items-center border-b border-line px-5 py-3 font-mono text-[9px] uppercase tracking-[0.22em] font-medium md:grid-cols-12 md:px-10">
        <div className="col-span-3 flex items-center gap-2.5 md:col-span-4">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-ink-2">TAB · 01</span>
        </div>
        <div className="col-span-1 text-center font-display text-[13px] font-light italic normal-case tracking-tight md:col-span-4">
          Introduction
        </div>
        <div className="col-span-2 text-right text-ink-3 md:col-span-4">UKD ©2026</div>
      </div>

      {/* Center stepped UKD signature pattern */}
      <div className="flex flex-1 items-center justify-center px-6 py-6 md:px-10">
        <WordmarkDraw
          stroke="rgba(27,25,21,0.92)"
          className="h-auto w-full max-w-[460px] drop-shadow-[0_1px_0_rgba(0,0,0,0.04)] md:max-w-[520px]"
        />
      </div>

      {/* footer meta + progress */}
      <div className="px-5 pb-6 md:px-10 md:pb-8">
        <div className="mb-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3">
          <span className="intro-count opacity-0">Udhaya Kumara Devan S — 01 / 10</span>
          <span className="hidden md:block">Chennai, 13.08° N / 80.27° E — MCA 2024–26</span>
          <span className="md:hidden">Chennai, India</span>
        </div>
        <div className="intro-progress relative h-px w-full overflow-hidden bg-line">
          <span className="absolute inset-0 block origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [introGone, setIntroGone] = useState(false);

  // hard unlock at App level too — guarantees scroll after loader
  useEffect(() => {
    if (introGone) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
      ScrollTrigger.refresh();
    }
  }, [introGone]);

  /* keep ScrollTrigger honest once media/fonts settle */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    const t = window.setTimeout(refresh, 1200);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="grain relative min-h-screen bg-paper text-ink">
      <Cursor />
      <Intro onGone={() => setIntroGone(true)} />
      <Nav />
      <main>
        <Hero />
        <Identity />
        <Capabilities />
        <SkillsField />
        <Disciplines />
        <CaseStudy />
        <Experience />
        <Education />
        <Certifications />
        <About />
        <Contact />
      </main>

      {/* end-of-page whisper */}
      <p className="sr-only">End of portfolio. Contact: udhayakumaradevan@gmail.com, +91 7695931468, Chennai, Tamil Nadu, India.</p>

      {/* keep the intro flag observable for future transitions */}
      <span className="sr-only">{introGone ? "ready" : "loading"}</span>
    </div>
  );
}
