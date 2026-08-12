import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/site/cursor";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Work } from "@/components/site/work";
import { About, Stack } from "@/components/site/about";
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
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Stack />
        <Experience />
        <Testimonials />
        <Lab />
        <Contact />
      </main>
    </>
  );
}
