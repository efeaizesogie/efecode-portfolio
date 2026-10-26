"use client";

import { Link } from "@tanstack/react-router";
import { ALL_PROJECTS } from "./data";

/* The way out of Selected Work to the full /projects index. */
export function ViewAllProjects() {
  return (
    <Link
      to="/projects"
      data-cursor="View"
      className="group inline-flex items-baseline gap-4 border-b border-ink/40 pb-2 transition-colors hover:border-signal"
    >
      <span className="type-title transition-colors group-hover:text-signal">
        View all {ALL_PROJECTS.length} projects
      </span>
      <span
        aria-hidden
        className="type-title transition-transform duration-500 group-hover:translate-x-2 group-hover:text-signal"
      >
        →
      </span>
    </Link>
  );
}
