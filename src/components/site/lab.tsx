"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { experiments } from "@/lib/portfolio";
import { RevealText } from "./motion-primitives";

/**
 * Creative lab — an index list where hovering a row summons the artefact
 * itself, tracked to the pointer. Nothing is shown until you go looking.
 */
export function Lab() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.7 });

  return (
    <section
      id="lab"
      className="relative py-20 md:py-32"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="type-display">
            <RevealText text="The Lab" stagger={0.05} />
          </h2>
          <p className="type-label max-w-[36ch] text-ink-soft">
            Experiments, concepts and client work that taught me something. Hover to look.
          </p>
        </div>

        <ul className="mt-12 md:mt-16">
          {experiments.map((p, i) => (
            <li key={p.title}>
              <div
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-4 border-t border-rule py-6 last:border-b md:grid-cols-[3rem_1.4fr_1fr_7rem] md:py-7"
                onMouseEnter={(e) => {
                  x.set(e.clientX);
                  y.set(e.clientY);
                  setActive(i);
                }}
                onMouseLeave={() => setActive(null)}
              >
                <span className="type-label text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <motion.a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Visit"
                  className="type-title hover:text-signal"
                  animate={{ x: active === i && !reduced ? 14 : 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {p.title} ↗
                </motion.a>
                <span className="type-meta col-start-2 text-ink-soft md:col-start-3">
                  {p.note}
                </span>
                <span className="type-label col-start-2 flex gap-4 text-ink-soft md:col-start-4 md:justify-end">
                  {p.kind}
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="Code"
                    className="link-underline hover:text-signal"
                  >
                    Code
                  </a>
                </span>
              </div>
            </li>

          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active !== null && !reduced ? (
          <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[60] hidden aspect-[16/10] w-[26rem] overflow-hidden lg:block -mt-[8.125rem] -ml-[13rem]"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={experiments[active]!.image}
              alt={`${experiments[active]!.title} preview`}
              className="h-full w-full object-cover object-top"
            />
            <span className="type-label absolute bottom-3 left-3 bg-signal px-2 py-1 text-signal-ink">
              {experiments[active]!.stack}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Touch devices get the artefacts inline rather than on hover */}
      <div className="shell mt-10 grid grid-cols-2 gap-3 lg:hidden">
        {experiments.slice(0, 4).map((p) => (
          <a key={p.title} href={p.live} target="_blank" rel="noreferrer" className="block">
            <figure className="overflow-hidden">
              <img
                src={p.image}
                alt={`${p.title} preview`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover object-top"
              />
              <figcaption className="type-label mt-2 text-ink-soft">{p.title} ↗</figcaption>
            </figure>
          </a>
        ))}

      </div>
    </section>
  );
}
