"use client";

/* Pieces every contact/footer layout shares. */

import { useEffect, useState } from "react";
import { links } from "@/lib/portfolio";

export const SIGN_OFF = "Have an idea to discuss? Let's build it properly.";

export const CONTACT_LINKS = [
  { label: "LinkedIn", value: "in/efe-aizesogie", href: links.linkedin },
  { label: "GitHub", value: "efeaizesogie", href: links.github },
  { label: "X", value: "@efecode", href: links.x },
  { label: "Instagram", value: "@efeaizesogie", href: links.instagram },
  { label: "Résumé", value: "PDF", href: links.resume },
];

/* Live UK time (follows GMT/BST), refreshed every 30 seconds. */
export function useUkTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`type-label rounded-full border px-3 py-1.5 !text-[0.62rem] transition-colors ${className}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function BackToTop({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const top = document.getElementById("index");
        if (top) top.scrollIntoView({ behavior: "smooth" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`type-label transition-colors hover:text-signal ${className}`}
    >
      Back to top ↑
    </button>
  );
}

/* The thin closing bar under every layout. */
export function FooterBar({ tone = "ink" }: { tone?: "ink" | "light" }) {
  const time = useUkTime();
  const muted = tone === "ink" ? "text-ink-soft" : "text-void-foreground/50";
  const rule = tone === "ink" ? "border-rule" : "border-void-rule";
  return (
    <footer
      className={`shell flex flex-wrap items-center justify-between gap-4 border-t py-6 ${rule}`}
    >
      <p className={`type-label ${muted}`}>© {new Date().getFullYear()} Efe Aizesogie</p>
      <p className={`type-label ${muted}`}>{time ? `${time} UK time` : "UK time"}</p>
      <BackToTop className={tone === "ink" ? "text-ink" : "text-void-foreground/80"} />
    </footer>
  );
}
