"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { sections, links } from "@/lib/portfolio";
import { Magnetic, SwapText } from "./interactions";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("index");
  const [clock, setClock] = useState("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

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
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          scrolled ? "bg-paper/85 backdrop-blur-[2px]" : ""
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
          <Magnetic className="shrink-0">
            <button
              onClick={() => go("index")}
              className="type-label flex items-center gap-2 text-ink"
              aria-label="Back to top"
            >
              {/* <span className="inline-block h-2 w-2 rounded-full bg-signal" />
              EFECODE */}
              <img src="/favicon.ico" alt="logo" />
            </button>
          </Magnetic>

          <nav className="hidden items-center gap-4 md:flex lg:gap-8">
            {sections.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={`type-label transition-opacity duration-300 ${
                  current === s.id ? "text-signal" : "text-ink opacity-55 hover:opacity-100"
                }`}
              >
                <SwapText label={s.label} />
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 lg:gap-5">
            <span className="type-label hidden text-ink-soft xl:inline">
              Edo {clock}
            </span>
            <a
              href={links.resume}
              target="_blank"
              rel="noreferrer"
              className="type-label link-underline hidden text-ink-soft hover:text-signal lg:inline"
            >
              Résumé
            </a>

            <Magnetic strength={0.25}>
              <a
                href={`mailto:${links.email}`}
                className="type-label hidden rounded-full bg-ink px-4 py-2.5 text-paper transition-colors duration-300 hover:bg-signal lg:inline-block"
              >
                Available for work
              </a>
            </Magnetic>
            <button
              onClick={() => setOpen((v) => !v)}
              className="type-label md:hidden"
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? "Close" : "Index"}
            </button>
          </div>
        </div>
        <motion.div
          className="h-px origin-left bg-signal"
          style={{ scaleX: progress }}
        />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[79] bg-paper md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="shell flex h-full flex-col justify-center gap-2 pt-16">
              {sections.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => go(s.id)}
                  className="type-display flex items-baseline gap-4 py-1 text-left"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="type-label text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
