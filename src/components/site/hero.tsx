"use client";

/*
 * Hero — a desk laid on the live terrain map.
 * The live contour map from the Terrain option is the desk surface. The name
 * is printed into it; on top sit objects you can pick up and throw around:
 * a note, a live clock, a business card and two project printouts. Moving
 * them raises the terrain under the pointer, and on scroll the map tilts.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { featuredProjects, links } from "@/lib/portfolio";
import { Magnetic } from "./interactions";
import { TerrainCanvas } from "./terrain";

let topZ = 10;

function DeskObject({
  bounds,
  className,
  rotate,
  delay,
  children,
}: {
  bounds: React.RefObject<HTMLElement | null>;
  className: string;
  rotate: number;
  delay: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const [z, setZ] = useState(1);
  return (
    <motion.div
      drag={!reduced}
      dragConstraints={bounds}
      dragElastic={0.12}
      dragTransition={{ power: 0.25, timeConstant: 220 }}
      onPointerDown={() => setZ(++topZ)}
      initial={reduced ? false : { opacity: 0, y: -40, rotate: rotate - 8, scale: 1.08 }}
      animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 160, damping: 18 }}
      whileHover={{ scale: reduced ? 1 : 1.02 }}
      whileDrag={{
        scale: 1.06,
        rotate: rotate * 0.4,
        boxShadow: "0 40px 60px -24px rgb(0 0 0 / 0.45)",
      }}
      data-cursor="Drag"
      style={{ zIndex: z, touchAction: "none" }}
      className={`absolute cursor-grab shadow-[0_14px_30px_-18px_rgb(0_0_0/0.45)] active:cursor-grabbing ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const parts = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(now)
    : [];
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const h = Number(get("hour")) % 12;
  const m = Number(get("minute"));
  const s = Number(get("second"));
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="h-24 w-24 md:h-28 md:w-28" aria-hidden>
        <circle cx="50" cy="50" r="47" className="fill-paper stroke-ink" strokeWidth="2" />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="50"
            y1="8"
            x2="50"
            y2={i % 3 === 0 ? 16 : 12}
            className="stroke-ink"
            strokeWidth={i % 3 === 0 ? 2 : 1}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="28"
          className="stroke-ink"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${h * 30 + m / 2} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="18"
          className="stroke-ink"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${m * 6} 50 50)`}
        />
        <line
          x1="50"
          y1="56"
          x2="50"
          y2="14"
          className="stroke-signal"
          strokeWidth="1"
          transform={`rotate(${s * 6} 50 50)`}
        />
        <circle cx="50" cy="50" r="2.5" className="fill-signal" />
      </svg>
      <p className="type-meta mt-2 text-ink-soft">
        {now ? `${get("hour")}:${get("minute")} in Benin City` : "Benin City"}
      </p>
    </div>
  );
}

function HeroLinks() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Magnetic strength={0.28}>
        <a
          href="#work"
          data-cursor="View"
          className="type-label inline-block rounded-full border border-ink px-5 py-3 transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Selected Work
        </a>
      </Magnetic>
      <Magnetic strength={0.28}>
        <a
          href={links.resume}
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
          className="type-label inline-block rounded-full px-5 py-3 text-ink-soft transition-colors duration-300 hover:text-signal"
        >
          Résumé ↗
        </a>
      </Magnetic>
    </div>
  );
}

const PRINTS = [
  {
    slug: "honatrix",
    shot: "/work/honatrix/1.jpg",
    rotate: -5,
    place: "left-[6%] top-[33%] md:left-[31%] md:top-[15%]",
  },
  {
    slug: "fundedfun",
    shot: "/work/fundedfun/1.jpg",
    rotate: 4,
    place: "right-[5%] top-[47%] md:left-[56%] md:right-auto md:top-[31%]",
  },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const tilt = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 58]);
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.25]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="index"
      ref={ref}
      className="grain relative min-h-[100svh] overflow-hidden pt-24 [perspective:1400px]"
    >
      <motion.div
        className="absolute inset-0 origin-bottom"
        style={{ rotateX: tilt, scale: mapScale }}
      >
        <TerrainCanvas
          animate={!reduced}
          readoutClassName="hidden md:block right-[clamp(1.15rem,4vw,4rem)] bottom-10"
        />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ opacity: fade }}>
        {/* The name, printed into the map under everything else. */}
        <h1 className="pointer-events-none absolute inset-x-0 bottom-[13svh] select-none text-center md:bottom-[15svh]">
          <span className="sr-only">
            Efe Aizesogie — EFECODE, frontend engineer building fast, considered interfaces.
          </span>
          <span aria-hidden className="type-mega block">
            Efe Aizesogie
          </span>
        </h1>

        <div className="absolute bottom-6 left-1/2 z-[5] -translate-x-1/2 md:bottom-8">
          <HeroLinks />
        </div>

        {/* Sticky note */}
        <DeskObject
          bounds={ref}
          rotate={-4}
          delay={0.2}
          className="left-[5%] top-[13%] w-48 bg-[oklch(0.86_0.12_88)] p-4 md:left-[8%] md:top-[20%] md:w-64 md:p-5"
        >
          <p className="font-prose text-[1.05rem] italic leading-snug text-ink md:text-[1.35rem]">
            I build fast, considered interfaces for fintech, healthcare and commerce.
          </p>
          <p className="type-meta mt-4 text-ink/60">Pick anything up.</p>
        </DeskObject>

        {/* Clock */}
        <DeskObject
          bounds={ref}
          rotate={3}
          delay={0.35}
          className="right-[5%] top-[16%] rounded-[4px] bg-paper p-3 md:right-[7%] md:top-[40%] md:p-4"
        >
          <Clock />
        </DeskObject>

        {/* Business card */}
        <DeskObject
          bounds={ref}
          rotate={-6}
          delay={0.5}
          className="hidden w-72 rounded-[3px] bg-ink p-5 text-paper md:left-[9%] md:top-[50%] md:block"
        >
          <p className="font-display text-xl font-semibold tracking-tight">Efe Aizesogie</p>
          <p className="type-meta mt-1 text-paper/70">Frontend Engineer</p>
          <a
            href={`mailto:${links.email}`}
            onPointerDown={(e) => e.stopPropagation()}
            className="type-meta mt-6 block text-signal hover:underline"
          >
            {links.email}
          </a>
        </DeskObject>

        {/* Project printouts */}
        {PRINTS.map((print, i) => {
          const project = featuredProjects.find((p) => p.slug === print.slug);
          if (!project) return null;
          return (
            <DeskObject
              key={print.slug}
              bounds={ref}
              rotate={print.rotate}
              delay={0.6 + i * 0.12}
              className={`${print.place} w-44 bg-white p-2 pb-2.5 md:w-72 md:p-2.5 md:pb-3`}
            >
              <img
                src={print.shot}
                alt={`${project.title} interface`}
                draggable={false}
                className="aspect-[16/10] w-full object-cover object-left-top"
              />
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                data-cursor="Visit"
                onPointerDown={(e) => e.stopPropagation()}
                className="mt-2 flex items-center justify-between font-display text-sm font-semibold tracking-tight text-ink hover:text-signal md:text-base"
              >
                {project.title}
                <span aria-hidden>↗</span>
              </a>
            </DeskObject>
          );
        })}
      </motion.div>
    </section>
  );
}
