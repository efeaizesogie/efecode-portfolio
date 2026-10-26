"use client";

/* The "where was this used" readout shared by the interactive Stack options. */

import { motion, AnimatePresence } from "motion/react";
import type { Tool } from "./stack-data";

export function Readout({ tool }: { tool: Tool }) {
  const where = [...tool.projects, ...tool.roles.map((r) => `${r} (role)`)];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tool.name}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <p className="type-display !text-[clamp(2rem,4vw,3.4rem)]">{tool.name}</p>
        <p className="type-prose mt-3 text-ink/80">
          {where.length === 0
            ? "Part of the toolkit, not yet credited on a listed project."
            : `Used in ${tool.projects.length} project${tool.projects.length === 1 ? "" : "s"}${
                tool.roles.length
                  ? ` and ${tool.roles.length} role${tool.roles.length === 1 ? "" : "s"}`
                  : ""
              }${tool.since ? `, since ${tool.since}` : ""}.`}
        </p>
        {where.length > 0 && (
          <p className="type-meta mt-4 max-w-[52ch] text-ink-soft">{where.join(" · ")}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
