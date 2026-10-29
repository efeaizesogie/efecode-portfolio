/*
 * The minimal site's frame: a slab nav, the page, and a closing statement.
 * The theme (dark by default, light by choice) lives on <html data-theme>
 * and is set before paint by the script in the layout route.
 */

import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { links } from "@/lib/portfolio";

export const THEME_KEY = "efecode:v2-theme";

/* Every "Start a project" opens a mail with the subject already filled in. */
export const projectMail = `mailto:${links.email}?subject=${encodeURIComponent("New project")}`;

/* Runs before the page paints, so a light choice never flashes dark. It
 * also marks the page as scripted, which is the only state in which the
 * scroll fade-ins start hidden: without script every section just shows. */
export const themeScript = `document.documentElement.classList.add("js");try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})==="light")document.documentElement.dataset["theme"]="light"}catch(e){}`;

/* Fades each [data-reveal] section in once as it scrolls into view. */
function useReveal(key: string) {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".v2 [data-reveal]:not(.is-in)")];
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}

function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.dataset["theme"] === "light");
  }, []);

  const flip = () => {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.dataset["theme"] = "light";
    else delete document.documentElement.dataset["theme"];
    try {
      localStorage.setItem(THEME_KEY, next ? "light" : "dark");
    } catch {
      /* private mode: the choice lasts for this page only */
    }
  };

  return (
    <button
      type="button"
      className="btn btn--icon"
      onClick={flip}
      aria-label={light ? "Switch to the dark theme" : "Switch to the light theme"}
    >
      {light ? <Moon aria-hidden /> : <Sun aria-hidden />}
    </button>
  );
}

export function Slab({ current }: { current?: "work" | undefined }) {
  return (
    <header className="slab">
      <div className="container slab__row">
        <Link to="/" className="slab__mark" aria-label="Efe Aizesogie, home">
          Efe Aizesogie
        </Link>
        <nav aria-label="Primary">
          <ul className="slab__links">
            <li>
              <Link to="/" hash="work" aria-current={current === "work" ? "page" : undefined}>
                Work
              </Link>
            </li>
            <li>
              <Link to="/" hash="roles">
                Roles
              </Link>
            </li>
          </ul>
        </nav>
        <div className="slab__tools">
          <ThemeToggle />
          <a className="btn btn--quiet slab__email" href={projectMail}>
            Start a project
          </a>
        </div>
      </div>
    </header>
  );
}

export function Close() {
  return (
    <footer className="close" data-reveal>
      <div className="container">
        <h2 className="close__line">Have a product to launch? Tell me about it.</h2>
        <p className="close__sub">Send a brief, a Figma link or a rough idea, and I’ll tell you how I’d build it.</p>
        <div className="close__cta">
          <a className="btn" href={projectMail}>
            Start a project
          </a>
          <a className="mail-link" href={projectMail}>
            {links.email}
          </a>
        </div>
        <div className="close__row">
          <ul className="close__links">
            <li>
              <a href={links.linkedin}>LinkedIn</a>
            </li>
            <li>
              <a href={links.github}>GitHub</a>
            </li>
            <li>
              <a href={links.x}>X</a>
            </li>
            <li>
              <a href={links.resume}>Résumé</a>
            </li>
            <li>
              <a href="/v1">Interactive version</a>
            </li>
          </ul>
          <p className="close__legal">© {new Date().getFullYear()} Efe Aizesogie</p>
        </div>
      </div>
    </footer>
  );
}

export function V2Frame({ children, current }: { children: ReactNode; current?: "work" | undefined }) {
  useReveal(useLocation().pathname);
  return (
    <div className="v2">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Slab current={current} />
      <main id="main">{children}</main>
      <Close />
    </div>
  );
}
