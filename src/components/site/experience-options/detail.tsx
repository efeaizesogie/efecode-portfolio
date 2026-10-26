"use client";

/* The selected-role readout shared by the interactive Experience layouts. */

import { motion, AnimatePresence } from "motion/react";
import { RevealText } from "../motion-primitives";
import { duration, stackLine, type Role } from "./data";

export function ExperienceHeading() {
  return (
    <h2 className="type-display">
      <RevealText text="Experience" stagger={0.05} />
    </h2>
  );
}

export function RoleDetail({ role }: { role: Role }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role.company}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <p className="type-title">
          {role.company}
          <span className="text-ink/45"> · {role.role}</span>
        </p>
        <p className="type-meta mt-2 text-ink-soft">
          {role.period} · {duration(role.months)} · {role.place}
        </p>
        <p className="type-prose mt-4 max-w-[54ch] text-ink/80">{role.summary}</p>
        <p className="type-meta mt-4 max-w-[60ch] text-ink-soft">{stackLine(role)}</p>
      </motion.div>
    </AnimatePresence>
  );
}
