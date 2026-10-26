"use client";

/*
 * Dev-only layout picker. Each row maps a URL param to a set of options;
 * slots read the param and swap their component live. Production builds
 * ignore the params and never render the picker.
 */

import { useEffect, useState, type ComponentType } from "react";

type Options = Record<string, { label: string; Component: ComponentType }>;

const EVENT = "dev-options-change";

export function useDevOption<K extends string>(param: string, options: Options, chosen: K) {
  const [key, setKey] = useState<K>(chosen);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const read = () => {
      const v = new URLSearchParams(window.location.search).get(param);
      setKey(v && v in options ? (v as K) : chosen);
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, [param, options, chosen]);
  return key;
}

export function DevSlot<K extends string>({
  param,
  options,
  chosen,
}: {
  param: string;
  options: Options;
  chosen: K;
}) {
  const key = useDevOption(param, options, chosen);
  const { Component } = options[key]!;
  return <Component key={key} />;
}

type Row = { title: string; param: string; options: Options; chosen: string; scrollTo: string };

function PickerRow({ row }: { row: Row }) {
  const key = useDevOption(row.param, row.options, row.chosen);
  const pick = (k: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(row.param, k);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(EVENT));
    requestAnimationFrame(() =>
      document.querySelector(row.scrollTo)?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
  };
  return (
    <div>
      <p className="type-label mb-1.5 !text-[0.6rem] text-paper/50">{row.title}</p>
      <div className="flex flex-wrap gap-1">
        {Object.entries(row.options).map(([k, o]) => (
          <button
            key={k}
            type="button"
            onClick={() => pick(k)}
            aria-pressed={k === key}
            className={`type-label whitespace-nowrap rounded-full px-2.5 py-1.5 !text-[0.6rem] transition-colors ${
              k === key ? "bg-signal text-signal-ink" : "text-paper/70 hover:text-paper"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DevPicker({ rows }: { rows: Row[] }) {
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
        <div className="mt-2 flex flex-col gap-3 px-1.5 pb-1.5 md:w-[30rem]">
          {rows.map((r) => (
            <PickerRow key={r.param} row={r} />
          ))}
        </div>
      )}
    </div>
  );
}
