import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Send,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Tag,
  Briefcase,
  Shield,
  Sparkles,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import type { FitAssessmentOutput } from "@shared/fitAssessmentSchema";

const MAX_CHARS = 10000;

const EXAMPLE_JDS = {
  operations: {
    label: "Ops Manager",
    content: `Senior Operations Manager - Tech Startup

About the Role:
We're looking for a Senior Operations Manager to build and scale our operational infrastructure. You'll own process design, automation initiatives, and cross-functional workflows.

Responsibilities:
- Design and implement scalable operational processes
- Lead automation initiatives using modern tools (Zapier, custom integrations)
- Build dashboards and reporting systems for executive visibility
- Manage vendor relationships and optimize spend
- Collaborate with Engineering and Product on tooling needs

Requirements:
- 3-5 years operations experience, preferably in tech/startup
- Strong systems thinking and process design skills
- Experience with data analysis and business intelligence tools
- Comfort with ambiguity and fast-paced environments
- Excellent communication and stakeholder management

Nice to Have:
- SQL or Python skills
- Experience with AI/automation tools
- Background in scaling operations from scratch`,
  },
  dataAnalyst: {
    label: "Data Analyst",
    content: `Data Analyst - Business Intelligence

We're seeking a Data Analyst to transform raw data into actionable insights that drive business decisions.

Responsibilities:
- Build and maintain dashboards and reports using Power BI/Tableau
- Write SQL queries to extract, transform, and analyze data
- Partner with stakeholders to define KPIs and success metrics
- Perform ad-hoc analysis to answer business questions
- Document data sources and maintain data dictionary

Requirements:
- 2-4 years experience in data analysis or BI role
- Proficient in SQL and at least one BI tool
- Strong Excel/Google Sheets skills
- Experience with data quality and validation
- Clear communication of technical concepts to non-technical audiences

Nice to Have:
- Python or R for analysis
- Experience with data warehousing
- Understanding of statistical methods`,
  },
  aiSystems: {
    label: "AI Systems",
    content: `AI Systems Engineer

Join our team building AI-powered products that solve real business problems.

Responsibilities:
- Design and implement RAG systems and AI workflows
- Build integrations with LLM APIs (OpenAI, Anthropic)
- Develop evaluation frameworks for AI system quality
- Create documentation and training for AI features
- Collaborate with product to translate requirements into technical solutions

Requirements:
- Experience building production AI/ML systems
- Proficiency in Python or TypeScript
- Understanding of LLM capabilities and limitations
- Experience with vector databases and embeddings
- Strong problem-solving and debugging skills

Nice to Have:
- Experience with prompt engineering
- Knowledge of RAG architectures
- Background in full-stack development`,
  },
};

type AssessmentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: FitAssessmentOutput }
  | { status: "error"; message: string };

type ExampleKey = keyof typeof EXAMPLE_JDS;

export default function FitLanding() {
  const [inputText, setInputText] = useState("");
  const [state, setState] = useState<AssessmentState>({ status: "idle" });
  const [activeExample, setActiveExample] = useState<ExampleKey | null>(null);

  const charCount = inputText.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit =
    inputText.trim().length > 0 && !isOverLimit && state.status !== "loading";

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setState({ status: "loading" });

    try {
      const response = await fetch("/api/fit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: inputText.trim() }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setState({
          status: "error",
          message: result.error || "Something went wrong. Please try again.",
        });
        return;
      }

      // Save JD text for the chat page to pick up
      try { localStorage.setItem("fitJdText", inputText.trim()); } catch {}
      setState({ status: "success", data: result.data });
    } catch (err) {
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const handleLoadExample = (key: ExampleKey) => {
    setInputText(EXAMPLE_JDS[key].content);
    setActiveExample(key);
    setState({ status: "idle" });
  };

  const handleReset = () => {
    setInputText("");
    setActiveExample(null);
    setState({ status: "idle" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="text-center space-y-3">
          <motion.h1
            className="text-3xl md:text-4xl font-bold tracking-tight text-brand-red leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Don't hire blindly.<br />
            Test the role.<br />
            Reveal the systems.
          </motion.h1>

          <motion.p
            className="text-sm text-brand-brown/70 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Paste a job description or try an example to see how I analyze role fit.
          </motion.p>

          {/* Trust Badge */}
          <motion.div
            className="flex items-center justify-center gap-2 text-xs text-brand-brown/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-3 h-3 text-brand-copper" />
            <span>Powered by Claude AI</span>
            <span className="text-surface-line">•</span>
            <span>Built by Calum Kershaw</span>
          </motion.div>

          {/* Back to chooser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link href="/fit">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-brand-brown/50 hover:text-brand-brown/70 transition-colors">
                <ArrowRight className="w-3 h-3 rotate-180" />
                Back to evaluation options
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Video/Image Placeholder - for future use */}
        {/*
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="aspect-video bg-brand-stone/50 rounded-2xl border-2 border-dashed border-surface-line flex items-center justify-center">
            <div className="text-center space-y-2">
              <Play className="w-12 h-12 text-brand-copper/50 mx-auto" />
              <p className="text-sm text-brand-brown/50">Demo video coming soon</p>
            </div>
          </div>
        </motion.div>
        */}

        {/* Main Content */}
        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
            {/* Input Card */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-brand-charcoal text-lg">
                  <FileText className="h-5 w-5 text-brand-copper" />
                  Paste job description or workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Example Tabs */}
                <div className="flex flex-wrap gap-2 pb-2 border-b border-surface-line/30">
                  <span className="text-xs text-brand-brown/60 self-center mr-1">Try example:</span>
                  {(Object.keys(EXAMPLE_JDS) as ExampleKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleLoadExample(key)}
                      disabled={state.status === "loading"}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        activeExample === key
                          ? "bg-brand-copper text-surface-paper"
                          : "bg-brand-stone text-brand-brown hover:bg-brand-stone/80"
                      }`}
                    >
                      {EXAMPLE_JDS[key].label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Textarea
                    placeholder="Paste the job description, role requirements, or workflow description here..."
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setActiveExample(null);
                      if (state.status === "error") setState({ status: "idle" });
                    }}
                    className="min-h-[160px] resize-y rounded-xl border-surface-line bg-surface-paper text-brand-brown placeholder:text-surface-line focus:border-brand-copper"
                    disabled={state.status === "loading"}
                  />
                  <div
                    className={`absolute bottom-3 right-3 text-xs ${
                      isOverLimit ? "text-brand-red font-medium" : "text-surface-line"
                    }`}
                  >
                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="h-11 px-6 rounded-xl text-base font-medium"
                  >
                    {state.status === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Run Assessment
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {(state.status === "success" || inputText.length > 0) && (
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      className="h-11 px-5 rounded-xl"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Area */}
            <AnimatePresence mode="wait">
              {state.status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSkeleton />
                </motion.div>
              )}

              {state.status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="rounded-2xl border-brand-red/30 bg-brand-red/5">
                    <CardContent className="p-6 flex items-start gap-4">
                      <AlertCircle className="h-6 w-6 text-brand-red flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-medium text-brand-red">
                          Analysis Failed
                        </p>
                        <p className="text-brand-brown">{state.message}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setState({ status: "idle" })}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {state.status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <AssessmentResults data={state.data} />

                  {/* Post-Results CTA */}
                  <Card className="rounded-2xl bg-surface-ink border-surface-line/30">
                    <CardContent className="p-6 text-center space-y-4">
                      <h3 className="text-lg font-semibold text-surface-paper">
                        Want to dig deeper?
                      </h3>
                      <p className="text-sm text-surface-paper/70 max-w-md mx-auto">
                        Talk through the biggest operational bottleneck with my diagnostic tool — it'll use this job description as context.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/fit/chat">
                          <Button className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper">
                            <MessageSquare className="mr-2 w-4 h-4" />
                            Discuss This Further
                          </Button>
                        </Link>
                        <Link href="/case-study">
                          <Button
                            variant="outline"
                            className="rounded-xl border-surface-paper/30 text-surface-paper hover:bg-surface-paper/10"
                          >
                            See the Case Study
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* How It Works - Expandable */}
            <MethodologySection />
        </motion.div>
      </div>
    </Layout>
  );
}

function MethodologySection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="rounded-2xl border-surface-line/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-brand-stone/30 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-brand-copper" />
          <span className="font-medium text-brand-charcoal">How does this evaluation work?</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-brand-brown/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 pb-5 px-5 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-copper/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-brand-copper" />
                  </div>
                  <h4 className="font-medium text-sm text-brand-charcoal">1. Parse & Extract</h4>
                  <p className="text-xs text-brand-brown/70">
                    Claude AI extracts key signals: seniority level, required skills, domain, and core responsibilities.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-copper/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-copper" />
                  </div>
                  <h4 className="font-medium text-sm text-brand-charcoal">2. Match & Score</h4>
                  <p className="text-xs text-brand-brown/70">
                    Compares against my documented experience, skills, and project outcomes to calculate fit score.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-copper/10 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-brand-copper" />
                  </div>
                  <h4 className="font-medium text-sm text-brand-charcoal">3. Honest Assessment</h4>
                  <p className="text-xs text-brand-brown/70">
                    Returns strengths, gaps, and risks with transparency. No inflated scores—honest fit evaluation.
                  </p>
                </div>
              </div>

              <div className="bg-brand-stone/50 rounded-xl p-4 mt-4">
                <p className="text-xs text-brand-brown/80">
                  <strong className="text-brand-charcoal">Why build this?</strong> Most job applications are a black box.
                  This tool demonstrates structured AI analysis while giving you real insight into role alignment.
                  It's the same systematic approach I apply when building decision support tools for organizations.
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-brand-copper" />
          <span className="text-brand-brown font-medium">Analyzing input...</span>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-surface-line/30 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-surface-line/30 rounded animate-pulse w-full" />
          <div className="h-4 bg-surface-line/30 rounded animate-pulse w-2/3" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-surface-line/20 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentResults({ data }: { data: FitAssessmentOutput }) {
  const fitLevel = data.fitScore >= 70 ? "High" : data.fitScore >= 50 ? "Medium" : "Low";

  const scoreColor =
    data.fitScore >= 70
      ? "text-brand-moss"
      : data.fitScore >= 50
        ? "text-brand-copper"
        : "text-brand-red";

  const scoreBgColor =
    data.fitScore >= 70
      ? "bg-brand-moss/10 border-brand-moss/30"
      : data.fitScore >= 50
        ? "bg-brand-copper/10 border-brand-copper/30"
        : "bg-brand-red/10 border-brand-red/30";

  const fitBadgeColor =
    data.fitScore >= 70
      ? "bg-brand-moss text-surface-paper"
      : data.fitScore >= 50
        ? "bg-brand-copper text-surface-paper"
        : "bg-brand-red text-surface-paper";

  return (
    <>
      {/* Summary + Score */}
      <Card className="rounded-2xl">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Score Badge */}
            <div
              className={`flex-shrink-0 flex flex-col items-center justify-center p-5 rounded-2xl border ${scoreBgColor}`}
            >
              <span className={`px-3 py-1 text-xs font-bold rounded-full mb-2 ${fitBadgeColor}`}>
                {fitLevel} Fit
              </span>
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {data.fitScore}
              </span>
              <span className="text-xs text-brand-brown/70 mt-1">out of 100</span>
            </div>

            {/* Summary */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-brand-charcoal mb-2">Summary</h3>
                <p className="text-brand-brown leading-relaxed text-sm">
                  {data.summary}
                </p>
              </div>

              {/* Why Hire - Top 3 strengths */}
              {data.strengths.length > 0 && (
                <div className="bg-brand-moss/5 border border-brand-moss/20 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-brand-moss mb-2">Top Match Points</h4>
                  <ul className="space-y-1">
                    {data.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-xs text-brand-brown flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-brand-moss mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Considerations */}
              {data.risks.length > 0 && (
                <div className="bg-brand-stone/30 border border-brand-brown/10 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-brand-brown/60 mb-2">Worth Noting</h4>
                  <ul className="space-y-1">
                    {data.risks.slice(0, 2).map((r, i) => (
                      <li key={i} className="text-xs text-brand-brown/70 flex items-start gap-2">
                        <span className="text-brand-brown/30 mt-0.5">—</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths — full width, leading position */}
      <ResultSection
        title="Strengths"
        icon={<TrendingUp className="h-4 w-4 text-brand-moss" />}
        items={data.strengths}
        iconColor="text-brand-moss"
      />

      {/* Interview Strategy — full width */}
      <ResultSection
        title="Interview Strategy"
        icon={<Lightbulb className="h-4 w-4 text-brand-copper" />}
        items={data.recommendedNextSteps}
        iconColor="text-brand-copper"
        numbered
      />

      {/* Areas to Address + Things to Watch — secondary, side by side */}
      <div className="grid md:grid-cols-2 gap-5">
        <ResultSection
          title="Areas to Address"
          icon={<ArrowRight className="h-4 w-4 text-brand-brown/50" />}
          items={data.gaps}
          iconColor="text-brand-brown/50"
          muted
        />
        <ResultSection
          title="Things to Watch"
          icon={<Shield className="h-4 w-4 text-brand-brown/50" />}
          items={data.risks}
          iconColor="text-brand-brown/50"
          muted
        />
      </div>

      {/* Keywords */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-brand-copper" />
            <h3 className="font-semibold text-brand-charcoal text-sm">
              Keywords
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Signals */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-brand-copper" />
            <h3 className="font-semibold text-brand-charcoal text-sm">
              Role Signals
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-surface-line">Seniority</span>
              <p className="font-medium text-brand-charcoal text-sm">
                {data.roleSignals.seniority}
              </p>
            </div>
            <div>
              <span className="text-xs text-surface-line">Domain</span>
              <p className="font-medium text-brand-charcoal text-sm">
                {data.roleSignals.domain}
              </p>
            </div>
            <div>
              <span className="text-xs text-surface-line">Primary Tools</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.roleSignals.primaryTools.map((tool, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-surface-line">
                Core Responsibilities
              </span>
              <ul className="mt-1 space-y-1">
                {data.roleSignals.coreResponsibilities.slice(0, 4).map((resp, i) => (
                  <li
                    key={i}
                    className="text-xs text-brand-brown flex items-start gap-1.5"
                  >
                    <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-brand-copper" />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ResultSection({
  title,
  icon,
  items,
  iconColor,
  numbered = false,
  muted = false,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  iconColor: string;
  numbered?: boolean;
  muted?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <Card className={`rounded-2xl ${muted ? "border-surface-line/50" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className={`font-semibold text-sm ${muted ? "text-brand-brown/60" : "text-brand-charcoal"}`}>{title}</h3>
        </div>
        <ul className="space-y-2">
          {items.slice(0, muted ? 4 : 8).map((item, i) => (
            <li key={i} className={`flex items-start gap-2 text-sm ${muted ? "text-brand-brown/70" : "text-brand-brown"}`}>
              {numbered ? (
                <span className={`font-semibold ${iconColor} text-xs`}>
                  {i + 1}.
                </span>
              ) : muted ? (
                <span className="text-brand-brown/30 mt-0.5 text-xs">—</span>
              ) : (
                <CheckCircle2
                  className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${iconColor}`}
                />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
