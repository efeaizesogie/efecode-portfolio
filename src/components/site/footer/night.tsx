"use client";

/*
 * Footer option F2 — Night survey.
 * A deliberate dark ending: the live contour map in light lines on black,
 * its signal hill following the cursor behind the sign-off and email.
 */

import { useReducedMotion } from "motion/react";
import { links } from "@/lib/portfolio";
import { RevealText } from "../motion-primitives";
import { TerrainCanvas } from "../terrain";
import { CONTACT_LINKS, CopyEmail, FooterBar, SIGN_OFF } from "./shared";

export function FooterNight() {
  const reduced = useReducedMotion();
  return (
    <section
      id="contact"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void text-void-foreground"
    >
      <div aria-hidden className="absolute inset-0 opacity-80">
        <TerrainCanvas animate={!reduced} readout={false} tone="light" strength={0.7} />
      </div>

      <div className="shell relative flex flex-1 flex-col justify-center py-24 md:py-32">
        <h2 className="type-display max-w-[16ch]">
          <RevealText text={SIGN_OFF} stagger={0.03} />
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-16">
          <a
            href={`mailto:${links.email}`}
            data-cursor="Email"
            className="font-display text-[clamp(1.5rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.03em] text-signal [overflow-wrap:anywhere] transition-colors hover:text-void-foreground"
          >
            {links.email}
          </a>
          <CopyEmail className="border-void-foreground/30 text-void-foreground hover:border-signal hover:text-signal" />
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {CONTACT_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="type-label link-underline text-void-foreground/75 hover:text-void-foreground"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="relative">
        <FooterBar tone="light" />
      </div>
    </section>
  );
}
