"use client";

/*
 * Navbar and Stack options, side by side. The page renders whichever option
 * `chosen` names. On the dev server a collapsible picker (and `?nav=` /
 * `?stack=`) flips between them live; production only renders `chosen`.
 */

import { useEffect, useState, type ComponentType } from "react";
import { Nav } from "../nav";
import { Stack } from "../about";
import { NavMap } from "./nav-map";
import { NavScale } from "./nav-scale";
import { NavRail } from "./nav-rail";
import { NavSurvey } from "./nav-survey";
import { StackKeys } from "./stack-keys";
import { StackProfile } from "./stack-profile";
import { StackLayers } from "./stack-layers";
import { StackLedger } from "./stack-ledger";

export const NAVS = {
  current: { label: "Current", Component: Nav },
  map: { label: "N1 · Map menu", Component: NavMap },
  scale: { label: "N2 · Scale bar", Component: NavScale },
  rail: { label: "N3 · Index rail", Component: NavRail },
  survey: { label: "N4 · Survey line", Component: NavSurvey },
} satisfies Record<string, { label: string; Component: ComponentType }>;

export const STACKS = {
  current: { label: "Current", Component: Stack },
  keys: { label: "S1 · Keycaps", Component: StackKeys },
  profile: { label: "S2 · Elevation", Component: StackProfile },
  layers: { label: "S3 · Layers", Component: StackLayers },
  ledger: { label: "S4 · Ledger", Component: StackLedger },
} satisfies Record<string, { label: string; Component: ComponentType }>;

export type NavKey = keyof typeof NAVS;
export type StackKey = keyof typeof STACKS;

const EVENT = "site-options-change";

function useOption<T extends string>(param: string, chosen: T, valid: Record<string, unknown>) {
  const [value, setValue] = useState<T>(chosen);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const read = () => {
      const v = new URLSearchParams(window.location.search).get(param);
      setValue(v && v in valid ? (v as T) : chosen);
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, [param, chosen, valid]);
  return value;
}

const setOption = (param: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(EVENT));
};

export function NavSlot({ chosen }: { chosen: NavKey }) {
  const key = useOption<NavKey>("nav", chosen, NAVS);
  const { Component } = NAVS[key];
  return <Component key={key} />;
}

export function StackSlot({ chosen }: { chosen: StackKey }) {
  const key = useOption<StackKey>("stack", chosen, STACKS);
  const { Component } = STACKS[key];
  return <Component key={key} />;
}

function Row<K extends string>({
  title,
  options,
  value,
  onPick,
}: {
  title: string;
  options: Record<K, { label: string }>;
  value: K;
  onPick: (k: K) => void;
}) {
  return (
    <div>
      <p className="type-label mb-1.5 !text-[0.6rem] text-paper/50">{title}</p>
      <div className="flex flex-wrap gap-1">
        {(Object.keys(options) as K[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onPick(k)}
            aria-pressed={k === value}
            className={`type-label whitespace-nowrap rounded-full px-2.5 py-1.5 !text-[0.6rem] transition-colors ${
              k === value ? "bg-signal text-signal-ink" : "text-paper/70 hover:text-paper"
            }`}
          >
            {options[k].label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OptionsPicker({ nav, stack }: { nav: NavKey; stack: StackKey }) {
  const navValue = useOption<NavKey>("nav", nav, NAVS);
  const stackValue = useOption<StackKey>("stack", stack, STACKS);
  const [open, setOpen] = useState(true);
  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] max-w-[calc(100vw-2rem)] rounded-[10px] bg-ink/92 p-2 text-paper shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="type-label px-1.5 py-1 !text-[0.6rem] text-paper/80"
        aria-expanded={open}
      >
        {open ? "Hide options" : "Options"}
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-3 px-1.5 pb-1.5 md:w-[34rem]">
          <Row
            title="Navbar"
            options={NAVS}
            value={navValue}
            onPick={(k) => {
              setOption("nav", k);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          />
          <Row
            title="Stack"
            options={STACKS}
            value={stackValue}
            onPick={(k) => {
              setOption("stack", k);
              document
                .getElementById("stack")
                ?.scrollIntoView({ behavior: "instant", block: "start" });
            }}
          />
        </div>
      )}
    </div>
  );
}
