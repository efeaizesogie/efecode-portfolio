"use client";

/*
 * Hero option C — The desk.
 * A top-down work surface. The name is printed into the desk itself; on top
 * sit objects you can pick up and throw around: a note, a live clock, a
 * business card and project printouts.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { featuredProjects, links } from "@/lib/portfolio";
import { HeroLinks, HeroTitleSr } from "./shared";

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

export function HeroDesk() {
  const ref = useRef<HTMLElement>(null);
  const prints = [featuredProjects[1], featuredProjects[2], featuredProjects[4]].filter(Boolean);
  const printShots = ["/work/traders-launch/1.jpg", "/work/clinq/1.jpg", "/work/fundedfun/1.jpg"];

  return (
    <section
      id="index"
      ref={ref}
      className="grain relative min-h-[100svh] overflow-hidden bg-[oklch(0.9_0.012_80)] pt-24"
    >
      {/* The name, printed into the desk under everything else. */}
      <h1 className="pointer-events-none absolute inset-x-0 bottom-[14svh] select-none text-center md:bottom-[10svh]">
        <HeroTitleSr />
        <span aria-hidden className="type-mega block text-ink/[0.9]">
          Efe Aizesogie
        </span>
      </h1>

      <div className="pointer-events-auto absolute bottom-6 left-1/2 z-[5] -translate-x-1/2 md:bottom-8">
        <HeroLinks />
      </div>

      {/* Sticky note */}
      <DeskObject
        bounds={ref}
        rotate={-4}
        delay={0.2}
        className="left-[6%] top-[16%] w-52 bg-[oklch(0.86_0.12_88)] p-5 md:left-[10%] md:top-[18%] md:w-64"
      >
        <p className="font-prose text-[1.15rem] italic leading-snug text-ink md:text-[1.35rem]">
          I build fast, considered interfaces for fintech, healthcare and commerce.
        </p>
        <p className="type-meta mt-4 text-ink/60">Pick anything up.</p>
      </DeskObject>

      {/* Clock */}
      <DeskObject
        bounds={ref}
        rotate={0}
        delay={0.35}
        className="right-[8%] top-[15%] rounded-[4px] bg-paper p-4 md:right-[12%] md:top-[18%]"
      >
        <Clock />
      </DeskObject>

      {/* Business card */}
      <DeskObject
        bounds={ref}
        rotate={6}
        delay={0.5}
        className="bottom-[34%] right-[6%] w-56 rounded-[3px] bg-ink p-5 text-paper md:bottom-[36%] md:right-[30%] md:w-72"
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
      {prints.map((p, i) => (
        <DeskObject
          key={p!.slug}
          bounds={ref}
          rotate={[-7, 3, -2][i]!}
          delay={0.6 + i * 0.12}
          className={`${
            [
              "left-[4%] top-[50%] md:left-[30%] md:top-[14%]",
              "hidden md:block md:left-[54%] md:top-[30%]",
              "hidden md:block md:left-[6%] md:top-[52%]",
            ][i]
          } w-56 bg-white p-2.5 pb-3 md:w-64`}
        >
          <img
            src={printShots[i]}
            alt={`${p!.title} interface`}
            draggable={false}
            className="aspect-[16/10] w-full object-cover object-left-top"
          />
          <a
            href="#work"
            onPointerDown={(e) => e.stopPropagation()}
            className="mt-2 block font-display text-base font-semibold tracking-tight text-ink hover:text-signal"
          >
            {p!.title}
          </a>
        </DeskObject>
      ))}
    </section>
  );
}
