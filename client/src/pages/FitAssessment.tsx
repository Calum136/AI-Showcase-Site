import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Tag,
  Briefcase,
} from "lucide-react";
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

export default function FitAssessment() {
  const [inputText, setInputText] = useState("");
  const [state, setState] = useState<AssessmentState>({ status: "idle" });

  const charCount = inputText.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit = inputText.trim().length > 0 && !isOverLimit && state.status !== "loading";

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
      <div className="max-w-[1100px] mx-auto py-8 md:py-16 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-brand-red leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            See How I Turn Messy Requirements Into Structured Fit Analysis
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-brand-brown leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Paste a job description or workflow. Get a clear breakdown of fit, gaps, risks, and next steps.
          </motion.p>
        </div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-brand-charcoal">
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
                  className="min-h-[200px] resize-y rounded-xl border-surface-line bg-surface-paper text-brand-brown placeholder:text-surface-line focus:border-brand-copper"
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

              <p className="text-sm text-surface-line">
                Works best with detailed job descriptions, role requirements, or workflow specifications.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 sm:flex-none h-12 px-8 rounded-xl text-base font-medium"
                >
                  {state.status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Run Assessment
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLoadSample}
                  disabled={state.status === "loading"}
                  className="h-12 px-6 rounded-xl text-base"
                >
                  Load Sample
                </Button>

                {state.status === "success" && (
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="h-12 px-6 rounded-xl text-base"
                  >
                    Start Over
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Output Area */}
        <AnimatePresence mode="wait">
          {state.status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
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
                    <p className="font-medium text-brand-red">Analysis Failed</p>
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

        {/* What This Demonstrates */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="rounded-2xl bg-surface-ink text-surface-paper">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">What This Demonstrates</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "Converts unstructured language into structured systems",
                  "Produces decision-ready summaries with quantified confidence",
                  "Highlights risks, missing info, and next actions",
                  "Mirrors how I approach real workflow problems",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-copper flex-shrink-0 mt-0.5" />
                    <span className="text-surface-paper/90">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-brand-copper" />
          <span className="text-brand-brown font-medium">Analyzing input...</span>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-surface-line/30 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-surface-line/30 rounded animate-pulse w-full" />
          <div className="h-4 bg-surface-line/30 rounded animate-pulse w-2/3" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-surface-line/20 rounded-xl animate-pulse" />
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
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Score Badge */}
            <div
              className={`flex-shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl border ${scoreBgColor}`}
            >
              <span className={`text-4xl md:text-5xl font-bold ${scoreColor}`}>
                {data.fitScore}
              </span>
              <span className="text-sm text-brand-brown mt-1">Fit Score</span>
            </div>

            {/* Summary */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-brand-charcoal mb-3">Summary</h3>
              <p className="text-brand-brown leading-relaxed">{data.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main sections grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <ResultSection
          title="Strengths"
          icon={<TrendingUp className="h-5 w-5 text-brand-moss" />}
          items={data.strengths}
          iconColor="text-brand-moss"
        />

        {/* Gaps */}
        <ResultSection
          title="Gaps"
          icon={<AlertTriangle className="h-5 w-5 text-brand-copper" />}
          items={data.gaps}
          iconColor="text-brand-copper"
        />

        {/* Risks */}
        <ResultSection
          title="Risks"
          icon={<AlertCircle className="h-5 w-5 text-brand-red" />}
          items={data.risks}
          iconColor="text-brand-red"
        />

        {/* Next Steps */}
        <ResultSection
          title="Recommended Next Steps"
          icon={<Lightbulb className="h-5 w-5 text-brand-copper" />}
          items={data.recommendedNextSteps}
          iconColor="text-brand-copper"
          numbered
        />
      </div>

      {/* Keywords */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-brand-copper" />
            <h3 className="font-semibold text-brand-charcoal">Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword, i) => (
              <Badge key={i} variant="outline" className="text-sm">
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Signals */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-brand-copper" />
            <h3 className="font-semibold text-brand-charcoal">Role Signals</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-surface-line">Seniority</span>
              <p className="font-medium text-brand-charcoal">{data.roleSignals.seniority}</p>
            </div>
            <div>
              <span className="text-sm text-surface-line">Domain</span>
              <p className="font-medium text-brand-charcoal">{data.roleSignals.domain}</p>
            </div>
            <div>
              <span className="text-sm text-surface-line">Primary Tools</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.roleSignals.primaryTools.map((tool, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-surface-line">Core Responsibilities</span>
              <ul className="mt-1 space-y-1">
                {data.roleSignals.coreResponsibilities.map((resp, i) => (
                  <li key={i} className="text-sm text-brand-brown flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 mt-1.5 flex-shrink-0 text-brand-copper" />
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
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="font-semibold text-brand-charcoal">{title}</h3>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-brand-brown">
              {numbered ? (
                <span className={`font-semibold ${iconColor} text-sm`}>{i + 1}.</span>
              ) : (
                <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
