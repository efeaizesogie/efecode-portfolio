export type Project = {
  slug: string;
  index: string;
  title: string;
  year: string;
  role: string;
  discipline: string;
  stack: string[];
  problem: string;
  solution: string;
  outcome: string;
  image: string;
  live: string;
  repo: string;
};

export const featuredProjects: Project[] = [
  {
    slug: "honatrix",
    index: "01",
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
    slug: "traders-launch",
    index: "02",
    title: "Traders Launch Reimagined",
    year: "2025",
    role: "Frontend Developer",
    discipline: "Fintech / Prop Trading",
    stack: ["React", "TypeScript", "TailwindCSS", "Vite", "TanStack Router"],
    problem:
      "Futures evaluation platforms bury their rules in fine print, so traders can never tell what a challenge actually costs them.",
    solution:
      "A rebuilt evaluation flow where pricing, payout cadence and risk parameters are first-class interface objects, wired through typed routing and a component system tuned for dense financial data.",
    outcome:
      "One-time fee evaluations, daily payouts, no payout caps and up to 80% profit split, all legible at a glance.",
    image: "/work/traderslaunch.png",
    live: "https://traders-launch-reimagined.vercel.app/",
    repo: "https://github.com/efeaizesogie/Traders-Launch-Reimagined",
  },

  {
    slug: "clinq",
    index: "03",
    title: "Clinq",
    year: "2025",
    role: "Frontend Developer",
    discipline: "Healthcare / Platform",
    stack: ["React", "Next.js", "TypeScript", "TailwindCSS", "Supabase", "GSAP"],
    problem:
      "Clinic software is built for administrators. Patients get the leftovers: static forms, stale records, phone calls.",
    solution:
      "A patient-centric portal with real-time specialist booking and record synchronisation, fronted by a landing experience choreographed in GSAP so the marketing site feels like the product.",
    outcome:
      "Booking, records and clinic management unified into a single modern patient surface.",
    image: "/work/clinq.png",
    live: "https://clinq-brown.vercel.app/",
    repo: "https://github.com/efeaizesogie/clinq-p",
  },

  {
    slug: "simple-payroll",
    index: "04",
    title: "Simple Payroll",
    year: "2024",
    role: "Frontend Developer",
    discipline: "HR / Payments",
    stack: ["React", "TailwindCSS", "JavaScript"],
    problem:
      "Small teams run payroll on spreadsheets because the alternatives are enterprise suites nobody asked for.",
    solution:
      "A comprehensive payroll service built as a focused React application — salary runs, deductions and employee records reduced to a handful of clear, repeatable screens.",
    outcome:
      "A complete payroll workflow delivered end to end with streamlined employee records and automated salary runs.",
    image: "/work/simple-payroll.png",
    live: "https://simple-payroll.vercel.app/",
    repo: "https://github.com/efeaizesogie/simple-payroll",
  },
  {
    slug: "fundedfun",
    index: "05",
    title: "FundedFun",
    year: "2025",
    role: "Frontend Developer",
    discipline: "Fintech / Prop Trading",
    stack: ["React", "TypeScript", "TailwindCSS", "Vite", "TanStack Router"],
    problem:
      "Low-cost trading challenges attract first-time traders who are then overwhelmed by charting tools and opaque rule sets.",
    solution:
      "An onboarding-forward evaluation platform with instant challenge creation, plain-language rules and embedded TradingView charting that stays performant under live data.",
    outcome:
      "Instant evaluations, fair trading rules and clear risk parameters in one uninterrupted surface.",
    image: "/work/fundedfun.png",
    live: "https://funded-fun-elevated.vercel.app/",
    repo: "https://github.com/efeaizesogie/FundedFun-Elevated",
  },
  {
    slug: "veescents",
    index: "06",
    title: "Veescents",
    year: "2024",
    role: "Frontend Developer",
    discipline: "Commerce",
    stack: ["React", "TailwindCSS", "JavaScript"],
    problem:
      "Fragrance buyers need to trust authenticity before they trust a checkout flow.",
    solution:
      "A modern storefront that leads with the curation — designer, Arabian and niche houses — and keeps the path to purchase short and legible.",
    outcome:
      "A seamless shopping experience with fast delivery options across a curated catalogue.",
    image: "/work/veescents.png",
    live: "https://veescents-next.vercel.app/",
    repo: "https://github.com/efeaizesogie/veescents-next",
  },
];

export const experiments = [
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
    stack: ["ArcGIS", "Remote Sensing", "QGIS", "Google Earth Pro", "Global Mapper", "AutoCAD", "Civil 3D"],
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
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
];
