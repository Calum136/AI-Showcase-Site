import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter } from "lucide-react";
import { SkillBadge } from "@/components/SkillBadge";
import { Layout } from "@/components/Layout";
import { customGPTs, claudeSkills, miniProjects } from "@/data/skillsData";

const professionalProjects = [
  {
    title: "Blackbird Brewing — AI Email Automation",
    description:
      "End-to-end AI email automation system with 17-category classifier, brand-voice response matching, escalation rules, and Make.com integration. Delivered on budget in 3 weeks.",
    tags: ["AI Systems", "Automation", "OpenAI", "Make.com"],
    category: "Automation",
    image: "/blackbird-email.png",
    link: "#",
    impact: "500+ emails/month automated for client",
  },
  {
    title: "JollyTails Staff Assistant (DogBot)",
    description:
      "RAG-powered Q&A system consolidating 20+ fragmented SOPs into searchable AI knowledge base with admin analytics dashboard, training compliance tracking, and knowledge gap identification.",
    tags: ["AI Systems", "RAG", "TypeScript", "React", "OpenAI"],
    category: "AI Systems",
    image: "/jollytails-staff-assistant.png",
    link: "https://github.com/Calum136/dogbot-jollytails",
    impact: "~70% faster procedure lookup, 20+ docs unified",
  },
  {
    title: "AI Portfolio & Diagnostic Platform",
    description:
      "Full-stack portfolio with AI-powered diagnostic chat that generates plain-language fit reports with actionable recommendations. Multi-agent architecture with dual deployment paths.",
    tags: ["AI Systems", "TypeScript", "React", "Claude API"],
    category: "AI Systems",
    image: "/AIShowCase.png",
    link: "#",
    impact: "Live AI diagnostic generating personalized hiring reports",
  },
  {
    title: "Maritime Home Map",
    description:
      "Nova Scotia mortgage affordability calculator with interactive Mapbox choropleth. Enter income, debts, and lifestyle — see which NS municipalities you can realistically afford, colour-coded by financial zone with OSFI B-20 stress testing.",
    tags: ["Tools", "React", "TypeScript", "Mapbox GL"],
    category: "Tools",
    image: "/maritime-home-map.png",
    link: "#",
    impact: "30+ NS municipalities mapped with real PVSC + StatsCan data",
  },
];

type FilterCategory = "All" | "AI Systems" | "Automation" | "Analytics" | "Tools";

const filterCategories: FilterCategory[] = [
  "All",
  "AI Systems",
  "Automation",
  "Tools",
  "Analytics",
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  const filteredProjects = professionalProjects.filter(
    (p) => activeFilter === "All" || p.category === activeFilter
  );

  return (
    <Layout>
      <div className="space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">
            Selected Work
          </h1>
          <p className="text-lg text-brand-brown/80 max-w-2xl mx-auto">
            Professional systems and experimental projects exploring AI, automation, and operational efficiency.
          </p>
        </motion.div>

        {/* Professional Systems Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <h2 className="text-2xl font-bold text-brand-charcoal">
              Professional Systems
            </h2>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <Filter className="w-4 h-4 text-brand-brown/60 mr-1 self-center" />
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeFilter === cat
                      ? "bg-brand-copper text-surface-paper"
                      : "bg-brand-stone text-brand-brown hover:bg-brand-stone/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-surface-ink rounded-2xl overflow-hidden border border-surface-line/20 hover:border-brand-copper/40 transition-all group"
              >
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-900/20">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.style.display = "none";
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector("[data-img-fallback]")) {
                        const fallback = document.createElement("div");
                        fallback.setAttribute("data-img-fallback", "true");
                        fallback.className =
                          "absolute inset-0 flex items-center justify-center text-surface-paper/60 text-sm bg-surface-ink/60";
                        fallback.innerText = "Image missing";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-copper mb-2">
                    {project.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-brand-moss/20 text-brand-moss border border-brand-moss/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-surface-paper/80 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Impact callout */}
                  <div className="bg-brand-moss/10 border border-brand-moss/20 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs font-medium text-brand-moss">
                      Impact: {project.impact}
                    </p>
                  </div>

                  <Button
                    variant="default"
                    className="w-full bg-brand-copper hover:bg-brand-copper/90 text-surface-paper rounded-xl"
                    asChild
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experiments Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-brand-charcoal mb-2">
              Experiments & Tools
            </h2>
            <p className="text-brand-brown/70 text-sm mb-8">
              Custom GPTs, Claude skills, and smaller projects exploring different AI capabilities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Custom GPTs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Custom GPTs</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {customGPTs.map((gpt) => (
                  <SkillBadge key={gpt.name} {...gpt} />
                ))}
              </div>
            </motion.div>

            {/* Claude Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Claude Skills</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {claudeSkills.map((skill) => (
                  <SkillBadge key={skill.name} {...skill} />
                ))}
              </div>
            </motion.div>

            {/* Mini Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Mini Projects</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {miniProjects.map((project) => (
                  <SkillBadge key={project.name} {...project} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
