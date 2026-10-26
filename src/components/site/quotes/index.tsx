"use client";

/*
 * Testimonials. Three ways to read the same five quotes: a spotlight (the
 * default), desk notes and columns. Visitors switch between them and the
 * choice is remembered per browser.
 */

import { ViewSwitch, useStoredView } from "../view-switch";
import { QuotesSpotlight } from "./spotlight";
import { QuotesNotes } from "./notes";
import { QuotesColumns } from "./columns";

const VIEWS = [
  ["spotlight", "Spotlight"],
  ["notes", "Notes"],
  ["columns", "Columns"],
] as const;

const COMPONENTS = {
  spotlight: QuotesSpotlight,
  notes: QuotesNotes,
  columns: QuotesColumns,
};

export function Testimonials() {
  const [view, setView] = useStoredView(
    "efecode:testimonials-view",
    VIEWS.map(([v]) => v),
    "spotlight",
    "testimonials",
  );
  const View = COMPONENTS[view];
  return (
    <View
      toggle={
        <ViewSwitch label="Testimonials view" views={VIEWS} value={view} onChange={setView} />
      }
    />
  );
}
