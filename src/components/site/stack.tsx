"use client";

/*
 * Stack — an elevation profile of the toolkit.
 * A terrain cross-section: one peak per tool, its height the number of
 * projects and roles that used it. Fainter ridges behind give depth.
 * Hovering or tapping a peak drops a survey marker and fills the readout.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RevealText } from "./motion-primitives";
import { GROUPS, TOOLS, weight, type Tool } from "./stack-data";

const W = 1000;
const H = 340;
const BASE = 290;
const TOP = 40;
const PAD = 24;

const max = Math.max(...TOOLS.map(weight), 1);
const step = (W - PAD * 2) / (TOOLS.length - 1);
const peakX = (i: number) => PAD + i * step;
const peakY = (w: number, scale = 1) => BASE - (0.12 + (w / max) * 0.88) * (BASE - TOP) * scale;

/* Smooth line through points (Catmull-Rom converted to cubic Béziers). */
function smooth(pts: [number, number][]) {
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function ridge(scale: number, shift: number) {
  const pts: [number, number][] = [[0, BASE]];
  TOOLS.forEach((t, i) => {
    const x = peakX(i) + shift;
    pts.push([x, peakY(weight(t), scale)]);
    // Saddles sit at about 60% of the lower neighbour, so peaks read as a
    // connected range rather than isolated spikes.
    const next = TOOLS[i + 1];
    if (next) {
      const saddle = Math.min(peakY(weight(t), scale), peakY(weight(next), scale));
      pts.push([x + step / 2, BASE - (BASE - saddle) * 0.6]);
    }
  });
  pts.push([W, BASE]);
  return smooth(pts);
}

const FRONT = ridge(1, 0);
const MID = ridge(0.72, step * 0.45);
const BACK = ridge(0.5, -step * 0.3);

function Readout({ tool }: { tool: Tool }) {
  const where = [...tool.projects, ...tool.roles.map((r) => `${r} (role)`)];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tool.name}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <p className="type-display !text-[clamp(2rem,4vw,3.4rem)]">{tool.name}</p>
        <p className="type-prose mt-3 text-ink/80">
          {where.length === 0
            ? "Part of the toolkit, not yet credited on a listed project."
            : `Used in ${[
                tool.projects.length &&
                  `${tool.projects.length} project${tool.projects.length === 1 ? "" : "s"}`,
                tool.roles.length &&
                  `${tool.roles.length} role${tool.roles.length === 1 ? "" : "s"}`,
              ]
                .filter(Boolean)
                .join(" and ")}${tool.since ? `, since ${tool.since}` : ""}.`}
        </p>
        {where.length > 0 && (
          <p className="type-meta mt-4 max-w-[52ch] text-ink-soft">{where.join(" · ")}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function Stack() {
  const [active, setActive] = useState(TOOLS.findIndex((t) => t.name === "React"));
  const tool = TOOLS[active] ?? TOOLS[0]!;
  const ax = peakX(active);
  const ay = peakY(weight(tool));

  return (
    <section id="stack" data-contour className="border-y border-rule py-20 md:py-32">
      <div className="shell">
        <h2 className="type-display">
          <RevealText text="Stack" stagger={0.05} />
        </h2>

        <div className="mt-12 md:mt-16">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label="Elevation profile of tools, peak height is how many projects and roles used each"
          >
            <path
              d={`${BACK} L ${W} ${BASE} L 0 ${BASE} Z`}
              className="fill-ink/[0.04] stroke-ink/20"
              strokeWidth={1}
            />
            <path
              d={`${MID} L ${W} ${BASE} L 0 ${BASE} Z`}
              className="fill-ink/[0.05] stroke-ink/30"
              strokeWidth={1}
            />
            <path
              d={`${FRONT} L ${W} ${BASE} L 0 ${BASE} Z`}
              className="fill-paper stroke-ink"
              strokeWidth={1.4}
            />
            <line x1={0} x2={W} y1={BASE} y2={BASE} className="stroke-ink/40" strokeWidth={1} />

            <motion.g
              animate={{ x: ax }}
              initial={false}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <motion.line
                x1={0}
                x2={0}
                y2={BASE}
                animate={{ y1: ay }}
                initial={false}
                className="stroke-signal"
                strokeDasharray="4 4"
                strokeWidth={1.2}
              />
              <motion.circle
                animate={{ cy: ay }}
                initial={false}
                cx={0}
                r={5}
                className="fill-signal"
              />
              <motion.circle
                animate={{ cy: ay }}
                initial={false}
                cx={0}
                r={11}
                className="fill-none stroke-signal/50"
              />
            </motion.g>

            {TOOLS.map((t, i) => (
              <g key={t.name}>
                <text
                  x={peakX(i)}
                  y={BASE + 18}
                  textAnchor="middle"
                  className={`font-mono text-[11px] ${i === active ? "fill-signal" : "fill-ink/50"} ${
                    i === active ? "" : "hidden md:block"
                  }`}
                >
                  {t.short}
                </text>
                <rect
                  x={peakX(i) - step / 2}
                  y={TOP - 20}
                  width={step}
                  height={BASE - TOP + 50}
                  className="cursor-pointer fill-transparent"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                />
              </g>
            ))}

            {GROUPS.map((g) => {
              const idx = TOOLS.map((t, i) => (t.group === g ? i : -1)).filter((i) => i >= 0);
              const x1 = peakX(idx[0]!) - step / 3;
              const x2 = peakX(idx[idx.length - 1]!) + step / 3;
              return (
                <g key={g} className="hidden md:block">
                  <line x1={x1} x2={x2} y1={BASE + 32} y2={BASE + 32} className="stroke-ink/30" />
                  <text
                    x={(x1 + x2) / 2}
                    y={BASE + 48}
                    textAnchor="middle"
                    className="fill-ink/60 font-mono text-[10px] uppercase tracking-[0.14em]"
                  >
                    {g}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Peaks are too narrow to tap on phones, so step through them. */}
          <div className="mt-8 flex items-center justify-between md:hidden">
            <button
              onClick={() => setActive((a) => (a - 1 + TOOLS.length) % TOOLS.length)}
              aria-label="Previous tool"
              className="type-label px-2 py-2 text-ink"
            >
              ← Prev
            </button>
            <span className="type-meta text-ink-soft">
              {active + 1} / {TOOLS.length}
            </span>
            <button
              onClick={() => setActive((a) => (a + 1) % TOOLS.length)}
              aria-label="Next tool"
              className="type-label px-2 py-2 text-ink"
            >
              Next →
            </button>
          </div>

          <div aria-live="polite" className="mt-10 md:mt-14">
            <Readout tool={tool} />
          </div>
        </div>
      </div>
    </section>
  );
}
