/* One project's case study: the head and its facts, the lead screen, then
 * three numbered stages, each with its own screen or the walkthrough. */

import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { cases, type Case } from "@/lib/cases";
import { LoopVideo } from "./loop-video";

function Shot({ c, n, eager }: { c: Case; n: number; eager?: boolean | undefined }) {
  return (
    <figure className="frame" data-kind="product">
      <img
        src={`/work/${c.slug}/${n}.jpg`}
        width={c.size[0]}
        height={c.size[1]}
        alt={`${c.title}, screen ${n}`}
        loading={eager ? undefined : "lazy"}
        decoding="async"
      />
    </figure>
  );
}

const and = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export function CaseStudy({ c }: { c: Case }) {
  const i = cases.findIndex((x) => x.slug === c.slug);
  const next = cases[(i + 1) % cases.length]!;
  const written = !!c.brief;

  const stages = [
    {
      head: written ? "The brief" : "What it does",
      text: written ? c.brief : c.blurb,
      obj: <Shot c={c} n={2} />,
    },
    {
      head: written ? "What I built" : "How it’s built",
      text: written ? c.built : `Built with ${and(c.stack)}.`,
      obj: <Shot c={c} n={3} />,
    },
    {
      head: written ? "The result" : "In use",
      text: written
        ? c.result
        : c.video
          ? "A walkthrough of the site, recorded from the live build."
          : "One more screen from the live build.",
      obj: c.video ? (
        <LoopVideo
          src={`/work/${c.slug}/demo.mp4`}
          poster={`/work/${c.slug}/poster.jpg`}
          width={c.video[0]}
          height={c.video[1]}
          label={`A walkthrough of ${c.title}`}
        />
      ) : (
        <Shot c={c} n={4} />
      ),
    },
  ];

  return (
    <>
      <section className="case-hero" aria-labelledby="case-head">
        <div className="container">
          <p className="crumb">
            <Link to="/" hash="work">
              All work
            </Link>
          </p>
          <div className="case-hero__grid">
            <div>
              <h1 id="case-head" className="rise" style={{ "--i": 0 } as CSSProperties}>{c.title}</h1>
              <p className="lead rise" style={{ "--i": 1 } as CSSProperties}>
                {c.lede}
              </p>
              <div className="actions rise" style={{ "--i": 2 } as CSSProperties}>
                {c.live && (
                  <a className="btn btn--primary" href={c.live}>
                    Visit the live site
                  </a>
                )}
                {c.repo && (
                  <a className="btn btn--quiet" href={c.repo}>
                    Read the source
                  </a>
                )}
              </div>
            </div>
            <dl className="facts panel rise" style={{ "--i": 3 } as CSSProperties}>
              <div>
                <dt>Year</dt>
                <dd className="measured">{c.year}</dd>
              </div>
              <div>
                <dt>Field</dt>
                <dd>{c.field}</dd>
              </div>
              {c.role && (
                <div>
                  <dt>Role</dt>
                  <dd>{c.role}</dd>
                </div>
              )}
              <div>
                <dt>Built with</dt>
                <dd>{c.stack.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="lead-shot" data-reveal aria-label={`${c.title}, the first screen`}>
        <div className="container">
          <Shot c={c} n={1} eager />
        </div>
      </section>

      {stages.map((s, n) => (
        <section className="stage" data-reveal key={s.head} aria-labelledby={`stage-${n + 1}`}>
          <div className="container stage__grid">
            <div className="stage__text">
              <h2 id={`stage-${n + 1}`}>
                {n + 1}. {s.head}
              </h2>
              <p>{s.text}</p>
            </div>
            <div className="stage__obj">{s.obj}</div>
          </div>
        </section>
      ))}

      {c.quote && (
        <section className="said" data-reveal aria-label="From the client">
          <div className="container">
            <blockquote className="said__body">
              <p>“{c.quote.text}”</p>
              <footer>{c.quote.by}</footer>
            </blockquote>
          </div>
        </section>
      )}

      <nav className="next" data-reveal aria-label="Next case study">
        <div className="container">
          <Link to="/work/$slug" params={{ slug: next.slug }} className="next__link">
            <span className="next__label">Next case study</span>
            <span className="next__title">{next.title}</span>
            <span className="next__lede">{next.lede}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
