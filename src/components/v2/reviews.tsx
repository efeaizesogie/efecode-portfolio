import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials } from "@/lib/portfolio";

const EVERY_MS = 7000;

/* The five reviews, one at a time. It turns every seven seconds while on
 * screen and holds on hover and focus. The arrows step back and forward,
 * and the first press stops the turning for good, so a reader can always
 * hold one still. It never moves under reduced motion; without script the
 * first review simply stays. */
export function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState(false);
  const [held, setHeld] = useState(false);
  const [byHand, setByHand] = useState(false);
  const n = testimonials.length;
  const step = (d: number) => {
    setByHand(true);
    setI((x) => (x + d + n) % n);
  };

  useEffect(() => {
    setHeld(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = seen && !hover && !held && !byHand;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setI((x) => (x + 1) % n), EVERY_MS);
    return () => window.clearTimeout(id);
  }, [running, i, n]);

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
          <button type="button" className="btn btn--icon" onClick={() => step(-1)} aria-label="Previous review">
            <ArrowLeft aria-hidden />
          </button>
          <button type="button" className="btn btn--icon" onClick={() => step(1)} aria-label="Next review">
            <ArrowRight aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
