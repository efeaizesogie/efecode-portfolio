"use client";

/* Shared state every navbar option needs: the section in view, whether the
 * page has scrolled, the Benin City clock and smooth section jumps. */

import { useEffect, useState } from "react";
import { sections } from "@/lib/portfolio";

export function useNavState() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState("index");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });

    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Lagos",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 30_000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
      window.clearInterval(id);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const currentIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === current),
  );

  return { scrolled, current, currentIndex, clock, go, sections };
}
