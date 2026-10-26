"use client";

/*
 * Live topographic map drawn with marching squares over drifting noise.
 * The pointer raises a hill whose summit contours glow in signal; a corner
 * readout tracks the pointer as coordinates around Benin City.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* Benin City, the map's origin. */
const ORIGIN = { lat: 6.335, lon: 5.6037 };

function hash(x: number, y: number, z: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function valueNoise(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const zf = smooth(z - zi);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), xf);
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), xf);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), xf);
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), xf);
  return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf) * 2 - 1;
}

function fbm(x: number, y: number, z: number) {
  return (
    valueNoise(x, y, z) * 0.6 +
    valueNoise(x * 2.1, y * 2.1, z) * 0.28 +
    valueNoise(x * 4.3, y * 4.3, z) * 0.12
  );
}

const STEP = 0.11;
const SUMMIT = 0.85;

export function TerrainCanvas({
  animate,
  readout = true,
  readoutClassName = "right-[clamp(1.15rem,4vw,4rem)] top-24 md:top-28",
  strength = 1,
  tone = "ink",
}: {
  animate: boolean;
  readout?: boolean;
  readoutClassName?: string;
  /* Multiplies line opacity; below 1 for backdrops behind body text. */
  strength?: number;
  /* Line colour: ink on paper, or light lines for dark surfaces. */
  tone?: "ink" | "light";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cell = 10;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const target = { x: -9999, y: -9999 };
    const hill = { x: -9999, y: -9999, amp: 0 };
    let raf = 0;
    let visible = true;
    let t = Math.random() * 100;
    let last = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cell = w < 700 ? 12 : 10;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;
      const field = new Float32Array(cols * rows);
      const scale = 0.0021;
      const r2 = 2 * Math.pow(Math.min(170, w * 0.16), 2);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * cell;
          const y = j * cell;
          const dx = x - hill.x;
          const dy = y - hill.y;
          field[j * cols + i] =
            fbm(x * scale, y * scale, t) + hill.amp * Math.exp(-(dx * dx + dy * dy) / r2);
        }
      }

      const paths = new Map<number, Path2D>();
      const pathFor = (k: number) => {
        let p = paths.get(k);
        if (!p) paths.set(k, (p = new Path2D()));
        return p;
      };

      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = field[j * cols + i]!;
          const b = field[j * cols + i + 1]!;
          const c = field[(j + 1) * cols + i + 1]!;
          const d = field[(j + 1) * cols + i]!;
          const lo = Math.min(a, b, c, d);
          const hi = Math.max(a, b, c, d);
          const x = i * cell;
          const y = j * cell;
          for (let k = Math.ceil(lo / STEP); k * STEP <= hi; k++) {
            const L = k * STEP;
            const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const top = () => [x + ((L - a) / (b - a)) * cell, y] as const;
            const right = () => [x + cell, y + ((L - b) / (c - b)) * cell] as const;
            const bottom = () => [x + ((L - d) / (c - d)) * cell, y + cell] as const;
            const left = () => [x, y + ((L - a) / (d - a)) * cell] as const;
            const p = pathFor(k);
            const seg = (p1: readonly [number, number], p2: readonly [number, number]) => {
              p.moveTo(p1[0], p1[1]);
              p.lineTo(p2[0], p2[1]);
            };
            switch (idx) {
              case 1:
              case 14:
                seg(left(), bottom());
                break;
              case 2:
              case 13:
                seg(bottom(), right());
                break;
              case 3:
              case 12:
                seg(left(), right());
                break;
              case 4:
              case 11:
                seg(top(), right());
                break;
              case 5:
                seg(left(), top());
                seg(bottom(), right());
                break;
              case 6:
              case 9:
                seg(top(), bottom());
                break;
              case 7:
              case 8:
                seg(left(), top());
                break;
              case 10:
                seg(left(), bottom());
                seg(top(), right());
                break;
            }
          }
        }
      }

      ctx.clearRect(0, 0, w, h);
      for (const [k, p] of paths) {
        const L = k * STEP;
        const major = k % 5 === 0;
        if (L >= SUMMIT) {
          ctx.strokeStyle = `oklch(0.605 0.204 33 / ${Math.min(1, 0.45 + (L - SUMMIT) * 0.9) * strength})`;
          ctx.lineWidth = major ? 1.6 : 1.1;
        } else {
          ctx.strokeStyle = `${tone === "light" ? "oklch(0.945 0.008 84" : "oklch(0.185 0.006 60"} / ${(major ? 0.42 : 0.2) * strength})`;
          ctx.lineWidth = major ? 1.2 : 0.8;
        }
        ctx.stroke(p);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      t += dt * 0.045;
      const ease = 1 - Math.pow(0.002, dt);
      hill.x += (target.x - hill.x) * ease;
      hill.y += (target.y - hill.y) * ease;
      const goal = target.x < -1000 ? 0 : 1.7;
      hill.amp += (goal - hill.amp) * (1 - Math.pow(0.05, dt));
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (y < 0 || y > r.height) {
        target.x = target.y = -9999;
        return;
      }
      if (hill.x < -1000) {
        hill.x = x;
        hill.y = y;
      }
      target.x = x;
      target.y = y;
      const el = readoutRef.current;
      if (el) {
        const lat = ORIGIN.lat + (0.5 - y / r.height) * 0.08;
        const lon = ORIGIN.lon + (x / r.width - 0.5) * 0.12;
        el.textContent = `${lat.toFixed(4)}° N   ${lon.toFixed(4)}° E`;
      }
    };
    const onLeave = () => {
      target.x = target.y = -9999;
    };

    resize();
    draw();
    const ro = new ResizeObserver(() => {
      resize();
      if (!animate) draw();
    });
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (animate) {
      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
      io = new IntersectionObserver(([entry]) => {
        visible = !!entry?.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      });
      io.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [animate, strength, tone]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      {readout && (
        <span
          ref={readoutRef}
          aria-hidden
          className={`type-meta absolute whitespace-pre text-ink-soft ${readoutClassName}`}
        >
          {`${ORIGIN.lat.toFixed(4)}° N   ${ORIGIN.lon.toFixed(4)}° E`}
        </span>
      )}
    </>
  );
}

/*
 * One map fixed behind the whole page. It shows through every section marked
 * `data-contour` (the light ones) and dark sections paint over it. It only
 * animates while a marked section is on screen.
 */
export function ContourBackdrop() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setActive(seen.size > 0);
    });
    const scan = () => {
      io.disconnect();
      seen.clear();
      document.querySelectorAll("[data-contour]").forEach((el) => io.observe(el));
    };
    scan();
    // Sections can be swapped after mount; re-scan when the page changes shape.
    const mo = new MutationObserver((records) => {
      if (records.some((r) => r.addedNodes.length || r.removedNodes.length)) scan();
    });
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <TerrainCanvas animate={active && !reduced} readout={false} strength={0.6} />
    </div>
  );
}
