import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/portfolio";

const EVERY_MS = 7000;

/* The five reviews, one at a time. It turns every seven seconds while on
 * screen, holds on hover and focus, has a visible Pause, and never moves
 * under reduced motion. Without script the first review simply stays. */
export function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState(false);
  const [held, setHeld] = useState(false);
  const [byHand, setByHand] = useState(false);

  useEffect(() => {
    setHeld(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = seen && !hover && !held;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % testimonials.length), EVERY_MS);
    return () => window.clearTimeout(id);
  }, [running, i]);

  const t = testimonials[i]!;
  return (
    <section
      ref={ref}
      className="said"
      aria-label="What clients and teammates say"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="container">
        <blockquote className="said__body" key={i} aria-live={byHand ? "polite" : "off"}>
          <p>“{t.quote}”</p>
          <footer>
            {t.name} <span className="said__handle">{t.handle}</span>
          </footer>
        </blockquote>
        <div className="said__controls">
          <button type="button" className="btn btn--small btn--quiet" onClick={() => setHeld((h) => !h)}>
            {held ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            className="btn btn--small btn--quiet"
            onClick={() => {
              setByHand(true);
              setI((n) => (n + 1) % testimonials.length);
            }}
          >
            Next review
          </button>
        </div>
      </div>
    </section>
  );
}
