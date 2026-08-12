"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { experience, testimonials } from "@/lib/portfolio";
import { RevealText, Rise } from "./motion-primitives";

export function Experience() {
  const [open, setOpen] = useState<string | null>(experience[0]?.company ?? null);
  const reduced = useReducedMotion();

  return (
    <section id="experience" className="py-20 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="type-display">
            <RevealText text="Experience" stagger={0.05} />
          </h2>
          <p className="type-label text-ink-soft">2023 — Present</p>
        </div>

        <div className="mt-12 md:mt-16">
          {experience.map((job, i) => {
            const isOpen = open === job.company;
            return (
              <Rise key={job.company} delay={i * 0.04}>
                <div className="border-t border-rule last:border-b">
                  <button
                    onClick={() => setOpen(isOpen ? null : job.company)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[3rem_1.2fr_1fr_auto] md:py-8"
                    aria-expanded={isOpen}
                  >
                    <span className="type-label text-ink-soft group-hover:text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`type-title transition-colors duration-300 ${
                        isOpen ? "text-signal" : "group-hover:text-signal"
                      }`}
                    >
                      {job.company}
                    </span>
                    <span className="type-meta hidden text-ink-soft md:block">{job.role}</span>
                    <span className="type-label text-ink-soft">{job.period}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reduced ? 0.001 : 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-10 md:grid-cols-[3rem_1.2fr_1fr] md:gap-10">
                          <div className="hidden md:block" />
                          <p className="type-prose max-w-[62ch] text-ink-soft">{job.body}</p>
                          <div>
                            <p className="type-label text-ink-soft md:hidden">{job.role}</p>
                            <p className="type-label mt-2 text-ink-soft md:mt-0">{job.place}</p>
                            <ul className="mt-5 flex flex-wrap gap-2">
                              {job.stack.map((s) => (
                                <li
                                  key={s}
                                  className="type-label rounded-full border border-rule px-3 py-1.5 text-ink-soft"
                                >
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="overflow-hidden border-y border-rule py-14 md:py-20">
      <div className="shell mb-10">
        <p className="type-label text-signal">Said about the work</p>
      </div>
      <div
        className="marquee-track flex w-max gap-6"
        style={{ ["--marquee-duration" as string]: "70s" }}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <figure
            key={`${t.handle}-${i}`}
            className="w-[78vw] shrink-0 border-l border-rule pl-6 sm:w-[42vw] lg:w-[26vw]"
          >
            <blockquote className="type-prose text-ink-soft">“{t.quote}”</blockquote>
            <figcaption className="type-label mt-6 text-ink">
              {t.name} <span className="text-ink-soft">{t.handle}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
