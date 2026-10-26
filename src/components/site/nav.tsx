"use client";

/*
 * Site navigation — the map menu.
 * The header is just the name and a Menu key. Opening it lays the sections
 * out on a live contour map, each on its own peak. M toggles it, Esc closes
 * it and the number keys jump straight to a section.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { links, sections } from "@/lib/portfolio";
import { Magnetic } from "./interactions";
import { TerrainCanvas } from "./terrain";

/* The section in view, scroll state, the UK clock and smooth jumps. */
function useNavState() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState("index");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });

    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 30_000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
      window.clearInterval(id);
    };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    // Sections live on the home page; from other routes, go home to them.
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.assign(id === "index" ? "/" : `/#${id}`);
  };

  const currentIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === current),
  );

  return { scrolled, current, currentIndex, clock, go, sections };
}

/* Where each section's peak sits on the map, as viewport percentages. */
const PEAKS = [
  { x: 12, y: 30 },
  { x: 44, y: 22 },
  { x: 72, y: 32 },
  { x: 20, y: 58 },
  { x: 52, y: 52 },
  { x: 78, y: 64 },
  { x: 38, y: 78 },
];

function Key({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-[4px] border border-ink/25 px-1.5 font-mono text-[0.7rem] leading-none text-ink/70 shadow-[0_2px_0_oklch(0.185_0.006_60/0.18)]">
      {children}
    </kbd>
  );
}

export function Nav() {
  const { scrolled, current, go, sections } = useNavState();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  const jump = (id: string) => {
    setOpen(false);
    go(id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /input|textarea|select/i.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") setOpen(false);
      else if (e.key.toLowerCase() === "m") setOpen((v) => !v);
      else if (/^[1-9]$/.test(e.key)) {
        const s = sections[Number(e.key) - 1];
        if (s) jump(s.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          scrolled && !open ? "bg-paper/85 backdrop-blur-[2px]" : ""
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
          <button
            onClick={() => jump("index")}
            className="font-display text-base font-semibold tracking-tight text-ink"
          >
            Efe Aizesogie
          </button>
          <Magnetic strength={0.25}>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="map-menu"
              className="type-label flex items-center gap-3 text-ink"
            >
              {open ? "Close" : "Menu"}
              <Key>{open ? "Esc" : "M"}</Key>
            </button>
          </Magnetic>
        </div>
        <motion.div className="h-px origin-left bg-signal" style={{ scaleX: progress }} />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="map-menu"
            aria-label="Sections"
            className="fixed inset-0 z-[79] overflow-hidden bg-paper"
            initial={{ clipPath: "circle(0% at calc(100% - 4rem) 2.25rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 4rem) 2.25rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 4rem) 2.25rem)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden className="absolute inset-0">
              <TerrainCanvas animate readout={false} />
            </div>

            <ol className="shell relative flex h-full flex-col justify-center gap-1 pt-16 md:block md:max-w-none md:p-0">
              {sections.map((s, i) => {
                const peak = PEAKS[i % PEAKS.length]!;
                const on = s.id === current;
                return (
                  <motion.li
                    key={s.id}
                    className="md:absolute md:-translate-x-1/2 md:-translate-y-1/2"
                    style={{ left: `${peak.x}%`, top: `${peak.y}%` }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      onClick={() => jump(s.id)}
                      data-cursor="Go"
                      aria-current={on ? "location" : undefined}
                      className="group flex items-center gap-3 py-1 text-left"
                    >
                      <span className="relative flex h-3 w-3 items-center justify-center">
                        {on && (
                          <span className="absolute h-8 w-8 animate-ping rounded-full border border-signal/60" />
                        )}
                        <span
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            on ? "bg-signal" : "bg-ink group-hover:bg-signal"
                          }`}
                        />
                      </span>
                      <span
                        className={`type-display !text-[clamp(2.2rem,5vw,4.4rem)] transition-colors ${
                          on ? "text-signal" : "text-ink group-hover:text-signal"
                        }`}
                      >
                        {s.label}
                      </span>
                      <span className="hidden md:inline">
                        <Key>{String(i + 1)}</Key>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>

            <div className="shell absolute inset-x-0 bottom-8 flex flex-wrap items-center justify-between gap-4">
              <a
                href={`mailto:${links.email}`}
                className="type-label rounded-full bg-ink px-4 py-2.5 text-paper transition-colors hover:bg-signal"
              >
                Available for work
              </a>
              <div className="flex items-center gap-6">
                <a
                  href="/projects"
                  className="type-label link-underline text-ink-soft hover:text-signal"
                >
                  All projects
                </a>
                <a
                  href={links.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="type-label link-underline text-ink-soft"
                >
                  Résumé ↗
                </a>
                <span className="type-label hidden items-center gap-2 text-ink-soft md:flex">
                  <Key>1</Key>–<Key>{String(sections.length)}</Key> to jump
                </span>
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
