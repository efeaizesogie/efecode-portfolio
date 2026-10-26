"use client";

/*
 * Testimonials — spotlight view.
 * One quote at a time, large and in serif, under an oversized signal
 * quotation mark. Arrows step through them; it advances slowly on its own
 * but pauses on hover or focus, and never moves for reduced-motion users.
 */

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { testimonials } from "@/lib/portfolio";
import { QuotesHeading } from "./heading";

const INTERVAL = 8000;

export function QuotesSpotlight({ toggle }: { toggle: ReactNode }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const t = testimonials[i]!;

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setTimeout(() => setI((v) => (v + 1) % n), INTERVAL);
    return () => window.clearTimeout(id);
  }, [i, paused, reduced, n]);

  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <section
      id="testimonials"
      data-contour
      aria-roledescription="carousel"
      aria-label="Testimonials"
      className="py-20 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="shell">
        <QuotesHeading aside={toggle} />

        <div className="relative mt-12 grid gap-6 md:mt-16 md:grid-cols-[6rem_1fr] md:gap-10">
          <span
            aria-hidden
            className="font-prose text-[4.5rem] leading-[0.6] text-signal md:text-[10rem] md:leading-[0.7]"
          >
            “
          </span>
          <div className="min-h-[22rem] md:min-h-[18rem]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="max-w-[34ch] font-prose text-[clamp(1.5rem,3vw,2.6rem)] leading-[1.25] tracking-[-0.01em] text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-baseline gap-3">
                  <span className="font-display text-lg font-semibold tracking-tight">
                    {t.name}
                  </span>
                  <span className="type-meta text-ink-soft">{t.handle}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-rule pt-6 md:ml-[8.5rem]">
          <span className="type-label text-ink-soft" aria-live="polite">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-signal hover:text-signal"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-signal hover:text-signal"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
