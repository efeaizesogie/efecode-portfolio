"use client";

/*
 * Stack option S1 — Keycap board.
 * The stack laid out as a keyboard. Hovering, focusing or typing a key's
 * first letter presses it, and the readout shows where that tool was used.
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { RevealText } from "../motion-primitives";
import { TOOLS } from "./stack-data";
import { Readout } from "./stack-readout";

/* Keyboard-ish rows with a slight stagger, like real key rows. */
const ROWS = [TOOLS.slice(0, 7), TOOLS.slice(7, 13), TOOLS.slice(13, 19), TOOLS.slice(19)];
const OFFSETS = ["md:pl-0", "md:pl-10", "md:pl-20", "md:pl-14"];

export function StackKeys() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-30% 0px -30% 0px" });
  const [active, setActive] = useState(TOOLS.findIndex((t) => t.name === "React"));
  const tool = TOOLS[active] ?? TOOLS[0]!;

  // Typing a letter while the board is on screen presses the next key
  // whose name starts with it.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /input|textarea|select/i.test(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const letter = e.key.toLowerCase();
      if (!/[a-z]/.test(letter)) return;
      setActive((cur) => {
        for (let step = 1; step <= TOOLS.length; step++) {
          const i = (cur + step) % TOOLS.length;
          if (TOOLS[i]!.name.toLowerCase().startsWith(letter)) return i;
        }
        return cur;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView]);

  return (
    <section id="stack" ref={ref} data-contour className="border-y border-rule py-20 md:py-32">
      <div className="shell">
        <h2 className="type-display">
          <RevealText text="Stack" stagger={0.05} />
        </h2>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div
            role="listbox"
            aria-label="Tools"
            aria-activedescendant={`key-${active}`}
            className="flex flex-col gap-2.5 md:gap-3"
          >
            {ROWS.map((row, r) => (
              <div key={r} className={`flex flex-wrap gap-2.5 md:gap-3 ${OFFSETS[r]}`}>
                {row.map((t) => {
                  const i = TOOLS.indexOf(t);
                  const on = i === active;
                  const geo = t.group === "Geospatial";
                  return (
                    <button
                      key={t.name}
                      id={`key-${i}`}
                      role="option"
                      aria-selected={on}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`relative flex h-16 w-16 flex-col justify-between rounded-[8px] border p-2 text-left transition-[transform,box-shadow,background-color] duration-150 md:h-20 md:w-20 md:p-2.5 ${
                        on
                          ? "translate-y-[3px] border-signal bg-signal text-signal-ink shadow-[0_1px_0_oklch(0.45_0.18_33)]"
                          : `border-ink/15 text-ink shadow-[0_4px_0_oklch(0.185_0.006_60/0.16)] ${
                              geo ? "bg-[oklch(0.9_0.02_150)]" : "bg-[oklch(0.965_0.008_84)]"
                            } hover:-translate-y-px`
                      } ${t.name.length > 9 ? "md:w-28" : ""}`}
                    >
                      <span className="font-display text-lg font-semibold leading-none tracking-tight md:text-xl">
                        {t.short}
                      </span>
                      <span
                        className={`truncate font-mono text-[0.6rem] leading-none ${on ? "text-signal-ink/80" : "text-ink/55"}`}
                      >
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
            <p className="type-meta mt-4 text-ink-soft">Hover a key, or type a letter.</p>
          </div>

          <div aria-live="polite" className="lg:pt-2">
            <Readout tool={tool} />
          </div>
        </div>
      </div>
    </section>
  );
}
