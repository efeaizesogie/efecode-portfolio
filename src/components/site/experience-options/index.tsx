"use client";

/*
 * Experience layouts, side by side. The page renders whichever layout
 * `chosen` names. On the dev server a collapsible picker (and `?exp=`)
 * flips between them live; production only renders `chosen`.
 */

import { useEffect, useState, type ComponentType } from "react";
import { Experience } from "../experience";
import { ExperienceTimeline } from "./timeline";
import { ExperienceStrata } from "./strata";
import { ExperienceFieldLog } from "./fieldlog";
import { ExperienceCards } from "./cards";

export const EXPERIENCES = {
  current: { label: "Current", Component: Experience },
  timeline: { label: "E1 · Timeline", Component: ExperienceTimeline },
  strata: { label: "E2 · Strata", Component: ExperienceStrata },
  log: { label: "E3 · Field log", Component: ExperienceFieldLog },
  cards: { label: "E4 · Index cards", Component: ExperienceCards },
} satisfies Record<string, { label: string; Component: ComponentType }>;

export type ExperienceKey = keyof typeof EXPERIENCES;

const EVENT = "experience-layout-change";

function useExperienceKey(chosen: ExperienceKey) {
  const [key, setKey] = useState<ExperienceKey>(chosen);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const read = () => {
      const v = new URLSearchParams(window.location.search).get("exp");
      setKey(v && v in EXPERIENCES ? (v as ExperienceKey) : chosen);
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, [chosen]);
  return key;
}

export function ExperienceSlot({ chosen }: { chosen: ExperienceKey }) {
  const key = useExperienceKey(chosen);
  const { Component } = EXPERIENCES[key];
  return <Component key={key} />;
}

export function ExperiencePicker({ chosen }: { chosen: ExperienceKey }) {
  const key = useExperienceKey(chosen);
  const [open, setOpen] = useState(true);
  if (!import.meta.env.DEV) return null;

  const pick = (k: ExperienceKey) => {
    const url = new URL(window.location.href);
    url.searchParams.set("exp", k);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(EVENT));
    requestAnimationFrame(() =>
      document
        .getElementById("experience")
        ?.scrollIntoView({ behavior: "instant", block: "start" }),
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
        {open ? "Hide experience options" : "Experience options"}
      </button>
      {open && (
        <div className="mt-2 flex flex-wrap gap-1 px-1 pb-1 md:max-w-[34rem]">
          {(Object.keys(EXPERIENCES) as ExperienceKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pick(k)}
              aria-pressed={k === key}
              className={`type-label whitespace-nowrap rounded-full px-2.5 py-1.5 !text-[0.6rem] transition-colors ${
                k === key ? "bg-signal text-signal-ink" : "text-paper/70 hover:text-paper"
              }`}
            >
              {EXPERIENCES[k].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
