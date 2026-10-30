import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { cases } from "@/lib/cases";

/* The six projects, each row opening its case study. A project with a
 * walkthrough shows a 10 s preview of it instead of a still: the previews
 * play only while the list is on screen, stop with "Pause previews", and
 * stay on their first screen under reduced motion or without script. */
export function Ledger() {
  const list = useRef<HTMLOListElement>(null);
  const [seen, setSeen] = useState(false);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = list.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const run = seen && !held && !still;
    list.current?.querySelectorAll("video").forEach((v) => (run ? v.play().catch(() => {}) : v.pause()));
  }, [seen, held, still]);

  return (
    <>
      <ol ref={list} className="ledger panel" aria-label="Six projects, each with a case study">
        {cases.map((c, i) => (
          <li key={c.slug}>
            <Link
              to="/work/$slug"
              params={{ slug: c.slug }}
              className="ledger__link"
              style={{ "--row": i } as CSSProperties}
            >
              {c.video ? (
                <video
                  className="ledger__thumb"
                  src={`/work/${c.slug}/preview.mp4`}
                  poster={`/work/${c.slug}/1.jpg`}
                  width={320}
                  height={200}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                />
              ) : (
                <img
                  className="ledger__thumb"
                  src={`/work/${c.slug}/1.jpg`}
                  width={c.size[0]}
                  height={c.size[1]}
                  alt=""
                  loading={i > 2 ? "lazy" : undefined}
                  decoding="async"
                />
              )}
              <span className="ledger__title">{c.title}</span>
              <span className="ledger__lede">{c.lede}</span>
              <span className="ledger__field">{c.field}</span>
              <span className="ledger__year measured">{c.year}</span>
            </Link>
          </li>
        ))}
      </ol>
      {!still && (
        <div className="ledger__tools">
          <button type="button" className="btn btn--small btn--quiet" onClick={() => setHeld((h) => !h)}>
            {held ? "Play previews" : "Pause previews"}
          </button>
        </div>
      )}
    </>
  );
}
