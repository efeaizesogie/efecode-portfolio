"use client";

/*
 * Stack option S3 — Layers panel.
 * A GIS-style layers panel: each skill group is a layer with a visibility
 * toggle. Layers that are on light up every project that used one of their
 * tools; the rest of the map dims.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { RevealText } from "../motion-primitives";
import { GROUPS, PROJECT_THUMBS, TOOLS, usesTool } from "./stack-data";

export function StackLayers() {
  const [on, setOn] = useState<Set<string>>(() => new Set([GROUPS[1]!]));
  const [hoverTool, setHoverTool] = useState<string | null>(null);

  const toggle = (g: string) =>
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const activeTools = hoverTool
    ? [hoverTool]
    : TOOLS.filter((t) => on.has(t.group)).map((t) => t.name);
  const lit = (stack: string[]) => activeTools.some((t) => usesTool(stack, t));
  const litCount = PROJECT_THUMBS.filter((p) => lit(p.stack)).length;
  const roles = [
    ...new Set(TOOLS.filter((t) => activeTools.includes(t.name)).flatMap((t) => t.roles)),
  ];

  return (
    <section id="stack" data-contour className="border-y border-rule py-20 md:py-32">
      <div className="shell">
        <h2 className="type-display">
          <RevealText text="Stack" stagger={0.05} />
        </h2>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[19rem_1fr] lg:gap-14">
          <div className="self-start rounded-[6px] border border-ink/15 bg-paper/80 backdrop-blur-[2px]">
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <span className="font-display text-base font-semibold tracking-tight">Layers</span>
              <span className="type-meta text-ink-soft">
                {litCount} of {PROJECT_THUMBS.length} lit
              </span>
            </div>
            <ul>
              {GROUPS.map((g) => {
                const visible = on.has(g);
                const tools = TOOLS.filter((t) => t.group === g);
                return (
                  <li key={g} className="border-b border-ink/10 last:border-b-0">
                    <button
                      onClick={() => toggle(g)}
                      aria-pressed={visible}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-ink/[0.03]"
                    >
                      <span
                        aria-hidden
                        className={`flex h-4 w-4 items-center justify-center rounded-[3px] border transition-colors ${
                          visible ? "border-signal bg-signal" : "border-ink/40"
                        }`}
                      >
                        {visible && <span className="h-1.5 w-1.5 rounded-full bg-signal-ink" />}
                      </span>
                      <span
                        className={`font-display text-[0.95rem] font-semibold tracking-tight ${visible ? "text-ink" : "text-ink/55"}`}
                      >
                        {g}
                      </span>
                      <span className="type-meta ml-auto text-ink-soft">{tools.length}</span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: visible ? "auto" : 0, opacity: visible ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="flex flex-wrap gap-x-3 gap-y-1 px-4 pb-3 pl-11">
                        {tools.map((t) => (
                          <span
                            key={t.name}
                            onMouseEnter={() => setHoverTool(t.name)}
                            onMouseLeave={() => setHoverTool(null)}
                            className={`type-meta cursor-default transition-colors ${
                              hoverTool === t.name ? "text-signal" : "text-ink/75 hover:text-ink"
                            }`}
                          >
                            {t.name}
                          </span>
                        ))}
                      </p>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {PROJECT_THUMBS.map((p) => {
                const isLit = lit(p.stack);
                return (
                  <motion.figure
                    key={p.title}
                    animate={{ opacity: isLit ? 1 : 0.28, scale: isLit ? 1 : 0.97 }}
                    transition={{ duration: 0.35 }}
                    className={`overflow-hidden rounded-[4px] bg-white p-1.5 ${
                      isLit ? "ring-2 ring-signal" : "ring-1 ring-ink/10 grayscale"
                    }`}
                  >
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover object-left-top"
                    />
                    <figcaption className="type-meta mt-1.5 truncate px-0.5 text-ink">
                      {p.title}
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
            <p className="type-meta mt-5 text-ink-soft" aria-live="polite">
              {roles.length
                ? `Also used at ${roles.join(", ")}.`
                : activeTools.length
                  ? ""
                  : "Switch a layer on to see where it was used."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
