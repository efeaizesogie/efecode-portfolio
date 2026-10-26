"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { RevealText, Rise } from "./motion-primitives";
import { links } from "@/lib/portfolio";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["6%", "-6%"]);

  return (
    <section id="about" data-contour className="grain py-20 md:py-32">
      <div className="shell" ref={ref}>
        <div className="mt-8 grid gap-12 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-7">
            <h2 className="type-display max-w-[16ch]">
              <RevealText text="A geomatics scientist who fell for the browser." stagger={0.03} />
            </h2>
          </div>

          <motion.div style={{ y }} className="space-y-5 md:col-span-4 md:col-start-9">
            <Rise>
              <p className="type-prose text-ink-soft">
                I'm Efe Aizesogie, with a B.Sc. in Geomatics and four years focused on frontend
                engineering. Mapping taught me precision; the browser taught me pace.
              </p>
            </Rise>
            <Rise delay={0.08}>
              <p className="type-prose text-ink-soft">
                I build responsive interfaces in React, Next.js, and TypeScript, with motion crafted
                to guide understanding rather than merely decorate.
              </p>
            </Rise>
            <Rise delay={0.14}>
              <p className="type-prose text-ink-soft">
                Off the keyboard, cartography and spatial exploration keep the perspective sharp and
                curious.
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
            ["14+", "Projects delivered"],
            ["06", "Teams collaborated"],
            ["100%", "Remote fluent"],
          ].map(([n, l], i) => (
            <Rise key={l} delay={i * 0.06}>
              <div className="h-full bg-paper px-5 py-8 md:px-7 md:py-12">
                <p className="type-display leading-none">{n}</p>
                <p className="type-label mt-4 text-ink/75">{l}</p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
