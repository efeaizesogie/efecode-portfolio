"use client";

/*
 * Experience — strata view.
 * A geological cross-section: each role is a rock layer, oldest at the
 * bottom, its thickness by duration and its fill by the kind of work.
 * Selecting a layer lifts it and fills the role card beside it.
 */

import { useEffect, useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ROLES_BY_START, stamp } from "./data";
import { ExperienceHeading, RoleDetail } from "./detail";

/* Newest layer on top, so draw from the top down. */
const LAYERS = [...ROLES_BY_START].reverse();
/* Square-root scale: long roles stay visibly thicker without dwarfing short ones. */
const THICK = LAYERS.map((r) => 22 + Math.sqrt(r.months) * 24);
const TOPS = THICK.map((_, i) => 14 + THICK.slice(0, i).reduce((a, b) => a + b, 0));
const H = TOPS[TOPS.length - 1]! + THICK[THICK.length - 1]! + 14;

/* A gently undulating boundary, different for every layer. */
function boundary(W: number, y: number, k: number, reverse = false) {
  const pts: string[] = [];
  const steps = 16;
  for (let s = 0; s <= steps; s++) {
    const t = reverse ? steps - s : s;
    const x = (t / steps) * W;
    const yy = y + Math.sin(t * 0.7 + k * 1.9) * 5 + Math.sin(t * 0.23 + k) * 4;
    pts.push(`${x.toFixed(1)} ${yy.toFixed(1)}`);
  }
  return pts.join(" L ");
}

export function ExperienceStrata({ toggle }: { toggle: ReactNode }) {
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState((LAYERS.find((r) => r.current) ?? LAYERS[0]!).company);
  const role = LAYERS.find((r) => r.company === active) ?? LAYERS[0]!;
  // A narrower drawing on phones keeps the labels at a readable size.
  const [W, setW] = useState(640);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setW(mq.matches ? 380 : 640);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="experience" data-contour className="py-20 md:py-32">
      <div className="shell">
        <ExperienceHeading aside={toggle} />

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <svg
            viewBox={`-8 0 ${W + 16} ${H}`}
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label="Cross-section of roles as rock layers, newest on top"
          >
            <defs>
              <pattern id={`${uid}-dots`} width="9" height="9" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" className="fill-ink/35" />
                <circle cx="6.5" cy="6.5" r="0.8" className="fill-ink/25" />
              </pattern>
              <pattern
                id={`${uid}-hatch`}
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="7" className="stroke-ink/45" strokeWidth="1.2" />
              </pattern>
            </defs>

            {LAYERS.map((r, i) => {
              const top = TOPS[i]!;
              const bottom = top + THICK[i]!;
              const on = r.company === active;
              const d = `M ${boundary(W, top, i)} L ${boundary(W, bottom, i + 1, true)} Z`;
              return (
                <motion.g
                  key={r.company}
                  animate={{ x: on ? -8 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  onMouseEnter={() => setActive(r.company)}
                  onClick={() => setActive(r.company)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`${r.company}, ${r.period}`}
                  aria-pressed={on}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(r.company)}
                >
                  <path d={d} className={on ? "fill-signal/15" : "fill-paper"} />
                  <path
                    d={d}
                    fill={`url(#${uid}-${r.kind === "geospatial" ? "hatch" : "dots"})`}
                    opacity={on ? 0.5 : 1}
                  />
                  <path
                    d={d}
                    className={on ? "fill-none stroke-signal" : "fill-none stroke-ink/60"}
                    strokeWidth={on ? 2 : 1}
                  />
                  <text
                    x={16}
                    y={top + THICK[i]! / 2 + 5}
                    className={`font-display text-[15px] font-semibold ${on ? "fill-signal" : "fill-ink"}`}
                    style={{ paintOrder: "stroke", stroke: "var(--paper)", strokeWidth: 5 }}
                  >
                    {r.company.replace(/ (LLC|Ltd|Technologies Ltd)$/, "")}
                  </text>
                  <text
                    x={W - 16}
                    y={top + THICK[i]! / 2 + 4}
                    textAnchor="end"
                    className="fill-ink/60 font-mono text-[11px]"
                    style={{ paintOrder: "stroke", stroke: "var(--paper)", strokeWidth: 4 }}
                  >
                    {stamp(r.start)}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div aria-live="polite">
              <RoleDetail role={role} />
            </div>
            <div className="mt-10 flex items-center gap-6">
              <span className="type-meta flex items-center gap-2 text-ink-soft">
                <svg width="22" height="12" aria-hidden>
                  <rect
                    width="22"
                    height="12"
                    fill={`url(#${uid}-dots)`}
                    className="stroke-ink/50"
                  />
                </svg>
                Frontend
              </span>
              <span className="type-meta flex items-center gap-2 text-ink-soft">
                <svg width="22" height="12" aria-hidden>
                  <rect
                    width="22"
                    height="12"
                    fill={`url(#${uid}-hatch)`}
                    className="stroke-ink/50"
                  />
                </svg>
                Geospatial
              </span>
              <span className="type-meta text-ink-soft">Thickness = time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
