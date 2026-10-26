"use client";

/*
 * Navbar option N3 — Index rail.
 * A thin numbered rail down the left edge. The section in view opens out to
 * its name and a signal line tracks progress down the page. The top-right
 * corner only says hello. On phones the rail becomes an Index overlay.
 */

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { links } from "@/lib/portfolio";
import { Magnetic } from "../interactions";
import { useNavState } from "./nav-state";

export function NavRail() {
  const { current, go, sections } = useNavState();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  const jump = (id: string) => {
    setOpen(false);
    go(id);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[80]">
        <div className="shell flex h-16 items-center justify-end gap-5 md:h-[4.5rem]">
          <a
            href={links.resume}
            target="_blank"
            rel="noreferrer"
            className="type-label link-underline pointer-events-auto hidden text-ink-soft hover:text-signal md:inline"
          >
            Résumé
          </a>
          <Magnetic strength={0.25} className="pointer-events-auto">
            <a
              href={`mailto:${links.email}`}
              className="type-label inline-block rounded-full bg-ink px-4 py-2.5 text-paper transition-colors hover:bg-signal"
            >
              Say hello
            </a>
          </Magnetic>
          <button
            onClick={() => setOpen((v) => !v)}
            className="type-label pointer-events-auto md:hidden"
            aria-expanded={open}
          >
            {open ? "Close" : "Index"}
          </button>
        </div>
      </div>

      <nav
        aria-label="Sections"
        className="fixed left-3 top-1/2 z-[80] hidden -translate-y-1/2 md:block lg:left-5"
        onMouseLeave={() => setHover(null)}
      >
        <button
          onClick={() => jump("index")}
          className="mb-6 block font-display text-sm font-semibold tracking-tight text-ink"
          aria-label="Back to top"
        >
          EA
        </button>
        <div className="relative pl-4">
          <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-ink/15" />
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px origin-top bg-signal"
            style={{ scaleY: progress }}
          />
          <ol className="flex flex-col gap-3">
            {sections.map((s, i) => {
              const on = s.id === current;
              const expanded = on || hover === s.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => jump(s.id)}
                    onMouseEnter={() => setHover(s.id)}
                    onFocus={() => setHover(s.id)}
                    aria-current={on ? "location" : undefined}
                    className="flex items-center gap-2 rounded-full bg-paper/0 py-0.5 pr-2 text-left"
                  >
                    <span
                      className={`type-label !text-[0.68rem] ${on ? "text-signal" : "text-ink/50"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.span
                          className={`type-label overflow-hidden whitespace-nowrap rounded-[2px] bg-paper/90 px-1 !text-[0.68rem] ${
                            on ? "text-signal" : "text-ink"
                          }`}
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {s.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[79] bg-paper md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="shell flex h-full flex-col justify-center gap-2 pt-16">
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className="type-display flex items-baseline gap-4 py-1 text-left"
                >
                  <span className="type-label text-signal">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
