"use client";

/*
 * Navbar option N4 — Survey line.
 * One flat line of text across the top, read like a survey record: name,
 * the section in view (which opens a compact section list), coordinates,
 * local time and contact. No buttons, no bar.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { links } from "@/lib/portfolio";
import { useNavState } from "./nav-state";

export function NavSurvey() {
  const { scrolled, current, currentIndex, clock, go, sections } = useNavState();
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!listRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = sections.find((s) => s.id === current)?.label ?? "Index";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
        scrolled ? "bg-paper/85 backdrop-blur-[2px]" : ""
      }`}
    >
      <div className="shell flex h-14 items-center gap-6 border-b border-rule md:h-16 md:gap-10">
        <button
          onClick={() => go("index")}
          className="font-display text-[0.95rem] font-semibold tracking-tight text-ink"
        >
          Efe Aizesogie
        </button>

        <div ref={listRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="true"
            className="type-meta flex items-center gap-2 text-ink"
          >
            <span className="text-ink-soft">§{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="relative inline-block h-[1.5em] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={label}
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </span>
            <span
              aria-hidden
              className={`text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.ol
                className="absolute left-0 top-full mt-3 min-w-56 rounded-[4px] border border-rule bg-paper p-2 shadow-[0_20px_40px_-24px_rgb(0_0_0/0.45)]"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        go(s.id);
                      }}
                      className={`type-meta flex w-full items-center gap-3 rounded-[3px] px-3 py-2 text-left hover:bg-ink/5 ${
                        s.id === current ? "text-signal" : "text-ink"
                      }`}
                    >
                      <span className="text-ink-soft">§{String(i + 1).padStart(2, "0")}</span>
                      {s.label}
                    </button>
                  </li>
                ))}
              </motion.ol>
            )}
          </AnimatePresence>
        </div>

        <span className="type-meta hidden text-ink-soft lg:inline">6.3350° N 5.6037° E</span>
        <span className="type-meta hidden text-ink-soft md:inline">{clock}</span>

        <div className="ml-auto flex items-center gap-6">
          <a
            href={links.resume}
            target="_blank"
            rel="noreferrer"
            className="type-meta link-underline hidden text-ink-soft hover:text-ink sm:inline"
          >
            Résumé
          </a>
          <a href={`mailto:${links.email}`} className="type-meta link-underline text-signal">
            Email
          </a>
        </div>
      </div>
      <motion.div className="h-px origin-left bg-signal" style={{ scaleX: progress }} />
    </header>
  );
}
