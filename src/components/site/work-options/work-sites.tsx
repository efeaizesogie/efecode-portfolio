"use client";

/*
 * Selected Work option W4 — Survey sites.
 * A project list beside a live contour map with six numbered survey markers.
 * Picking a project from either opens a print of the site on its marker.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TerrainCanvas } from "../terrain";
import { WORK } from "./data";
import { WorkHeading } from "./heading";

/* Marker positions on the map panel, as percentages. */
const SITES = [
  { x: 22, y: 26 },
  { x: 62, y: 18 },
  { x: 80, y: 46 },
  { x: 40, y: 52 },
  { x: 18, y: 76 },
  { x: 66, y: 78 },
];

export function WorkSites() {
  const [active, setActive] = useState(0);
  const item = WORK[active]!;
  const site = SITES[active % SITES.length]!;
  // Open the print toward the roomier side of the marker.
  const flipX = site.x > 55;
  const flipY = site.y > 55;

  return (
    <section id="work" data-contour className="relative py-20 md:py-32">
      <div className="shell">
        <WorkHeading />

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[18rem_1fr] lg:gap-12">
          <ol className="flex flex-col border-t border-ink/40">
            {WORK.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.slug} className="border-b border-rule">
                  <button
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={on}
                    className="flex w-full items-baseline gap-4 py-4 text-left"
                  >
                    <span className={`type-label ${on ? "text-signal" : "text-ink-soft"}`}>
                      {p.index}
                    </span>
                    <span
                      className={`type-title !text-[1.35rem] transition-colors ${on ? "text-ink" : "text-ink/55"}`}
                    >
                      {p.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="relative h-[70svh] min-h-[28rem] overflow-hidden rounded-[6px] border border-ink/15 bg-paper">
            <div aria-hidden className="absolute inset-0">
              <TerrainCanvas animate readout={false} />
            </div>

            {WORK.map((p, i) => {
              const s = SITES[i % SITES.length]!;
              const on = i === active;
              return (
                <button
                  key={p.slug}
                  onClick={() => setActive(i)}
                  aria-label={p.title}
                  className="absolute -translate-x-1/2 -translate-y-full"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <span className="flex flex-col items-center">
                    <span
                      className={`type-label mb-1 !text-[0.62rem] ${on ? "text-signal" : "text-ink/70"}`}
                    >
                      {p.index}
                    </span>
                    <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden>
                      <path d="M8 1 L15 13 H1 Z" className={on ? "fill-signal" : "fill-ink"} />
                    </svg>
                  </span>
                </button>
              );
            })}

            <AnimatePresence mode="wait">
              <motion.div
                key={item.slug}
                className="absolute w-[min(78%,22rem)]"
                style={{
                  left: `${site.x}%`,
                  top: `${site.y}%`,
                  translateX: flipX ? "calc(-100% - 1.25rem)" : "1.25rem",
                  translateY: flipY ? "calc(-100% - 0.5rem)" : "0.5rem",
                }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="rounded-[3px] bg-white p-2 pb-3 shadow-[0_24px_50px_-28px_rgb(0_0_0/0.6)]">
                  <img
                    src={item.shots[0]}
                    alt={`${item.title} interface`}
                    className="aspect-[16/10] w-full object-cover object-left-top"
                  />
                  <div className="px-1 pt-3">
                    <p className="font-display text-lg font-semibold tracking-tight text-ink">
                      {item.title}
                    </p>
                    <p className="type-meta mt-1 text-ink-soft">{item.blurb}</p>
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Visit"
                      className="type-label link-underline mt-3 inline-block text-signal"
                    >
                      Visit ↗
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
