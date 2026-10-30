/* The minimal home page: the six projects as a ledger, the figures behind
 * them, what a client gets, reviews in turn, the roles. Each ledger row
 * opens its case study. */

import type { CSSProperties } from "react";
import { roles } from "@/lib/cases";
import { Ledger } from "./ledger";
import { projectMail } from "./shell";
import { Reviews } from "./reviews";

/* The figures the interactive site's About section already states. */
const figures = [
  ["4", "years shipping frontend"],
  ["14+", "projects delivered"],
  ["6", "teams worked with"],
] as const;

export function Home() {
  return (
    <>
      <section className="hero" id="work" aria-labelledby="hero-head">
        <div className="container">
          <div className="hero__head">
            <div>
              <h1 id="hero-head" className="rise" style={{ "--i": 0 } as CSSProperties}>Fast, considered interfaces for the web.</h1>
              <p className="lead hero__lead rise" style={{ "--i": 1 } as CSSProperties}>
                <span>
                  I’m a frontend engineer who turns designs into fast, accessible products, works closely with
                  designers and backend teams, and takes the work all the way to launch.
                </span>
                <span>
                  I’ve built across fintech, healthcare, construction and Web3: booking portals, dashboards and
                  company sites that customers find easy to use and teams can keep building on.
                </span>
              </p>
            </div>
            <div className="actions rise" style={{ "--i": 2 } as CSSProperties}>
              <a className="btn btn--primary" href={projectMail}>
                Start a project
              </a>
            </div>
          </div>
          <Ledger />
          <dl className="figures__row rise" style={{ "--i": 6 } as CSSProperties} aria-label="In numbers">
            {figures.map(([n, label]) => (
              <div key={label}>
                <dt className="figures__label">{label}</dt>
                <dd className="figures__value">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="does" aria-labelledby="does-head" data-reveal>
        <div className="container split">
          <h2 id="does-head">What you get.</h2>
          <dl className="does__list">
            <div>
              <dt>Your design, built exactly</dt>
              <dd>Figma files turned into responsive React components that look right on every screen.</dd>
            </div>
            <div>
              <dt>Fast, findable pages</dt>
              <dd>Code tuned for speed, SEO and accessibility, as on the Ascetic Capital site.</dd>
            </div>
            <div>
              <dt>Motion with a job</dt>
              <dd>GSAP and Framer Motion that lead visitors to the next step instead of distracting them.</dd>
            </div>
            <div>
              <dt>Product screens, not only pages</dt>
              <dd>Bookings, dashboards and fintech flows, from Clinq to Mercator Technologies.</dd>
            </div>
          </dl>
        </div>
      </section>

      <Reviews />

      <section className="roles" id="roles" aria-labelledby="roles-head" data-reveal>
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
    </>
  );
}
