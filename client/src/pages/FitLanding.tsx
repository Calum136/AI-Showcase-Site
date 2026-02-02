import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  User,
  ArrowRight,
  Target,
  Clock,
  Zap,
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
} from "lucide-react";
import { ContactDialog } from "@/components/ContactDialog";
import type { FitAssessmentOutput } from "@shared/fitAssessmentSchema";

const MAX_CHARS = 10000;

const SAMPLE_INPUT = `Senior Operations Manager - Tech Startup

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
- Background in scaling operations from scratch`;

type AssessmentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: FitAssessmentOutput }
  | { status: "error"; message: string };

export default function FitLanding() {
  const [inputText, setInputText] = useState("");
  const [state, setState] = useState<AssessmentState>({ status: "idle" });

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

      setState({ status: "success", data: result.data });
    } catch (err) {
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_INPUT);
    setState({ status: "idle" });
  };

  const handleReset = () => {
    setInputText("");
    setState({ status: "idle" });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Compact Hero */}
        <div className="text-center space-y-3">
          <motion.h1
            className="text-3xl md:text-4xl font-bold tracking-tight text-brand-red"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Test the Fit. See the Analysis.
          </motion.h1>

          <motion.p
            className="text-lg text-brand-brown max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Paste a job description. Get a structured breakdown of alignment,
            gaps, and next steps.
          </motion.p>
        </div>

        {/* 3:1 Grid Layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* LEFT COLUMN - Assessment (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Card */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-brand-charcoal text-lg">
                  <FileText className="h-5 w-5 text-brand-copper" />
                  Paste job description or workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Paste the job description, role requirements, or workflow description here..."
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
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

                  <Button
                    variant="outline"
                    onClick={handleLoadSample}
                    disabled={state.status === "loading"}
                    className="h-11 px-5 rounded-xl"
                  >
                    Load Sample
                  </Button>

                  {state.status === "success" && (
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      className="h-11 px-5 rounded-xl"
                    >
                      Start Over
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN - Sidebar (1 col) */}
          <div className="space-y-5">
            {/* Guided Chat Card */}
            <Card className="group rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Link href="/fit/chat">
                <CardContent className="p-5 space-y-4">
                  <div className="h-10 w-10 rounded-lg bg-brand-copper/10 flex items-center justify-center group-hover:bg-brand-copper/20 transition-colors">
                    <MessageSquare className="h-5 w-5 text-brand-copper" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-brand-charcoal">
                      Guided Conversation
                    </h3>
                    <p className="text-sm text-brand-brown/80 leading-relaxed">
                      8-12 questions to surface bottlenecks and improvement
                      opportunities.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-10 text-sm font-medium group-hover:border-brand-copper transition-colors"
                  >
                    Start Chat
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            {/* Contact Card */}
            <Card className="group rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-brand-moss/10 flex items-center justify-center group-hover:bg-brand-moss/20 transition-colors">
                  <User className="h-5 w-5 text-brand-moss" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-brand-charcoal">
                    Connect with Calum
                  </h3>
                  <p className="text-sm text-brand-brown/80 leading-relaxed">
                    Reach out via email, phone, or LinkedIn.
                  </p>
                </div>

                <ContactDialog
                  triggerClassName="w-full rounded-xl h-10 text-sm font-medium border border-surface-line bg-transparent hover:border-brand-copper transition-all inline-flex items-center justify-center"
                  triggerLabel="View Contact Info"
                />
              </CardContent>
            </Card>

            {/* What to Expect - Compact */}
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-semibold text-brand-charcoal mb-4">
                  What to Expect
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-brand-copper mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-brand-charcoal">
                        Quick Analysis
                      </p>
                      <p className="text-xs text-brand-brown/70">
                        Results in seconds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-4 w-4 text-brand-copper mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-brand-charcoal">
                        Systems Focus
                      </p>
                      <p className="text-xs text-brand-brown/70">
                        Bottlenecks, not symptoms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-4 w-4 text-brand-copper mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-brand-charcoal">
                        Actionable Output
                      </p>
                      <p className="text-xs text-brand-brown/70">
                        Gaps, risks, next steps
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Note */}
            <p className="text-xs text-surface-line text-center px-2">
              Nothing stored. Session data discarded after use.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
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
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {data.fitScore}
              </span>
              <span className="text-sm text-brand-brown mt-1">Fit Score</span>
            </div>

            {/* Summary */}
            <div className="flex-1">
              <h3 className="font-semibold text-brand-charcoal mb-2">Summary</h3>
              <p className="text-brand-brown leading-relaxed text-sm">
                {data.summary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main sections grid */}
      <div className="grid md:grid-cols-2 gap-5">
        <ResultSection
          title="Strengths"
          icon={<TrendingUp className="h-4 w-4 text-brand-moss" />}
          items={data.strengths}
          iconColor="text-brand-moss"
        />
        <ResultSection
          title="Gaps"
          icon={<AlertTriangle className="h-4 w-4 text-brand-copper" />}
          items={data.gaps}
          iconColor="text-brand-copper"
        />
        <ResultSection
          title="Risks"
          icon={<AlertCircle className="h-4 w-4 text-brand-red" />}
          items={data.risks}
          iconColor="text-brand-red"
        />
        <ResultSection
          title="Next Steps"
          icon={<Lightbulb className="h-4 w-4 text-brand-copper" />}
          items={data.recommendedNextSteps}
          iconColor="text-brand-copper"
          numbered
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
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  iconColor: string;
  numbered?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="font-semibold text-brand-charcoal text-sm">{title}</h3>
        </div>
        <ul className="space-y-2">
          {items.slice(0, 5).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-brand-brown">
              {numbered ? (
                <span className={`font-semibold ${iconColor} text-xs`}>
                  {i + 1}.
                </span>
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
