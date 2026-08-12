"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { RevealText, Rise } from "./motion-primitives";
import { skillGroups, marqueeSkills, links } from "@/lib/portfolio";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["6%", "-6%"]);

  return (
    <section id="about" className="grain py-20 md:py-32">
      <div className="shell" ref={ref}>
        <p className="type-label text-signal">About</p>

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-7">
            <h2 className="type-display max-w-[16ch]">
              <RevealText
                text="A geomatics scientist who fell for the browser."
                stagger={0.03}
              />
            </h2>
          </div>

          <motion.div style={{ y }} className="space-y-5 md:col-span-4 md:col-start-9">
            <Rise>
              <p className="type-prose text-ink-soft">
                I'm Efe Aizesogie, a Bachelor of Science in Geomatics. I've worked in both the
                GIS and web development worlds, with a focus on frontend — mapping taught me
                precision, the browser taught me pace.
              </p>
            </Rise>
            <Rise delay={0.08}>
              <p className="type-prose text-ink-soft">
                I build responsive interfaces that feel considered: HTML, CSS, JavaScript and
                frameworks like React and Next.js, with motion used to explain rather than
                decorate.
              </p>
            </Rise>
            <Rise delay={0.14}>
              <p className="type-prose text-ink-soft">
                Off the keyboard, cartography. I think a healthy work–life balance is what keeps
                the work sharp, and I'm always looking for the next thing I don't know yet.
              </p>
            </Rise>
            <Rise delay={0.2}>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="type-label link-underline inline-block text-ink"
              >
                My links →
              </a>
            </Rise>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px border border-rule bg-rule md:mt-24 md:grid-cols-4">
          {[
            ["04", "Years shipping"],
            ["13+", "Projects delivered"],
            ["06", "Teams collaborated"],
            ["100%", "Remote fluent"],
          ].map(([n, l], i) => (
            <Rise key={l} delay={i * 0.06}>
              <div className="h-full bg-paper px-5 py-8 md:px-7 md:py-11">
                <p className="type-display leading-none">{n}</p>
                <p className="type-label mt-4 text-ink-soft">{l}</p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stack() {
  return (
    <section id="stack" className="border-y border-rule py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="type-display">
            <RevealText text="Stack" stagger={0.05} />
          </h2>
          <p className="type-label max-w-[34ch] text-ink-soft">
            Tools I reach for daily, and the ones that keep the geospatial half of my brain busy.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          {skillGroups.map((g, gi) => (
            <Rise key={g.label} delay={gi * 0.05}>
              <div className="grid gap-3 border-t border-rule py-6 md:grid-cols-[12rem_1fr] md:gap-10 md:py-8">
                <p className="type-label text-signal">{g.label}</p>
                <ul className="flex flex-wrap gap-x-8 gap-y-3">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="type-title text-ink-soft transition-colors duration-300 hover:text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          ))}
        </div>
      </div>

      <div className="mt-10 overflow-hidden border-t border-rule py-5">
        <div
          className="marquee-track flex w-max gap-10 whitespace-nowrap"
          style={{ ["--marquee-duration" as string]: "48s" }}
        >
          {[...marqueeSkills, ...marqueeSkills].map((s, i) => (
            <span key={`${s}-${i}`} className="type-label text-ink-soft">
              {s} <span className="text-signal">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
