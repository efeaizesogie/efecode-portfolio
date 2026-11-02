import { useEffect, useRef, useState } from "react";

/* The project reel above the six projects: the best few seconds of each
 * walkthrough, looping (built by showcase/reel/make_reel.py). It plays only
 * while on screen, has a visible Pause, and shows its poster without script
 * or under reduced motion. */
export function Reel() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [seen, setSeen] = useState(false);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (seen && !held && !still) v.play().catch(() => {});
    else v.pause();
  }, [seen, held, still]);

  return (
    <figure ref={ref} className="reel" data-kind="product">
      <video
        ref={video}
        className="reel__video"
        src="/work/reel.mp4"
        poster="/work/reel-poster.jpg"
        width={1600}
        height={900}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="A reel of Verto, ScamTrail, Furlio, ApplyReady, Clinq and Honatrix"
      />
      {!still && (
        <button type="button" className="btn btn--small reel__toggle" onClick={() => setHeld((h) => !h)}>
          {held ? "Play" : "Pause"}
        </button>
      )}
    </figure>
  );
}
