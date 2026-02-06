import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Settings, Zap } from "lucide-react";

const buildCategories = [
  {
    icon: Database,
    title: "AI Knowledge Systems",
    subtitle: "RAG Architecture",
    description: "Turn SOPs, docs, and tribal knowledge into searchable, intelligent answers. Staff get context-aware help instead of digging through files.",
  },
  {
    icon: Settings,
    title: "Decision Support Tools",
    subtitle: "Structured Reasoning",
    description: "Structured inputs produce consistent outputs. From fit evaluations to operational checklists, reduce guesswork with systematic approaches.",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    subtitle: "Process Efficiency",
    description: "Reduce repetitive manual work. Automate data flows, notifications, and routine decisions so teams focus on what matters.",
  },
];

export function WhatIBuild() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-3">
          Proven Systems in Practice
        </h2>
        <p className="text-brand-brown/80 max-w-2xl mx-auto">
          Systems that solve real operational problems through strategic AI implementation.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {buildCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * idx }}
            >
              <Card className="h-full rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border-surface-line/50">
                <CardContent className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-brand-copper/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-brand-copper" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-charcoal">
                        {category.title}
                      </h3>
                      <span className="text-xs text-brand-copper font-medium">
                        {category.subtitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-brand-brown/80 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
