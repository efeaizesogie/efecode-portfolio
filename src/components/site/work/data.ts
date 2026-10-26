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
  verto: {
    blurb:
      "Scroll-driven 3D showroom for a clothing label: five pieces turned in a seamless grey void.",
    shots: shotsFor("verto"),
  },
  furlio: {
    blurb:
      "Editorial concept site for an architectural furniture studio that draws every piece before it builds it.",
    shots: shotsFor("furlio"),
    video: "/work/furlio/demo.mp4",
    poster: "/work/furlio/poster.jpg",
  },
  scamtrail: {
    blurb:
      "Evidence-based due diligence for Web3: search a handle, wallet, contract or domain and see what the evidence says and leaves open.",
    shots: shotsFor("scamtrail"),
    video: "/work/scamtrail/demo.mp4",
    poster: "/work/scamtrail/poster.jpg",
  },
  applyready: {
    blurb:
      "Turns any scholarship, job, admission or grant announcement into a deadline-paced checklist that emails you daily until you submit.",
    shots: shotsFor("applyready"),
    video: "/work/applyready/demo.mp4",
    poster: "/work/applyready/poster.jpg",
  },
  honatrix: {
    blurb:
      "A corporate site for a Nigerian construction firm, built to show the scale of its builds and turn visitors into quote requests.",
    shots: shotsFor("honatrix"),
  },
  clinq: {
    blurb: "A patient-first healthcare portal for booking specialists and keeping records in sync.",
    shots: shotsFor("clinq"),
    video: "/work/clinq/demo.mp4",
    poster: "/work/clinq/poster.jpg",
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
  blurb: BOOK[p.slug]?.blurb ?? p.outcome ?? "",
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
