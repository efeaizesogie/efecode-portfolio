/*
 * Short copy and screenshots for each featured project, shared by every
 * Selected Work layout.
 */

import { experiments, featuredProjects, type Project } from "@/lib/portfolio";

const shotsFor = (slug: string) => [1, 2, 3, 4].map((n) => `/work/${slug}/${n}.jpg`);

export const BOOK: Record<
  string,
  { blurb: string; shots: string[]; video?: string; poster?: string }
> = {
  honatrix: {
    blurb:
      "A corporate site for a Nigerian construction firm, built to show the scale of its builds and turn visitors into quote requests.",
    shots: shotsFor("honatrix"),
  },
  "traders-launch": {
    blurb:
      "A prop-trading evaluation platform where pricing, payouts and risk rules read at a glance.",
    shots: shotsFor("traders-launch"),
  },
  clinq: {
    blurb: "A patient-first healthcare portal for booking specialists and keeping records in sync.",
    shots: shotsFor("clinq"),
    video: "/work/clinq/demo.mp4",
    poster: "/work/clinq/poster.jpg",
  },
  "simple-payroll": {
    blurb:
      "Payroll for small teams: salary runs, deductions and employee records in a few clear screens.",
    shots: shotsFor("simple-payroll"),
  },
  fundedfun: {
    blurb: "An onboarding-first trading challenge with plain-language rules and live charts.",
    shots: shotsFor("fundedfun"),
  },
  veescents: {
    blurb: "A fragrance storefront that leads with curation and keeps the path to checkout short.",
    shots: shotsFor("veescents"),
  },
};

export type WorkItem = Project & {
  blurb: string;
  shots: string[];
  video?: string | undefined;
  poster?: string | undefined;
};

export const WORK: WorkItem[] = featuredProjects.map((p) => ({
  ...p,
  blurb: BOOK[p.slug]?.blurb ?? p.outcome,
  shots: BOOK[p.slug]?.shots ?? [p.image],
  video: BOOK[p.slug]?.video,
  poster: BOOK[p.slug]?.poster,
}));

/* Every project for the /projects page: featured work first, then the
 * smaller builds and experiments. */
export type ProjectEntry = {
  slug: string;
  index: string;
  title: string;
  year?: string | undefined;
  blurb: string;
  shots: string[];
  video?: string | undefined;
  poster?: string | undefined;
  live?: string | undefined;
  repo?: string | undefined;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const ALL_PROJECTS: ProjectEntry[] = [
  ...WORK.map(({ slug, index, title, year, blurb, shots, video, poster, live, repo }) => ({
    slug,
    index,
    title,
    year,
    blurb,
    shots,
    video,
    poster,
    live,
    repo,
  })),
  ...experiments.map((e, i) => ({
    slug: slugify(e.title),
    index: String(WORK.length + i + 1).padStart(2, "0"),
    title: e.title,
    year: e.year,
    blurb: e.note,
    shots: e.shots ?? [e.image],
    video: e.video,
    poster: e.poster,
    live: e.live,
    repo: e.repo,
  })),
];
