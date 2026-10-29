import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/site/cursor";
import { ContourBackdrop } from "@/components/site/terrain";
import { Nav } from "@/components/site/nav";
import { ProjectsIndex } from "@/components/site/projects-index";
import { Footer } from "@/components/site/footer";

const title = "All projects — Efe Aizesogie (EFECODE)";
const description =
  "Every project by Efe Aizesogie: client sites, fintech platforms, products and frontend experiments.";

export const Route = createFileRoute("/v1/projects")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <Cursor />
      <ContourBackdrop />
      <Nav />
      <main>
        <ProjectsIndex />
        <Footer />
      </main>
    </>
  );
}
