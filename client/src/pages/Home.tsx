import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { WhatIBuild } from "@/components/WhatIBuild";
import { FeaturedCaseStudy } from "@/components/FeaturedCaseStudy";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Hero - Outcome-focused */}
        <div className="max-w-3xl mx-auto text-center py-2 md:py-4 space-y-4">
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
            I design decision support tools, knowledge systems, and automation workflows
            that reduce manual work and make organizations easier to run.
          </motion.p>
        </div>

        {/* What I Build Section - moved up */}
        <WhatIBuild />

        {/* Micro-testimonial */}
        <motion.div
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="bg-brand-stone/50 rounded-xl p-4 flex items-start gap-3">
            <Quote className="w-5 h-5 text-brand-copper shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-brand-brown/80 italic">
                "I can actually find what I need now without bothering management."
              </p>
              <p className="text-xs text-brand-brown/60 mt-1">
                — Staff feedback after JollyTails AI system launch
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/fit">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base font-semibold h-14 px-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              Try Evaluate Tool <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Link href="/resume">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base font-semibold h-14 px-10 rounded-xl border-2 hover:border-brand-copper transition-all duration-200"
            >
              View Resume
            </Button>
          </Link>
        </motion.div>

        {/* Featured Case Study */}
        <FeaturedCaseStudy />
      </div>
    </Layout>
  );
}
