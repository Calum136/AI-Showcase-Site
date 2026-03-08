import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Brain,
  Database,
  Lightbulb,
  Search,
  Settings,
  Target,
  Zap,
  BookOpen,
  GitBranch,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import { Link } from "wouter";
import { ContactDialog } from "@/components/ContactDialog";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function OpenBrainContent() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <motion.div {...fadeIn} className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Case Study
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-display">
            Open Brain + Project Memory
          </h1>
          <p className="text-xl text-brand-brown/80 max-w-2xl mx-auto">
            A persistent memory layer for AI assistants — so every Claude session
            starts with full context, no re-explaining, no lost decisions.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">2</div>
              <div className="text-xs text-brand-brown/70">MCP Servers</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">24+</div>
              <div className="text-xs text-brand-brown/70">Thoughts Stored</div>
            </div>
            <div className="text-center p-4 bg-brand-stone rounded-xl">
              <div className="text-2xl font-bold text-brand-copper">0s</div>
              <div className="text-xs text-brand-brown/70">Context Recall</div>
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
                  AI assistants have no memory between sessions. Corrections, preferences, and project context are lost every time.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Stakes</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Hours re-explaining context. Decisions repeated. Mistakes not learned from. AI assistants that never get better at working with you.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Solution</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Two-layer MCP system. Open Brain captures free-form thoughts with semantic search (pgvector embeddings). Project Memory tracks structured project state via CLAUDE.md files.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-brand-copper uppercase tracking-wide">Outcome</span>
                <p className="text-sm text-brand-brown/80 mt-1">
                  Every Claude session starts with full context. Decisions persist. Corrections compound. Project state queryable in natural language.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs font-medium text-brand-brown/60">Stack:</span>
                {["TypeScript", "Supabase", "pgvector", "Deno", "OpenRouter", "MCP"].map((t) => (
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
                AI assistants are stateless. Every session starts from zero — you correct the
                same mistakes, re-explain the same preferences, re-describe the same project
                context. The longer you work with AI tools, the more this compounds.
              </p>
              <p className="text-brand-brown/80">
                Your accumulated knowledge about <strong className="text-brand-charcoal">how to work together</strong>{" "}
                never persists. Platform memory features (Claude, ChatGPT) are intentional lock-in,
                siloed per tool, and not agent-readable.
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand-red/20 bg-brand-red/5">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-brand-charcoal mb-3">What's Lost Every Session</h4>
              <ul className="space-y-1.5 text-sm text-brand-brown/80">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-red mt-0.5 shrink-0" />
                  <span>Project decisions and their reasoning</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-red mt-0.5 shrink-0" />
                  <span>Corrections and the rules they imply</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-red mt-0.5 shrink-0" />
                  <span>People and relationship context</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-red mt-0.5 shrink-0" />
                  <span>Technical preferences and patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-red mt-0.5 shrink-0" />
                  <span>Work-in-progress state across sessions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.section>

        {/* Origin & Credit */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.25 }}
          id="origin-&-credit"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-copper/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-brand-copper" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Origin & Credit</h2>
          </div>

          <Card className="border-brand-copper/20 bg-brand-copper/5">
            <CardContent className="pt-6 space-y-4">
              <p className="text-brand-brown/80">
                The Open Brain concept and architecture were designed and published by{" "}
                <strong className="text-brand-charcoal">Nate</strong> on his{" "}
                <a
                  href="https://substack.com/@natesnewsletter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-copper hover:underline"
                >
                  Substack
                </a>{" "}
                and{" "}
                <a
                  href="https://www.youtube.com/watch?v=2JiMmye2ezg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-copper hover:underline"
                >
                  YouTube
                </a>
                . His core insight: <strong className="text-brand-charcoal">memory architecture determines
                agent capability more than model selection</strong>.
              </p>
              <p className="text-brand-brown/80">
                My adaptation: I built it on my own stack (Supabase Edge Functions, OpenRouter
                for embeddings instead of direct OpenAI calls) and extended the concept with the{" "}
                <strong className="text-brand-charcoal">Project Memory</strong> layer — a structured
                project state system using CLAUDE.md files exposed via a second MCP server. The
                two layers together create a complete context system.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* The Architecture */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.3 }}
          id="the-architecture"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-charcoal" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">The Architecture</h2>
          </div>

          <Card className="border-surface-line/50">
            <CardContent className="pt-6 space-y-4">
              <p className="text-brand-brown/80">
                Two complementary MCP servers on a shared Supabase backend. One for free-form
                knowledge (Open Brain), one for structured project state (Project Memory).
                Both connect to Claude Code, Claude Desktop, and claude.ai simultaneously.
              </p>
            </CardContent>
          </Card>

          {/* Architecture Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-brand-copper" />
                  Open Brain — Capture & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Free-form thought capture with auto-classification (decision, insight, person_note,
                  idea, action_item). Semantic search via pgvector embeddings — find things by
                  meaning, not keywords.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-brand-copper" />
                  Project Memory — Structured State
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  CLAUDE.md files per project with standardized fields: status, next actions, rules,
                  completion %. Session notes, decision logs, priority tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand-copper" />
                  Supabase Backend
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  PostgreSQL with pgvector extension. Deno Edge Functions serving MCP protocol.
                  OpenRouter for embedding generation. Single deployment, zero infrastructure management.
                </p>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-copper" />
                  MCP Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-brand-brown/80">
                <p>
                  Model Context Protocol connects to Claude Code (user scope), Claude Desktop
                  (mcp-remote), and claude.ai. Tools auto-available in every session via
                  Streamable HTTP transport.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.4 }}
          id="how-it-works"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-brown/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-brand-brown" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">How It Works</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-surface-line rounded-xl overflow-hidden">
              <thead className="bg-brand-stone/50">
                <tr>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Trigger</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">System</th>
                  <th className="text-left p-3 font-medium text-brand-charcoal">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">Session start</td>
                  <td className="p-3 text-brand-brown/80">Project Memory</td>
                  <td className="p-3 text-brand-brown/80">Load current priorities and relevant project state</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">"Remember this"</td>
                  <td className="p-3 text-brand-brown/80">Open Brain</td>
                  <td className="p-3 text-brand-brown/80">Capture thought, auto-classify, generate embedding</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">Decision made</td>
                  <td className="p-3 text-brand-brown/80">Both</td>
                  <td className="p-3 text-brand-brown/80">Log decision with context and reasoning to project + brain</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">Correction given</td>
                  <td className="p-3 text-brand-brown/80">Open Brain</td>
                  <td className="p-3 text-brand-brown/80">Capture correction, update lessons learned</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">End of session</td>
                  <td className="p-3 text-brand-brown/80">Project Memory</td>
                  <td className="p-3 text-brand-brown/80">Add session note with outcomes and next steps</td>
                </tr>
                <tr className="border-t border-surface-line">
                  <td className="p-3 font-medium text-brand-charcoal">Search for context</td>
                  <td className="p-3 text-brand-brown/80">Open Brain</td>
                  <td className="p-3 text-brand-brown/80">Semantic similarity search across all captured thoughts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Results */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.5 }}
          id="results"
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-moss/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-brand-moss" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Results</h2>
          </div>

          <div className="space-y-4">
            <Card className="border-surface-line/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-copper" />
                  What Changed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-brand-brown">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">24+ thoughts</strong> captured and embedded — decisions, insights, corrections, person notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">8+ projects</strong> tracked with structured state, next actions, and session history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">Every session</strong> starts with full context — zero re-explaining required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">Self-improving loop</strong> — corrections compound into permanent rules across all sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-moss mt-0.5" />
                    <span><strong className="text-brand-charcoal">$0/month</strong> additional cost — Supabase free tier + minimal OpenRouter API calls</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-surface-line/50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-brand-charcoal mb-4">System Flow</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="px-3 py-1.5 bg-brand-copper/10 text-brand-copper rounded-lg font-medium">Thought</span>
                    <ArrowRight className="w-4 h-4 text-brand-brown/40" />
                    <span className="px-3 py-1.5 bg-brand-stone rounded-lg text-brand-brown">Classify</span>
                    <ArrowRight className="w-4 h-4 text-brand-brown/40" />
                    <span className="px-3 py-1.5 bg-brand-stone rounded-lg text-brand-brown">Embed</span>
                    <ArrowRight className="w-4 h-4 text-brand-brown/40" />
                    <span className="px-3 py-1.5 bg-brand-moss/10 text-brand-moss rounded-lg font-medium">pgvector</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="px-3 py-1.5 bg-brand-copper/10 text-brand-copper rounded-lg font-medium">Query</span>
                    <ArrowRight className="w-4 h-4 text-brand-brown/40" />
                    <span className="px-3 py-1.5 bg-brand-stone rounded-lg text-brand-brown">Semantic Search</span>
                    <ArrowRight className="w-4 h-4 text-brand-brown/40" />
                    <span className="px-3 py-1.5 bg-brand-stone rounded-lg text-brand-brown">Context</span>
                    <ArrowRight className="w-4 h-4 text-brand-brown/40" />
                    <span className="px-3 py-1.5 bg-brand-moss/10 text-brand-moss rounded-lg font-medium">Claude</span>
                  </div>
                </div>
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
                  "Origin & Credit",
                  "The Architecture",
                  "How It Works",
                  "Results",
                  "Design Decisions",
                  "Self-Improving Loop",
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

            {/* Credit & Inspiration */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.45 }}
            >
              <Card className="border-brand-copper/20 bg-brand-copper/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-brand-copper" />
                    Credit & Inspiration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-brown/80 space-y-2">
                  <p>
                    Open Brain concept by <strong className="text-brand-charcoal">Nate</strong> —
                    agent-readable memory architecture for AI tools.
                  </p>
                  <div className="flex flex-col gap-1">
                    <a
                      href="https://substack.com/@natesnewsletter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-copper hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Nate's Substack
                    </a>
                    <a
                      href="https://www.youtube.com/watch?v=2JiMmye2ezg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-copper hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> YouTube — "Open Brain"
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Design Decisions */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.55 }}
              id="design-decisions"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-charcoal" />
                    Design Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-brown/80 space-y-3">
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Two Systems, Not One</h4>
                    <p>Thoughts are unstructured and searchable by meaning. Project state is structured and queryable by field. Mixing them would compromise both.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Supabase Over Custom</h4>
                    <p>Free tier, managed Postgres, built-in pgvector, Edge Functions for MCP. Zero ops burden.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Streamable HTTP</h4>
                    <p>SSE incompatible with serverless (no shared session state). Stateless POST works with Deno Edge Functions.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">CLAUDE.md Over Database</h4>
                    <p>Project state in files means it's version-controlled, human-readable, and editable outside AI sessions.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Self-Improving Loop */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.7 }}
              id="self-improving-loop"
            >
              <Card className="border-surface-line/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Search className="w-4 h-4 text-brand-copper" />
                    Self-Improving Loop
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-brown/80 space-y-3">
                  <div>
                    <h4 className="font-semibold text-brand-moss mb-1">How It Compounds</h4>
                    <p>Correction → capture_thought → Correction Log → Lessons Learned → AI Usage Patterns → CLAUDE.md rules</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-copper mb-1">Every Mistake Becomes a Rule</h4>
                    <p>The brain accumulates context. Each correction makes every future session smarter.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-1">Cross-Project Learning</h4>
                    <p>Insights from one project are available in all sessions. No context is siloed.</p>
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
                      "TypeScript",
                      "Supabase",
                      "pgvector",
                      "Deno",
                      "OpenRouter",
                      "MCP Protocol",
                      "Obsidian",
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
  );
}

export default function OpenBrainCaseStudy() {
  return (
    <Layout>
      <OpenBrainContent />
    </Layout>
  );
}
