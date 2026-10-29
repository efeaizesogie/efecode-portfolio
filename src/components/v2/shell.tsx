/*
 * The minimal site's frame: a slab nav, the page, and a closing statement.
 * The theme (dark by default, light by choice) lives on <html data-theme>
 * and is set before paint by the script in the layout route.
 */

import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { links } from "@/lib/portfolio";

export const THEME_KEY = "efecode:v2-theme";

/* Runs before the page paints, so a light choice never flashes dark. */
export const themeScript = `try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})==="light")document.documentElement.dataset["theme"]="light"}catch(e){}`;

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
            <li className="slab__wide">
              <a href="/v1">Interactive site</a>
            </li>
          </ul>
        </nav>
        <div className="slab__tools">
          <ThemeToggle />
          <a className="btn btn--quiet slab__email" href={`mailto:${links.email}`}>
            Email me
          </a>
        </div>
      </div>
    </header>
  );
}

export function Close() {
  return (
    <footer className="close">
      <div className="container">
        <p className="close__line">
          Have something to build? <a href={`mailto:${links.email}`}>{links.email}</a>
        </p>
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
