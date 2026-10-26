"use client";

/*
 * Selected Work option W1 — Index with live prints.
 * A quiet table of projects on the paper and contours. Hovering a row floats
 * a fanned stack of that site's screenshots beside the cursor; clicking a
 * row opens it in place with all four shots, one line and a Visit link.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { WORK } from "./data";
import { WorkHeading } from "./heading";

function FloatingPrints({ index }: { index: number | null }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX + 28);
      y.set(e.clientY - 120);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!fine || reduced) return null;
  const item = index === null ? null : WORK[index];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] w-72 lg:w-80"
      style={{ x: sx, y: sy }}
    >
      <AnimatePresence>
        {item &&
          item.shots.slice(0, 3).map((src, n) => (
            <motion.img
              key={`${item.slug}-${n}`}
              src={src}
              alt=""
              className="absolute left-0 top-0 aspect-[16/10] w-full rounded-[3px] bg-white object-cover object-left-top p-1 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.55)]"
              style={{ zIndex: 3 - n }}
              initial={{ opacity: 0, scale: 0.9, rotate: 0, x: 0, y: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [-2, 5, -7][n] ?? 0,
                x: n * 14,
                y: n * 10,
              }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, delay: n * 0.04, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
      </AnimatePresence>
    </motion.div>
  );
}

export function WorkIndex() {
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="work" data-contour className="relative py-20 md:py-32">
      <div className="shell">
        <WorkHeading />

        <ol className="mt-12 border-t border-ink/40 md:mt-16" onMouseLeave={() => setHover(null)}>
          {WORK.map((p, i) => {
            const isOpen = open === i;
            return (
              <li key={p.slug} className="border-b border-rule">
                <button
                  onClick={() => {
                    setOpen(isOpen ? null : i);
                    setHover(null);
                  }}
                  onMouseEnter={() => setHover(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`work-${p.slug}`}
                  data-cursor={isOpen ? "Close" : "Open"}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[4rem_1.2fr_1.5fr_5rem_2rem] md:gap-8 md:py-8"
                >
                  <span
                    className={`type-label ${isOpen || hover === i ? "text-signal" : "text-ink-soft"}`}
                  >
                    {p.index}
                  </span>
                  <span className="type-title transition-transform duration-500 group-hover:translate-x-2">
                    {p.title}
                  </span>
                  <span className="type-prose hidden !text-[1rem] text-ink/70 md:block">
                    {p.blurb}
                  </span>
                  <span className="type-meta hidden text-ink-soft md:block">{p.year}</span>
                  <span
                    aria-hidden
                    className={`type-label text-right transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-signal" : "text-ink-soft group-hover:text-signal"
                    }`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`work-${p.slug}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 md:pl-[6rem]">
                        <p className="type-prose max-w-[52ch] text-ink/80 md:hidden">{p.blurb}</p>
                        <div className="mt-4 grid grid-cols-2 gap-2 md:mt-0 md:grid-cols-4 md:gap-3">
                          {p.shots.map((src, n) => (
                            <img
                              key={src}
                              src={src}
                              alt={`${p.title} screen ${n + 1}`}
                              loading="lazy"
                              className="aspect-[16/10] w-full rounded-[3px] bg-white object-cover object-left-top p-1 shadow-[0_10px_24px_-18px_rgb(0_0_0/0.5)]"
                            />
                          ))}
                        </div>
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="Visit"
                          className="type-label link-underline mt-6 inline-block text-signal"
                        >
                          Visit {p.title} ↗
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
      <FloatingPrints index={hover} />
    </section>
  );
}
