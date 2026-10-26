"use client";

/*
 * Navbar option N2 — Scale bar.
 * A map scale bar floats at the bottom: one alternating segment per section,
 * the current one in signal and everything before it filled. The top keeps
 * only the name, the Benin City clock and email.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { links } from "@/lib/portfolio";
import { useNavState } from "./nav-state";

export function NavScale() {
  const { scrolled, currentIndex, clock, go, sections } = useNavState();
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? currentIndex;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          scrolled ? "bg-paper/85 backdrop-blur-[2px]" : ""
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
          <button
            onClick={() => go("index")}
            className="font-display text-base font-semibold tracking-tight text-ink"
          >
            Efe Aizesogie
          </button>
          <div className="flex items-center gap-5">
            <span className="type-label hidden text-ink-soft sm:inline">{clock} Benin City</span>
            <a
              href={`mailto:${links.email}`}
              className="type-label rounded-full bg-ink px-4 py-2.5 text-paper transition-colors hover:bg-signal"
            >
              Available for work
            </a>
          </div>
        </div>
      </header>

      <nav
        aria-label="Sections"
        className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-ink/15 bg-paper/90 px-5 pb-2.5 pt-2 shadow-[0_10px_30px_-18px_rgb(0_0_0/0.5)] backdrop-blur md:bottom-7"
        onMouseLeave={() => setHover(null)}
      >
        <div className="relative mb-1.5 h-4 overflow-hidden text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={shown}
              className="type-label block !text-[0.62rem] text-ink"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {sections[shown]?.label}
            </motion.span>
          </AnimatePresence>
        </div>
        <ol className="flex items-end">
          {sections.map((s, i) => {
            const on = i === currentIndex;
            const passed = i < currentIndex;
            return (
              <li key={s.id} className="relative">
                <button
                  onClick={() => go(s.id)}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={s.label}
                  aria-current={on ? "location" : undefined}
                  className="group block px-0 py-1.5"
                >
                  <span
                    className={`block h-2 w-8 border border-ink transition-colors duration-300 sm:w-11 md:w-14 ${
                      on
                        ? "border-signal bg-signal"
                        : passed
                          ? "bg-ink"
                          : i % 2 === 0
                            ? "bg-ink/80 group-hover:bg-signal/70"
                            : "bg-paper group-hover:bg-signal/40"
                    }`}
                  />
                </button>
                <span aria-hidden className="absolute -bottom-1 left-0 h-1.5 w-px bg-ink/60" />
              </li>
            );
          })}
          <li aria-hidden className="h-1.5 w-px self-end bg-ink/60" />
        </ol>
      </nav>
    </>
  );
}
