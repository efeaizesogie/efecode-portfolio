"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { links } from "@/lib/portfolio";
import { RevealText } from "./motion-primitives";
import { Magnetic } from "./interactions";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["18%", "0%"]);

  return (
    <section
      id="contact"
      ref={ref}
      className="grain relative overflow-hidden bg-void pt-20 text-void-foreground md:pt-32"
    >
      <div className="shell">
        <p className="type-label text-signal">Contact</p>

        <h2 className="type-display mt-8 max-w-[18ch]">
          <RevealText text="Have an idea to discuss? Let's build it properly." stagger={0.03} />
        </h2>

        <div className="mt-12 grid gap-10 border-t border-void-rule pt-8 md:grid-cols-12">
          <p className="type-prose max-w-[46ch] text-void-foreground/70 md:col-span-5">
            Shoot me an email if you want to connect. You can also find me on LinkedIn or X if
            that's more your speed.
          </p>

          <div className="md:col-span-6 md:col-start-7">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${links.email}`}
                data-cursor="Email"
                className="type-display block break-all text-void-foreground transition-colors duration-500 hover:text-signal"
              >
                {links.email}
              </a>
            </Magnetic>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[
                ["LinkedIn", links.linkedin],
                ["GitHub", links.github],
                ["X / Twitter", links.x],
                ["Instagram", links.instagram],
                ["Résumé", links.resume],
                ["Email", `mailto:${links.email}`],
              ].map(([label, href]) => (

                <a
                  key={label}
                  href={href}
                  target={href!.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="type-label link-underline text-void-foreground/70 hover:text-void-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div style={{ y }} className="mt-16 overflow-hidden md:mt-24">
        <p className="type-mega w-full px-[clamp(1.15rem,4vw,4rem)] leading-none text-void-foreground/10 select-none">
          EFECODE
        </p>
      </motion.div>

      <footer className="shell flex flex-wrap items-center justify-between gap-4 border-t border-void-rule py-6">
        <p className="type-label text-void-foreground/45">
          © {new Date().getFullYear()} Efe Aizesogie
        </p>
        <p className="type-label text-void-foreground/45">Built in React · Edo, Nigeria</p>
        <button
          onClick={() =>
            document.getElementById("index")?.scrollIntoView({ behavior: "smooth" })
          }
          className="type-label text-void-foreground/70 hover:text-signal"
        >
          Back to top ↑
        </button>
      </footer>
    </section>
  );
}
