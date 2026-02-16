import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ClipboardPaste,
  BrainCircuit,
} from "lucide-react";

export default function FitEvaluate() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        {/* Hero text */}
        <motion.div
          className="text-center space-y-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-red leading-tight">
            Let's evaluate the fit.
          </h1>
          <p className="text-sm text-brand-brown/70 max-w-md mx-auto">
            Two ways to explore whether I'm the right person for your challenge.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-brand-brown/50 pt-1">
            <Sparkles className="w-3 h-3 text-brand-copper" />
            <span>Powered by AI</span>
            <span className="text-surface-line">·</span>
            <span>Built by Calum Kershaw</span>
          </div>
        </motion.div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Card 1: Paste a Job Description */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Link href="/fit/assess">
              <div className="group relative h-full cursor-pointer rounded-2xl border border-surface-line/40 bg-surface-paper p-6 md:p-8 transition-all hover:border-brand-copper/50 hover:shadow-lg hover:shadow-brand-copper/5">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-brand-copper/10 flex items-center justify-center mb-5 group-hover:bg-brand-copper/15 transition-colors">
                  <ClipboardPaste className="w-6 h-6 text-brand-copper" />
                </div>

                <h2 className="text-xl font-semibold text-brand-charcoal mb-2">
                  Paste a Job Description
                </h2>
                <p className="text-sm text-brand-brown/70 mb-6 leading-relaxed">
                  Drop in a JD or role brief and get an instant, structured
                  fit assessment — strengths, gaps, risks, and a score.
                </p>

                {/* What you get */}
                <ul className="space-y-2 mb-6">
                  {[
                    "Fit score out of 100",
                    "Strengths & honest risk flags",
                    "Recommended next steps",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-brand-brown/60"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-copper/70" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-sm font-medium text-brand-copper group-hover:gap-3 transition-all">
                  Run Assessment
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Card 2: Discuss Your Problem */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link href="/fit/chat">
              <div className="group relative h-full cursor-pointer rounded-2xl border border-surface-line/40 bg-surface-paper p-6 md:p-8 transition-all hover:border-brand-moss/50 hover:shadow-lg hover:shadow-brand-moss/5">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-brand-moss/10 flex items-center justify-center mb-5 group-hover:bg-brand-moss/15 transition-colors">
                  <BrainCircuit className="w-6 h-6 text-brand-moss" />
                </div>

                <h2 className="text-xl font-semibold text-brand-charcoal mb-2">
                  Discuss Your Problem
                </h2>
                <p className="text-sm text-brand-brown/70 mb-6 leading-relaxed">
                  Have a conversation about the challenge you're facing.
                  I'll ask the right questions and build a diagnostic report.
                </p>

                {/* What you get */}
                <ul className="space-y-2 mb-6">
                  {[
                    "Guided diagnostic conversation",
                    "Uncovers hidden requirements",
                    "Personalized fit report",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-brand-brown/60"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-brand-moss/70" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-sm font-medium text-brand-moss group-hover:gap-3 transition-all">
                  Start Conversation
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
