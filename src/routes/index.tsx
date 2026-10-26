import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/site/cursor";
import { Hero } from "@/components/site/hero";
import { ContourBackdrop } from "@/components/site/terrain";
import { Work } from "@/components/site/work";
import { WorkBook } from "@/components/site/work-book";

// Experiment: flip to false to restore the original slab layout.
const USE_BOOK_SHOWCASE = true;
import { About } from "@/components/site/about";
import { NavSlot, OptionsPicker, StackSlot, type NavKey, type StackKey } from "@/components/site/options";

// Navbar and Stack on the live site. Nav: current, map, scale, rail, survey.
// Stack: current, keys, profile, layers, ledger.
const NAV: NavKey = "current";
const STACK: StackKey = "current";
import { Experience, Testimonials } from "@/components/site/experience";
import { Lab } from "@/components/site/lab";
import { Contact } from "@/components/site/contact";

const title = "Efe Aizesogie — Frontend Engineer (EFECODE)";
const description =
  "Frontend engineer with four years building fintech evaluation platforms, healthcare portals and payroll systems in React, Next.js and TypeScript.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Cursor />
      <ContourBackdrop />
      <NavSlot chosen={NAV} />
      <OptionsPicker nav={NAV} stack={STACK} />
      <main>
        <Hero />
        {USE_BOOK_SHOWCASE ? <WorkBook /> : <Work />}
        <About />
        <StackSlot chosen={STACK} />
        <Experience />
        <Testimonials />
        <Lab />
        <Contact />
      </main>
    </>
  );
}
