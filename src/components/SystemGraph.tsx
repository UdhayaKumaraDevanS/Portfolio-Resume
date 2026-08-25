import { useEffect, useMemo, useRef } from "react";
import { mulberry32, prefersReducedMotion, isTouchDevice, lerp, clamp } from "../lib";

type Node = { x: number; y: number; depth: number; square: boolean };
type Edge = { a: number; b: number; depth: number };

interface Props {
  seed?: number;
  density?: number;
  className?: string;
  /** pointer parallax on depth layers */
  interactive?: boolean;
  /** nodes gently repel from the pointer */
  repel?: boolean;
  /** accent pulses travelling along edges */
  pulses?: boolean;
}

/**
 * The site's representative visual: a quiet diagnostic network of nodes
 * and thin traces — systems, connectivity, troubleshooting. Almost static
 * at rest; it leans toward the cursor, parts around it, and sends small
 * pulses along its traces.
 */
export default function SystemGraph({
  seed = 7,
  density = 1,
  className = "",
  interactive = false,
  repel = false,
  pulses = true,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layerRefs = useRef<(SVGGElement | null)[]>([]);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

  const { nodes, edges } = useMemo(() => {
    const rand = mulberry32(seed);
    const count = clamp(Math.round(30 * density), 12, 42);
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: 4 + rand() * 92,
        y: 5 + rand() * 90,
        depth: Math.floor(rand() * 3),
        square: rand() > 0.78,
      });
    }
    const edges: Edge[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < count; i++) {
      const dists = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
        .filter((e) => e.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j, d } of dists) {
        if (d > 34) continue;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ a: i, b: j, depth: Math.min(nodes[i].depth, nodes[j].depth) });
        }
      }
    }
    /* a few long "bus" traces for structure */
    for (let k = 0; k < 3; k++) {
      const a = Math.floor(rand() * count);
      const b = Math.floor(rand() * count);
      if (a !== b) edges.push({ a, b, depth: 0 });
    }
    return { nodes, edges };
  }, [seed, density]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const touch = isTouchDevice();
    const svg = svgRef.current;
    if (!svg) return;
    if (reduced || touch) return; /* static sculpture on touch / reduced motion */

    let raf = 0;
    let running = true;
    const pointer = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5, inside: false };
    const offsets = nodes.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));

    /* pulses */
    const pulseCount = pulses ? Math.min(4, Math.max(2, Math.round(edges.length / 12))) : 0;
    const rand2 = mulberry32(seed + 99);
    const ps = Array.from({ length: pulseCount }, () => ({
      edge: Math.floor(rand2() * edges.length),
      t: rand2(),
      speed: 0.0016 + rand2() * 0.0022,
      el: null as SVGCircleElement | null,
    }));
    ps.forEach((p, i) => {
      p.el = svg.querySelector<SVGCircleElement>(`[data-pulse="${i}"]`);
    });

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      pointer.x = clamp((e.clientX - r.left) / r.width, 0, 1);
      pointer.y = clamp((e.clientY - r.top) / r.height, 0, 1);
      pointer.inside =
        e.clientX >= r.left - 80 && e.clientX <= r.right + 80 && e.clientY >= r.top - 80 && e.clientY <= r.bottom + 80;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(svg);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!running) return;

      pointer.sx = lerp(pointer.sx, pointer.inside ? pointer.x : 0.5, 0.045);
      pointer.sy = lerp(pointer.sy, pointer.inside ? pointer.y : 0.5, 0.045);

      /* depth parallax */
      if (interactive) {
        layerRefs.current.forEach((g, depth) => {
          if (!g) return;
          const k = (depth + 1) * 1.1;
          const tx = (pointer.sx - 0.5) * k;
          const ty = (pointer.sy - 0.5) * k;
          g.setAttribute("transform", `translate(${tx.toFixed(3)} ${ty.toFixed(3)})`);
        });
      }

      /* pointer repel */
      if (repel) {
        const px = pointer.sx * 100;
        const py = pointer.sy * 100;
        nodes.forEach((n, i) => {
          const o = offsets[i];
          if (pointer.inside) {
            const dx = n.x - px;
            const dy = n.y - py;
            const d = Math.hypot(dx, dy);
            if (d < 14 && d > 0.001) {
              const f = ((14 - d) / 14) * 2.6;
              o.tx = (dx / d) * f;
              o.ty = (dy / d) * f;
            } else {
              o.tx = 0;
              o.ty = 0;
            }
          } else {
            o.tx = 0;
            o.ty = 0;
          }
          o.x = lerp(o.x, o.tx, 0.08);
          o.y = lerp(o.y, o.ty, 0.08);
          const g = nodeRefs.current[i];
          if (g) g.setAttribute("transform", `translate(${o.x.toFixed(3)} ${o.y.toFixed(3)})`);
        });
      }

      /* travelling pulses */
      for (const p of ps) {
        p.t += p.speed * 16;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = Math.floor(Math.random() * edges.length);
        }
        const e = edges[p.edge];
        if (!e || !p.el) continue;
        const a = nodes[e.a];
        const b = nodes[e.b];
        p.el.setAttribute("cx", lerp(a.x, b.x, p.t).toFixed(2));
        p.el.setAttribute("cy", lerp(a.y, b.y, p.t).toFixed(2));
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, [nodes, edges, interactive, repel, pulses, seed]);

  const depthOpacity = [0.1, 0.16, 0.24];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {[0, 1, 2].map((depth) => (
        <g key={depth} ref={(el) => void (layerRefs.current[depth] = el)}>
          {edges
            .filter((e) => e.depth === depth)
            .map((e, i) => {
              const a = nodes[e.a];
              const b = nodes[e.b];
              return (
                <line
                  key={`e${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="currentColor"
                  strokeOpacity={depthOpacity[depth]}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          {nodes
            .map((n, i) => ({ n, i }))
            .filter(({ n }) => n.depth === depth)
            .map(({ n, i }) => (
              <g key={`n${i}`} ref={(el) => void (nodeRefs.current[i] = el)}>
                {n.square ? (
                  <rect
                    x={n.x - 0.32}
                    y={n.y - 0.32}
                    width={0.64}
                    height={0.64}
                    fill="currentColor"
                    fillOpacity={depthOpacity[depth] + 0.18}
                  />
                ) : (
                  <circle cx={n.x} cy={n.y} r={0.3 + depth * 0.12} fill="currentColor" fillOpacity={depthOpacity[depth] + 0.18} />
                )}
              </g>
            ))}
        </g>
      ))}
      {pulses &&
        psPlaceholder(edges).map((_, i) => (
          <circle key={`p${i}`} data-pulse={i} r={0.34} fill="var(--color-accent)" opacity={0.65} cx={-5} cy={-5} />
        ))}
    </svg>
  );
}

/* renders the pulse circles once we know how many we want */
function psPlaceholder(edges: Edge[]) {
  const count = Math.min(4, Math.max(2, Math.round(edges.length / 12)));
  return Array.from({ length: count });
}
