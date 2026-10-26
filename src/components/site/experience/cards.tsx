"use client";

/*
 * Experience — index cards view.
 * Each role is a ruled index card in a fanned stack, picking up the desk from
 * the hero. Clicking the front card, or a date below, brings the next one up.
 */

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { links } from "@/lib/portfolio";
import { ROLES, duration, stackLine, stamp } from "./data";
import { ExperienceHeading } from "./detail";

const TILTS = [-2, 4, -5, 3, -3, 5];

export function ExperienceCards({ toggle }: { toggle: ReactNode }) {
  const roles = [...ROLES].sort((a, b) => b.start - a.start);
  const [front, setFront] = useState(() =>
    Math.max(
      0,
      roles.findIndex((r) => r.current),
    ),
  );
  const n = roles.length;

  return (
    <section id="experience" data-contour className="overflow-x-clip py-20 md:py-32">
      <div className="shell">
        <ExperienceHeading aside={toggle} />

        <div className="mt-12 grid items-center gap-12 md:mt-16 lg:grid-cols-[1fr_16rem]">
          <div className="relative mx-auto h-[22rem] w-full max-w-[38rem] md:h-[17rem]">
            {roles.map((r, i) => {
              // Depth 0 is the front card; the rest fan out behind it.
              const depth = (i - front + n) % n;
              const isFront = depth === 0;
              return (
                <motion.button
                  key={r.company}
                  type="button"
                  onClick={() => setFront(isFront ? (front + 1) % n : i)}
                  aria-label={
                    isFront ? `${r.company}, next card` : `Bring ${r.company} to the front`
                  }
                  data-cursor={isFront ? "Next" : "Pick"}
                  className="absolute inset-0 flex flex-col justify-start overflow-hidden rounded-[4px] border border-ink/15 bg-[oklch(0.975_0.006_84)] text-left shadow-[0_24px_50px_-30px_rgb(0_0_0/0.55)]"
                  style={{
                    zIndex: n - depth,
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0 calc(2rem - 1px), oklch(0.6 0.05 240 / 0.16) calc(2rem - 1px) 2rem)",
                    backgroundPosition: "0 5.5rem",
                  }}
                  animate={{
                    rotate: isFront ? 0 : (TILTS[depth % TILTS.length] ?? 0),
                    x: isFront ? 0 : depth * 10,
                    y: isFront ? 0 : depth * -8,
                    scale: 1 - Math.min(depth, 4) * 0.025,
                    opacity: depth > 4 ? 0 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                >
                  <div className="flex items-baseline justify-between gap-4 border-b-2 border-signal/70 bg-[oklch(0.975_0.006_84)] px-6 pb-4 pt-6 md:px-8">
                    <span className="type-title">{r.company}</span>
                    <span className="type-meta shrink-0 text-ink-soft">
                      {stamp(r.start)} — {r.current ? "now" : stamp(r.end)}
                    </span>
                  </div>
                  <div className="px-6 pt-3 md:px-8" style={{ lineHeight: "2rem" }}>
                    <p className="type-label text-ink-soft" style={{ lineHeight: "2rem" }}>
                      {r.role} · {r.place}
                    </p>
                    <p
                      className="font-prose text-[1.08rem] text-ink/85"
                      style={{ lineHeight: "2rem" }}
                    >
                      {r.summary}
                    </p>
                    <p className="type-meta text-ink-soft" style={{ lineHeight: "2rem" }}>
                      {duration(r.months)} · {stackLine(r)}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div>
            <ol className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {roles.map((r, i) => (
                <li key={r.company}>
                  <button
                    type="button"
                    onClick={() => setFront(i)}
                    aria-pressed={i === front}
                    className={`flex w-full items-baseline gap-3 py-1.5 text-left transition-colors ${
                      i === front ? "text-signal" : "text-ink/55 hover:text-ink"
                    }`}
                  >
                    <span className="type-meta">{stamp(r.start)}</span>
                    <span className="font-display text-sm font-semibold tracking-tight">
                      {r.company.replace(/ (LLC|Ltd|Technologies Ltd)$/, "")}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <a
              href={links.resume}
              target="_blank"
              rel="noreferrer"
              className="type-label link-underline mt-8 inline-block text-ink hover:text-signal"
            >
              Full résumé ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
