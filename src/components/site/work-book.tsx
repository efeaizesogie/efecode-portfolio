"use client";

/*
 * Experimental "book" take on Selected Work.
 * A stack of cards hinged at the top edge. Scrolling lifts each card from its
 * free bottom edge, bends it over the hinge and turns it away, revealing the
 * next. The original slab layout lives untouched in ./work.tsx.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  useInView,
  type MotionValue,
} from "motion/react";
import { featuredProjects, type Project } from "@/lib/portfolio";
import { RevealText } from "./motion-primitives";
import { BOOK } from "./work-options/data";

type Theme = { page: string; muted: string; pill: string; verso: string };

const THEMES: Theme[] = [
  {
    page: "bg-signal text-signal-ink",
    muted: "text-signal-ink/75",
    pill: "bg-signal-ink text-signal",
    verso: "bg-[oklch(0.52_0.18_33)]",
  },
  {
    page: "bg-paper text-ink",
    muted: "text-ink-soft",
    pill: "bg-ink text-paper",
    verso: "bg-[oklch(0.86_0.012_84)]",
  },
  {
    page: "bg-[oklch(0.25_0.006_60)] text-void-foreground",
    muted: "text-void-foreground/65",
    pill: "bg-signal text-signal-ink",
    verso: "bg-[oklch(0.2_0.006_60)]",
  },
];

/* Paper variant: the book sits on the page's paper and contours instead of
 * a dark slab, with paper-toned cards and one ink card for rhythm. */
const PAPER_THEMES: Theme[] = [
  {
    page: "bg-[oklch(0.975_0.006_84)] text-ink ring-1 ring-inset ring-ink/15",
    muted: "text-ink-soft",
    pill: "bg-signal text-signal-ink",
    verso: "bg-[oklch(0.9_0.012_84)]",
  },
  {
    page: "bg-[oklch(0.905_0.014_84)] text-ink ring-1 ring-inset ring-ink/15",
    muted: "text-ink-soft",
    pill: "bg-ink text-paper",
    verso: "bg-[oklch(0.84_0.012_84)]",
  },
  {
    page: "bg-ink text-paper",
    muted: "text-paper/65",
    pill: "bg-signal text-signal-ink",
    verso: "bg-[oklch(0.2_0.006_60)]",
  },
];

/* Each turning card owns one unit of progress: it rests for the first part,
 * then turns over the hinge during the rest. */
const REST = 0.35;
const STRIPS = 5;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const turnOf = (p: number, i: number) => clamp01((p - (i + REST)) / (1 - REST));

/* Absolute angle (deg) of strip k at turn t. The free bottom edge leads and
 * the paper bows as it rises, then flattens again as it lands past the hinge. */
function stripAngle(t: number, k: number) {
  if (k < 0) return 0;
  const base = 180 * Math.pow(t, 1.35);
  const bend = Math.sin(Math.PI * t) * 55;
  return base + bend * Math.pow(k / (STRIPS - 1), 1.6);
}

function Card({ project, theme }: { project: Project; theme: Theme }) {
  const book = BOOK[project.slug];
  const shots = book?.shots ?? [project.image];
  return (
    <article className="flex h-full flex-col p-5 md:p-9" aria-labelledby={`book-${project.slug}`}>
      <div className="flex items-start justify-between gap-6">
        <h3
          id={`book-${project.slug}`}
          className="type-display max-w-[14ch] !text-[clamp(2rem,4.4vw,4.2rem)]"
        >
          {project.title}
        </h3>
        <span className={`type-label pt-2 ${theme.muted}`}>({project.index})</span>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mt-4">
        <p className="type-prose max-w-[52ch] !text-[1rem] !leading-snug md:!text-[1.15rem]">
          {book?.blurb ?? project.outcome}
        </p>
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          data-cursor="Visit"
          className={`type-label shrink-0 rounded-full px-4 py-2.5 !text-[0.7rem] transition-transform duration-500 hover:-translate-y-0.5 ${theme.pill}`}
        >
          Visit site ↗
        </a>
      </div>

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2 md:mt-7 md:grid-cols-4 md:gap-3">
        {shots.slice(0, 4).map((src, n) => (
          <div
            key={src}
            className={`overflow-hidden rounded-[4px] bg-black/10 ${
              n === 0
                ? "col-span-2 md:row-span-2"
                : n === 1
                  ? "md:col-span-2"
                  : n === 3
                    ? "hidden md:block"
                    : ""
            }`}
          >
            <img
              src={src}
              alt={`${project.title} screen ${n + 1}`}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover object-left-top"
            />
          </div>
        ))}
      </div>
    </article>
  );
}

/* One horizontal band of a turning card. Bands nest, each hinged to the
 * bottom of the one above, so their angles compound into a curl. */
function Strip({
  k,
  turn,
  theme,
  content,
}: {
  k: number;
  turn: MotionValue<number>;
  theme: Theme;
  content: ReactNode;
}) {
  const rotateX = useTransform(turn, (t) => stripAngle(t, k) - stripAngle(t, k - 1));
  // Light falls off as the band tips toward the viewer, and the back of the
  // leaf darkens the closer it is to edge-on.
  const shadeFront = useTransform(
    turn,
    (t) => Math.max(0, Math.sin((stripAngle(t, k) * Math.PI) / 180)) * 0.35,
  );
  const shadeBack = useTransform(
    turn,
    (t) => (1 - Math.abs(Math.cos((stripAngle(t, k) * Math.PI) / 180))) * 0.35,
  );

  return (
    <motion.div
      className="absolute inset-x-0 origin-top [transform-style:preserve-3d]"
      style={{
        top: k === 0 ? 0 : "100%",
        height: k === 0 ? `${100 / STRIPS}%` : "100%",
        rotateX,
      }}
    >
      <div
        className={`absolute inset-x-0 top-0 -bottom-px overflow-hidden [backface-visibility:hidden] ${theme.page} ${
          k === 0 ? "rounded-t-[6px]" : k === STRIPS - 1 ? "rounded-b-[6px]" : ""
        }`}
      >
        <div
          className="absolute inset-x-0"
          style={{ top: `${-k * 100}%`, height: `${STRIPS * 100}%` }}
        >
          {content}
        </div>
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: shadeFront }} />
      </div>
      <div
        className={`grain absolute inset-x-0 top-0 -bottom-px [backface-visibility:hidden] [transform:rotateX(180deg)] ${theme.verso}`}
      >
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: shadeBack }} />
      </div>
      {k + 1 < STRIPS && <Strip k={k + 1} turn={turn} theme={theme} content={content} />}
    </motion.div>
  );
}

function Page({
  i,
  total,
  progress,
  theme,
  turns,
  active,
  children,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
  theme: Theme;
  turns: boolean;
  active: boolean;
  children: ReactNode;
}) {
  // How many cards sit on top of this one, as a continuous value.
  const depth = useTransform(progress, (p) => {
    let above = 0;
    for (let k = 0; k < i; k++) above += 1 - turnOf(p, k);
    return above;
  });
  const turn = useTransform(progress, (p) => (turns ? turnOf(p, i) : 0));

  // Swap the flat card for the bendable strips only while it is turning.
  const [turning, setTurning] = useState(false);
  useMotionValueEvent(turn, "change", (t) => setTurning(t > 0.001));

  // Cards underneath shrink from the bottom edge so they peek out below,
  // like the block of a book.
  const y = useTransform(depth, (d) => Math.min(d, 3) * 12);
  const scale = useTransform(depth, (d) => 1 - Math.min(d, 3) * 0.04);
  const opacity = useTransform(
    [depth, turn] as MotionValue<number>[],
    ([d = 0, t = 0]: number[]) => (d > 3.2 ? 0 : 1) * (t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1),
  );
  // Shadow cast by the card above; lifts as it turns away.
  const shade = useTransform(depth, (d) => Math.min(d, 1) * 0.5);

  return (
    <motion.div
      className="absolute inset-0 origin-bottom"
      style={{ y, scale, opacity, zIndex: total - i }}
    >
      {turning ? (
        <div
          aria-hidden
          inert
          className="absolute inset-0 [perspective:1500px] [perspective-origin:50%_0%]"
        >
          <Strip k={0} turn={turn} theme={theme} content={children} />
        </div>
      ) : (
        <div
          inert={!active}
          className={`grain absolute inset-0 overflow-hidden rounded-[6px] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.65)] ${theme.page}`}
        >
          {children}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black"
            style={{ opacity: shade }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function WorkBook({ paper = false }: { paper?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const projects = featuredProjects;
  const themes = paper ? PAPER_THEMES : THEMES;
  const themeOf = (i: number) => themes[i % themes.length] ?? themes[0]!;
  const sectionClass = paper ? "relative text-ink" : "grain relative bg-void text-void-foreground";
  const contour = paper ? { "data-contour": "" } : {};
  const turnable = projects.length - 1;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, turnable + 0.4]);

  // The card currently lying open: how many cards have turned past halfway.
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    let n = 0;
    for (let k = 0; k < turnable; k++) if (turnOf(p, k) >= 0.5) n++;
    setCurrent(n);
  });

  // Each card settles at a resting point; snap there so a scroll never stops
  // on a half-turned card. Snapping is only on while the book is on screen.
  const restAt = (i: number) => Math.min(i + REST / 2, turnable + 0.4);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    root.style.scrollSnapType = inView ? "y proximity" : "";
    return () => {
      root.style.scrollSnapType = "";
    };
  }, [inView, reduced]);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + restAt(i) * window.innerHeight, behavior: "smooth" });
  };

  const cardBox = "h-[min(76svh,46rem)] w-[min(92vw,74rem)]";

  const heading = (
    <div className="shell pt-20 pb-6 text-center md:pt-32 md:pb-10">
      <h2 className="type-display">
        <RevealText text="Selected Work" stagger={0.05} />
      </h2>
      <p
        className={`type-prose mx-auto mt-4 max-w-[40ch] ${paper ? "text-ink/70" : "text-void-foreground/70"}`}
      >
        Six projects, one page each.
      </p>
    </div>
  );

  if (reduced) {
    return (
      <section id="work" {...contour} className={`${sectionClass} pb-20 md:pb-32`}>
        {heading}
        <div className="flex flex-col items-center gap-8">
          {projects.map((p, i) => (
            <div
              key={p.slug}
              className={`relative overflow-hidden rounded-[6px] ${cardBox} ${themeOf(i).page}`}
            >
              <Card project={p} theme={themeOf(i)} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="work" {...contour} className={sectionClass}>
      {heading}
      <div ref={ref} className="relative" style={{ height: `${(turnable + 1.4) * 100}svh` }}>
        {projects.map((p, i) => (
          <div
            key={`snap-${p.slug}`}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-px [scroll-snap-align:start]"
            style={{ top: `${restAt(i) * 100}svh` }}
          />
        ))}
        <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
          <div>
            <div className={`relative mt-[4svh] ${cardBox}`}>
              {projects.map((p, i) => (
                <Page
                  key={p.slug}
                  i={i}
                  total={projects.length}
                  progress={progress}
                  theme={themeOf(i)}
                  turns={i < turnable}
                  active={i === current}
                >
                  <Card project={p} theme={themeOf(i)} />
                </Page>
              ))}
            </div>
          </div>
          <nav aria-label="Projects" className="relative z-10 mt-12 flex items-center gap-1">
            {projects.map((p, i) => {
              const on = i === current;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={on ? "page" : undefined}
                  aria-label={p.title}
                  data-cursor="Turn"
                  className={`type-label rounded-[2px] px-2 py-1.5 !text-[0.66rem] transition-colors duration-300 ${
                    on
                      ? "bg-signal text-signal-ink"
                      : paper
                        ? "text-ink/55 hover:text-ink"
                        : "text-void-foreground/55 hover:text-void-foreground"
                  }`}
                >
                  {p.index}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
