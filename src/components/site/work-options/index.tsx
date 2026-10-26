"use client";

/*
 * Selected Work layouts, side by side. The page renders whichever layout
 * `chosen` names. On the dev server a collapsible picker (and `?work=`)
 * flips between them live; production only renders `chosen`.
 */

import { useEffect, useState, type ComponentType } from "react";
import { WorkBook } from "../work-book";
import { WorkIndex } from "./work-index";
import { WorkSheets } from "./work-sheets";
import { WorkTransect } from "./work-transect";
import { WorkSites } from "./work-sites";

const PaperBook = () => <WorkBook paper />;

export const WORKS = {
  current: { label: "Current", Component: WorkBook },
  index: { label: "W1 · Index", Component: WorkIndex },
  sheets: { label: "W2 · Field sheets", Component: WorkSheets },
  transect: { label: "W3 · Transect", Component: WorkTransect },
  sites: { label: "W4 · Survey sites", Component: WorkSites },
  paper: { label: "W5 · Paper book", Component: PaperBook },
} satisfies Record<string, { label: string; Component: ComponentType }>;

export type WorkKey = keyof typeof WORKS;

const EVENT = "work-layout-change";

function useWorkKey(chosen: WorkKey) {
  const [key, setKey] = useState<WorkKey>(chosen);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const read = () => {
      const v = new URLSearchParams(window.location.search).get("work");
      setKey(v && v in WORKS ? (v as WorkKey) : chosen);
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, [chosen]);
  return key;
}

export function WorkSlot({ chosen }: { chosen: WorkKey }) {
  const key = useWorkKey(chosen);
  const { Component } = WORKS[key];
  return <Component key={key} />;
}

export function WorkPicker({ chosen }: { chosen: WorkKey }) {
  const key = useWorkKey(chosen);
  const [open, setOpen] = useState(true);
  if (!import.meta.env.DEV) return null;

  const pick = (k: WorkKey) => {
    const url = new URL(window.location.href);
    url.searchParams.set("work", k);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(EVENT));
    requestAnimationFrame(() =>
      document.getElementById("work")?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100] max-w-[calc(100vw-2rem)] rounded-[10px] bg-ink/92 p-2 text-paper shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="type-label px-1.5 py-1 !text-[0.6rem] text-paper/80"
        aria-expanded={open}
      >
        {open ? "Hide work options" : "Work options"}
      </button>
      {open && (
        <div className="mt-2 flex flex-wrap gap-1 px-1 pb-1 md:max-w-[36rem]">
          {(Object.keys(WORKS) as WorkKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pick(k)}
              aria-pressed={k === key}
              className={`type-label whitespace-nowrap rounded-full px-2.5 py-1.5 !text-[0.6rem] transition-colors ${
                k === key ? "bg-signal text-signal-ink" : "text-paper/70 hover:text-paper"
              }`}
            >
              {WORKS[k].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
