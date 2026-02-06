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
      <div className="space-y-4 md:space-y-6">
        {/* Hero - Outcome-focused */}
        <div className="max-w-3xl mx-auto text-center py-2 md:py-4 space-y-4">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-brand-red"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Systems that transform operations.
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-brand-brown leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            By building decision support tools, knowledge systems, and automation workflows
            I reduce your manual work load and improve operational clarity.
          </motion.p>
        </div>

        {/* What I Build Section - moved up */}
        <WhatIBuild />

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
