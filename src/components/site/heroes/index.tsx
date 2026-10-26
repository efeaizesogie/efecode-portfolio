"use client";

/*
 * Hero options, side by side. The page renders whichever hero `chosen` names.
 * On the dev server a small picker (and `?hero=<key>`) lets you flip between
 * them live; production builds only ever render `chosen`.
 */

import { useEffect, useState, type ComponentType } from "react";
import { Hero } from "../hero";
import { HeroTerrain } from "./hero-terrain";
import { HeroType } from "./hero-type";
import { HeroDesk } from "./hero-desk";
import { HeroMonolith } from "./hero-monolith";

export const HEROES = {
  current: { label: "Current", Component: Hero },
  terrain: { label: "A · Terrain", Component: HeroTerrain },
  type: { label: "B · Type", Component: HeroType },
  desk: { label: "C · Desk", Component: HeroDesk },
  monolith: { label: "D · Monolith", Component: HeroMonolith },
} satisfies Record<string, { label: string; Component: ComponentType }>;

export type HeroKey = keyof typeof HEROES;

const isKey = (v: string | null): v is HeroKey => !!v && v in HEROES;

export function HeroSlot({ chosen }: { chosen: HeroKey }) {
  const [key, setKey] = useState<HeroKey>(chosen);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const fromUrl = new URLSearchParams(window.location.search).get("hero");
    if (isKey(fromUrl)) setKey(fromUrl);
  }, []);

  const pick = (k: HeroKey) => {
    setKey(k);
    const url = new URL(window.location.href);
    url.searchParams.set("hero", k);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const { Component } = HEROES[key];

  return (
    <>
      <Component key={key} />
      {import.meta.env.DEV && (
        <div
          role="group"
          aria-label="Preview hero option"
          className="fixed bottom-4 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 gap-1 overflow-x-auto rounded-full bg-ink/90 p-1 shadow-lg backdrop-blur"
        >
          {(Object.keys(HEROES) as HeroKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pick(k)}
              aria-pressed={k === key}
              className={`type-label whitespace-nowrap rounded-full px-3 py-2 !text-[0.62rem] transition-colors ${
                k === key ? "bg-signal text-signal-ink" : "text-paper/70 hover:text-paper"
              }`}
            >
              {HEROES[k].label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
