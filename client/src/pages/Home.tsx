import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { WhatIBuild } from "@/components/WhatIBuild";
import { FeaturedCaseStudy } from "@/components/FeaturedCaseStudy";

const TESTIMONIALS = [
  {
    quote: "I can actually find what I need now without bothering management.",
    attribution: "Staff feedback after JollyTails AI system launch",
  },
  {
    quote: "Training time is noticeably shorter. Staff are more confident.",
    attribution: "Operations Manager, JollyTails Pet Resort",
  },
  {
    quote: "The system surfaced conflicting SOPs we didn't even know about.",
    attribution: "Operations review after AI knowledge base deployment",
  },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % TESTIMONIALS.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="bg-brand-stone/50 rounded-xl px-12 py-5 min-h-[88px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 w-full"
          >
            <Quote className="w-5 h-5 text-brand-copper shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-brand-brown/80 italic">
                "{TESTIMONIALS[current].quote}"
              </p>
              <p className="text-xs text-brand-brown/60 mt-1">
                -- {TESTIMONIALS[current].attribution}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-brand-brown/40 hover:text-brand-brown/70 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-brand-brown/40 hover:text-brand-brown/70 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === current ? "bg-brand-copper" : "bg-brand-brown/20"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Hero - Two Column */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center py-6 md:py-12">
          {/* Left Column: Text + CTAs */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-brand-red">
              AI systems that turn messy operations into reliable execution.
            </h1>

            <p className="text-lg md:text-xl text-brand-brown leading-relaxed">
              I design decision support tools, knowledge systems, and automation
              workflows that reduce manual work and make organizations easier to
              run.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </motion.div>

          {/* Right Column: Headshot with floating animation + gradient glow */}
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Gradient glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-copper/20 via-brand-red/10 to-brand-moss/15 rounded-3xl blur-2xl" />
              <img
                src="/CalumHeadshot.png"
                alt="Calum Kershaw"
                className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-2xl object-cover ring-1 ring-surface-line/30 shadow-[0_20px_60px_rgba(75,52,40,0.25)]"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* What I Build Section */}
        <WhatIBuild />

        {/* Featured Case Study */}
        <FeaturedCaseStudy />

        {/* Testimonial Carousel - bottom of page */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pb-4"
        >
          <TestimonialCarousel />
        </motion.div>
      </div>
    </Layout>
  );
}
