import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { Link } from "wouter";

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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            How I built an AI knowledge base that turned 20+ fragmented SOPs into
            an intelligent, searchable system for pet care operations.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-2xl font-bold text-primary">20+</div>
              <div className="text-xs text-muted-foreground">Documents Consolidated</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-2xl font-bold text-primary">~70%</div>
              <div className="text-xs text-muted-foreground">Search Time Reduced</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-2xl font-bold text-primary">RAG</div>
              <div className="text-xs text-muted-foreground">AI Architecture</div>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.1 }}
          className="bg-muted/20 rounded-2xl p-6 border border-border/50"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
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
                className="text-muted-foreground hover:text-primary transition-colors"
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
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold">The Problem</h2>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">
                JollyTails Pet Resort had a knowledge management crisis. Over years of
                operation, they'd accumulated <strong>20+ Standard Operating Procedures</strong>{" "}
                spread across multiple formats:
              </p>

              <ul className="space-y-2">
                {[
                  "Word documents in shared drives",
                  "PDFs in email attachments",
                  "Handwritten notes in binders",
                  "Tribal knowledge only in senior staff heads",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mt-4">
                <h4 className="font-semibold text-red-600 mb-2">Impact</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">Analysis</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Stakeholder Interviews
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Talked with operations managers, shift supervisors, and new hires.
                  Key finding: <em>"I know it's written down somewhere, I just can't
                  find it when I need it."</em>
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Document Audit
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Catalogued 23 distinct SOPs covering feeding, medications, emergency
                  protocols, cleaning, and customer interactions. 40% had conflicting
                  versions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Constraints
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Budget: Minimal (pro-bono project)</li>
                  <li>• Timeline: 4-6 weeks</li>
                  <li>• Users: Non-technical staff</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Core Insight
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  The problem wasn't documentation—it was <strong>retrieval</strong>.
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
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold">Solution Options</h2>
          </div>

          <p className="text-muted-foreground">
            I evaluated three approaches before recommending RAG:
          </p>

          {/* Decision Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Approach</th>
                  <th className="text-left p-3 font-medium">Pros</th>
                  <th className="text-left p-3 font-medium">Cons</th>
                  <th className="text-center p-3 font-medium">Fit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 font-medium">Wiki/Docs System</td>
                  <td className="p-3 text-muted-foreground">Low cost, full control</td>
                  <td className="p-3 text-muted-foreground">Still requires manual search</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-medium">Fine-tuned Model</td>
                  <td className="p-3 text-muted-foreground">Highly customized</td>
                  <td className="p-3 text-muted-foreground">Expensive, needs labeled data</td>
                  <td className="p-3 text-center">❌</td>
                </tr>
                <tr className="border-t border-border bg-green-500/5">
                  <td className="p-3 font-medium text-green-600">RAG System ✓</td>
                  <td className="p-3 text-muted-foreground">Cost-effective, real-time updates</td>
                  <td className="p-3 text-muted-foreground">Requires embedding infrastructure</td>
                  <td className="p-3 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-green-600 mb-2">Why RAG Won</h4>
              <p className="text-sm text-muted-foreground">
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
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold">Technical Implementation</h2>
          </div>

          {/* Architecture Diagram */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-xl p-6 font-mono text-sm">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                  <div className="bg-background p-3 rounded-lg border">
                    📄 Documents<br />
                    <span className="text-xs text-muted-foreground">(Word, PDF)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  <div className="bg-background p-3 rounded-lg border">
                    🔧 Chunking<br />
                    <span className="text-xs text-muted-foreground">(~500 tokens)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  <div className="bg-background p-3 rounded-lg border">
                    🧠 Embeddings<br />
                    <span className="text-xs text-muted-foreground">(OpenAI)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  <div className="bg-background p-3 rounded-lg border">
                    💾 Vector DB<br />
                    <span className="text-xs text-muted-foreground">(PostgreSQL)</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-lg border border-primary/30">
                      💬 User Query
                    </div>
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                    <div className="bg-background p-3 rounded-lg border">
                      🔍 Similarity Search<br />
                      <span className="text-xs text-muted-foreground">(Top 5 chunks)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                    <div className="bg-background p-3 rounded-lg border">
                      🤖 LLM + Context<br />
                      <span className="text-xs text-muted-foreground">(GPT-4)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                    <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                      ✅ Answer
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Decisions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Why OpenAI Embeddings?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Tested against open-source alternatives. OpenAI's ada-002 gave best
                  results for procedural/operational text with minimal tuning.
                  Cost: ~$0.0001 per document chunk.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Chunk Size Tuning</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Started with 1000 tokens, reduced to 500 after testing. Smaller chunks
                  gave more precise retrieval for specific procedures. Added 50-token
                  overlap to preserve context.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Similarity Threshold</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Set at 0.78 after testing. Lower values returned irrelevant content,
                  higher values missed valid matches. Retrieve top 5 chunks for context.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">PostgreSQL + pgvector</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Chose over dedicated vector DBs for simplicity. Same database for
                  app data and vectors. Easy to deploy, maintain, and backup.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Results */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.6 }}
          id="results"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Results & Impact</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Quantitative Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span><strong>23 documents</strong> consolidated into searchable system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span><strong>~70% reduction</strong> in time to find procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span><strong>Sub-second</strong> query response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span><strong>$15-20/month</strong> total operational cost</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Qualitative Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground">
                    "I can actually find what I need now without bothering Sarah."
                    <span className="block mt-1 text-xs not-italic">— New Hire</span>
                  </blockquote>
                  <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground">
                    "Training time is noticeably shorter. Staff are more confident."
                    <span className="block mt-1 text-xs not-italic">— Operations Manager</span>
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
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold">Lessons Learned</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-green-600">What Worked</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Simple UI with single search box</li>
                  <li>• Source citations for trust</li>
                  <li>• Incremental document updates</li>
                  <li>• Real user testing throughout</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-yellow-600">What I'd Change</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Add feedback loop for answer quality</li>
                  <li>• Build admin UI for doc management</li>
                  <li>• Implement usage analytics earlier</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-blue-600">Surprises</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
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
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Tech Stack</h2>
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
                className="px-3 py-1.5 text-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.9 }}
          className="bg-muted/30 rounded-2xl p-8 text-center space-y-4 border border-border/50"
        >
          <h3 className="text-xl font-bold">Interested in Similar Solutions?</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            I build AI systems that solve real operational problems. Whether it's
            knowledge management, process automation, or decision support — let's talk.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/fit">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                Check Fit for Your Role
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/portfolio">
              <span className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors cursor-pointer">
                View More Projects
                <ExternalLink className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
