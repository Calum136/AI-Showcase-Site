import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  Lightbulb,
  MessageCircle,
  BookOpen,
  ExternalLink,
  Shield,
  RefreshCw,
  Mail,
  Brain,
  CalendarClock,
} from "lucide-react";
import { Link } from "wouter";
import { ContactDialog } from "@/components/ContactDialog";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function BlackbirdContent() {
  return (
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
          Built a custom OpenAI classifier. Andy had to rewrite every draft.
          Rebuilt around Claude Desktop + Gmail MCP — and eliminated the problem entirely.
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
          <div className="text-center p-4 bg-brand-stone rounded-xl">
            <div className="text-2xl font-bold text-brand-copper">500+</div>
            <div className="text-xs text-brand-brown/70">Emails/Month</div>
          </div>
          <div className="text-center p-4 bg-brand-stone rounded-xl">
            <div className="text-2xl font-bold text-brand-copper">1,049</div>
            <div className="text-xs text-brand-brown/70">Emails Parsed</div>
          </div>
          <div className="text-center p-4 bg-brand-stone rounded-xl">
            <div className="text-2xl font-bold text-brand-copper">0</div>
            <div className="text-xs text-brand-brown/70">Draft Rewrites</div>
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
                Andy at Blackbird Brewing was spending hours each week answering the same emails.
                First build automated the routing — but Andy had to rewrite every single draft before sending.
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Root Cause</span>
              <p className="text-sm text-brand-brown/80 mt-1">
                The OpenAI-based classifier was technically correct but couldn't capture Andy's voice.
                Architecture complexity doesn't fix a model quality problem.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Solution</span>
              <p className="text-sm text-brand-brown/80 mt-1">
                Pivoted to Claude Desktop with Gmail MCP. Parsed 1,049 of Andy's real emails into a
                living knowledge base alongside a business-rules.md. Claude reads the inbox directly
                and drafts in Andy's voice — he reviews, not rewrites.
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Outcome</span>
              <p className="text-sm text-brand-brown/80 mt-1">
                Morning scheduled workflow: Claude drafts overnight arrivals, Andy approves and sends.
                500+/month handled. Zero rewrites.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-medium text-brand-brown/60">Stack:</span>
              {["Claude Desktop", "Gmail MCP", "Cowork", "Node.js"].map((t) => (
                <span key={t} className="px-2 py-0.5 text-xs bg-brand-stone rounded text-brand-brown">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column body */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">

        {/* LEFT COLUMN */}
        <div className="space-y-10">

          {/* The Problem */}
          <motion.section {...fadeIn} transition={{ delay: 0.2 }} id="the-problem" className="space-y-6">
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
                  to reclaim that time without losing the{" "}
                  <strong className="text-brand-charcoal">direct, no-fluff tone</strong>{" "}
                  his customers expected.
                </p>
                <p className="text-brand-brown/80">
                  A $1,100 fixed-price project. Real client. Real inbox. Real pressure to get it right.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Act 1: First Build */}
          <motion.section {...fadeIn} transition={{ delay: 0.3 }} id="act-1-first-build" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-charcoal/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-brand-charcoal" />
              </div>
              <h2 className="text-2xl font-bold text-brand-charcoal">Act 1: The Classifier</h2>
            </div>
            <Card className="border-surface-line/50">
              <CardContent className="pt-6 space-y-4">
                <p className="text-brand-brown/80">
                  Built a three-layer system: a 17-category classifier (OpenAI), a response generator
                  trained on Andy's real email history, and a Make.com orchestration layer connecting
                  Gmail to the engine hosted on Render.
                </p>
                <p className="text-brand-brown/80">
                  The routing logic worked. Emails got classified. Drafts got written. The system was
                  technically functional — 20 mock scenarios, 5 action types, live on the real inbox.
                </p>
              </CardContent>
            </Card>

            {/* v1 action type table */}
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
                    <td className="p-3 text-brand-brown/80">Sends immediately</td>
                  </tr>
                  <tr className="border-t border-surface-line">
                    <td className="p-3 font-medium text-brand-charcoal">DRAFT_FOR_APPROVAL</td>
                    <td className="p-3 text-brand-brown/80">Booking details, pricing questions</td>
                    <td className="p-3 text-brand-brown/80">Creates Gmail draft for Andy to review</td>
                  </tr>
                  <tr className="border-t border-surface-line">
                    <td className="p-3 font-medium text-brand-charcoal">ESCALATE</td>
                    <td className="p-3 text-brand-brown/80">Complaints, unusual requests, uncertain</td>
                    <td className="p-3 text-brand-brown/80">Labels + stars email</td>
                  </tr>
                  <tr className="border-t border-surface-line">
                    <td className="p-3 font-medium text-brand-charcoal">FLAG_LOW_PRIORITY</td>
                    <td className="p-3 text-brand-brown/80">Real vendors</td>
                    <td className="p-3 text-brand-brown/80">Labels + marks read</td>
                  </tr>
                  <tr className="border-t border-surface-line">
                    <td className="p-3 font-medium text-brand-charcoal">IGNORE</td>
                    <td className="p-3 text-brand-brown/80">Spam, charity, marketing</td>
                    <td className="p-3 text-brand-brown/80">Marks read, no action</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* The Pivot */}
          <motion.section {...fadeIn} transition={{ delay: 0.4 }} id="the-pivot" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-brand-red" />
              </div>
              <h2 className="text-2xl font-bold text-brand-charcoal">The Pivot</h2>
            </div>
            <Card className="border-brand-red/20 bg-brand-red/5">
              <CardContent className="pt-6 space-y-4">
                <p className="text-brand-brown/80">
                  Andy tested the system with real emails and was severely underwhelmed.{" "}
                  <strong className="text-brand-charcoal">He had to rewrite every single draft before sending.</strong>{" "}
                  Not tweak — fully rewrite. The responses were technically correct but tonally wrong.
                </p>
                <p className="text-brand-brown/80">
                  This is a voice-fidelity problem, not an architecture problem. Adding more routing
                  logic or tuning the classifier wouldn't fix it. The model simply couldn't hold
                  Andy's specific, terse, no-fluff style across the variety of email types.
                </p>
                <p className="text-brand-brown/80">
                  The right call: abandon the custom stack and use the best available model with the
                  richest possible context.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Act 2: New Architecture */}
          <motion.section {...fadeIn} transition={{ delay: 0.5 }} id="act-2-claude-desktop" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-moss/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-brand-moss" />
              </div>
              <h2 className="text-2xl font-bold text-brand-charcoal">Act 2: Claude Desktop</h2>
            </div>
            <Card className="border-surface-line/50">
              <CardContent className="pt-6 space-y-4">
                <p className="text-brand-brown/80">
                  Rebuilt from scratch around Claude Desktop Pro with Gmail MCP. Instead of
                  engineering around the model's limitations, the new architecture leans into
                  Claude's strengths: deep context, voice matching, and judgment.
                </p>
                <p className="text-brand-brown/80">
                  A streaming MBOX parser processed Andy's entire Gmail history — 3,825 conversation
                  threads from 5,765 kept emails. The 1,049 most useful emails became Claude's
                  knowledge base alongside a <code className="text-brand-copper text-xs">business-rules.md</code>{" "}
                  capturing every policy, room detail, deposit amount, and cancellation rule.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-copper" />
                    Gmail MCP
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-brown/80">
                  Claude reads the live inbox directly — no webhook, no Make.com, no middleware.
                  It sees threads, subject lines, and history just like Andy does.
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
                  1,049 parsed emails as context. <code className="text-brand-copper text-xs">business-rules.md</code> covers
                  rooms, pricing, policies, and deposit rules. Andy corrects Claude in chat;
                  corrections get synced back to the rules file.
                </CardContent>
              </Card>

              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-brand-copper" />
                    Morning Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-brown/80">
                  Cowork scheduled task runs each morning. Claude drafts responses for overnight
                  arrivals. Andy opens his inbox, reviews the drafts, and approves the ones that
                  are ready to send.
                </CardContent>
              </Card>

              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-brand-copper" />
                    Correction Loop
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-brand-brown/80">
                  When Andy doesn't like a draft, he tells Claude in the chat. That correction
                  gets incorporated immediately and the permanent fix goes back into
                  <code className="text-brand-copper text-xs"> business-rules.md</code>.
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Results */}
          <motion.section {...fadeIn} transition={{ delay: 0.6 }} id="results" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-moss/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-brand-moss" />
              </div>
              <h2 className="text-2xl font-bold text-brand-charcoal">Results</h2>
            </div>
            <Card className="border-surface-line/50">
              <CardContent className="pt-6">
                <ul className="space-y-3 text-sm text-brand-brown">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5 shrink-0" />
                    <span><strong className="text-brand-charcoal">500+ emails/month</strong> handled — 17 categories, 5 action types still in use as a classification reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5 shrink-0" />
                    <span><strong className="text-brand-charcoal">1,049 emails parsed</strong> into Claude's Project knowledge base</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5 shrink-0" />
                    <span><strong className="text-brand-charcoal">Zero draft rewrites</strong> — Andy reviews and approves, not fixes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5 shrink-0" />
                    <span><strong className="text-brand-charcoal">$1,100 fixed price</strong> — delivered in full including the pivot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5 shrink-0" />
                    <span><strong className="text-brand-charcoal">Included in Claude Desktop Pro</strong> — no incremental API cost</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.section>

        </div>{/* end left column */}

        {/* RIGHT COLUMN: Sidebar */}
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
                "Act 1: First Build",
                "The Pivot",
                "Act 2: Claude Desktop",
                "Results",
                "Lessons Learned",
                "Tech Stack",
              ].map((item, i) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/[\s:]/g, "-").replace(/--+/g, "-")}`}
                  className="text-brand-brown/70 hover:text-brand-copper transition-colors"
                >
                  {i + 1}. {item}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Constraints & Tradeoffs */}
          <motion.div {...fadeIn} transition={{ delay: 0.55 }} id="constraints">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-charcoal" />
                  Constraints & Tradeoffs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-brand-brown/80 space-y-3">
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-1">Human-in-the-Loop</h4>
                  <p>Andy reviews every draft before sending. Claude never sends autonomously — that's by design.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-1">Claude Desktop Dependency</h4>
                  <p>System requires Claude Desktop Pro subscription. No custom infra to maintain, but tied to Anthropic's pricing.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-1">Knowledge Base Drift</h4>
                  <p>Policies change. business-rules.md needs periodic syncs from Andy's chat corrections.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lessons Learned */}
          <motion.div {...fadeIn} transition={{ delay: 0.7 }} id="lessons-learned">
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
                    <li>Real email testing before declaring done</li>
                    <li>Pivoting when client feedback was clear</li>
                    <li>Richest context beats clever architecture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-red mb-1">What Failed</h4>
                  <ul className="space-y-0.5">
                    <li>OpenAI couldn't hold a specific person's voice</li>
                    <li>Make.com + Render added friction without quality gains</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-charcoal mb-1">Key Insight</h4>
                  <p>For voice-sensitive work, model quality trumps architecture complexity. Use the best model first.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tech Stack */}
          <motion.div {...fadeIn} transition={{ delay: 0.8 }} id="tech-stack">
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
                    "Claude Desktop Pro",
                    "Gmail MCP",
                    "Cowork",
                    "Node.js",
                    "MBOX Parser",
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
              Talk to My Agent <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function BlackbirdCaseStudy() {
  return (
    <Layout>
      <BlackbirdContent />
    </Layout>
  );
}
