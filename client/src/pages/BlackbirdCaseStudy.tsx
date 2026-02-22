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
  Cpu,
  Database,
  FileText,
  Lightbulb,
  MessageCircle,
  Search,
  Settings,
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

export default function BlackbirdCaseStudy() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <motion.div {...fadeIn} className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Case Study
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-display">
            Blackbird Brewing — Email Automation
          </h1>
          <p className="text-xl text-brand-brown/80 max-w-2xl mx-auto">
            How I built an AI-powered email triage and response system for a Nova Scotia
            brewery, reducing repetitive inbox work while preserving the owner's voice and
            keeping humans in control of every booking.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">500+</div>
              <div className="text-xs text-brand-brown/70">Emails/Month</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">17</div>
              <div className="text-xs text-brand-brown/70">Response Categories</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">~$20/mo</div>
              <div className="text-xs text-brand-brown/70">Operating Cost</div>
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
                  Andy at Blackbird Brewing was spending hours each week answering the same emails — hours, menu questions, booking inquiries, vendor pitches.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Stakes</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Time wasted on repetitive email, direct tone at risk of being lost to automation.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Solution</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Three-layer system: classifier (17 categories), responder (trained on Andy's real emails), Make.com orchestration connecting Gmail to AI engine on Render.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Outcome</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Full pipeline live: Gmail → Make.com → Render → classified response → Gmail action. Routing ~20 emails/day, 500+/month.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs font-medium text-brand-brown/60">Stack:</span>
                {["Make.com", "OpenAI API", "Gmail API", "Node.js", "Render"].map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs bg-brand-stone rounded text-brand-brown">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two-column body: main content left, sidebar right */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* ===== LEFT COLUMN: Main content ===== */}
          <div className="space-y-10">

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
                Andy at Blackbird Brewing was spending hours each week answering the same
                emails — hours, menu questions, booking inquiries, vendor pitches. He needed
                to reclaim that time without losing the <strong className="text-brand-charcoal">direct, no-fluff tone</strong>{" "}
                his customers expected.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* The Approach */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.3 }}
          id="the-approach"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-charcoal" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">The Approach</h2>
          </div>

          <Card className="border-surface-line/50">
            <CardContent className="pt-6 space-y-4">
              <p className="text-brand-brown/80">
                Built a three-layer system: a classifier that reads each incoming email and
                assigns one of 17 categories and 4 action types, a responder that drafts
                replies in Andy's actual voice (extracted from his real email history), and a
                Make.com orchestration layer connecting Gmail to the AI engine hosted on Render.
              </p>
              <p className="text-brand-brown/80">
                The system is designed to never overstep — it never confirms availability,
                never makes exceptions, and escalates anything uncertain to a human draft.
              </p>
            </CardContent>
          </Card>

          {/* Architecture Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-copper" />
                  Classifier Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  OpenAI-powered triage engine — 17 categories covering booking details,
                  vendor sales, spam, complaints, general inquiries, etc.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-brand-copper" />
                  Response Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Trained on Andy's real emails. Signs off "Andrew." Short, direct, zero fluff.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-brand-copper" />
                  Knowledge Base
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Business rules JSON: room names, deposit amounts, minimums, cancellation
                  policy, menu selection deadlines.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand-copper" />
                  Gmail Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Gmail API integration with flag control (GMAIL_ACTIVE env var). Make.com
                  scenario: Gmail Watch → HTTP POST → Router → 5 action paths.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Action Types */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.4 }}
          id="action-types"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-brown/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-brand-brown" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Action Types</h2>
          </div>

          {/* Decision Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-surface-line rounded-xl overflow-hidden">
              <thead className="bg-brand-stone/50">
                <tr>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Action</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Trigger</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">AUTO_REPLY</td>
                  <td className="p-3 text-brand-brown/80">Clear FAQ (hours, menus, general info)</td>
                  <td className="p-3 text-brand-brown/80">Sends response immediately</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">DRAFT_FOR_APPROVAL</td>
                  <td className="p-3 text-brand-brown/80">Booking details, pricing questions</td>
                  <td className="p-3 text-brand-brown/80">Creates Gmail draft for Andy to review</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">ESCALATE</td>
                  <td className="p-3 text-brand-brown/80">Complaints, unusual requests, uncertain</td>
                  <td className="p-3 text-brand-brown/80">Labels email, adds star</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">FLAG_LOW_PRIORITY</td>
                  <td className="p-3 text-brand-brown/80">Real vendors</td>
                  <td className="p-3 text-brand-brown/80">Labels + marks read</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">IGNORE</td>
                  <td className="p-3 text-brand-brown/80">Spam, charity requests, marketing</td>
                  <td className="p-3 text-brand-brown/80">Marks read, no action</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Testing & Results */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.5 }}
          id="testing-&-results"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-moss/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-brand-moss" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Testing & Results</h2>
          </div>

          <div className="space-y-4">
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
                    <span><strong className="text-brand-charcoal">20 mock scenarios</strong> in test harness covering all categories and edge cases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">500+ emails/month</strong> routed — ~20/day across all categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">2 edge cases</strong> found and fixed: charity donation requests and vendor pitches were being treated as general inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">~$20/month</strong> operating cost (OpenAI + Make.com)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">$1,100</strong> fixed price project value</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.section>

          </div>{/* end left column */}

          {/* ===== RIGHT COLUMN: Sidebar ===== */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">

            {/* Table of Contents */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.15 }}
              className="bg-brand-stone/50 rounded-2xl p-5 border border-surface-line/50"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-brand-charcoal text-sm">
                <BookOpen className="w-4 h-4" />
                Contents
              </h3>
              <nav className="flex flex-col gap-1.5 text-sm">
                {[
                  "The Problem",
                  "The Approach",
                  "Action Types",
                  "Testing & Results",
                  "Constraints",
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
              </nav>
            </motion.div>

            {/* Constraints & Tradeoffs */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.55 }}
              id="constraints"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-charcoal" />
                    Constraints & Tradeoffs
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-brown/80 space-y-3">
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Voice Fidelity</h4>
                    <p>Response generator trained on real Andy emails — maintains his direct, short style.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Human-in-the-Loop</h4>
                    <p>Never auto-confirms bookings. All booking replies go to draft for approval.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Edge Cases</h4>
                    <p>Charity requests and vendor pitches originally misclassified — fixed with explicit category rules.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Cost Control</h4>
                    <p>~$20/month operational cost across OpenAI API + Make.com.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lessons Learned */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.7 }}
              id="lessons-learned"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-brand-copper" />
                    Lessons Learned
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-brown/80 space-y-3">
                  <div>
                    <h4 className="font-semibold text-brand-moss mb-1">What Worked</h4>
                    <ul className="space-y-0.5">
                      <li>Real email testing early</li>
                      <li>Voice extraction from actual correspondence</li>
                      <li>Make.com for orchestration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-copper mb-1">What I'd Change</h4>
                    <ul className="space-y-0.5">
                      <li>Add confidence scoring to classifier</li>
                      <li>Build admin dashboard for Andy to tune responses</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Surprises</h4>
                    <ul className="space-y-0.5">
                      <li>Vendor pitches hardest to classify (look like real inquiries)</li>
                      <li>Charity requests needed their own category</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.8 }}
              id="tech-stack"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-brand-copper" />
                    Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Make.com",
                      "OpenAI API",
                      "Gmail API",
                      "Node.js",
                      "Render",
                      "Express",
                    ].map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="px-2 py-0.5 text-xs border-surface-line text-brand-brown"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>{/* end right column */}

        </div>{/* end two-column grid */}

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
