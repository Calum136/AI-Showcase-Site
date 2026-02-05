import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  Database,
  FileText,
  Lightbulb,
  Target,
  Users,
  Zap,
  BookOpen,
  GitBranch,
  ExternalLink,
  Shield,
} from "lucide-react";
import { Link } from "wouter";
import { ContactDialog } from "@/components/ContactDialog";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function CaseStudy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div {...fadeIn} className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Case Study
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-display">
            JollyTails Staff Assistant
          </h1>
          <p className="text-xl text-brand-brown/80 max-w-2xl mx-auto">
            How I built an AI knowledge base that turned 20+ fragmented SOPs into
            an intelligent, searchable system for pet care operations.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">20+</div>
              <div className="text-xs text-brand-brown/70">Documents Consolidated</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">~70%</div>
              <div className="text-xs text-brand-brown/70">Search Time Reduced</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">RAG</div>
              <div className="text-xs text-brand-brown/70">AI Architecture</div>
            </div>
          </div>
        </motion.div>

        {/* Executive Summary */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.1 }}
          className="bg-surface-paper rounded-2xl p-6 md:p-8 border border-surface-line/50 shadow-sm"
        >
          <h3 className="font-semibold mb-4 text-brand-charcoal text-lg">Executive Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Problem</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  20+ SOPs scattered across formats; staff couldn't find answers when needed.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Stakes</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  2-3 week onboarding, inconsistent service, senior staff constantly interrupted.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Solution</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  RAG-based AI assistant that provides instant, contextual answers from consolidated docs.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Outcome</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  ~70% faster lookup, sub-second responses, $15-20/month operational cost.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs font-medium text-brand-brown/60">Stack:</span>
                {["TypeScript", "React", "OpenAI", "pgvector"].map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs bg-brand-stone rounded text-brand-brown">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.15 }}
          className="bg-brand-stone/50 rounded-2xl p-6 border border-surface-line/50"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-brand-charcoal">
            <BookOpen className="w-4 h-4" />
            Contents
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {[
              "The Problem",
              "Analysis",
              "Solution Design",
              "Implementation",
              "Results",
              "Lessons Learned",
              "Tech Stack",
            ].map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-brand-brown/70 hover:text-brand-copper transition-colors"
              >
                {i + 1}. {item}
              </a>
            ))}
          </div>
        </motion.div>

        {/* The Problem */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.2 }}
          id="the-problem"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-brand-red" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">The Problem</h2>
          </div>

          <Card className="border-surface-line/50">
            <CardContent className="pt-6 space-y-4">
              <p className="text-brand-brown/80">
                JollyTails Pet Resort had a knowledge management crisis. Over years of
                operation, they'd accumulated <strong className="text-brand-charcoal">20+ Standard Operating Procedures</strong>{" "}
                spread across multiple formats:
              </p>

              <ul className="space-y-2">
                {[
                  "Word documents in shared drives",
                  "PDFs in email attachments",
                  "Handwritten notes in binders",
                  "Tribal knowledge only in senior staff heads",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-brand-brown">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-4 mt-4">
                <h4 className="font-semibold text-brand-red mb-2">Impact</h4>
                <ul className="text-sm space-y-1 text-brand-brown/80">
                  <li>• New staff took 2-3 weeks to become operational</li>
                  <li>• Inconsistent service delivery across shifts</li>
                  <li>• Senior staff constantly interrupted for basic questions</li>
                  <li>• Critical procedures sometimes missed entirely</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Analysis */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.3 }}
          id="analysis"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-charcoal" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Analysis</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-copper" />
                  Stakeholder Interviews
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Talked with operations managers, shift supervisors, and new hires.
                  Key finding: <em className="text-brand-charcoal">"I know it's written down somewhere, I just can't
                  find it when I need it."</em>
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-copper" />
                  Document Audit
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Catalogued 23 distinct SOPs covering feeding, medications, emergency
                  protocols, cleaning, and customer interactions. 40% had conflicting
                  versions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-copper" />
                  Constraints
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <ul className="space-y-1">
                  <li>• Budget: Minimal (pro-bono project)</li>
                  <li>• Timeline: 4-6 weeks</li>
                  <li>• Users: Non-technical staff</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-brand-copper" />
                  Core Insight
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  The problem wasn't documentation—it was <strong className="text-brand-charcoal">retrieval</strong>.
                  Staff needed answers in context, not a document to read.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Solution Design */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.4 }}
          id="solution-design"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-brown/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-brand-brown" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Solution Options</h2>
          </div>

          <p className="text-brand-brown/80">
            I evaluated three approaches before recommending RAG:
          </p>

          {/* Decision Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-surface-line rounded-xl overflow-hidden">
              <thead className="bg-brand-stone/50">
                <tr>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Approach</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Pros</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Cons</th>
                  <th className="text-center p-3 font-medium text-brand-charcoal">Fit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">Wiki/Docs System</td>
                  <td className="p-3 text-brand-brown/80">Low cost, full control</td>
                  <td className="p-3 text-brand-brown/80">Still requires manual search</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">Fine-tuned Model</td>
                  <td className="p-3 text-brand-brown/80">Highly customized</td>
                  <td className="p-3 text-brand-brown/80">Expensive, needs labeled data</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-surface-line bg-brand-moss/10">
                  <td className="p-3 font-medium text-brand-moss">RAG System ✓</td>
                  <td className="p-3 text-brand-brown/80">Cost-effective, real-time updates</td>
                  <td className="p-3 text-brand-brown/80">Requires embedding infrastructure</td>
                  <td className="p-3 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Card className="border-brand-moss/30 bg-brand-moss/5">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-brand-moss mb-2">Why RAG Won</h4>
              <p className="text-sm text-brand-brown/80">
                RAG (Retrieval-Augmented Generation) hit the sweet spot: intelligent search
                without the cost of fine-tuning, easy document updates without retraining,
                and natural language answers that staff could immediately use.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Implementation */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.5 }}
          id="implementation"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-copper/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-brand-copper" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Technical Implementation</h2>
          </div>

          {/* Architecture Diagram */}
          <Card className="border-surface-line/50">
            <CardHeader>
              <CardTitle className="text-base">System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-brand-stone/50 rounded-xl p-6 font-mono text-sm">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                  <div className="bg-surface-paper p-3 rounded-lg border border-surface-line">
                    📄 Documents<br />
                    <span className="text-xs text-brand-brown/70">(Word, PDF)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-brand-copper" />
                  <div className="bg-surface-paper p-3 rounded-lg border border-surface-line">
                    🔧 Chunking<br />
                    <span className="text-xs text-brand-brown/70">(~500 tokens)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-brand-copper" />
                  <div className="bg-surface-paper p-3 rounded-lg border border-surface-line">
                    🧠 Embeddings<br />
                    <span className="text-xs text-brand-brown/70">(OpenAI)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-brand-copper" />
                  <div className="bg-surface-paper p-3 rounded-lg border border-surface-line">
                    💾 Vector DB<br />
                    <span className="text-xs text-brand-brown/70">(PostgreSQL)</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-surface-line">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                    <div className="bg-brand-copper/10 p-3 rounded-lg border border-brand-copper/30">
                      💬 User Query
                    </div>
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-brand-copper" />
                    <div className="bg-surface-paper p-3 rounded-lg border border-surface-line">
                      🔍 Similarity Search<br />
                      <span className="text-xs text-brand-brown/70">(Top 5 chunks)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-brand-copper" />
                    <div className="bg-surface-paper p-3 rounded-lg border border-surface-line">
                      🤖 LLM + Context<br />
                      <span className="text-xs text-brand-brown/70">(GPT-4)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0 text-brand-copper" />
                    <div className="bg-brand-moss/10 p-3 rounded-lg border border-brand-moss/30">
                      ✅ Answer
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Decisions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Why OpenAI Embeddings?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Tested against open-source alternatives. OpenAI's ada-002 gave best
                  results for procedural/operational text with minimal tuning.
                  Cost: ~$0.0001 per document chunk.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Chunk Size Tuning</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Started with 1000 tokens, reduced to 500 after testing. Smaller chunks
                  gave more precise retrieval for specific procedures. Added 50-token
                  overlap to preserve context.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Similarity Threshold</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Set at 0.78 after testing. Lower values returned irrelevant content,
                  higher values missed valid matches. Retrieve top 5 chunks for context.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">PostgreSQL + pgvector</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Chose over dedicated vector DBs for simplicity. Same database for
                  app data and vectors. Easy to deploy, maintain, and backup.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Constraints & Tradeoffs - Senior Signal */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.55 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-charcoal" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Constraints & Tradeoffs</h2>
          </div>

          <Card className="border-surface-line/50">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-3">Accuracy Concerns</h4>
                  <p className="text-sm text-brand-brown/80 mb-3">
                    LLMs can hallucinate. For operational procedures, wrong answers could cause real problems.
                  </p>
                  <p className="text-sm text-brand-brown/80">
                    <strong className="text-brand-charcoal">Mitigation:</strong> Source citations on every answer,
                    confidence thresholds, and clear "I don't know" responses when retrieval scores are low.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-3">Evaluation Approach</h4>
                  <p className="text-sm text-brand-brown/80 mb-3">
                    Tested with 50 real questions from staff. Measured retrieval accuracy (correct docs found)
                    and answer quality (human rating 1-5).
                  </p>
                  <p className="text-sm text-brand-brown/80">
                    <strong className="text-brand-charcoal">Result:</strong> 92% retrieval accuracy, 4.2/5 average
                    answer quality before launch.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-3">Maintenance Plan</h4>
                  <p className="text-sm text-brand-brown/80">
                    Documents change. Built simple re-indexing pipeline triggered by file updates.
                    New SOPs can be added without touching code. Usage analytics flag frequently-asked
                    questions with low confidence for manual review.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-3">Cost Control</h4>
                  <p className="text-sm text-brand-brown/80">
                    Pro-bono project with real ongoing costs. Chose embedding model (ada-002) and LLM
                    (GPT-3.5-turbo for most queries, GPT-4 fallback) to keep monthly costs under $20
                    for expected usage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Results */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.6 }}
          id="results"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-moss/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-brand-moss" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Results & Impact</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-copper" />
                  Quantitative Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-brand-brown">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">23 documents</strong> consolidated into searchable system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">~70% reduction</strong> in time to find procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">Sub-second</strong> query response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">$15-20/month</strong> total operational cost</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-copper" />
                  Qualitative Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <blockquote className="border-l-2 border-brand-copper pl-3 italic text-brand-brown/80">
                    "I can actually find what I need now without bothering Sarah."
                    <span className="block mt-1 text-xs not-italic text-brand-brown/60">— New Hire</span>
                  </blockquote>
                  <blockquote className="border-l-2 border-brand-copper pl-3 italic text-brand-brown/80">
                    "Training time is noticeably shorter. Staff are more confident."
                    <span className="block mt-1 text-xs not-italic text-brand-brown/60">— Operations Manager</span>
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Lessons Learned */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.7 }}
          id="lessons-learned"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-copper/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-brand-copper" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Lessons Learned</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-brand-moss/30 bg-brand-moss/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-brand-moss">What Worked</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <ul className="space-y-2">
                  <li>• Simple UI with single search box</li>
                  <li>• Source citations for trust</li>
                  <li>• Incremental document updates</li>
                  <li>• Real user testing throughout</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-brand-copper/30 bg-brand-copper/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-brand-copper">What I'd Change</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <ul className="space-y-2">
                  <li>• Add feedback loop for answer quality</li>
                  <li>• Build admin UI for doc management</li>
                  <li>• Implement usage analytics earlier</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-brand-charcoal/30 bg-brand-charcoal/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-brand-charcoal">Surprises</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <ul className="space-y-2">
                  <li>• Users preferred answers over docs</li>
                  <li>• Conflicting SOPs revealed by AI</li>
                  <li>• Mobile use higher than expected</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.8 }}
          id="tech-stack"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-copper/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-brand-copper" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Tech Stack</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "TypeScript",
              "React",
              "Node.js",
              "Express",
              "PostgreSQL",
              "pgvector",
              "OpenAI API",
              "Embeddings",
              "Tailwind CSS",
              "Vite",
            ].map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="px-3 py-1.5 text-sm border-surface-line text-brand-brown hover:border-brand-copper/50 hover:text-brand-copper transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.section>

        {/* Closing CTA */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.9 }}
          className="bg-surface-paper rounded-2xl p-8 md:p-10 text-center space-y-6 border border-surface-line/50 shadow-sm"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal">
            Want to discuss a similar challenge?
          </h3>
          <p className="text-brand-brown/80 max-w-xl mx-auto">
            I build AI systems that solve real operational problems. Whether it's
            knowledge management, process automation, or decision support — let's talk
            about what you're trying to solve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactDialog>
              <Button
                size="lg"
                className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper"
              >
                Contact Me <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </ContactDialog>
            <Link href="/resume">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-2 hover:border-brand-copper"
              >
                View Resume
              </Button>
            </Link>
            <Link href="/fit">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-xl text-brand-copper hover:text-brand-copper/80 hover:bg-brand-copper/5"
              >
                Try Evaluate Tool <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
