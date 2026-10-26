/* The six projects in Selected Work. `live` or `repo` is left out when
 * there's no public site or the repo is private. The longer write-up fields
 * are kept where they exist but no longer shown. */
export type Project = {
  slug: string;
  index: string;
  title: string;
  year: string;
  stack: string[];
  image: string;
  live?: string | undefined;
  repo?: string | undefined;
  role?: string | undefined;
  discipline?: string | undefined;
  problem?: string | undefined;
  solution?: string | undefined;
  outcome?: string | undefined;
};

export const featuredProjects: Project[] = [
  {
    slug: "verto",
    index: "01",
    title: "Verto",
    year: "2026",
    stack: ["React", "Three.js", "GSAP", "TS"],
    image: "/work/verto/1.jpg",
    live: "https://verto-orcin-phi.vercel.app/",
  },
  {
    slug: "furlio",
    index: "02",
    title: "Furlio",
    year: "2026",
    stack: ["HTML", "CSS", "JS"],
    image: "/work/furlio/1.jpg",
    live: "https://jocular-alpaca-f1859d.netlify.app/",
  },
  {
    slug: "scamtrail",
    index: "03",
    title: "ScamTrail",
    year: "2026",
    stack: ["Next.js", "React", "Tailwind", "GSAP", "TS"],
    image: "/work/scamtrail/1.jpg",
    live: "https://scamtrail.vercel.app/",
    repo: "https://github.com/efeaizesogie/scamtrail",
  },
  {
    slug: "applyready",
    index: "04",
    title: "ApplyReady",
    year: "2026",
    stack: ["Next.js", "React", "Tailwind", "TS", "Supabase"],
    image: "/work/applyready/1.jpg",
    live: "https://applyready-gamma.vercel.app/",
    repo: "https://github.com/efeaizesogie/applyready",
  },
  {
    slug: "honatrix",
    index: "05",
    title: "Honatrix",
    year: "2025",
    role: "Frontend Developer",
    discipline: "Civil Engineering / Real Estate",
    stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "Responsive Design"],
    problem:
      "Engineering and construction firms often rely on rigid, legacy web templates that fail to showcase the true physical scale of their builds or provide clear inquiry channels for prospective clients and investors.",
    solution:
      "A responsive corporate web presence featuring dynamic project showcases, dedicated commercial development pages, modular team profiles, and structured quote-request workflows tailored for high-trust engagements.",
    outcome:
      "A polished, mobile-optimized digital platform representing Honatrix Nig. Ltd.'s landmark infrastructure and commercial developments with seamless navigation and client lead capture.",
    image: "/work/honatrix.png",
    live: "https://honatrix.com/",
    repo: "https://github.com/efeaizesogie/Honatrix",
  },
  {
    slug: "clinq",
    index: "06",
    title: "Clinq",
    year: "2025",
    role: "Frontend Developer",
    discipline: "Healthcare / Platform",
    stack: ["React", "Next.js", "TypeScript", "TailwindCSS", "Supabase", "GSAP"],
    problem:
      "Clinic software is built for administrators. Patients get the leftovers: static forms, stale records, phone calls.",
    solution:
      "A patient-centric portal with real-time specialist booking and record synchronisation, fronted by a landing experience choreographed in GSAP so the marketing site feels like the product.",
    outcome: "Booking, records and clinic management unified into a single modern patient surface.",
    image: "/work/clinq.png",
    live: "https://clinq-brown.vercel.app/",
    repo: "https://github.com/efeaizesogie/clinq-p",
  },
];

/* Projects beyond the featured six: everything on /projects after them.
 * `live` or `repo` is left out when there's no public site or the repo is
 * private; `video` is a short walkthrough shown when the row is opened. */
export type Experiment = {
  title: string;
  kind: string;
  year?: string;
  stack: string;
  note: string;
  image: string;
  shots?: string[];
  video?: string;
  poster?: string;
  live?: string;
  repo?: string;
};

export const experiments: Experiment[] = [
  {
    title: "Nebula",
    kind: "Landing",
    year: "2026",
    stack: "HTML · CSS · JS",
    note: "Waitlist site for a non-custodial DeFi staking platform with auto-compounding vaults and scored validators.",
    image: "/work/nebula/1.jpg",
    shots: ["/work/nebula/1.jpg", "/work/nebula/2.jpg", "/work/nebula/3.jpg", "/work/nebula/4.jpg"],
    live: "https://nebula-cyan-alpha.vercel.app/",
    repo: "https://github.com/efeaizesogie/nebula",
  },
  {
    title: "Plearn",
    kind: "Landing",
    year: "2026",
    stack: "React · Tailwind · Framer Motion · TS",
    note: "Site for a playful after-school coding school where kids build real games with friendly mentors.",
    image: "/work/plearn/1.jpg",
    shots: ["/work/plearn/1.jpg", "/work/plearn/2.jpg", "/work/plearn/3.jpg", "/work/plearn/4.jpg"],
    live: "https://plearn-gold.vercel.app/",
    repo: "https://github.com/efeaizesogie/plearn",
  },
  {
    title: "IdeaBank",
    kind: "Tool",
    year: "2026",
    stack: "Next.js · React · Tailwind · TS",
    note: "Type a website idea and get every design decision made: one master prompt, media prompts and a brand kit.",
    image: "/work/ideabank/1.jpg",
    shots: ["/work/ideabank/1.jpg"],
    live: "https://ideabank.vercel.app/",
  },
  {
    title: "Where Was Crime Reported?",
    kind: "Data story",
    year: "2026",
    stack: "React · D3 · JS",
    note: "A visual investigation into reported crime across Nigeria in 2016, how population changes the picture, and why there is no single map of crime.",
    image: "/work/crimestory/1.jpg",
    shots: [
      "/work/crimestory/1.jpg",
      "/work/crimestory/2.jpg",
      "/work/crimestory/3.jpg",
      "/work/crimestory/4.jpg",
    ],
    live: "https://crimestory-wheat.vercel.app/",
    repo: "https://github.com/efeaizesogie/crimestory",
  },
  {
    title: "Zonocore",
    kind: "Client site",
    year: "2026",
    stack: "React · Tailwind · TS · TanStack Start",
    note: "Website for a Benin City civil and environmental engineering consultancy: geotechnics, EIA, land surveying and design.",
    image: "/work/zonocore/1.jpg",
    shots: [
      "/work/zonocore/1.jpg",
      "/work/zonocore/2.jpg",
      "/work/zonocore/3.jpg",
      "/work/zonocore/4.jpg",
    ],
    live: "https://zonocore.vercel.app/",
    repo: "https://github.com/efeaizesogie/Zonocore",
  },
  {
    title: "RSVP",
    kind: "Catalogue",
    year: "2026",
    stack: "Next.js · React · Tailwind · Framer Motion · TS",
    note: "A browsable catalogue of digital wedding invitation and RSVP templates.",
    image: "/work/rsvp/1.jpg",
    shots: ["/work/rsvp/1.jpg", "/work/rsvp/2.jpg", "/work/rsvp/3.jpg", "/work/rsvp/4.jpg"],
    live: "https://rsvp-chi-ecru.vercel.app/",
    repo: "https://github.com/efeaizesogie/rsvp",
  },
  {
    title: "FreeAI",
    kind: "Tool",
    year: "2026",
    stack: "React · TS",
    note: "One chat UI for every free LLM provider: bring your own keys and route across 60+ free-tier models.",
    image: "/work/freeai/1.jpg",
    shots: ["/work/freeai/1.jpg", "/work/freeai/2.jpg", "/work/freeai/3.jpg", "/work/freeai/4.jpg"],
    live: "https://freeai-ivory.vercel.app/",
    repo: "https://github.com/efeaizesogie/Freeai",
  },
  {
    title: "PayFlow Analyzer",
    kind: "Dashboard",
    year: "2026",
    stack: "React · TS · Recharts",
    note: "Transaction analytics dashboard with spend categorisation, anomaly detection and burn-rate forecasting.",
    image: "/work/payflow-analyzer/1.jpg",
    shots: [
      "/work/payflow-analyzer/1.jpg",
      "/work/payflow-analyzer/2.jpg",
      "/work/payflow-analyzer/3.jpg",
      "/work/payflow-analyzer/4.jpg",
    ],
    live: "https://payflow-analyzer.vercel.app/",
    repo: "https://github.com/efeaizesogie/payflow-analyzer",
  },
  {
    title: "Traders Launch Reimagined",
    kind: "Platform",
    year: "2025",
    stack: "React · TypeScript · TailwindCSS · Vite · TanStack Router",
    note: "A prop-trading evaluation platform where pricing, payouts and risk rules read at a glance.",
    image: "/work/traders-launch/1.jpg",
    shots: [
      "/work/traders-launch/1.jpg",
      "/work/traders-launch/2.jpg",
      "/work/traders-launch/3.jpg",
      "/work/traders-launch/4.jpg",
    ],
    live: "https://traders-launch-reimagined.vercel.app/",
    repo: "https://github.com/efeaizesogie/Traders-Launch-Reimagined",
  },
  {
    title: "FundedFun",
    kind: "Platform",
    year: "2025",
    stack: "React · TypeScript · TailwindCSS · Vite · TanStack Router",
    note: "An onboarding-first trading challenge with plain-language rules and live charts.",
    image: "/work/fundedfun/1.jpg",
    shots: [
      "/work/fundedfun/1.jpg",
      "/work/fundedfun/2.jpg",
      "/work/fundedfun/3.jpg",
      "/work/fundedfun/4.jpg",
    ],
    live: "https://funded-fun-elevated.vercel.app/",
    repo: "https://github.com/efeaizesogie/FundedFun-Elevated",
  },
  {
    title: "Simple Payroll",
    kind: "Product",
    year: "2024",
    stack: "React · TailwindCSS · JavaScript",
    note: "Payroll for small teams: salary runs, deductions and employee records in a few clear screens.",
    image: "/work/simple-payroll/1.jpg",
    shots: [
      "/work/simple-payroll/1.jpg",
      "/work/simple-payroll/2.jpg",
      "/work/simple-payroll/3.jpg",
      "/work/simple-payroll/4.jpg",
    ],
    live: "https://simple-payroll.vercel.app/",
    repo: "https://github.com/efeaizesogie/simple-payroll",
  },
  {
    title: "Veescents",
    kind: "Commerce",
    year: "2024",
    stack: "React · TailwindCSS · JavaScript",
    note: "A fragrance storefront that leads with curation and keeps the path to checkout short.",
    image: "/work/veescents/1.jpg",
    shots: [
      "/work/veescents/1.jpg",
      "/work/veescents/2.jpg",
      "/work/veescents/3.jpg",
      "/work/veescents/4.jpg",
    ],
    live: "https://veescents-next.vercel.app/",
    repo: "https://github.com/efeaizesogie/veescents-next",
  },
  {
    title: "Aether",
    kind: "Concept",
    stack: "React · Tailwind · TS",
    note: "Futuristic smart-furniture concept site built around immersive storytelling and interactive product moments.",
    image: "/work/aether.png",
    live: "https://aether-omega-blush.vercel.app/",
    repo: "https://github.com/efeaizesogie/Aether",
  },
  {
    title: "Muni",
    kind: "Product",
    stack: "React · Tailwind · TS",
    note: "AI-powered municipal services platform: automated resident support, service requests, citizen engagement.",
    image: "/work/muni.png",
    live: "https://poetic-licorice-8da1a7.netlify.app/",
    repo: "https://github.com/efeaizesogie/muni_out-main",
  },
  {
    title: "GIS Data Scout",
    kind: "Tool",
    stack: "Angular · Tailwind · TS",
    note: "Geospatial data discovery assistant — finds datasets, papers and spatial information from natural language.",
    image: "/work/gis-data-scout.png",
    live: "https://gis-data-scout.vercel.app/",
    repo: "https://github.com/efeaizesogie/gis-data-scout",
  },
  {
    title: "Elena Vossen",
    kind: "Portfolio",
    stack: "React · Tailwind · TS",
    note: "Cinematic photography portfolio: editorial, fashion, portrait and landscape work in a minimal narrative frame.",
    image: "/work/elena.png",
    live: "https://photography-portfolio-azure-nine.vercel.app/",
    repo: "https://github.com/efeaizesogie/photography-portfolio",
  },
  {
    title: "Chillspot",
    kind: "Landing",
    stack: "React · Tailwind · JS",
    note: "Landing page for a cocktail and mocktail bar.",
    image: "/work/chillspot.png",
    live: "https://efeosa-cocktails.vercel.app/",
    repo: "https://github.com/efeaizesogie/efeosa_cocktails",
  },
  {
    title: "Review Nest",
    kind: "Platform",
    stack: "Angular · Tailwind · JS",
    note: "Customer insight and review platform for small businesses, contributed as Angular frontend developer.",
    image: "/work/review-nest.png",
    live: "https://review-nest-7w4m-git-master-efeaizesogie.vercel.app/",
    repo: "https://github.com/efeaizesogie/Review-Nest",
  },
  {
    title: "TaskFlow",
    kind: "Landing",
    stack: "React · Tailwind",
    note: "Landing page for a task management app for teams tracking progress and staying productive.",
    image: "/work/taskflow.png",
    live: "https://taskflow-flax-six.vercel.app/",
    repo: "https://github.com/efeaizesogie/taskflow",
  },
  {
    title: "ShippersWise",
    kind: "Marketplace",
    stack: "React · Bootstrap · JS",
    note: "A one-stop international freight comparison e-market.",
    image: "/work/shipperswise.png",
    live: "https://shipperswise.com/",
    repo: "https://github.com/efeaizesogie/web",
  },
];

export const skillGroups = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "Angular", "Redux", "GraphQL"],
  },
  {
    label: "Craft & Motion",
    items: ["TailwindCSS", "GSAP", "Framer Motion", "Three.js", "Shadcn", "Figma"],
  },
  {
    label: "Ship",
    items: ["Vercel", "Git", "GitHub"],
  },
  {
    label: "Geospatial",
    items: ["ArcGIS", "QGIS", "Remote Sensing", "AutoCAD", "Civil 3D", "Global Mapper"],
  },
];

export const marqueeSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "TailwindCSS",
  "GSAP",
  "Framer Motion",
  "Three.js",
  "GraphQL",
  "Redux",
  "Vercel",
  "Figma",
];

export const experience = [
  {
    company: "FoxyLabs",
    period: "Aug 2024 — Present",
    role: "Frontend Developer",
    place: "Remote, Nigeria",
    body: "I transform UI/UX designs into seamless, interactive React components, focused on responsive, device-optimized experiences that stay consistent across platforms. Working with cross-functional teams, I build reusable components, uphold coding best practices, and ensure stability through thorough testing and debugging.",
    stack: ["Next.js", "React", "TailwindCSS", "Git", "GitHub", "Framer Motion", "GSAP"],
  },
  {
    company: "DGIS",
    period: "May 2024 — Aug 2025",
    role: "Geomatics and GIS Specialist",
    place: "Edo, Nigeria",
    body: "Applied ArcGIS for high-precision map creation and spatial analysis supporting data-driven decisions in engineering and environmental projects. Digitised and managed geospatial datasets, collected field data with GPS and total stations, and produced engineering plans and profiles in Civil 3D.",
    stack: [
      "ArcGIS",
      "Remote Sensing",
      "QGIS",
      "Google Earth Pro",
      "Global Mapper",
      "AutoCAD",
      "Civil 3D",
    ],
  },
  {
    company: "Balancee",
    period: "Sept 2024 — Dec 2024",
    role: "Frontend Developer Intern",
    place: "Remote, Nigeria",
    body: "Collaborated with software development teams to maintain and enhance the Balancee website using React.js, GraphQL and Tailwind CSS — building responsive interfaces, optimising performance and ensuring seamless integration with backend services.",
    stack: ["React", "GraphQL", "TailwindCSS", "Redux", "Git", "GitLab", "GSAP"],
  },
  {
    company: "Ascetic Capital LLC",
    period: "Aug 2024 — Oct 2024",
    role: "Senior Software Developer",
    place: "Remote, United States",
    body: "Built the official website for a modern investment firm: translated UI/UX designs into responsive React components and shipped clean, scalable code optimised for speed, SEO and accessibility, aligned to the firm's brand identity.",
    stack: ["Next.js", "MongoDB", "TypeScript", "Express", "Auth0", "TailwindCSS", "Git"],
  },
  {
    company: "Mercator Technologies Ltd",
    period: "Nov 2023 — June 2024",
    role: "Frontend Developer Intern",
    place: "Remote, Nigeria",
    body: "Led development of intricate frontend components for fintech applications, integrating complex backend functionality, running code reviews and performance optimisations, and contributing to planning that aligned engineering with business objectives.",
    stack: ["Angular", "Material UI", "TailwindCSS", "Git", "GitHub"],
  },
  {
    company: "Phreetech",
    period: "July 2023 — Sept 2023",
    role: "Frontend Developer Intern",
    place: "Remote, Nigeria",
    body: "Refined version control practice, delivered two robust Angular projects with peers, and worked with a team of interns to elevate branding and user experience while coordinating work in Jira.",
    stack: ["Angular", "JavaScript", "Tailwind", "Bootstrap", "Git", "GitHub"],
  },
];

export const testimonials = [
  {
    quote:
      "Working with Efeosa was a smart decision. He clearly understood our project goals and delivered a seamless website that met all our expectations. He's very reliable and knows his craft well.",
    name: "Edoki Chukwuyem",
    handle: "@chuksdev",
  },
  {
    quote:
      "As a teammate, Efeosa is reliable, sharp, and always ready to dive into challenges. He consistently delivers quality work, communicates clearly, and elevates any project he's on. A real asset to the team!",
    name: "Kelechi Eronini",
    handle: "@k_eronini",
  },
  {
    quote:
      "Working with Efeosa as a fellow intern was inspiring. He was always quick to solve problems, share knowledge, and push for clean, efficient code. His focus and energy made every team task smoother.",
    name: "Gifted Phreetech",
    handle: "@gifted",
  },
  {
    quote:
      "It was a great experience working with Efeosa. He delivered a clean, user-friendly website that our customers find easy to navigate. He brings both technical skills and creative ideas to the table.",
    name: "Mr Henry",
    handle: "@honatrix",
  },
  {
    quote:
      "Efeosa is a very skilled web developer. He handled our site professionally, and since the launch, we've seen a clear improvement in performance and user experience.",
    name: "Godstime Nwabue",
    handle: "@nwabuegodstime",
  },
];

/* Where the clocks on the site read from: shown as "<time> <city>". */
export const place = { city: "London", timeZone: "Europe/London" };

export const links = {
  email: "efeaizesogie@gmail.com",
  linkedin: "https://www.linkedin.com/in/efe-aizesogie/",
  x: "https://x.com/efecode",
  github: "https://github.com/efeaizesogie",
  instagram: "https://www.instagram.com/efeaizesogie",
  resume: "/efeosa_aizesogie_developer_cv_5.pdf",
};

export const sections = [
  { id: "index", label: "Index" },
  { id: "work", label: "Selected Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
