"use client";

/*
 * Experimental "book" take on Selected Work.
 * A stack of pages hinged at the top edge. Scrolling lifts each page up and
 * over the hinge, revealing the next — cover, one page per project, endpaper.
 * The original slab layout lives untouched in ./work.tsx.
 */

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { featuredProjects, type Project } from "@/lib/portfolio";

type Theme = {
  page: string;
  muted: string;
  rule: string;
  accent: string;
  verso: string;
};

const THEMES: Record<"paper" | "signal" | "ink", Theme> = {
  paper: {
    page: "bg-paper text-ink",
    muted: "text-ink-soft",
    rule: "border-rule",
    accent: "text-signal",
    verso: "bg-[oklch(0.88_0.012_84)]",
  },
  signal: {
    page: "bg-signal text-signal-ink",
    muted: "text-signal-ink/75",
    rule: "border-signal-ink/25",
    accent: "text-signal-ink",
    verso: "bg-[oklch(0.5_0.18_33)]",
  },
  ink: {
    page: "bg-[oklch(0.235_0.006_60)] text-void-foreground",
    muted: "text-void-foreground/65",
    rule: "border-void-rule",
    accent: "text-signal",
    verso: "bg-[oklch(0.2_0.006_60)]",
  },
};

const PROJECT_THEMES: Theme[] = [THEMES.paper, THEMES.ink, THEMES.signal];

/* Each turnable page owns one unit of scroll progress: it rests for the
 * first part of its unit, then turns over the hinge during the rest. */
const REST = 0.4;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const turnOf = (p: number, i: number) => clamp01((p - (i + REST)) / (1 - REST));

function Page({
  i,
  total,
  progress,
  theme,
  turns,
  children,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
  theme: Theme;
  turns: boolean;
  children: ReactNode;
}) {
  // How many pages sit on top of this one, as a continuous value.
  const depth = useTransform(progress, (p) => {
    let above = 0;
    for (let k = 0; k < i; k++) above += 1 - turnOf(p, k);
    return above;
  });
  const turn = useTransform(progress, (p) => (turns ? turnOf(p, i) : 0));

  const rotateX = useTransform(turn, [0, 1], [0, 180]);
  const y = useTransform(depth, (d) => `${Math.min(d, 3) * -1.6}%`);
  const scale = useTransform(depth, (d) => 1 - Math.min(d, 3) * 0.045);
  const opacity = useTransform(
    [depth, turn] as MotionValue<number>[],
    ([d = 0, t = 0]: number[]) => (d > 3.2 ? 0 : 1) * (t > 0.6 ? Math.max(0, 1 - (t - 0.6) / 0.25) : 1),
  );
  // Shadow cast by the pages above; lifts as they turn away.
  const shade = useTransform(depth, (d) => Math.min(d, 1) * 0.45);
  // Light falling across the page as it stands up.
  const sheen = useTransform(turn, [0, 0.45, 0.5], [0, 0.22, 0]);
  const pointerEvents = useTransform(
    [depth, turn] as MotionValue<number>[],
    ([d = 0, t = 0]: number[]) => (d < 0.5 && t < 0.5 ? "auto" : "none"),
  );

  return (
    <motion.div
      className="absolute inset-0 origin-top [transform-style:preserve-3d]"
      style={{ rotateX, y, scale, opacity, zIndex: total - i, pointerEvents }}
    >
      <div
        className={`absolute inset-0 overflow-hidden rounded-[6px] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.65)] [backface-visibility:hidden] ${theme.page}`}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: shade }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white to-transparent"
          style={{ opacity: sheen }}
        />
      </div>
      {/* Verso — the back of the leaf, seen once it passes the hinge. */}
      <div
        aria-hidden
        className={`grain absolute inset-0 rounded-[6px] [backface-visibility:hidden] [transform:rotateX(180deg)] ${theme.verso}`}
      />
    </motion.div>
  );
}

function RunningHead({ left, right, theme }: { left: string; right: string; theme: Theme }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b pb-3 type-label !text-[0.68rem] ${theme.rule} ${theme.muted}`}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Cover({ count }: { count: number }) {
  const theme = THEMES.signal;
  return (
    <div className="flex h-full flex-col p-5 md:p-10">
      <RunningHead left="EFECODE — Vol. 26" right="Chapter I" theme={theme} />
      <div className="flex flex-1 flex-col justify-center">
        <p className={`type-label ${theme.muted}`}>Selected Work</p>
        <h2 className="type-mega mt-4 md:mt-6">
          Selected
          <br />
          Work
        </h2>
      </div>
      <div className={`flex flex-wrap items-end justify-between gap-4 border-t pt-4 ${theme.rule}`}>
        <p className="type-prose max-w-[38ch] !text-[1rem] md:!text-[1.15rem]">
          {count} projects, bound in one volume. Scroll to turn the pages.
        </p>
        <p className={`type-label ${theme.muted}`}>↓ Open</p>
      </div>
    </div>
  );
}

function ProjectPage({ project, theme, page }: { project: Project; theme: Theme; page: number }) {
  return (
    <article
      className="flex h-full flex-col p-5 md:p-10"
      aria-labelledby={`book-${project.slug}`}
    >
      <RunningHead
        left={`No. ${project.index} — ${project.discipline}`}
        right={`p. ${String(page).padStart(2, "0")}`}
        theme={theme}
      />

      <div className="mt-4 grid min-h-0 flex-1 grid-rows-[auto_1fr] gap-5 md:mt-8 md:grid-cols-12 md:grid-rows-1 md:gap-10">
        <div className="flex min-h-0 flex-col md:col-span-5">
          <p className={`type-meta ${theme.muted}`}>
            {project.year} · {project.role}
          </p>
          <h3
            id={`book-${project.slug}`}
            className="type-display mt-2 !text-[clamp(1.9rem,3.6vw,3.6rem)]"
          >
            {project.title}
          </h3>

          <dl className="mt-5 hidden space-y-3 md:block">
            {(
              [
                ["Problem", project.problem],
                ["Solution", project.solution],
              ] as const
            ).map(([label, body]) => (
              <div key={label} className={`grid grid-cols-[5.5rem_1fr] gap-4 border-t pt-3 ${theme.rule}`}>
                <dt className={`type-label !text-[0.68rem] ${theme.muted}`}>{label}</dt>
                <dd className="font-prose text-[0.98rem] leading-snug line-clamp-4">{body}</dd>
              </div>
            ))}
          </dl>
          <div className={`mt-3 grid gap-1 border-t pt-3 md:grid-cols-[5.5rem_1fr] md:gap-4 ${theme.rule}`}>
            <p className={`type-label !text-[0.68rem] ${theme.muted}`}>Outcome</p>
            <p className="font-prose text-[0.98rem] leading-snug line-clamp-3">{project.outcome}</p>
          </div>

          <div className="mt-auto pt-4">
            <p className={`type-meta hidden md:block ${theme.muted}`}>{project.stack.join(" · ")}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                data-cursor="Visit"
                className={`type-label link-underline ${theme.accent}`}
              >
                Live site ↗
              </a>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                data-cursor="Code"
                className="type-label link-underline opacity-80 hover:opacity-100"
              >
                Source ↗
              </a>
            </div>
          </div>
        </div>

        <figure className="row-start-1 flex min-h-0 flex-col md:col-span-7 md:row-start-auto">
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            data-cursor="Visit"
            className="block min-h-0 flex-1 overflow-hidden rounded-[3px] bg-black/10"
          >
            <img
              src={project.image}
              alt={`${project.title} interface`}
              loading="lazy"
              className="h-full w-full object-cover object-top"
            />
          </a>
          <figcaption className={`mt-2 type-meta ${theme.muted}`}>
            Fig. {project.index} — {project.title}, {project.year}
          </figcaption>
        </figure>
      </div>
    </article>
  );
}

function Endpaper() {
  const theme = THEMES.paper;
  return (
    <div className="flex h-full flex-col p-5 md:p-10">
      <RunningHead left="EFECODE — Vol. 26" right="Fin." theme={theme} />
      <div className="flex flex-1 flex-col items-start justify-center">
        <p className={`type-label ${theme.muted}`}>End of chapter</p>
        <p className="type-display mt-4 max-w-[14ch]">More experiments live in the Lab.</p>
        <a href="#lab" className={`type-label link-underline mt-8 ${theme.accent}`}>
          Continue to the Lab ↓
        </a>
      </div>
    </div>
  );
}

export function WorkBook() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const projects = featuredProjects;

  const pages = [
    { key: "cover", theme: THEMES.signal, node: <Cover count={projects.length} /> },
    ...projects.map((p, i) => {
      const theme = PROJECT_THEMES[i % PROJECT_THEMES.length] ?? THEMES.paper;
      return { key: p.slug, theme, node: <ProjectPage project={p} theme={theme} page={i + 1} /> };
    }),
    { key: "end", theme: THEMES.paper, node: <Endpaper /> },
  ];
  const turnable = pages.length - 1;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // One unit per turnable page, plus a short rest on the endpaper.
  const progress = useTransform(scrollYProgress, [0, 1], [0, turnable + 0.3]);
  const counter = useTransform(progress, (p) => {
    const n = Math.min(projects.length, Math.max(1, Math.floor(p - REST + 1)));
    return `${String(n).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
  });

  const pageBox = "h-[min(80svh,46rem)] w-[min(94vw,76rem)]";

  if (reduced) {
    return (
      <section id="work" className="grain bg-void py-20 text-void-foreground md:py-32">
        <div className="flex flex-col items-center gap-8">
          {pages.map((pg) => (
            <div
              key={pg.key}
              className={`relative overflow-hidden rounded-[6px] ${pageBox} ${pg.theme.page}`}
            >
              {pg.node}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={ref}
      className="grain relative bg-void text-void-foreground"
      style={{ height: `${(turnable + 1.3) * 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <div className="[perspective:1500px] [perspective-origin:50%_35%]">
          <div className={`relative mt-[4svh] ${pageBox}`}>
            {pages.map((pg, i) => (
              <Page
                key={pg.key}
                i={i}
                total={pages.length}
                progress={progress}
                theme={pg.theme}
                turns={i < turnable}
              >
                {pg.node}
              </Page>
            ))}
          </div>
        </div>
        <motion.p
          aria-hidden
          className="type-label mt-4 text-void-foreground/60 md:mt-5"
        >
          {counter}
        </motion.p>
      </div>
    </section>
  );
}
