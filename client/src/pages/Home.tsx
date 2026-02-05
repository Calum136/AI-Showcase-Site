import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WhatIBuild } from "@/components/WhatIBuild";
import { FeaturedCaseStudy } from "@/components/FeaturedCaseStudy";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8 md:space-y-16">
        {/* Hero - Outcome-focused */}
        <div className="max-w-3xl mx-auto text-center py-8 md:py-12 space-y-6">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-brand-red"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI systems that turn messy operations into reliable execution.
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-brand-brown leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            I build decision support tools, knowledge systems, and automation workflows
            that reduce manual load and improve operational clarity.
          </motion.p>

          {/* Proof Panel */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="text-center px-5 py-3 bg-surface-paper rounded-xl border border-surface-line/50">
              <div className="text-2xl font-bold text-brand-copper">20+</div>
              <div className="text-xs text-brand-brown/70">Documents Unified</div>
            </div>
            <div className="text-center px-5 py-3 bg-surface-paper rounded-xl border border-surface-line/50">
              <div className="text-2xl font-bold text-brand-copper">~70%</div>
              <div className="text-xs text-brand-brown/70">Faster Lookup</div>
            </div>
            <div className="text-center px-5 py-3 bg-surface-paper rounded-xl border border-surface-line/50">
              <div className="text-2xl font-bold text-brand-copper">RAG</div>
              <div className="text-xs text-brand-brown/70">Architecture</div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/case-study">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base font-semibold h-14 px-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                data-testid="button-view-case-study"
              >
                View Case Study <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/resume">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold h-14 px-10 rounded-xl border-2 hover:border-brand-copper transition-all duration-200"
                data-testid="button-view-resume"
              >
                View Resume
              </Button>
            </Link>
          </motion.div>

          {/* Tertiary Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/fit">
              <span className="text-sm text-brand-copper hover:text-brand-copper/80 hover:underline cursor-pointer transition-colors">
                Try the Evaluate Tool →
              </span>
            </Link>
          </motion.div>
        </div>

        {/* What I Build Section */}
        <WhatIBuild />

        {/* Featured Case Study */}
        <FeaturedCaseStudy />
      </div>
    </Layout>
  );
}
