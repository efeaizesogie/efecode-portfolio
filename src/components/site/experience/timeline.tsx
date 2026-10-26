"use client";

/*
 * Experience — survey timeline view.
 * A time axis from the first role to now with one lane per role, so overlaps
 * and durations read at a glance. Geospatial work is hatched. Selecting a bar
 * fills the role card beneath.
 */

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { FIRST, LAST, ROLES_BY_START, yearOf } from "./data";
import { ExperienceHeading, RoleDetail } from "./detail";

const SPAN = LAST - FIRST + 1;
const pct = (m: number) => ((m - FIRST) / SPAN) * 100;

/* Year gridlines at each January inside the span. */
const YEARS: number[] = [];
for (let y = yearOf(FIRST) + 1; y * 12 <= LAST; y++) YEARS.push(y);

const LANES = [...ROLES_BY_START].reverse(); // newest on top

export function ExperienceTimeline({ toggle }: { toggle: ReactNode }) {
  const [active, setActive] = useState((LANES.find((r) => r.current) ?? LANES[0]!).company);
  const role = LANES.find((r) => r.company === active) ?? LANES[0]!;

  return (
    <section id="experience" data-contour className="py-20 md:py-32">
      <div className="shell">
        <ExperienceHeading aside={toggle} />

        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-[6.5rem_1fr] md:grid-cols-[12rem_1fr]">
            <div />
            <div className="relative h-6">
              {(YEARS[0] === undefined || pct(YEARS[0] * 12) > 14) && (
                <span className="type-meta absolute left-0 text-ink-soft">{yearOf(FIRST)}</span>
              )}
              {YEARS.map((y) => (
                <span
                  key={y}
                  className="type-meta absolute -translate-x-1/2 text-ink-soft"
                  style={{ left: `${pct(y * 12)}%` }}
                >
                  {y}
                </span>
              ))}
              <span className="type-meta absolute right-0 text-signal">now</span>
            </div>
          </div>

          <div className="relative mt-2 border-t border-ink/40">
            {LANES.map((r) => {
              const on = r.company === active;
              const geo = r.kind === "geospatial";
              return (
                <div
                  key={r.company}
                  className="grid grid-cols-[6.5rem_1fr] items-center border-b border-rule md:grid-cols-[12rem_1fr]"
                >
                  <button
                    onClick={() => setActive(r.company)}
                    onMouseEnter={() => setActive(r.company)}
                    className={`truncate py-4 pr-3 text-left font-display text-sm font-semibold tracking-tight transition-colors md:text-base ${
                      on ? "text-signal" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {r.company.replace(/ (LLC|Ltd|Technologies Ltd)$/, "")}
                  </button>
                  <div className="relative h-full min-h-12">
                    {YEARS.map((y) => (
                      <span
                        key={y}
                        aria-hidden
                        className="absolute bottom-0 top-0 w-px bg-ink/10"
                        style={{ left: `${pct(y * 12)}%` }}
                      />
                    ))}
                    <motion.button
                      onClick={() => setActive(r.company)}
                      onMouseEnter={() => setActive(r.company)}
                      aria-label={`${r.company}, ${r.period}`}
                      aria-pressed={on}
                      data-cursor="View"
                      className={`absolute top-1/2 -mt-[7px] h-3.5 origin-left rounded-full transition-colors md:-mt-2 md:h-4 ${
                        on ? "bg-signal" : geo ? "bg-ink/60" : "bg-ink/25 hover:bg-ink/45"
                      }`}
                      style={{
                        left: `${pct(r.start)}%`,
                        width: `max(0.75rem, ${(r.months / SPAN) * 100}%)`,
                        backgroundImage:
                          geo && !on
                            ? "repeating-linear-gradient(45deg, transparent 0 4px, oklch(0.933 0.009 84 / 0.5) 4px 6px)"
                            : undefined,
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                    {r.current && (
                      <span
                        aria-hidden
                        className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 animate-pulse rounded-full bg-signal"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-6">
            <span className="type-meta flex items-center gap-2 text-ink-soft">
              <span className="h-2 w-6 rounded-full bg-ink/25" /> Frontend
            </span>
            <span className="type-meta flex items-center gap-2 text-ink-soft">
              <span
                className="h-2 w-6 rounded-full bg-ink/60"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent 0 4px, oklch(0.933 0.009 84 / 0.5) 4px 6px)",
                }}
              />{" "}
              Geospatial
            </span>
          </div>

          <div aria-live="polite" className="mt-10 md:mt-14 md:pl-[12rem]">
            <RoleDetail role={role} />
          </div>
        </div>
      </div>
    </section>
  );
}
