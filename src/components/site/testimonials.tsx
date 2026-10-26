"use client";

import { testimonials } from "@/lib/portfolio";

export function Testimonials() {
  return (
    <section
      data-contour
      className="overflow-hidden border-y border-rule py-14 md:py-20 flex flex-col"
    >
      <div className="shell mb-10">
        <p className="type-label text-signal">Said about the work</p>
      </div>
      <div className="flex overflow-hidden">
        <div
          className="marquee-track flex w-max shrink-0 whitespace-nowrap"
          style={{ ["--marquee-duration" as string]: "70s" }}
        >
          {testimonials.map((t, i) => (
            <figure
              key={`${t.handle}-${i}`}
              className="w-[78vw] shrink-0 border-l border-rule pl-6 pr-6 sm:w-[42vw] lg:w-[26vw] whitespace-normal"
            >
              <blockquote className="type-prose text-ink-soft">“{t.quote}”</blockquote>
              <figcaption className="type-label mt-6 text-ink">
                {t.name} <span className="text-ink-soft">{t.handle}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div
          className="marquee-track flex w-max shrink-0 whitespace-nowrap"
          style={{ ["--marquee-duration" as string]: "70s" }}
          aria-hidden="true"
        >
          {testimonials.map((t, i) => (
            <figure
              key={`${t.handle}-${i}-dup`}
              className="w-[78vw] shrink-0 border-l border-rule pl-6 pr-6 sm:w-[42vw] lg:w-[26vw] whitespace-normal"
            >
              <blockquote className="type-prose text-ink-soft">“{t.quote}”</blockquote>
              <figcaption className="type-label mt-6 text-ink">
                {t.name} <span className="text-ink-soft">{t.handle}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
