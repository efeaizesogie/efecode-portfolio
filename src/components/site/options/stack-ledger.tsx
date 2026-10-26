"use client";

/*
 * Stack option S4 — Tool ledger.
 * A quiet editorial table, sortable by any column: tool, the year it first
 * shows up, and how many projects and roles used it.
 */

import { useMemo, useState } from "react";
import { RevealText } from "../motion-primitives";
import { TOOLS, type Tool } from "./stack-data";

type Col = "name" | "since" | "projects" | "roles";

const value = (t: Tool, c: Col) =>
  c === "name"
    ? t.name.toLowerCase()
    : c === "since"
      ? (t.since ?? 9999)
      : c === "projects"
        ? t.projects.length
        : t.roles.length;

export function StackLedger() {
  const [sort, setSort] = useState<{ col: Col; dir: 1 | -1 }>({ col: "projects", dir: -1 });

  const rows = useMemo(
    () =>
      [...TOOLS].sort((a, b) => {
        const va = value(a, sort.col);
        const vb = value(b, sort.col);
        if (va === vb) return a.name.localeCompare(b.name);
        return va < vb ? -sort.dir : sort.dir;
      }),
    [sort],
  );

  const head = (col: Col, label: string, className = "") => (
    <th
      scope="col"
      className={`py-3 font-normal ${className}`}
      aria-sort={sort.col === col ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
    >
      <button
        onClick={() =>
          setSort((s) => ({
            col,
            dir:
              s.col === col ? (s.dir === 1 ? -1 : 1) : col === "name" || col === "since" ? 1 : -1,
          }))
        }
        className={`type-label inline-flex items-center gap-1.5 ${sort.col === col ? "text-signal" : "text-ink-soft hover:text-ink"}`}
      >
        {label}
        <span aria-hidden>{sort.col === col ? (sort.dir === 1 ? "↑" : "↓") : ""}</span>
      </button>
    </th>
  );

  return (
    <section id="stack" data-contour className="border-y border-rule py-20 md:py-32">
      <div className="shell">
        <h2 className="type-display">
          <RevealText text="Stack" stagger={0.05} />
        </h2>

        <table className="mt-12 w-full border-collapse text-left md:mt-16">
          <thead>
            <tr className="border-b border-ink/40">
              {head("name", "Tool")}
              {head("since", "Since", "w-20 md:w-32")}
              {head("projects", "Projects", "w-24 md:w-40")}
              {head("roles", "Roles", "hidden w-32 md:table-cell")}
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr
                key={t.name}
                className="group border-b border-rule transition-colors hover:bg-ink/[0.03]"
              >
                <td className="py-4 pr-4 md:py-5">
                  <span className="type-title">{t.name}</span>
                  {t.projects.length > 0 && (
                    <span className="type-meta mt-1 hidden text-ink-soft group-hover:block">
                      {t.projects.join(" · ")}
                    </span>
                  )}
                </td>
                <td className="type-meta py-4 text-ink-soft md:py-5">{t.since ?? "—"}</td>
                <td
                  className={`type-meta py-4 md:py-5 ${t.projects.length ? "text-signal" : "text-ink-soft"}`}
                >
                  {t.projects.length || "—"}
                </td>
                <td className="type-meta hidden py-4 text-ink-soft md:table-cell md:py-5">
                  {t.roles.length || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
