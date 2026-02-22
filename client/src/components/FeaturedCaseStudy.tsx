import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const FEATURED_PROJECTS = [
  {
    title: "Blackbird Brewing — Email Automation",
    description:
      "AI-powered email triage and response system for a Nova Scotia brewery, reducing repetitive inbox work while preserving the owner's voice and keeping humans in control of every booking.",
    metrics: [
      { value: "14/14", label: "Emails Routed" },
      { value: "17", label: "Categories" },
      { value: "~$20/mo", label: "Operating Cost" },
    ],
    techStack: ["Make.com", "OpenAI", "Gmail API", "Node.js"],
    flowSteps: ["Email In", "Classify", "Route", "Respond"],
    caseStudyLink: "/case-study/blackbird-brewing",
    badge: "Client Delivery",
  },
  {
    title: "Maritime Home Map",
    description:
      "Nova Scotia mortgage affordability calculator with interactive map. Enter your income, debts, and lifestyle — see which NS municipalities you can realistically afford, colour-coded by financial zone.",
    metrics: [
      { value: "30+", label: "Municipalities" },
      { value: "15+", label: "Variables" },
      { value: "OSFI B-20", label: "Stress Test" },
    ],
    techStack: ["React", "TypeScript", "Mapbox GL", "TailwindCSS"],
    flowSteps: ["Inputs", "Calculate", "Map", "Zones"],
    caseStudyLink: "/case-study/maritime-home-map",
    badge: "In Development",
  },
];

export function FeaturedCaseStudy() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % FEATURED_PROJECTS.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [next]);

  const project = FEATURED_PROJECTS[current];

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-3">
          Featured Projects
        </h2>
        <p className="text-brand-brown/80 max-w-2xl mx-auto">
          Real systems solving real operational problems.
        </p>
      </motion.div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden rounded-2xl border-surface-line/50 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Left: Content */}
                  <div className="p-8 md:p-10 space-y-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-brand-copper border-brand-copper/30">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Case Study
                      </Badge>
                      <Badge variant="outline" className="text-brand-brown/60 border-brand-brown/20 text-xs">
                        {project.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal mb-3">
                        {project.title}
                      </h3>
                      <p className="text-brand-brown/80 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-3">
                      {project.metrics.map((metric) => (
                        <div key={metric.label} className="px-4 py-2 bg-brand-stone rounded-xl">
                          <div className="text-xl font-bold text-brand-copper">{metric.value}</div>
                          <div className="text-xs text-brand-brown/70">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    <Link href={project.caseStudyLink}>
                      <Button
                        size="lg"
                        className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper"
                      >
                        Read Case Study <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Right: Visual */}
                  <div className="relative bg-gradient-to-br from-brand-copper/10 to-brand-moss/10 p-8 md:p-10 flex items-center justify-center min-h-[300px]">
                    <div className="space-y-4 w-full max-w-sm">
                      {/* Architecture preview */}
                      <div className="bg-surface-paper/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-surface-line/30">
                        <div className="text-xs font-medium text-brand-brown/60 mb-2">System Flow</div>
                        <div className="flex items-center gap-2 text-xs">
                          {project.flowSteps.map((step, i) => (
                            <span key={step} className="contents">
                              <span className={`px-2 py-1 rounded ${i === project.flowSteps.length - 1 ? "bg-brand-moss/10 text-brand-moss" : "bg-brand-copper/10 text-brand-copper"}`}>
                                {step}
                              </span>
                              {i < project.flowSteps.length - 1 && (
                                <span className="text-brand-brown/40">→</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-surface-paper/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-surface-line/30">
                        <div className="text-xs font-medium text-brand-brown/60 mb-2">Tech Stack</div>
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs bg-brand-stone rounded text-brand-brown"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-paper/80 text-brand-brown/40 hover:text-brand-brown/70 transition-colors shadow-sm border border-surface-line/30 z-10"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-paper/80 text-brand-brown/40 hover:text-brand-brown/70 transition-colors shadow-sm border border-surface-line/30 z-10"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {FEATURED_PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-brand-copper" : "bg-brand-brown/20"
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
