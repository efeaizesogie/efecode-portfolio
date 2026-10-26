"use client";

/*
 * Footer option F3 — Postcard.
 * Contact laid out as a postcard on the desk: a short note on the left, the
 * email and profiles on the address lines, and a postmark carrying today's
 * date and the UK time.
 */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { links } from "@/lib/portfolio";
import { CONTACT_LINKS, CopyEmail, FooterBar, useUkTime } from "./shared";

function Postmark() {
  const time = useUkTime();
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
        .format(new Date())
        .toUpperCase(),
    );
  }, []);
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 md:h-28 md:w-28" aria-hidden>
      <circle cx="60" cy="60" r="54" className="fill-none stroke-signal" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" className="fill-none stroke-signal" strokeWidth="1" />
      <defs>
        <path id="pm-arc" d="M 18 60 A 42 42 0 0 1 102 60" />
      </defs>
      <text className="fill-signal font-mono text-[10px] tracking-[0.18em]">
        <textPath href="#pm-arc" startOffset="50%" textAnchor="middle">
          EFECODE · UK
        </textPath>
      </text>
      <text
        x="60"
        y="66"
        textAnchor="middle"
        className="fill-signal font-mono text-[11px] font-semibold"
      >
        {date}
      </text>
      <text x="60" y="82" textAnchor="middle" className="fill-signal font-mono text-[10px]">
        {time}
      </text>
    </svg>
  );
}

export function FooterPostcard() {
  const reduced = useReducedMotion();
  return (
    <section id="contact" data-contour className="pt-20 md:pt-32">
      <div className="shell">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="mx-auto grid max-w-[64rem] overflow-hidden rounded-[4px] bg-[oklch(0.975_0.006_84)] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.55)] ring-1 ring-ink/10 md:grid-cols-[1.1fr_1fr]"
        >
          <div className="p-7 md:p-12">
            <h2 className="font-prose text-[clamp(1.8rem,3.4vw,2.8rem)] italic leading-[1.15] text-ink">
              Have an idea to discuss? Let's build it properly.
            </h2>
            <p className="type-prose mt-6 max-w-[34ch] text-ink/70">
              Shoot me an email, or find me on LinkedIn or X if that's more your speed.
            </p>
            <p className="mt-10 font-prose text-xl italic text-ink">— Efe</p>
          </div>

          <div className="relative border-t border-dashed border-ink/25 p-7 md:border-l md:border-t-0 md:p-12">
            <div className="flex items-start justify-between gap-4">
              <Postmark />
              <div
                aria-hidden
                className="flex h-24 w-20 flex-col items-center justify-center border-2 border-dashed border-signal/70 font-display text-sm font-semibold text-signal md:h-28 md:w-24"
              >
                EFE
                <span className="type-meta mt-1 text-signal/70">CODE</span>
              </div>
            </div>

            <ul className="mt-8">
              <li className="flex items-center justify-between gap-3 border-b border-ink/20 py-3">
                <a
                  href={`mailto:${links.email}`}
                  data-cursor="Email"
                  className="font-display text-base font-semibold tracking-tight text-signal [overflow-wrap:anywhere] hover:text-ink md:text-lg"
                >
                  {links.email}
                </a>
                <CopyEmail className="shrink-0 border-ink/25 text-ink hover:border-signal hover:text-signal" />
              </li>
              {CONTACT_LINKS.map((l) => (
                <li key={l.label} className="border-b border-ink/20">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-baseline justify-between gap-3 py-3 hover:text-signal"
                  >
                    <span className="type-meta text-ink-soft">{l.label}</span>
                    <span className="font-prose text-[1.05rem] italic text-ink">{l.value} ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 md:mt-28">
        <FooterBar />
      </div>
    </section>
  );
}
