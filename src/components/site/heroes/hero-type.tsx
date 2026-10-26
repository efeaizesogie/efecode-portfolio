"use client";

/*
 * Hero option B — Fly-through type.
 * EFECODE fills the screen with real project screens running through the
 * letters. Scrolling zooms into the counter of the O until it swallows the
 * view and hands over to the dark Work section.
 */

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { HERO_LINE, HeroLinks, HeroTitleSr } from "./shared";

const WORD = "EFECODE";
const O_INDEX = 4;
const REEL = [
  "/work/honatrix/1.jpg",
  "/work/traders-launch/1.jpg",
  "/work/clinq/1.jpg",
  "/work/fundedfun/1.jpg",
  "/work/veescents/2.jpg",
  "/work/simple-payroll/1.jpg",
];

const FONT_SIZE = 300;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function HeroType() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const clipId = useId();
  const [box, setBox] = useState({
    x: 0,
    y: -FONT_SIZE * 0.74,
    width: 1040,
    height: FONT_SIZE * 0.76,
  });
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Exponential so the zoom feels like a constant forward speed.
  const zoom = useTransform(scrollYProgress, (p) =>
    reduced ? 1 : Math.pow(46, Math.min(1, Math.max(0, p / 0.85))),
  );
  const lineFade = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const veil = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);

  // Cycle the reel running through the letters.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % REEL.length), 1800);
    return () => window.clearInterval(id);
  }, [reduced]);

  // Fit the viewBox to the set word, and zoom from the centre of the O's
  // counter, both measured from the live glyphs once the font is in.
  useIsoLayoutEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const measure = () => {
      const b = text.getBBox();
      // Trim to cap height so the word sits tight in its box.
      const top = -FONT_SIZE * 0.74;
      const next = { x: b.x, y: top, width: b.width, height: -top + 2 };
      setBox(next);
      const o = text.getExtentOfChar(O_INDEX);
      const x = ((o.x + o.width / 2 - next.x) / next.width) * 100;
      const y = ((-FONT_SIZE * 0.36 - next.y) / next.height) * 100;
      setOrigin(`${x}% ${y}%`);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);

  return (
    <section
      id="index"
      ref={ref}
      className="relative bg-void text-void-foreground"
      style={{ height: reduced ? "100svh" : "260svh" }}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <motion.h1 style={{ scale: zoom, transformOrigin: origin }} className="relative">
            <HeroTitleSr />
            <svg
              aria-hidden
              viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
              className="block h-auto w-[94vw] max-w-[110rem] overflow-visible"
            >
              <defs>
                <clipPath id={clipId}>
                  <text
                    ref={textRef}
                    x="0"
                    y="0"
                    fontSize={FONT_SIZE}
                    fontWeight={800}
                    letterSpacing={-FONT_SIZE * 0.06}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {WORD}
                  </text>
                </clipPath>
              </defs>
              <g clipPath={`url(#${clipId})`}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  className="fill-void-foreground"
                />
                {REEL.map((src, i) => (
                  <image
                    key={src}
                    href={src}
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    preserveAspectRatio="xMinYMin slice"
                    style={{ opacity: i === frame ? 1 : 0, transition: "opacity 0.9s ease-in-out" }}
                  />
                ))}
              </g>
              {/* A hairline so the letters still read on dark frames. */}
              <text
                x="0"
                y="0"
                fontSize={FONT_SIZE}
                fontWeight={800}
                letterSpacing={-FONT_SIZE * 0.06}
                fill="none"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                className="stroke-void-foreground/40"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {WORD}
              </text>
            </svg>
          </motion.h1>
        </div>

        <motion.div
          style={{ opacity: lineFade }}
          className="shell flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:pb-14"
        >
          <p className="type-prose max-w-[44ch] text-void-foreground/80">{HERO_LINE}</p>
          <HeroLinks tone="light" />
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-void"
          style={{ opacity: veil }}
        />
      </div>
    </section>
  );
}
