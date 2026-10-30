/* The minimal site's case studies: one per project in Selected Work.
 * Titles, years, stacks and links come from `featuredProjects`; the ledes are
 * short forms of each blurb. Only Honatrix and Clinq have full write-ups so
 * far; the others tell what the project does and how it is built. */
import { experience, featuredProjects, type Project } from "./portfolio";

export type Case = Project & {
  field: string;
  lede: string;
  blurb: string;
  /* Pixel size of the screenshots in /work/<slug>/1-4.jpg. */
  size: [number, number];
  /* Pixel size of /work/<slug>/demo.mp4 when there is a walkthrough; the
   * home list then plays /work/<slug>/preview.mp4, a 10 s, 320 px cut of it. */
  video?: [number, number] | undefined;
  brief?: string | undefined;
  built?: string | undefined;
  result?: string | undefined;
  quote?: { text: string; by: string } | undefined;
};

const extra: Record<string, Omit<Case, keyof Project>> = {
  verto: {
    field: "Fashion, 3D",
    lede: "A 3D showroom for a clothing label.",
    blurb: "A scroll-driven 3D showroom for a clothing label: five pieces turned in a plain grey void.",
    size: [1440, 900],
    video: [1280, 800],
  },
  furlio: {
    field: "Furniture, editorial",
    lede: "An editorial site for a furniture studio.",
    blurb:
      "An editorial concept site for an architectural furniture studio that draws every piece before it builds it.",
    size: [1280, 720],
    video: [1280, 720],
  },
  scamtrail: {
    field: "Web3, research",
    lede: "Due diligence for Web3, from the evidence.",
    blurb: "Search a handle, wallet, contract or domain and see what the evidence says and what it leaves open.",
    size: [1440, 900],
    video: [1280, 720],
  },
  applyready: {
    field: "Productivity",
    lede: "Deadlines you can’t miss.",
    blurb:
      "Turns any scholarship, job, admission or grant announcement into a deadline-paced checklist that emails you daily until you submit.",
    size: [1440, 900],
    video: [1280, 720],
  },
  honatrix: {
    field: "Construction",
    lede: "A corporate site for a Nigerian construction firm.",
    blurb: "Built to show the scale of the firm’s builds and turn visitors into quote requests.",
    size: [1440, 900],
    brief:
      "Engineering firms often run on rigid template sites that can’t show the scale of their builds or give clients a clear way to ask for a quote.",
    built:
      "A responsive corporate site with project showcases, commercial development pages, team profiles and a quote request flow.",
    result:
      "A site for Honatrix Nig. Ltd. that works on any phone, presents its infrastructure work and takes client enquiries.",
    quote: {
      text: "It was a great experience working with Efeosa. He delivered a clean, user-friendly website that our customers find easy to navigate.",
      by: "Mr Henry, Honatrix",
    },
  },
  clinq: {
    field: "Healthcare",
    lede: "A patient portal for booking specialists.",
    blurb: "A patient-first healthcare portal for booking specialists and keeping records in sync.",
    size: [1440, 900],
    video: [1280, 688],
    brief:
      "Clinic software is built for administrators. Patients get the leftovers: static forms, stale records, phone calls.",
    built:
      "A patient portal with real-time specialist booking and record sync, fronted by a landing page choreographed in GSAP so the marketing site feels like the product.",
    result: "Booking, records and clinic management in one patient surface.",
  },
};

export const cases: Case[] = featuredProjects.map((p) => ({ ...p, ...extra[p.slug]! }));

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug);

/* Roles as the trail shows them: the period split into its two ends. */
export const roles = experience.map((r) => {
  const [from = "", to = ""] = r.period.split(/\s+[—–-]\s+/);
  return {
    company: r.company.replace(/ (LLC|Ltd)$/, ""),
    role: r.role,
    from,
    to: to === "Present" ? "now" : to,
    place: r.place,
  };
});
