import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

export function FeaturedCaseStudy() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-3">
          Featured Project
        </h2>
        <p className="text-brand-brown/80 max-w-2xl mx-auto">
          Real systems solving real operational problems.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal mb-3">
                    JollyTails Staff Assistant
                  </h3>
                  <p className="text-brand-brown/80 leading-relaxed">
                    Built an AI knowledge base that turned 20+ fragmented SOPs into an intelligent,
                    searchable system. Staff now get instant, contextual answers instead of hunting
                    through documents or interrupting senior team members.
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-brand-stone rounded-xl">
                    <div className="text-xl font-bold text-brand-copper">20+</div>
                    <div className="text-xs text-brand-brown/70">Docs Unified</div>
                  </div>
                  <div className="px-4 py-2 bg-brand-stone rounded-xl">
                    <div className="text-xl font-bold text-brand-copper">~70%</div>
                    <div className="text-xs text-brand-brown/70">Faster Lookup</div>
                  </div>
                  <div className="px-4 py-2 bg-brand-stone rounded-xl">
                    <div className="text-xl font-bold text-brand-copper">RAG</div>
                    <div className="text-xs text-brand-brown/70">Architecture</div>
                  </div>
                </div>

                <Link href="/case-study">
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
                      <span className="px-2 py-1 bg-brand-copper/10 rounded text-brand-copper">Docs</span>
                      <span className="text-brand-brown/40">→</span>
                      <span className="px-2 py-1 bg-brand-copper/10 rounded text-brand-copper">Embeddings</span>
                      <span className="text-brand-brown/40">→</span>
                      <span className="px-2 py-1 bg-brand-moss/10 rounded text-brand-moss">Answers</span>
                    </div>
                  </div>

                  <div className="bg-surface-paper/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-surface-line/30">
                    <div className="text-xs font-medium text-brand-brown/60 mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-1">
                      {["TypeScript", "React", "OpenAI", "pgvector"].map((tech) => (
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
    </section>
  );
}
