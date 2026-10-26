"use client";

/*
 * Testimonials and footer layouts under comparison. QUOTES_CHOSEN and
 * FOOTER_CHOSEN are what the live site renders; on the dev server the picker
 * (and ?quotes= / ?footer=) flips between the rest.
 */

import { DevPicker, DevSlot } from "./dev-options";
import { Testimonials } from "./testimonials";
import { Contact } from "./contact";
import { QuotesSpotlight } from "./quotes/spotlight";
import { QuotesNotes } from "./quotes/notes";
import { QuotesColumns } from "./quotes/columns";
import { FooterSheet } from "./footer/sheet";
import { FooterNight } from "./footer/night";
import { FooterPostcard } from "./footer/postcard";

const FooterPostcardDark = () => <FooterPostcard dark />;

const QUOTES = {
  current: { label: "Current", Component: Testimonials },
  spotlight: { label: "T1 · Spotlight", Component: QuotesSpotlight },
  notes: { label: "T2 · Desk notes", Component: QuotesNotes },
  columns: { label: "T3 · Columns", Component: QuotesColumns },
};

const FOOTERS = {
  current: { label: "Current", Component: Contact },
  sheet: { label: "F1 · Contact sheet", Component: FooterSheet },
  night: { label: "F2 · Night survey", Component: FooterNight },
  postcard: { label: "F3 · Postcard", Component: FooterPostcard },
  "postcard-dark": { label: "F3b · Postcard on dark", Component: FooterPostcardDark },
};

const QUOTES_CHOSEN: keyof typeof QUOTES = "current";
const FOOTER_CHOSEN: keyof typeof FOOTERS = "current";

export function QuotesSlot() {
  return <DevSlot param="quotes" options={QUOTES} chosen={QUOTES_CHOSEN} />;
}

export function FooterSlot() {
  return <DevSlot param="footer" options={FOOTERS} chosen={FOOTER_CHOSEN} />;
}

export function SectionOptionsPicker() {
  return (
    <DevPicker
      rows={[
        {
          title: "Testimonials",
          param: "quotes",
          options: QUOTES,
          chosen: QUOTES_CHOSEN,
          scrollTo: "#quotes-anchor",
        },
        {
          title: "Footer",
          param: "footer",
          options: FOOTERS,
          chosen: FOOTER_CHOSEN,
          scrollTo: "#contact",
        },
      ]}
    />
  );
}
