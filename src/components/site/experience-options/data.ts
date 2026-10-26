/*
 * Roles prepared for the Experience layouts: periods parsed into month
 * indices (so overlaps and durations can be drawn), one plain line per role,
 * and whether the work was frontend or geospatial.
 */

import { experience } from "@/lib/portfolio";

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const now = new Date();
const NOW = now.getFullYear() * 12 + now.getMonth();

function parseMonth(s: string): number {
  const m = s.trim().match(/([A-Za-z]+)\s+(\d{4})/);
  if (!m) return NOW;
  return Number(m[2]) * 12 + (MONTHS[m[1]!.toLowerCase()] ?? 0);
}

/* One plain line per role, in Efe's voice, condensed from the full write-up. */
const SUMMARY: Record<string, string> = {
  FoxyLabs:
    "Turning UI/UX designs into responsive, reusable React components that hold up across devices.",
  DGIS: "High-precision mapping and spatial analysis in ArcGIS, GPS and total-station fieldwork, and engineering plans in Civil 3D.",
  Balancee: "Kept the Balancee site fast and current with React, GraphQL and Tailwind.",
  "Ascetic Capital LLC":
    "Built an investment firm's website end to end, tuned for speed, SEO and accessibility.",
  "Mercator Technologies Ltd":
    "Led complex frontend components for fintech apps and ran code reviews.",
  Phreetech: "Shipped two Angular projects with a team of interns, coordinated in Jira.",
};

export type Role = {
  company: string;
  role: string;
  place: string;
  period: string;
  start: number;
  end: number;
  current: boolean;
  months: number;
  kind: "frontend" | "geospatial";
  summary: string;
  stack: string[];
};

export const ROLES: Role[] = experience.map((r) => {
  const [from = "", to = ""] = r.period.split(/[—–-]/);
  const current = /present/i.test(to);
  const start = parseMonth(from);
  const end = current ? NOW : parseMonth(to);
  return {
    company: r.company,
    role: r.role,
    place: r.place,
    period: r.period,
    start,
    end,
    current,
    months: Math.max(1, end - start + 1),
    kind: /gis|geomatic/i.test(r.role) ? "geospatial" : "frontend",
    summary: SUMMARY[r.company] ?? r.body.split(". ")[0] + ".",
    stack: r.stack,
  };
});

/* Oldest first, for layouts that build up through time. */
export const ROLES_BY_START = [...ROLES].sort((a, b) => a.start - b.start);

export const FIRST = Math.min(...ROLES.map((r) => r.start));
export const LAST = NOW;

export const yearOf = (m: number) => Math.floor(m / 12);

export function duration(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

export function stamp(m: number) {
  return `${yearOf(m)}.${String((m % 12) + 1).padStart(2, "0")}`;
}

/* Plain-text stack line instead of pills. */
export const stackLine = (r: Role) => r.stack.join(", ");
