"use client";

/*
 * Hero option D — Monolith.
 * One extruded E built from stacked CSS layers, lit from the front. It turns
 * toward the pointer, and scrolling pulls its layers apart into an exploded
 * view. Everything else stays small and out of the way.
 */

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { HERO_LINE, HERO_NAME, HeroLinks, HeroTitleSr } from "./shared";

const LAYERS = 30;
const E_SHAPE =
  "polygon(0 0, 100% 0, 100% 19%, 31% 19%, 31% 40.5%, 86% 40.5%, 86% 59.5%, 31% 59.5%, 31% 81%, 100% 81%, 100% 100%, 0 100%)";

function Layer({ i, gap }: { i: number; gap: MotionValue<number> }) {
  const z = useTransform(gap, (g) => (i - LAYERS / 2) * g);
  const front = i === LAYERS - 1;
  // Darker toward the back so the extrusion reads as depth.
  const light = 0.3 + (i / (LAYERS - 1)) * 0.22;
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        z,
        clipPath: E_SHAPE,
        background: front ? "var(--signal)" : `oklch(${light} 0.13 33)`,
      }}
    />
  );
}

export function HeroMonolith() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 16 });
  const sy = useSpring(py, { stiffness: 70, damping: 16 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const gap = useTransform(scrollYProgress, [0.05, 0.9], [2.4, reduced ? 2.4 : 26]);
  const spin = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 55]);
  const rotateY = useTransform(
    [sx, spin] as MotionValue<number>[],
    ([x = 0, s = 0]: number[]) => -24 + x * 34 + s,
  );
  const rotateX = useTransform(sy, (y) => 12 - y * 22);
  const fade = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  return (
    <section
      id="index"
      ref={ref}
      className="grain relative bg-void text-void-foreground"
      style={{ height: reduced ? "100svh" : "200svh" }}
    >
      {/* Pinned for a screen of scroll so the layers come apart in place. */}
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-24 pb-10 md:pb-14">
        <h1 className="sr-only">
          <HeroTitleSr />
        </h1>

        <div className="flex flex-1 items-center justify-center [perspective:1600px]">
          <motion.div
            aria-hidden
            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[min(52svh,26rem)] w-[min(32svh,16rem)] [transform-style:preserve-3d]"
            style={{ rotateY, rotateX }}
          >
            {Array.from({ length: LAYERS }, (_, i) => (
              <Layer key={i} i={i} gap={gap} />
            ))}
          </motion.div>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[18%] left-1/2 h-10 w-[min(50vw,22rem)] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl"
          />
        </div>

        <motion.div
          style={{ opacity: fade }}
          className="shell relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p aria-hidden className="type-display">
              {HERO_NAME}
            </p>
            <p className="type-prose mt-4 max-w-[44ch] text-void-foreground/75">{HERO_LINE}</p>
          </div>
          <HeroLinks tone="light" />
        </motion.div>
      </div>
    </section>
  );
}
