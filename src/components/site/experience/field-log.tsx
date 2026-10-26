"use client";

/*
 * Experience — field log view.
 * Set like a surveyor's field book: ruled lines, a signal margin, dates in a
 * mono column and one short entry per role. Nothing to click; the résumé
 * link closes the page.
 */

import type { ReactNode } from "react";
import { links } from "@/lib/portfolio";
import { Rise } from "../motion-primitives";
import { ROLES, stamp } from "./data";
import { ExperienceHeading } from "./detail";

const RULE = "2.25rem";

export function ExperienceFieldLog({ toggle }: { toggle: ReactNode }) {
  const entries = [...ROLES].sort((a, b) => b.start - a.start);

  return (
    <section id="experience" data-contour className="py-20 md:py-32">
      <div className="shell">
        <ExperienceHeading aside={toggle} />

        <div
          className="relative mt-12 overflow-hidden rounded-[4px] border border-ink/15 bg-[oklch(0.965_0.008_84)] shadow-[0_30px_60px_-40px_rgb(0_0_0/0.5)] md:mt-16"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 calc(${RULE} - 1px), oklch(0.6 0.05 240 / 0.18) calc(${RULE} - 1px) ${RULE})`,
          }}
        >
          <span
            aria-hidden
            className="absolute bottom-0 top-0 left-[6.5rem] w-px bg-signal/70 md:left-[10rem]"
          />
          <ol className="relative" style={{ paddingTop: RULE }}>
            {entries.map((r, i) => (
              <li key={r.company}>
                <Rise delay={i * 0.04}>
                  <div className="grid grid-cols-[6.5rem_1fr] md:grid-cols-[10rem_1fr]">
                    <p
                      className="type-meta px-3 text-ink-soft md:px-5"
                      style={{ lineHeight: RULE }}
                    >
                      {stamp(r.start)}
                      <br />
                      <span className={r.current ? "text-signal" : ""}>
                        {r.current ? "now" : stamp(r.end)}
                      </span>
                    </p>
                    <div className="pl-5 pr-4 md:pl-8 md:pr-10">
                      <p className="type-label text-ink" style={{ lineHeight: RULE }}>
                        {r.company}
                        <span className="text-ink-soft"> — {r.role}</span>
                      </p>
                      <p
                        className="font-prose text-[1.08rem] text-ink/85"
                        style={{ lineHeight: RULE }}
                      >
                        {r.summary}
                      </p>
                      <p className="type-meta text-ink-soft" style={{ lineHeight: RULE }}>
                        {r.place}
                        {r.kind === "geospatial" ? " · fieldwork" : ""}
                      </p>
                      <div style={{ height: RULE }} />
                    </div>
                  </div>
                </Rise>
              </li>
            ))}
          </ol>
        </div>

        <a
          href={links.resume}
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
          className="type-label link-underline mt-8 inline-block text-ink hover:text-signal"
        >
          Full résumé ↗
        </a>
      </div>
    </section>
  );
}
