"use client";

import { Magnetic } from "../interactions";
import { links } from "@/lib/portfolio";

/* Pieces every hero option shares, so the four directions differ only in
 * their idea, not their copy. */

export const HERO_NAME = "Efe Aizesogie";
export const HERO_LINE =
  "Frontend engineer building fast, considered interfaces for fintech, healthcare and commerce.";

export function HeroTitleSr() {
  return (
    <span className="sr-only">
      Efe Aizesogie — EFECODE, frontend engineer building fast, considered interfaces.
    </span>
  );
}

export function HeroLinks({ tone = "ink" }: { tone?: "ink" | "light" }) {
  const base =
    tone === "ink"
      ? "border-ink hover:bg-ink hover:text-paper"
      : "border-void-foreground hover:bg-void-foreground hover:text-void";
  const quiet =
    tone === "ink"
      ? "text-ink-soft hover:text-signal"
      : "text-void-foreground/70 hover:text-signal";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Magnetic strength={0.28}>
        <a
          href="#work"
          data-cursor="View"
          className={`type-label inline-block rounded-full border px-5 py-3 transition-colors duration-300 ${base}`}
        >
          Selected Work
        </a>
      </Magnetic>
      <Magnetic strength={0.28}>
        <a
          href={links.resume}
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
          className={`type-label inline-block rounded-full px-5 py-3 transition-colors duration-300 ${quiet}`}
        >
          Résumé ↗
        </a>
      </Magnetic>
    </div>
  );
}
