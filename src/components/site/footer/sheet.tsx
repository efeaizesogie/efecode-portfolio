"use client";

/*
 * Footer option F1 — Contact sheet.
 * The page ends on the paper and contours: a large sign-off, then tidy
 * contact rows (email with a copy button, then profiles and the résumé),
 * then the thin closing bar.
 */

import { links } from "@/lib/portfolio";
import { RevealText } from "../motion-primitives";
import { CONTACT_LINKS, CopyEmail, FooterBar, SIGN_OFF } from "./shared";

export function FooterSheet() {
  return (
    <section id="contact" data-contour className="pt-20 md:pt-32">
      <div className="shell">
        <h2 className="type-display max-w-[16ch]">
          <RevealText text={SIGN_OFF} stagger={0.03} />
        </h2>

        <ul className="mt-14 border-t border-ink/40 md:mt-20">
          <li className="grid grid-cols-[6rem_1fr] items-center gap-4 border-b border-rule py-5 md:grid-cols-[10rem_1fr_auto] md:py-7">
            <span className="type-label text-ink-soft">Email</span>
            <a
              href={`mailto:${links.email}`}
              data-cursor="Email"
              className="type-title min-w-0 [overflow-wrap:anywhere] text-signal transition-colors hover:text-ink"
            >
              {links.email}
            </a>
            <CopyEmail className="col-start-2 justify-self-start border-ink/25 text-ink hover:border-signal hover:text-signal md:col-start-auto md:justify-self-end" />
          </li>
          {CONTACT_LINKS.map((l) => (
            <li key={l.label} className="border-b border-rule">
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-cols-[6rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[10rem_1fr_auto] md:py-6"
              >
                <span className="type-label text-ink-soft">{l.label}</span>
                <span className="type-title !text-[clamp(1.2rem,2vw,1.7rem)] text-ink transition-transform duration-500 group-hover:translate-x-2">
                  {l.value}
                </span>
                <span
                  aria-hidden
                  className="type-label text-ink-soft transition-colors group-hover:text-signal"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 md:mt-28">
        <FooterBar />
      </div>
    </section>
  );
}
