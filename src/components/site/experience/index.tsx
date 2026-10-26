"use client";

/*
 * Experience. Four ways to read the same six roles: a survey timeline (the
 * default), strata, a field log and index cards. Visitors switch between
 * them and the choice is remembered per browser.
 */

import { ViewSwitch, useStoredView } from "../view-switch";
import { ExperienceTimeline } from "./timeline";
import { ExperienceStrata } from "./strata";
import { ExperienceFieldLog } from "./field-log";
import { ExperienceCards } from "./cards";

const VIEWS = [
  ["timeline", "Timeline"],
  ["strata", "Strata"],
  ["log", "Field log"],
  ["cards", "Cards"],
] as const;

const COMPONENTS = {
  timeline: ExperienceTimeline,
  strata: ExperienceStrata,
  log: ExperienceFieldLog,
  cards: ExperienceCards,
};

export function Experience() {
  const [view, setView] = useStoredView(
    "efecode:experience-view",
    VIEWS.map(([v]) => v),
    "timeline",
    "experience",
  );
  const View = COMPONENTS[view];
  return (
    <View
      toggle={<ViewSwitch label="Experience view" views={VIEWS} value={view} onChange={setView} />}
    />
  );
}
