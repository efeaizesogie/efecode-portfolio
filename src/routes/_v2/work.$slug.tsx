import { createFileRoute, notFound } from "@tanstack/react-router";
import { V2Frame } from "@/components/v2/shell";
import { CaseStudy } from "@/components/v2/case-study";
import { caseBySlug } from "@/lib/cases";

export const Route = createFileRoute("/_v2/work/$slug")({
  loader: ({ params }) => {
    const c = caseBySlug(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title}, a case study by Efe Aizesogie` : "Case study";
    const description = loaderData?.blurb ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CasePage,
});

function CasePage() {
  const c = Route.useLoaderData();
  return (
    <V2Frame current="work">
      <CaseStudy c={c} />
    </V2Frame>
  );
}
