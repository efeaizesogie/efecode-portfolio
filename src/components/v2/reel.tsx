import { useEffect, useRef, useState } from "react";

/* The project reel above the six projects: screenshots of each live site on
 * their own backdrops, looping (built by showcase/reel/make_reel.py). It plays only
 * while on screen and shows its poster without script or under reduced
 * motion. */
export function Reel() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [seen, setSeen] = useState(false);
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
    if (seen && !still) v.play().catch(() => {});
    else v.pause();
  }, [seen, still]);

  return (
    <figure ref={ref} className="reel" data-kind="product">
      <video
        ref={video}
        className="reel__video"
        poster="/work/reel-poster.jpg"
        width={3840}
        height={2160}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Screens from Verto, ScamTrail, Furlio, ApplyReady, Clinq and Honatrix"
      >
        {/* 4K where the reel is wide enough to show it; the 1080p cut on phones. */}
        <source src="/work/reel-4k.mp4" type="video/mp4" media="(min-width: 60rem)" />
        <source src="/work/reel.mp4" type="video/mp4" />
      </video>
    </figure>
  );
}
