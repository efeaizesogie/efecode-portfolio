/* The minimal home page: the six projects as a ledger, what Efe does, the
 * roles, one teammate's words. Each ledger row opens its case study. */

import { Link } from "@tanstack/react-router";
import { cases, roles } from "@/lib/cases";
import { links, testimonials } from "@/lib/portfolio";

const kelechi = testimonials.find((t) => t.name === "Kelechi Eronini");

export function Home() {
  return (
    <>
      <section className="hero" id="work" aria-labelledby="hero-head">
        <div className="container">
          <div className="hero__head">
            <div>
              <h1 id="hero-head">Fast, considered interfaces for the web.</h1>
              <p className="lead">I’m Efe, a frontend engineer working in React, Next.js and TypeScript.</p>
            </div>
            <div className="actions">
              <a className="btn btn--primary" href={`mailto:${links.email}`}>
                Email me
              </a>
              <a className="btn btn--quiet" href="/v1">
                View the interactive site
              </a>
            </div>
          </div>
          <ol className="ledger panel" aria-label="Six projects, each with a case study">
            {cases.map((c, i) => (
              <li key={c.slug}>
                <Link to="/work/$slug" params={{ slug: c.slug }} className="ledger__link">
                  <img
                    className="ledger__thumb"
                    src={`/work/${c.slug}/1.jpg`}
                    width={c.size[0]}
                    height={c.size[1]}
                    alt=""
                    loading={i > 2 ? "lazy" : undefined}
                    decoding="async"
                  />
                  <span className="ledger__title">{c.title}</span>
                  <span className="ledger__lede">{c.lede}</span>
                  <span className="ledger__field">{c.field}</span>
                  <span className="ledger__year measured">{c.year}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="does" aria-labelledby="does-head">
        <div className="container split">
          <h2 id="does-head">What I do.</h2>
          <dl className="does__list">
            <div>
              <dt>Interfaces from design files</dt>
              <dd>UI and UX designs turned into responsive, reusable React components.</dd>
            </div>
            <div>
              <dt>Motion that explains</dt>
              <dd>GSAP and Framer Motion, used to guide the eye rather than decorate.</dd>
            </div>
            <div>
              <dt>Fintech and data screens</dt>
              <dd>Fintech components at Mercator Technologies; dashboards like PayFlow Analyzer.</dd>
            </div>
            <div>
              <dt>Maps and spatial data</dt>
              <dd>A B.Sc. in Geomatics and a year as a GIS specialist at DGIS.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="roles" id="roles" aria-labelledby="roles-head">
        <div className="container split">
          <h2 id="roles-head">Six roles since 2023.</h2>
          <ol className="trail">
            {roles.map((r) => (
              <li className="trail__item" key={r.company}>
                <p className="trail__who">
                  <strong>{r.company}</strong> {r.role}
                </p>
                <p className="trail__when measured">
                  <time>{r.from}</time> to <time>{r.to}</time>
                </p>
                <p className="trail__where">{r.place}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {kelechi && (
        <section className="said" aria-label="From a teammate">
          <div className="container">
            <blockquote className="said__body">
              <p>“{kelechi.quote.split(". ")[0]}.”</p>
              <footer>{kelechi.name}</footer>
            </blockquote>
          </div>
        </section>
      )}
    </>
  );
}
