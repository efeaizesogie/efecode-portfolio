"use client";

/*
 * A segmented switch for sections that offer more than one way to look at
 * the same content, plus a hook that remembers the visitor's choice.
 */

import { useEffect, useState } from "react";

export function ViewSwitch<V extends string>({
  label,
  views,
  value,
  onChange,
}: {
  label: string;
  views: readonly (readonly [V, string])[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-wrap rounded-full border border-ink/20 bg-paper/80 p-1 backdrop-blur-[2px]"
    >
      {views.map(([v, text]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`type-label rounded-full px-3.5 py-2 !text-[0.66rem] transition-colors duration-300 md:px-4 ${
            value === v ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/* The chosen view, remembered per browser. Changing it keeps the reader at
 * the top of `sectionId`, since views can differ a lot in height. */
export function useStoredView<V extends string>(
  storageKey: string,
  views: readonly V[],
  fallback: V,
  sectionId: string,
) {
  const [view, setView] = useState<V>(fallback);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && (views as readonly string[]).includes(saved)) setView(saved as V);
    } catch {
      // Storage can be unavailable (private mode); the default view is fine.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const change = (v: V) => {
    if (v === view) return;
    setView(v);
    try {
      window.localStorage.setItem(storageKey, v);
    } catch {
      // Not remembered this time; nothing else depends on it.
    }
    requestAnimationFrame(() =>
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
  };

  return [view, change] as const;
}
