"use client";

/*
 * Selected Work. Field sheets by default; visitors can switch the same six
 * projects to the transect walk. The choice is remembered per browser.
 */

import { useEffect, useState } from "react";
import { WorkSheets } from "./sheets";
import { WorkTransect } from "./transect";

type View = "sheets" | "transect";
const KEY = "efecode:work-view";

function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Work view"
      className="inline-flex rounded-full border border-ink/20 bg-paper/80 p-1 backdrop-blur-[2px]"
    >
      {(
        [
          ["sheets", "Sheets"],
          ["transect", "Transect"],
        ] as const
      ).map(([v, label]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={view === v}
          onClick={() => onChange(v)}
          className={`type-label rounded-full px-4 py-2 !text-[0.66rem] transition-colors duration-300 ${
            view === v ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function Work() {
  const [view, setView] = useState<View>("sheets");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "sheets" || saved === "transect") setView(saved);
    } catch {
      // Storage can be unavailable (private mode); the default view is fine.
    }
  }, []);

  const change = (v: View) => {
    if (v === view) return;
    setView(v);
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      // Not remembered this time; nothing else depends on it.
    }
    // The two views differ a lot in height; keep the reader at the section top.
    requestAnimationFrame(() =>
      document.getElementById("work")?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
  };

  const toggle = <ViewSwitch view={view} onChange={change} />;
  return view === "sheets" ? <WorkSheets toggle={toggle} /> : <WorkTransect toggle={toggle} />;
}
