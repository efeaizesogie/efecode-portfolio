import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/site/cursor";
import { Hero } from "@/components/site/hero";
import { ContourBackdrop } from "@/components/site/terrain";
import { Work } from "@/components/site/work";

import { About } from "@/components/site/about";
import { Nav } from "@/components/site/nav";
import { Stack } from "@/components/site/stack";
import { Experience, Testimonials } from "@/components/site/experience";
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
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Stack />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
