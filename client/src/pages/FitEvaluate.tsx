import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Search,
  BarChart3,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FitEvaluate() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        {/* Hero text */}
        <motion.div
          className="text-center space-y-4 mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-brand-moss/10 text-brand-moss border-brand-moss mb-2">
            Normally $60 — free during beta
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-red leading-tight">
            Find Out Exactly Where AI Can Save Your Business Time and Money
          </h1>
          <p className="text-base text-brand-brown/70 max-w-lg mx-auto leading-relaxed">
            A 5-minute diagnostic that researches your specific business and
            returns concrete automation opportunities with real numbers.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-brand-brown/50 pt-1">
            <Sparkles className="w-3 h-3 text-brand-copper" />
            <span>Powered by AI</span>
            <span className="text-surface-line">·</span>
            <span>Built by Calum Kershaw</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <Link href="/fit/chat">
            <Button
              size="lg"
              className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-white px-8 py-6 text-base font-semibold"
            >
              Start the Diagnostic
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid md:grid-cols-3 gap-6 w-full max-w-3xl"
        >
          {[
            {
              icon: Search,
              title: "Tell Us About Your Business",
              description: "Share your business name, industry, and the tools you use every day.",
            },
            {
              icon: BarChart3,
              title: "We Research Your Industry",
              description: "AI analyzes your sector to find the most impactful automation opportunities.",
            },
            {
              icon: Zap,
              title: "Get Your ROI Report",
              description: "Receive specific recommendations with estimated time savings, cost, and payback period.",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="text-center space-y-3 p-6 rounded-2xl border border-surface-line/40 bg-surface-paper"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-copper/10 flex items-center justify-center mx-auto">
                <step.icon className="w-5 h-5 text-brand-copper" />
              </div>
              <p className="text-xs font-semibold text-brand-copper uppercase tracking-wide">
                Step {idx + 1}
              </p>
              <h3 className="font-semibold text-brand-charcoal text-sm">
                {step.title}
              </h3>
              <p className="text-xs text-brand-brown/60 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
