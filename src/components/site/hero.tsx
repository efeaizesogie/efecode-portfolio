"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { RevealText } from "./motion-primitives";
import { Magnetic } from "./interactions";
import { links } from "@/lib/portfolio";


const ROLES = ["Frontend Engineer", "Interface Builder", "Motion Obsessive", "Product Thinker"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [role, setRole] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const markY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-40%"]);

  useEffect(() => {
    const id = window.setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="index"
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-8"
    >
      <motion.div style={{ y, opacity: fade }} className="shell">
        

        <h1 className="mt-8 md:mt-12">
          <span className="sr-only">
            Efe Aizesogie — EFECODE, frontend engineer building fast, considered interfaces.
          </span>
          <span aria-hidden className="type-mega block">
            <RevealText text="EFE" stagger={0} delay={0.15} />
          </span>
          <span
            aria-hidden
            className="type-mega -mt-[0.06em] block text-right md:-mt-[0.08em]"
          >
            <span className="text-signal">
              <RevealText text="CODE." stagger={0} delay={0.28} />
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-8 border-t border-rule pt-6 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="type-label mb-3 text-ink-soft">Currently</p>
            <div className="type-title relative h-[1.5em] overflow-hidden leading-[1.3]">
              {ROLES.map((r, i) => (
                <motion.span
                  key={r}
                  className="absolute inset-x-0 top-0 block leading-[1.3]"
                  initial={false}
                  animate={{
                    y: reduced ? "0%" : `${(i - role) * 100}%`,
                    opacity: i === role ? 1 : 0,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >

                  {r}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <p className="type-prose max-w-[46ch] text-ink-soft">
              Four years building and scaling applications for companies and individuals —
              fintech evaluation platforms, healthcare portals, payroll systems. I care about
              the millisecond between intent and response.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.28}>
                <a
                  href="#work"
                  data-cursor="View"
                  className="type-label inline-block rounded-full border border-ink px-5 py-3 transition-colors duration-300 hover:bg-ink hover:text-paper"
                >
                  Selected Work
                </a>
              </Magnetic>
              <Magnetic strength={0.28}>
                <a
                  href={links.resume}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Open"
                  className="type-label inline-block rounded-full border border-rule px-5 py-3 text-ink-soft transition-colors duration-300 hover:border-signal hover:text-signal"
                >
                  Résumé ↗
                </a>
              </Magnetic>
              <Magnetic strength={0.28}>
                <a
                  href="#contact"
                  className="type-label inline-block rounded-full px-5 py-3 text-ink-soft transition-colors duration-300 hover:text-signal"
                >
                  Contact →
                </a>
              </Magnetic>
            </div>

          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: markY }}
        className="shell mt-12 flex items-end justify-between"
      >
        <span className="type-label text-ink-soft">Scroll · 07 chapters</span>
        <motion.span
          className="type-label text-ink-soft"
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
