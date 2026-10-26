"use client";

/*
 * Selected Work — field sheets view.
 * Each project is a magazine-style spread: its four screenshots unframed and
 * at unequal sizes, staggered and bleeding off the right edge. The notes sit
 * small in a corner, like annotations on a survey sheet.
 */

import type { ReactNode } from "react";
import { Rise } from "../motion-primitives";
import { WORK, type WorkItem } from "./data";
import { WorkHeading } from "./heading";
import { ViewAllProjects } from "./view-all";

/* Two alternating spread layouts on a 12-column grid (desktop). */
const LAYOUTS = [
  {
    notes: "md:col-start-1 md:col-span-3 md:row-start-2 md:self-end md:pb-6",
    shots: [
      "md:col-start-1 md:col-span-7 md:row-start-1 aspect-[16/10]",
      "md:col-start-8 md:col-span-5 md:row-start-1 md:mt-24 aspect-[4/3]",
      "md:col-start-4 md:col-span-4 md:row-start-2 md:-mt-6 aspect-[4/3]",
      "md:col-start-8 md:col-span-5 md:row-start-2 md:mt-12 aspect-[16/10]",
    ],
  },
  {
    notes: "md:col-start-1 md:col-span-3 md:row-start-1 md:self-start md:pt-4",
    shots: [
      "md:col-start-4 md:col-span-9 md:row-start-1 aspect-[16/9]",
      "md:col-start-1 md:col-span-4 md:row-start-2 md:mt-10 aspect-[4/3]",
      "md:col-start-5 md:col-span-4 md:row-start-2 md:mt-24 aspect-[16/10]",
      "md:col-start-9 md:col-span-4 md:row-start-2 md:-mt-4 aspect-[4/3]",
    ],
  },
];

function Sheet({ p, i }: { p: WorkItem; i: number }) {
  const layout = LAYOUTS[i % LAYOUTS.length]!;
  return (
    <article
      aria-labelledby={`sheet-${p.slug}`}
      className="grid grid-cols-2 items-start gap-3 md:-mr-[clamp(1.15rem,4vw,4rem)] md:grid-cols-12 md:gap-5"
    >
      <div className={`col-span-2 mb-2 md:mb-0 ${layout.notes}`}>
        <Rise>
          <p className="type-label text-signal">No. {p.index}</p>
          <h3 id={`sheet-${p.slug}`} className="type-title mt-3">
            {p.title}
          </h3>
          <p className="type-prose mt-3 !text-[1rem] !leading-snug text-ink/75">{p.blurb}</p>
          <div className="mt-5 flex items-center gap-5">
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              className="type-label link-underline text-ink hover:text-signal"
            >
              Visit ↗
            </a>
            <span className="type-meta text-ink-soft">{p.year}</span>
          </div>
        </Rise>
      </div>

      {p.shots.map((src, n) => (
        <Rise
          key={src}
          delay={n * 0.06}
          className={`${n === 0 ? "col-span-2" : n === 3 ? "hidden md:block" : "col-span-1"} ${layout.shots[n]}`}
        >
          <a
            href={p.live}
            target="_blank"
            rel="noreferrer"
            data-cursor="Visit"
            className="block h-full"
          >
            {n === 0 && p.video ? (
              // A project with a walkthrough leads with it, muted and looping.
              <video
                src={p.video}
                poster={p.poster ?? src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${p.title} walkthrough video`}
                className="h-full w-full border border-ink/10 bg-black object-cover object-left-top"
              />
            ) : (
              <img
                src={src}
                alt={`${p.title} screen ${n + 1}`}
                loading="lazy"
                className="h-full w-full border border-ink/10 bg-white object-cover object-left-top"
              />
            )}
          </a>
        </Rise>
      ))}
    </article>
  );
}

export function WorkSheets({ toggle }: { toggle: ReactNode }) {
  return (
    <section id="work" data-contour className="relative overflow-x-clip py-20 md:py-32">
      <div className="shell">
        <WorkHeading aside={toggle} />
        <div className="mt-14 flex flex-col gap-24 md:mt-20 md:gap-40">
          {WORK.map((p, i) => (
            <Sheet key={p.slug} p={p} i={i} />
          ))}
        </div>
        <div className="mt-24 md:mt-36">
          <ViewAllProjects />
        </div>
      </div>
    </section>
  );
}
