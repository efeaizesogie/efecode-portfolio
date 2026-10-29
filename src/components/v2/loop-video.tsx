import { useEffect, useRef, useState } from "react";

/* A walkthrough that plays only while it is on screen, pauses on hover and
 * focus, and carries a visible Pause control. Reduced motion starts it held. */
export function LoopVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [seen, setSeen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    setHeld(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (seen && !paused && !held) v.play().catch(() => {});
    else v.pause();
  }, [seen, paused, held]);

  return (
    <figure
      ref={ref}
      className="frame"
      data-kind="product"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
      <figcaption className="frame__cap">
        <span>Walkthrough</span>
        <button type="button" className="btn btn--small" onClick={() => setHeld((h) => !h)}>
          {held ? "Play" : "Pause"}
        </button>
      </figcaption>
    </figure>
  );
}
