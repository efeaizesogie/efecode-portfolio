import { createFileRoute } from "@tanstack/react-router";
import { V2Frame } from "@/components/v2/shell";
import { Home } from "@/components/v2/home";

const title = "Efe Aizesogie, frontend engineer";
const description =
  "Frontend engineer Efe Aizesogie turns designs into fast, accessible React and Next.js products and sees them through to launch. Six case studies.";

export const Route = createFileRoute("/_v2/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => (
    <V2Frame>
      <Home />
    </V2Frame>
  ),
});
