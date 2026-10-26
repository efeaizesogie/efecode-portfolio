"use client";

/*
 * Testimonials option T2 — Desk notes.
 * The quotes as notes and slips scattered on the page, picking up the hero
 * desk. On wide screens they can be picked up and moved; on phones they
 * simply stack.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { testimonials } from "@/lib/portfolio";
import { RevealText } from "../motion-primitives";

const STYLES = [
  "bg-[oklch(0.86_0.12_88)]",
  "bg-white",
  "bg-[oklch(0.95_0.03_33)]",
  "bg-white",
  "bg-[oklch(0.9_0.05_150)]",
];
const PLACES = [
  "md:left-[2%] md:top-[4%]",
  "md:left-[36%] md:top-[0%]",
  "md:left-[68%] md:top-[8%]",
  "md:left-[12%] md:top-[50%]",
  "md:left-[50%] md:top-[48%]",
];
const TILTS = [-4, 3, -2, 5, -3];

let topZ = 10;

export function QuotesNotes() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [z, setZ] = useState<number[]>(testimonials.map((_, i) => i + 1));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section data-contour className="overflow-x-clip py-20 md:py-32">
      <div className="shell">
        <h2 className="type-display">
          <RevealText text="Kind words" stagger={0.05} />
        </h2>

        <div
          ref={ref}
          className="relative mt-12 flex flex-col gap-6 md:mt-16 md:block md:h-[40rem]"
        >
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.handle}
              drag={wide && !reduced}
              dragConstraints={ref}
              dragElastic={0.12}
              onPointerDown={() => setZ((prev) => prev.map((v, k) => (k === i ? ++topZ : v)))}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: TILTS[i] ?? 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 160, damping: 20 }}
              whileDrag={{ scale: 1.04, rotate: 0 }}
              style={{ zIndex: z[i] }}
              data-cursor={wide ? "Drag" : undefined}
              className={`w-full p-6 shadow-[0_18px_34px_-20px_rgb(0_0_0/0.45)] md:absolute md:w-[22rem] md:cursor-grab md:active:cursor-grabbing ${STYLES[i % STYLES.length]} ${PLACES[i % PLACES.length]}`}
            >
              <blockquote className="font-prose text-[1.08rem] leading-snug text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-baseline justify-between gap-3">
                <span className="font-display text-base font-semibold tracking-tight">
                  {t.name}
                </span>
                <span className="type-meta text-ink/60">{t.handle}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
