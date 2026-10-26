"use client";

/*
 * Selected Work — transect view.
 * The section pins and scrolling walks sideways along a terrain line, like a
 * survey transect. Each project stands as a print on its own rise, marked
 * with survey stationing (0+00, 1+00 …) along the ground line.
 */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { WORK, type WorkItem } from "./data";
import { WorkHeading } from "./heading";
import { ViewAllProjects } from "./view-all";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const GROUND_H = 150;
const RISES = [16, 44, 8, 50, 24, 36];

function Station({ p, i }: { p: WorkItem; i: number }) {
  return (
    <article
      data-station
      aria-labelledby={`transect-${p.slug}`}
      className="relative flex w-[82vw] shrink-0 flex-col md:w-[min(46vw,42rem)]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 id={`transect-${p.slug}`} className="type-title">
          {p.title}
        </h3>
        <span className="type-meta text-ink-soft">
          Sta. {i}+00 · {p.year}
        </span>
      </div>
      <a
        href={p.live}
        target="_blank"
        rel="noreferrer"
        data-cursor="Visit"
        className="mt-4 block overflow-hidden rounded-[3px] bg-white p-1.5 shadow-[0_24px_50px_-30px_rgb(0_0_0/0.6)]"
      >
        {p.video ? (
          <video
            src={p.video}
            poster={p.poster ?? p.shots[0]}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${p.title} walkthrough video`}
            className="aspect-[16/10] w-full bg-black object-cover object-left-top"
          />
        ) : (
          <img
            src={p.shots[0]}
            alt={`${p.title} interface`}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover object-left-top"
          />
        )}
      </a>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <p className="type-prose max-w-[46ch] !text-[1rem] !leading-snug text-ink/75">{p.blurb}</p>
        <a
          href={p.live}
          target="_blank"
          rel="noreferrer"
          className="type-label link-underline shrink-0 text-signal"
        >
          Visit ↗
        </a>
      </div>
    </article>
  );
}

export function WorkTransect({ toggle }: { toggle: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const distance = useRef(0);
  const [ground, setGround] = useState<{ width: number; d: string; ticks: number[] }>({
    width: 0,
    d: "",
    ticks: [],
  });

  // Measure the track: how far it must travel, and where each station's
  // rise sits on the ground line.
  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const width = track.scrollWidth;
      distance.current = Math.max(0, width - window.innerWidth);
      const centers = [...track.querySelectorAll<HTMLElement>("[data-station]")].map(
        (el) => el.offsetLeft + el.offsetWidth / 2,
      );
      const base = GROUND_H - 14;
      let d = `M 0 ${base}`;
      let prevX = 0;
      centers.forEach((cx, i) => {
        const peak = RISES[i % RISES.length]!;
        const half = (cx - prevX) / 2;
        d += ` C ${prevX + half * 0.6} ${base}, ${cx - half * 0.7} ${peak}, ${cx} ${peak}`;
        const next = centers[i + 1] ?? width;
        const after = (next - cx) / 2;
        d += ` C ${cx + after * 0.7} ${peak}, ${cx + after * 0.6} ${base}, ${cx + after} ${base}`;
        prevX = cx + after;
      });
      d += ` L ${width} ${base}`;
      setGround({ width, d, ticks: centers });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => (reduced ? 0 : -v * distance.current));

  if (reduced) {
    return (
      <section id="work" data-contour className="relative py-20 md:py-32">
        <div className="shell">
          <WorkHeading aside={toggle} />
          <div className="mt-14 flex flex-col gap-16">
            {WORK.map((p, i) => (
              <Station key={p.slug} p={p} i={i} />
            ))}
          </div>
          <div className="mt-16">
            <ViewAllProjects />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" data-contour className="relative">
      <div ref={ref} className="relative" style={{ height: `${WORK.length * 75 + 40}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <div className="absolute right-[clamp(1.15rem,4vw,4rem)] top-20 z-10 md:top-24">
            {toggle}
          </div>
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="relative flex items-end gap-[14vw] pl-[clamp(1.15rem,4vw,4rem)] pr-[20vw] will-change-transform"
          >
            <div className="flex w-[78vw] shrink-0 flex-col justify-end self-stretch pb-[150px] md:w-[30vw]">
              <WorkHeading />
              <p className="type-label mt-8 text-ink-soft">Scroll to walk the line →</p>
            </div>

            {WORK.map((p, i) => (
              <div key={p.slug} className="pb-[150px]">
                <Station p={p} i={i} />
              </div>
            ))}

            {/* End of the line: the way on to every project. */}
            <div className="flex w-[78vw] shrink-0 flex-col justify-end self-stretch pb-[150px] md:w-[30vw]">
              <ViewAllProjects />
            </div>

            {ground.width > 0 && (
              <svg
                aria-hidden
                width={ground.width}
                height={GROUND_H}
                className="pointer-events-none absolute bottom-0 left-0 overflow-visible"
              >
                <path
                  d={`${ground.d} L ${ground.width} ${GROUND_H} L 0 ${GROUND_H} Z`}
                  className="fill-paper/60"
                />
                <path d={ground.d} className="fill-none stroke-ink" strokeWidth={1.4} />
                {ground.ticks.map((cx, i) => (
                  <g key={cx}>
                    <line
                      x1={cx}
                      x2={cx}
                      y1={-14}
                      y2={RISES[i % RISES.length]}
                      className="stroke-ink/40"
                      strokeDasharray="3 4"
                    />
                    <circle cx={cx} cy={RISES[i % RISES.length]} r={4} className="fill-signal" />
                    <text
                      x={cx}
                      y={GROUND_H - 2}
                      textAnchor="middle"
                      className="fill-ink/60 font-mono text-[11px]"
                    >
                      {i}+00
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
