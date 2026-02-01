import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SkillBadge } from "@/components/SkillBadge";
import { customGPTs, claudeSkills, miniProjects } from "@/data/skillsData";

// Your existing project cards data
const majorProjects = [
  {
    title: "JollyTails Staff Assistant",
    description: "AI-powered knowledge base for pet care operations using RAG and OpenAI embeddings. Consolidates fragmented SOPs into a searchable system with training tracking and admin analytics.",
    tags: ["React", "TypeScript", "Express", "OpenAI", "RAG"],
    image: "C:\Users\Calum\OneDrive\Pictures\Dogbot.png", // Replace with actual screenshot
    link: "https://github.com/Calum136/dogbot-jollytails" // Add GitHub link
  },
  {
    title: "AI Showcase Site (This Site)",
    description: "Portfolio and hiring evaluation system built with content-driven architecture. Demonstrates AI integration, systems thinking, and modern full-stack development.",
    tags: ["TypeScript", "React", "PostgreSQL", "Express"],
    image: "C:\Users\Calum\OneDrive\Pictures\AIShowCase.png", // Replace with actual screenshot
    link: "#"
  }
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl font-bold text-brand-espresso mb-4">
            Selected Work
          </h1>
          <p className="text-lg text-brand-espresso/70 max-w-2xl mx-auto">
            A collection of projects exploring the intersection of design, engineering, and artificial intelligence.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - Major Projects (2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            {majorProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface-charcoal rounded-lg overflow-hidden border border-brand-espresso/20 hover:border-brand-copper/40 transition-colors"
              >
                {/* Project Image */}
                <div className="aspect-video bg-brand-stone/20">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="font-heading text-2xl font-bold text-brand-copper mb-3">
                    {project.title}
                  </h3>
                  
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-brand-moss/20 text-brand-moss border border-brand-moss/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-surface-paper/80 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <Button
                    variant="default"
                    className="w-full bg-brand-copper hover:bg-brand-copper/90 text-surface-paper"
                    asChild
                  >
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT COLUMN - Skills & Mini Projects */}
          <div className="space-y-12">
            
            {/* Custom GPTs Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-heading text-xl font-bold text-brand-espresso mb-6">
                Custom GPTs
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {customGPTs.map((gpt) => (
                  <SkillBadge key={gpt.name} {...gpt} />
                ))}
              </div>
            </motion.div>

            {/* Claude Skills Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="font-heading text-xl font-bold text-brand-espresso mb-6">
                Claude Skills
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {claudeSkills.map((skill) => (
                  <SkillBadge key={skill.name} {...skill} />
                ))}
              </div>
            </motion.div>

            {/* Mini Projects Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="font-heading text-xl font-bold text-brand-espresso mb-6">
                Mini Projects
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {miniProjects.map((project) => (
                  <SkillBadge key={project.name} {...project} />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
