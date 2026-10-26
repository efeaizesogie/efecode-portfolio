"use client";

/*
 * Selected Work. Field sheets by default; visitors can switch the same six
 * projects to the transect walk. The choice is remembered per browser.
 */

import { ViewSwitch, useStoredView } from "../view-switch";
import { WorkSheets } from "./sheets";
import { WorkTransect } from "./transect";

const VIEWS = [
  ["sheets", "Sheets"],
  ["transect", "Transect"],
] as const;

export function Work() {
  const [view, setView] = useStoredView(
    "efecode:work-view",
    VIEWS.map(([v]) => v),
    "sheets",
    "work",
  );

  const toggle = <ViewSwitch label="Work view" views={VIEWS} value={view} onChange={setView} />;
  return view === "sheets" ? <WorkSheets toggle={toggle} /> : <WorkTransect toggle={toggle} />;
}
