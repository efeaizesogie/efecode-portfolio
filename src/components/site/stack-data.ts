/*
 * Stack usage, derived from what the portfolio already records — never
 * self-rated. For each tool in `skillGroups` we collect the projects (featured
 * work and Lab experiments) and the roles (experience) that list it, plus the
 * earliest year it shows up in either.
 */

import { experience, experiments, featuredProjects, skillGroups } from "@/lib/portfolio";

const ALIASES: Record<string, string> = {
  tailwind: "TailwindCSS",
  "tailwind css": "TailwindCSS",
  tailwindcss: "TailwindCSS",
  ts: "TypeScript",
  js: "JavaScript",
  html5: "HTML",
  css3: "CSS",
};

const canon = (raw: string) => {
  const key = raw.trim().toLowerCase();
  return ALIASES[key] ?? raw.trim();
};

const same = (a: string, b: string) => canon(a).toLowerCase() === canon(b).toLowerCase();

const SHORT: Record<string, string> = {
  JavaScript: "JS",
  TypeScript: "TS",
  HTML: "HTML",
  CSS: "CSS",
  React: "Re",
  "Next.js": "Nx",
  Angular: "Ng",
  Redux: "Rdx",
  GraphQL: "GQL",
  TailwindCSS: "Tw",
  GSAP: "GSAP",
  "Framer Motion": "FM",
  "Three.js": "3js",
  Shadcn: "ui",
  Figma: "Fig",
  Vercel: "▲",
  Git: "Git",
  GitHub: "GH",
  ArcGIS: "Arc",
  QGIS: "QGIS",
  "Remote Sensing": "RS",
  AutoCAD: "CAD",
  "Civil 3D": "C3D",
  "Global Mapper": "GM",
};

export type Tool = {
  name: string;
  short: string;
  group: string;
  projects: string[];
  roles: string[];
  since?: number | undefined;
};

const yearOf = (period: string) => {
  const m = period.match(/\d{4}/);
  return m ? Number(m[0]) : undefined;
};

const projectSources = [
  ...featuredProjects.map((p) => ({ title: p.title, stack: p.stack, year: Number(p.year) })),
  ...experiments.map((e) => ({ title: e.title, stack: e.stack.split("·"), year: undefined })),
];

export const TOOLS: Tool[] = skillGroups.flatMap((g) =>
  g.items.map((name) => {
    const projects = projectSources.filter((p) => p.stack.some((s) => same(s, name)));
    const roles = experience.filter((r) => r.stack.some((s) => same(s, name)));
    const years = [...projects.map((p) => p.year), ...roles.map((r) => yearOf(r.period))].filter(
      (y): y is number => typeof y === "number" && !Number.isNaN(y),
    );
    return {
      name,
      short: SHORT[name] ?? name.slice(0, 3),
      group: g.label,
      projects: projects.map((p) => p.title),
      roles: roles.map((r) => r.company),
      since: years.length ? Math.min(...years) : undefined,
    };
  }),
);

export const GROUPS = skillGroups.map((g) => g.label);

export const weight = (t: Tool) => t.projects.length + t.roles.length;
