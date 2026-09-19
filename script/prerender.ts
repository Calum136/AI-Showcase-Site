/**
 * Build-time prerender for crawlers, ATS parsers and link previews.
 *
 * The site is a client-rendered SPA, so a plain HTTP fetch sees an empty
 * <div id="root">. This step runs after `vite build` and writes real HTML
 * (plus per-page title, description and Open Graph tags) for key routes.
 * Netlify serves these static files before the "/*" SPA fallback, and React's
 * createRoot replaces the static markup as soon as the bundle loads.
 *
 * Content comes from content/resume.json, the same file the Resume page and
 * PDF download use, so the three can never drift apart.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const SITE = "https://calumkershaw.netlify.app";
const OUT = path.resolve("dist/public");

type Resume = {
  personalInfo: { name: string; title: string; summary: string; email: string; phone: string; location: string; linkedinLabel: string; linkedinUrl: string };
  impactSummary: string[];
  skillGroups: Array<{ category: string; skills: string[] }>;
  experience: Array<{ position: string; company: string; period: string; scope: string; highlights: string[] }>;
  education: Array<{ institution: string; degree: string; year?: string }>;
  certifications: string[];
  projects: Array<{ name: string; description: string; url?: string }>;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const list = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

function resumeHtml(r: Resume): string {
  const p = r.personalInfo;
  return `
<main class="max-w-4xl mx-auto p-6" data-prerendered="resume">
  <header>
    <h1>${esc(p.name)}</h1>
    <p><strong>${esc(p.title)}</strong></p>
    <p>${esc(p.location)} | <a href="mailto:${esc(p.email)}">${esc(p.email)}</a> | ${esc(p.phone)} | <a href="${esc(p.linkedinUrl)}">${esc(p.linkedinLabel)}</a></p>
    <p>${esc(p.summary)}</p>
  </header>
  <section><h2>Key Impact</h2>${list(r.impactSummary)}</section>
  <section><h2>Experience</h2>
    ${r.experience
      .map(
        (e) => `<article>
      <h3>${esc(e.position)}, ${esc(e.company)}</h3>
      <p>${esc(e.period)}</p>
      <p>${esc(e.scope)}</p>
      ${list(e.highlights)}
    </article>`,
      )
      .join("\n    ")}
  </section>
  <section><h2>Projects</h2>
    <ul>${r.projects
      .map((pr) => `<li><strong>${pr.url ? `<a href="${esc(pr.url)}">${esc(pr.name)}</a>` : esc(pr.name)}</strong>: ${esc(pr.description)}</li>`)
      .join("")}</ul>
  </section>
  <section><h2>Skills</h2>
    ${r.skillGroups.map((g) => `<p><strong>${esc(g.category)}:</strong> ${esc(g.skills.join(", "))}</p>`).join("\n    ")}
  </section>
  <section><h2>Education</h2>${list(r.education.map((e) => `${e.degree}, ${e.institution}${e.year ? ` (${e.year})` : ""}`))}</section>
  <section><h2>Certifications</h2>${list(r.certifications)}</section>
</main>`;
}

function homeHtml(r: Resume): string {
  const p = r.personalInfo;
  return `
<main class="max-w-4xl mx-auto p-6" data-prerendered="home">
  <h1>${esc(p.name)}</h1>
  <p><strong>${esc(p.title)}</strong>. ${esc(p.location)}.</p>
  <p>${esc(p.summary)}</p>
  <h2>Highlights</h2>${list(r.impactSummary)}
  <h2>Selected work</h2>
  <ul>${r.projects.map((pr) => `<li><strong>${esc(pr.name)}</strong>: ${esc(pr.description)}</li>`).join("")}</ul>
  <p><a href="/resume">Resume</a> | <a href="/case-study">Case studies</a> | <a href="/portfolio">Portfolio</a> | <a href="/about">About</a></p>
</main>`;
}

const goldRiverHtml = `
<main class="max-w-4xl mx-auto p-6" data-prerendered="case-study">
  <h1>Gold River Homes: Cost Configurator</h1>
  <p>A live cost configurator that lets first-time buyers price a modular home from bare land to monthly payment, built by Calum Kershaw for a Supreme Homes retailer in Chester Basin, Nova Scotia. Live at <a href="https://goldriverhomes.netlify.app/">goldriverhomes.netlify.app</a>.</p>
  <h2>What shipped</h2>
  <ul>
    <li>Twenty guided, plain-language decisions covering the home, land, foundation, water, septic, finishes and financing.</li>
    <li>Every choice shows its price difference, its monthly payment impact, and a Nova Scotia-specific reason.</li>
    <li>Canadian mortgage math: semi-annual compounding, minimum down payment rules and CMHC premiums.</li>
    <li>81 approved photos with a provenance manifest recording source, licence, credit and caption.</li>
    <li>Checksum-validated share links, verified by round-tripping 2,000 randomised configurations.</li>
    <li>Review page, named saves, printable spec sheet and a pre-written enquiry email.</li>
  </ul>
  <p>Stack: Next.js, React, TypeScript, Tailwind CSS, Recharts, Netlify.</p>
</main>`;

type Page = { route: string; title: string; description: string; body?: string };

function renderPage(template: string, page: Page): string {
  const url = `${SITE}${page.route === "/" ? "/" : page.route}`;
  let html = template;
  const set = (re: RegExp, tag: string) => {
    html = re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
  };
  set(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`);
  set(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(page.description)}" />`);
  set(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  set(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(page.title)}" />`);
  set(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(page.description)}" />`);
  set(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  set(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(page.title)}" />`);
  set(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(page.description)}" />`);
  if (page.body) {
    if (!html.includes('<div id="root"></div>')) throw new Error("prerender: empty #root not found in template");
    html = html.replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
  }
  return html;
}

export async function prerender() {
  const template = await readFile(path.join(OUT, "index.html"), "utf-8");
  const resume: Resume = JSON.parse(await readFile(path.resolve("content/resume.json"), "utf-8"));
  const name = resume.personalInfo.name;

  const pages: Page[] = [
    {
      route: "/",
      title: `${name} | Operations, Sales & AI Systems | Truro, Nova Scotia`,
      description: `${name}, Truro, Nova Scotia. ${resume.impactSummary[0]}. Builder of live AI and automation systems for Nova Scotia businesses. Open to roles in Halifax and remote.`,
      body: homeHtml(resume),
    },
    {
      route: "/resume",
      title: `Resume | ${name} | Operations, Sales & AI Systems`,
      description: `Resume of ${name}: ${resume.experience[0].position} at ${resume.experience[0].company}, ranked 30th in Canada on associate net sales, and builder of production AI and automation systems.`,
      body: resumeHtml(resume),
    },
    {
      route: "/case-study/gold-river-homes",
      title: `Gold River Homes Cost Configurator | Case Study | ${name}`,
      description: "A live modular home cost configurator for a Nova Scotia retailer: every choice shows its price, monthly payment impact and a plain-language reason. Canadian mortgage math, licensed photo system, checksum-validated share links.",
      body: goldRiverHtml,
    },
    {
      route: "/case-study",
      title: `Case Studies | ${name}`,
      description: "Case studies: Gold River Homes cost configurator, Blackbird Brewing AI email automation, Coastal Ledger affordability tool, JollyTails staff assistant, and Open Brain.",
      body: goldRiverHtml,
    },
  ];

  for (const page of pages) {
    const html = renderPage(template, page);
    const file = page.route === "/" ? path.join(OUT, "index.html") : path.join(OUT, page.route.slice(1), "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html, "utf-8");
    console.log(`prerendered ${page.route} -> ${path.relative(process.cwd(), file)}`);
  }
}
