import { useLayoutEffect, useRef } from "react";
import anime from "animejs";
import { ScrollTrigger, mulberry32, useReducedMotion, clamp } from "../lib";
import { SKILL_GROUPS } from "../data";

type Slot = { x: number; y: number };

const WORDS = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ text: s, group: g.name })));

/**
 * Kinetic skills composition — Anime.js owns the motion here:
 * a scattered field of disciplines assembles into four editorial
 * groups as you scroll, breathes while idle, and springs on hover.
 */
export default function SkillsField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordEls = useRef<(HTMLSpanElement | null)[]>([]);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    let tl: ReturnType<typeof anime.timeline> | null = null;
    let ambient: ReturnType<typeof anime> | null = null;
    let scrub: ScrollTrigger | null = null;
    let io: IntersectionObserver | null = null;
    let resizeT = 0;
    let lastProgress = 0;
    const rand = mulberry32(20260214);
    /* stable scatter offsets per word (viewport fractions) */
    const scatter = WORDS.map(() => ({ sx: rand() - 0.5, sy: rand() - 0.5 }));

    const layout = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const isMobile = W < 768;

      /* fit loop: shrink type until the field fits the stage */
      let fsScale = 1;
      let slots: Slot[] = [];
      let labelSlots: Slot[] = [];
      let fs = 0;
      let rowH = 0;

      const compute = () => {
        fs = clamp(W * (isMobile ? 0.0305 : 0.0108), 10, 15) * fsScale;
        const ch = fs * 0.62 + fs * 0.16; /* plex mono advance + tracking */
        const gapX = fs * 2.1;
        rowH = fs * 2.55;
        const left = W * (isMobile ? 0.07 : 0.085);
        const right = W * (isMobile ? 0.93 : 0.915);
        const top = H * (isMobile ? 0.13 : 0.16);
        const gl = clamp(W * 0.02, 17, 29) * fsScale;

        slots = [];
        labelSlots = [];
        let y = top;
        let wi = 0;
        for (const g of SKILL_GROUPS) {
          labelSlots.push({ x: left, y });
          y += gl * 2.0;
          let x = left;
          for (const skill of g.skills) {
            const wpx = skill.length * ch;
            if (x + wpx > right && x > left) {
              x = left + fs * 1.6;
              y += rowH;
            }
            slots[wi] = { x, y };
            x += wpx + gapX;
            wi++;
          }
          y += rowH * (isMobile ? 1.5 : 1.75);
        }
        return y + rowH;
      };

      let total = compute();
      const limit = H * (isMobile ? 0.9 : 0.86);
      while (total > limit && fsScale > 0.55) {
        fsScale -= 0.05;
        total = compute();
      }

      /* apply to DOM */
      wordEls.current.forEach((el, i) => {
        if (!el || !slots[i]) return;
        el.style.left = `${slots[i].x}px`;
        el.style.top = `${slots[i].y}px`;
        el.style.fontSize = `${fs}px`;
      });
      labelEls.current.forEach((el, i) => {
        if (!el || !labelSlots[i]) return;
        el.style.left = `${labelSlots[i].x}px`;
        el.style.top = `${labelSlots[i].y}px`;
        el.style.fontSize = `${clamp(stage.clientWidth * 0.02, 17, 29) * fsScale}px`;
      });
      return { W, H };
    };

    const buildTimeline = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      tl = anime.timeline({ autoplay: false, easing: "easeOutCubic" });
      tl.add(
        {
          targets: wordEls.current.filter(Boolean),
          translateX: (_el: HTMLElement, i: number) => [scatter[i].sx * W * 0.85, 0],
          translateY: (_el: HTMLElement, i: number) => [scatter[i].sy * H * 0.7, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 1200,
          delay: anime.stagger(34, { from: "center" }),
          easing: "easeOutQuart",
        },
        0
      )
        .add(
          {
            targets: labelEls.current.filter(Boolean),
            opacity: [0, 1],
            translateY: [16, 0],
            duration: 560,
            delay: anime.stagger(90),
          },
          420
        )
        .add(
          {
            targets: fillRef.current,
            scaleX: [0, 1],
            duration: tl ? tl.duration + 1780 : 1780,
            easing: "linear",
          },
          0
        );
    };

    const seek = (p: number) => {
      lastProgress = p;
      if (tl) tl.seek(tl.duration * p);
      if (readoutRef.current) readoutRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
    };

    const init = () => {
      layout();
      if (reduced) {
        wordEls.current.forEach((el) => el && (el.style.opacity = "1"));
        labelEls.current.forEach((el) => el && (el.style.opacity = "1"));
        if (fillRef.current) fillRef.current.style.transform = "scaleX(1)";
        if (readoutRef.current) readoutRef.current.textContent = "100%";
        return;
      }
      buildTimeline();
      seek(lastProgress);
      scrub?.kill();
      scrub = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => seek(self.progress),
      });
    };

    init();

    if (!reduced) {
      /* ambient breathing on the inner spans — independent of the scrub */
      io = new IntersectionObserver((entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (visible && !ambient) {
          ambient = anime({
            targets: stage.querySelectorAll(".skill-inner"),
            translateY: [2.5, -2.5],
            duration: (_el: Element, i: number) => 1500 + (i % 6) * 240,
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
            delay: anime.stagger(70),
          });
        } else if (!visible && ambient) {
          ambient.pause();
          ambient = null;
        }
      });
      io.observe(stage);

      /* elastic hover feedback */
      const enter = (e: Event) => {
        const inner = (e.currentTarget as HTMLElement).querySelector(".skill-inner");
        if (!inner) return;
        anime.remove(inner);
        anime({
          targets: inner,
          scale: [1, 1.22, 1],
          duration: 700,
          easing: "easeOutElastic(1, .5)",
        });
      };
      wordEls.current.forEach((el) => el?.addEventListener("pointerenter", enter));

      const onResize = () => {
        window.clearTimeout(resizeT);
        resizeT = window.setTimeout(init, 220);
      };
      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(() => init()).catch(() => undefined);

      return () => {
        window.removeEventListener("resize", onResize);
        wordEls.current.forEach((el) => el?.removeEventListener("pointerenter", enter));
        ambient?.pause();
        io?.disconnect();
        scrub?.kill();
      };
    }
  }, [reduced]);

  return (
    <section className="relative border-t border-line" aria-label="Skills">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between px-5 pt-10 md:px-10 md:pt-14">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent">03</span>
          <span className="h-px w-16 bg-line-2" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">Skills — the field</span>
        </div>
        <p className="hidden max-w-[36ch] text-right text-sm leading-relaxed text-ink-2 md:block">
          Twenty disciplines, scattered. Keep scrolling — they assemble into four groups.
        </p>
      </div>

      <div ref={wrapRef} className="relative mt-6" style={{ height: "min(235vh, 2400px)" }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div ref={stageRef} className="relative h-full w-full">
            {/* group labels */}
            {SKILL_GROUPS.map((g, i) => (
              <div
                key={g.name}
                ref={(el) => void (labelEls.current[i] = el)}
                className="absolute font-display italic leading-none text-ink"
                style={{ opacity: 0 }}
              >
                <span className="mr-3 inline-block h-[0.45em] w-[0.45em] translate-y-[-0.08em] bg-accent" aria-hidden="true" />
                {g.name}
                <span className="ml-3 font-mono text-[0.42em] not-italic uppercase tracking-[0.2em] text-ink-3">
                  ×{String(g.skills.length).padStart(2, "0")}
                </span>
              </div>
            ))}

            {/* skill words */}
            {WORDS.map((w, i) => (
              <span
                key={`${w.text}-${i}`}
                ref={(el) => void (wordEls.current[i] = el)}
                className="absolute whitespace-nowrap font-mono uppercase tracking-[0.16em] text-ink-2 transition-colors duration-300 hover:text-accent"
                style={{ opacity: 0, willChange: "transform, opacity" }}
              >
                <span className="skill-inner inline-block">{w.text}</span>
              </span>
            ))}

            {/* frame metadata */}
            <div className="pointer-events-none absolute left-[7%] top-6 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-3 md:left-[8.5%]">
              Field — 20 units / 4 groups
            </div>
            <div className="pointer-events-none absolute bottom-7 left-[7%] right-[7%] flex items-center gap-4 md:left-[8.5%] md:right-[8.5%]">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-3">Assembly</span>
              <div className="relative h-px flex-1 bg-line">
                <div ref={fillRef} className="absolute inset-0 origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
              </div>
              <span ref={readoutRef} className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-ink">
                00%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
