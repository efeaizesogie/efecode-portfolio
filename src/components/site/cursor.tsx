"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * A two-part cursor: a precise dot that tracks 1:1 and a lagging ring that
 * reads the page's interactive intent (link, project, view).
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(any-pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-fine-pointer");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor],a,button",
      );
      if (el) {
        setActive(true);
        setLabel(el.dataset["cursor"] ?? null);
      } else {
        setActive(false);
        setLabel(null);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("has-fine-pointer");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-signal"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border border-ink/40"
        style={{ x: reduced ? x : rx, y: reduced ? y : ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 92 : active ? 46 : 30,
          height: label ? 92 : active ? 46 : 30,
          backgroundColor: label ? "var(--signal)" : "transparent",
          borderColor: label ? "var(--signal)" : "var(--rule)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {label ? (
          <span className="type-label text-signal-ink">{label}</span>
        ) : null}
      </motion.div>
    </div>
  );
}
