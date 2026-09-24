"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { featuredProjects, type Project } from "@/lib/portfolio";
import { RevealText, Rise } from "./motion-primitives";

function ProjectSlab({ project, i }: { project: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-9%", "9%"]);
  const clip = useTransform(
    scrollYProgress,
    [0, 0.35],
    reduced ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(14% 6% 14% 6%)", "inset(0% 0% 0% 0%)"],
  );
  const scale = useTransform(scrollYProgress, [0, 0.35], reduced ? [1, 1] : [1.14, 1]);

  const flip = i % 2 === 1;

  return (
    <article
      ref={ref}
      className="border-t border-void-rule py-4 first:border-t-0  md:py-8"
      aria-labelledby={`p-${project.slug}`}
    >
      <div className="shell">
       

        <h3 id={`p-${project.slug}`} className="type-display mt-5">
          <RevealText text={project.title} stagger={0.05} />
        </h3>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            data-cursor="Visit"
            className="type-label link-underline text-signal"
          >
            Live site ↗
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            data-cursor="Code"
            className="type-label link-underline text-void-foreground/80 hover:text-void-foreground"
          >
            Source ↗
          </a>
        </div>

        <motion.figure
          style={{ clipPath: clip }}
          className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-void-foreground/5 md:mt-12 md:aspect-[16/8]"
          data-cursor="Visit"
        >
          <a href={project.live} target="_blank" rel="noreferrer" className="block h-full w-full">
            <motion.img
              src={project.image}
              alt={`${project.title} interface`}
              loading="lazy"
              style={{ y: imgY, scale }}
              className="h-[118%] w-full object-cover object-top"
            />
          </a>
        </motion.figure>

        <div
          className={`mt-10 grid gap-x-12 gap-y-10 md:mt-14 md:grid-cols-12 ${
            flip ? "md:[direction:rtl]" : ""
          }`}
        >
          <div className="md:col-span-3 md:[direction:ltr]">
            <dl className="space-y-4">
              <dt className="type-label text-void-foreground/65">Stack</dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1.5">
                {project.stack.map((s) => (
                  <span key={s} className="type-meta text-void-foreground/85">
                    {s}
                  </span>
                ))}
              </dd>
            </dl>
          </div>

          <div className="space-y-8 md:col-span-8 md:col-start-5 md:[direction:ltr]">
            {[
              ["Problem", project.problem],
              ["Solution", project.solution],
              ["Outcome", project.outcome],
            ].map(([label, body], idx) => (
              <Rise key={label} delay={idx * 0.06}>
                <div className="grid gap-2 border-t border-void-rule pt-5 md:grid-cols-[7rem_1fr] md:gap-8">
                  <p className="type-label text-void-foreground/65">{label}</p>
                  <p className="type-prose max-w-[62ch] text-void-foreground/95">{body}</p>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className="grain bg-void py-20 text-void-foreground md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-void-rule pb-8">
          <h2 className="type-display">
            <RevealText text="Selected Work" stagger={0.05} />
          </h2>
        </div>
      </div>
      <div className="mt-4">
        {featuredProjects.map((p, i) => (
          <ProjectSlab key={p.slug} project={p} i={i} />
        ))}
      </div>
    </section>
  );
}
