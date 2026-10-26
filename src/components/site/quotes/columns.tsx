"use client";

/*
 * Testimonials option T3 — Columns.
 * Every quote at once in unboxed, staggered columns, each signed with an
 * initials mark, the name and handle. Static: nothing to wait for.
 */

import { testimonials } from "@/lib/portfolio";
import { RevealText, Rise } from "../motion-primitives";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => !/^(mr|mrs|ms|dr)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function QuotesColumns() {
  return (
    <section data-contour className="py-20 md:py-32">
      <div className="shell">
        <h2 className="type-display">
          <RevealText text="Kind words" stagger={0.05} />
        </h2>

        <div className="mt-12 gap-10 md:mt-16 md:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <Rise key={t.handle} delay={i * 0.05} className="mb-12 break-inside-avoid">
              <figure className={i % 3 === 1 ? "lg:pt-12" : ""}>
                <blockquote className="type-prose text-ink/85">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-signal font-display text-sm font-semibold text-signal"
                  >
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold tracking-tight">
                      {t.name}
                    </span>
                    <span className="type-meta block text-ink-soft">{t.handle}</span>
                  </span>
                </figcaption>
              </figure>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
