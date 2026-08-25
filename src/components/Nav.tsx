import { useEffect, useState } from "react";
import { ScrollTrigger, scrollToId } from "../lib";
import { NAV_ITEMS, SECTIONS } from "../data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("top");
  const [open, setOpen] = useState(false);

  /* scroll state */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active-section indicator */
  useEffect(() => {
    const triggers = SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setActive(s.id);
        },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  /* body scroll lock while the menu is open — respects intro lock */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const hasIntro = !!document.querySelector(".intro-sheet");
    if (open) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      // only clear if intro is gone; otherwise keep hidden
      if (!hasIntro) {
        body.style.overflow = "";
        html.style.overflow = "";
      }
    }
    return () => {
      if (!document.querySelector(".intro-sheet")) {
        body.style.overflow = "";
        // don't force html if intro still present
        if (!hasIntro) html.style.overflow = "";
      }
    };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (target: string) => {
    setOpen(false);
    /* wait a beat so the menu sheet can start lifting */
    window.setTimeout(() => scrollToId(target), open ? 250 : 0);
  };

  const current = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
          scrolled ? "border-b border-line bg-paper/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[56px] max-w-[1600px] items-center justify-between px-5 md:h-[64px] md:px-10">
          <div className="flex items-center gap-8 md:gap-14">
            <button
              onClick={() => go("top")}
              className="font-serif text-[24px] font-normal leading-none tracking-tight text-[#1b1915] md:text-[28px]"
              aria-label="Back to top"
            >
              <span>UKD</span>
            </button>

            {/* section indicator — ● 01 / INTRODUCTION */}
            <div className="hidden items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#2f5a46] md:flex">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2f5a46]" aria-hidden="true" />
              <span className="tabular-nums font-semibold">{current?.index ?? "01"}</span>
              <span className="text-[#9faaa4]">/</span>
              <span className="font-semibold">{current?.label ?? "INTRODUCTION"}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <nav aria-label="Primary" className="hidden items-center gap-6 lg:gap-8 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.target;
                return (
                  <button
                    key={item.target}
                    onClick={() => go(item.target)}
                    data-cursor="OPEN"
                    className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                      isActive ? "text-[#2f5a46] font-bold" : "text-[#5a6a62] hover:text-[#1b1915]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* desktop hamburger circular like screenshot */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#e3dcd0]/70 text-[#1b1915] backdrop-blur-xs transition-colors hover:bg-[#d9d0c2] md:inline-flex"
            >
              <span className="flex flex-col gap-[4px]" aria-hidden="true">
                <span className={`block h-px w-4 bg-[#1b1915] transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`block h-px w-4 bg-[#1b1915] transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
                <span className={`block h-px w-4 bg-[#1b1915] transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>

            {/* mobile menu toggle */}
            <button
              className="flex flex-col items-end gap-[5px] py-2 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className={`h-px w-6 bg-[#1b1915] transition-transform duration-500 ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-4 bg-[#1b1915] transition-all duration-500 ${open ? "w-6 -translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- mobile menu sheet ---------- */}
      <div
        className={`fixed inset-0 z-[75] flex flex-col justify-between bg-paper-2 px-6 pb-8 pt-24 transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden ${
          open ? "[clip-path:inset(0_0_0%_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.target}
              onClick={() => go(item.target)}
              tabIndex={open ? 0 : -1}
              className={`group flex items-baseline gap-4 border-b border-line py-4 text-left transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink-2">0{i + 1}</span>
              <span className="font-display text-4xl italic tracking-tight text-ink group-active:text-accent">
                {item.label.startsWith("Udhaya") ? "Introduction" : item.label}
              </span>
            </button>
          ))}
        </nav>
        <div
          className={`flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2 transition-opacity duration-700 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>Chennai, India</span>
          <span>MCA 2024–26</span>
        </div>
      </div>

      {/* ---------- desktop overlay menu (three-line button) ---------- */}
      <div
        className={`fixed inset-0 z-[75] hidden flex-col bg-paper px-10 pb-10 pt-28 md:flex ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        } transition-opacity duration-500`}
        aria-hidden={!open}
      >
        {/* backdrop click area — clicking empty closes */}
        <button
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className="absolute inset-0"
          style={{ cursor: open ? "pointer" : "default" }}
        />
        <div className="relative flex flex-1 flex-col justify-center">
          <nav aria-label="Desktop" className="mx-auto w-full max-w-[1100px]">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item, i) => (
                <li
                  key={item.target}
                  className={`border-b border-line last:border-b-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${80 + i * 70}ms` : "0ms" }}
                >
                  <button
                    onClick={() => go(item.target)}
                    tabIndex={open ? 0 : -1}
                    data-cursor="GO"
                    className="group flex w-full items-baseline justify-between py-6 text-left md:py-7"
                  >
                    <span className="flex items-baseline gap-6">
                      <span className="font-mono text-[11px] tracking-[0.24em] text-ink-3 tabular-nums">0{i + 1}</span>
                      <span className="font-display text-[clamp(2.2rem,4.4vw,4.1rem)] font-light leading-none tracking-tight text-ink transition-colors group-hover:text-[#1a312b] group-hover:italic">
                        {item.label.startsWith("Udhaya") ? "Introduction" : item.label}
                      </span>
                    </span>
                    <span className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3 transition-all duration-300 group-hover:gap-4 group-hover:text-ink md:flex">
                      <span className="hidden md:block">{SECTIONS.find((s) => s.id === item.target)?.label ?? ""}</span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                        ↗
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div
          className={`relative flex items-center justify-between border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2 transition-opacity duration-700 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: open ? "520ms" : "0ms" }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2f5a46]" aria-hidden="true" />
            Chennai, India — Available for opportunities
          </span>
          <span className="hidden md:block">MCA 2024–26 — Technical Support</span>
          <button
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="link-line hidden md:block"
          >
            Close ×
          </button>
        </div>
      </div>
    </>
  );
}
