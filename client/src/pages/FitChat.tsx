import { useEffect, useRef, useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  Send,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Clock,
  TrendingUp,
  Calculator,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { ContactDialog } from "@/components/ContactDialog";
import { api } from "@shared/routes";
import {
  SOFTWARE_STACK_CATEGORIES,
  INDUSTRY_OPTIONS,
  type SoftwareCategory,
} from "@shared/softwareStack";

// ---------------------
// Types
// ---------------------
type DiagnosticPhase =
  | "business-capture"
  | "researching"
  | "software-stack"
  | "generating-questions"
  | "pain-questions"
  | "generating-report"
  | "report";

type DiagnosticContext = {
  businessName: string;
  industry: string;
  researchContext: string;
  softwareStack: string[];
  painAnswers: Array<{ question: string; answer: string }>;
};

type ROIReport = {
  businessName: string;
  industry: string;
  topOpportunity: {
    title: string;
    description: string;
  };
  estimatedImpact: {
    timeSavedHoursPerWeek: number;
    annualValue: number;
    implementationCost: number;
    paybackMonths: number;
  };
  secondaryOpportunities: Array<{
    title: string;
    description: string;
    timeSavedHoursPerWeek?: number;
  }>;
  recommendedNextStep: string;
};

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
};

// Fallback questions
const FALLBACK_PAIN_QUESTIONS = [
  "Which of these tools causes you the most manual re-entry or copy-paste work?",
  "How many hours per week do you estimate your team spends on repetitive admin tasks?",
  "What's the one thing you wish just 'happened automatically'?",
];

// ---------------------
// Main Component
// ---------------------
export default function FitChat() {
  const [phase, setPhase] = useState<DiagnosticPhase>("business-capture");
  const [context, setContext] = useState<DiagnosticContext>({
    businessName: "",
    industry: "",
    researchContext: "",
    softwareStack: [],
    painAnswers: [],
  });
  const [report, setReport] = useState<ROIReport | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Pain questions state
  const [painQuestions, setPainQuestions] = useState<string[]>([]);
  const [currentPainQuestion, setCurrentPainQuestion] = useState(0);

  // Business capture form state
  const [formName, setFormName] = useState("");
  const [formIndustry, setFormIndustry] = useState("");

  // Software stack state
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, phase]);

  // Focus input when pain questions start
  useEffect(() => {
    if (phase === "pain-questions") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase, currentPainQuestion]);

  // Add initial greeting on mount
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Let's find out exactly where AI can save your business time and money. First, a couple of quick questions.",
      },
    ]);
  }, []);

  // ---------------------
  // Phase transitions
  // ---------------------

  const handleBusinessCapture = useCallback(async () => {
    if (!formName.trim() || !formIndustry) return;

    const name = formName.trim();
    const industry = formIndustry;

    // Add user response to chat
    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: `${name} - ${industry}`,
      },
    ]);

    setContext((c) => ({ ...c, businessName: name, industry }));
    setPhase("researching");
    setError(null);

    // Add researching indicator
    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        isTyping: true,
      },
    ]);

    try {
      const r = await fetch(api.fit.research.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: name, industry }),
      });

      const data = await r.json().catch(() => null);
      if (!r.ok) throw new Error(data?.message ?? "Research failed");

      const researchContext = String(data.researchContext ?? "");
      setContext((c) => ({ ...c, researchContext }));

      // Replace typing indicator
      setMessages((m) => [
        ...m.filter((x) => !x.isTyping),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Great, I've researched the ${industry.toLowerCase()} industry. Now let's see what tools you're working with.`,
        },
      ]);

      setPhase("software-stack");
    } catch (e: any) {
      setMessages((m) => m.filter((x) => !x.isTyping));
      setError(e?.message ?? "Failed to research industry. Please try again.");
      setPhase("business-capture");
    }
  }, [formName, formIndustry]);

  const handleSoftwareStackSubmit = useCallback(async () => {
    setContext((c) => ({ ...c, softwareStack: selectedTools }));

    // Add user response summary to chat
    const toolSummary = selectedTools.length > 0
      ? selectedTools.join(", ")
      : "No specific tools selected";

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: toolSummary,
      },
    ]);

    setPhase("generating-questions");
    setError(null);

    // Add typing indicator
    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        isTyping: true,
      },
    ]);

    try {
      const r = await fetch(api.fit.questions.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: context.businessName,
          industry: context.industry,
          researchContext: context.researchContext,
          softwareStack: selectedTools,
        }),
      });

      const data = await r.json().catch(() => null);
      if (!r.ok) throw new Error(data?.message ?? "Question generation failed");

      const questions: string[] = Array.isArray(data.questions) && data.questions.length >= 3
        ? data.questions.slice(0, 3)
        : FALLBACK_PAIN_QUESTIONS;

      setPainQuestions(questions);
      setCurrentPainQuestion(0);

      // Replace typing indicator with first question
      setMessages((m) => [
        ...m.filter((x) => !x.isTyping),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: questions[0],
        },
      ]);

      setPhase("pain-questions");
    } catch (e: any) {
      // Fallback to hardcoded questions
      setPainQuestions(FALLBACK_PAIN_QUESTIONS);
      setCurrentPainQuestion(0);

      setMessages((m) => [
        ...m.filter((x) => !x.isTyping),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: FALLBACK_PAIN_QUESTIONS[0],
        },
      ]);

      setPhase("pain-questions");
    }
  }, [selectedTools, context.businessName, context.industry, context.researchContext]);

  const handlePainAnswer = useCallback(async () => {
    const text = draft.trim();
    if (!text) return;

    const questionIdx = currentPainQuestion;
    const question = painQuestions[questionIdx];

    // Add user answer to chat
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", content: text },
    ]);
    setDraft("");

    // Store the answer
    const newPainAnswers = [
      ...context.painAnswers,
      { question, answer: text },
    ];
    setContext((c) => ({ ...c, painAnswers: newPainAnswers }));

    const nextIdx = questionIdx + 1;

    if (nextIdx < painQuestions.length) {
      // Ask next question after a brief delay
      setCurrentPainQuestion(nextIdx);
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: painQuestions[nextIdx],
          },
        ]);
      }, 400);
    } else {
      // All questions answered — generate report
      setPhase("generating-report");

      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          isTyping: true,
        },
      ]);

      try {
        const fullContext: DiagnosticContext = {
          businessName: context.businessName,
          industry: context.industry,
          researchContext: context.researchContext,
          softwareStack: context.softwareStack,
          painAnswers: newPainAnswers,
        };

        const r = await fetch(api.fit.message.path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diagnosticContext: fullContext }),
        });

        const data = await r.json().catch(() => null);
        if (!r.ok) throw new Error(data?.message ?? "Report generation failed");

        setReport(data.report as ROIReport);
        setMessages((m) => m.filter((x) => !x.isTyping));
        setPhase("report");
      } catch (e: any) {
        setMessages((m) => m.filter((x) => !x.isTyping));
        setError(e?.message ?? "Failed to generate report. Please try again.");
        // Stay on generating-report phase so user can see error
      }
    }
  }, [draft, currentPainQuestion, painQuestions, context]);

  const handleToolToggle = useCallback((tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }, []);

  const isBusy = phase === "researching" || phase === "generating-questions" || phase === "generating-report";

  // ---------------------
  // Render
  // ---------------------
  return (
    <Layout>
      {/* Report phase — full-width scrollable */}
      {phase === "report" && report ? (
        <ROIReportView report={report} context={context} />
      ) : (
        /* Chat/intake phase — viewport-locked */
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-128px)] md:h-[calc(100dvh-144px)]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between py-3 shrink-0"
          >
            <div className="flex items-center gap-4">
              <Link href="/fit">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-brand-red">
                  AI Savings Diagnostic
                </h1>
                <p className="text-sm text-surface-line">
                  {phase === "business-capture" && "Tell us about your business"}
                  {phase === "researching" && "Researching your industry..."}
                  {phase === "software-stack" && "Select your tools"}
                  {phase === "generating-questions" && "Preparing your questions..."}
                  {phase === "pain-questions" && `Question ${currentPainQuestion + 1} of ${painQuestions.length}`}
                  {phase === "generating-report" && "Building your report..."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-xl p-3 shrink-0 mb-2"
            >
              {error}
            </motion.div>
          )}

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-surface-line bg-surface-paper overflow-hidden flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-0">
              {/* Chat messages */}
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    m.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-md px-4 py-3 bg-brand-copper text-surface-paper whitespace-pre-wrap shadow-sm"
                        : `max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 whitespace-pre-wrap shadow-sm ${
                            m.isTyping
                              ? "bg-brand-stone/70 text-brand-brown/60"
                              : "bg-brand-stone text-brand-brown"
                          }`
                    }
                  >
                    {m.isTyping ? <TypingIndicator /> : m.content}
                  </div>
                </motion.div>
              ))}

              {/* Inline phase cards */}
              {phase === "business-capture" && (
                <BusinessCaptureCard
                  formName={formName}
                  formIndustry={formIndustry}
                  onNameChange={setFormName}
                  onIndustryChange={setFormIndustry}
                  onSubmit={handleBusinessCapture}
                />
              )}

              {phase === "software-stack" && (
                <SoftwareStackCard
                  selectedTools={selectedTools}
                  onToggle={handleToolToggle}
                  onSubmit={handleSoftwareStackSubmit}
                />
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input Area — only during pain-questions phase */}
            {phase === "pain-questions" && (
              <div className="border-t border-surface-line p-4 flex gap-3 bg-surface-paper/50 shrink-0">
                <input
                  ref={inputRef}
                  className="flex-1 rounded-xl border border-surface-line px-4 py-3 text-sm bg-surface-paper text-brand-brown placeholder:text-surface-line focus:border-brand-copper focus:ring-1 focus:ring-brand-copper focus:outline-none transition-colors"
                  placeholder="Type your answer..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handlePainAnswer();
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={handlePainAnswer}
                  disabled={!draft.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </Layout>
  );
}

// ---------------------
// Business Capture Card
// ---------------------
function BusinessCaptureCard({
  formName,
  formIndustry,
  onNameChange,
  onIndustryChange,
  onSubmit,
}: {
  formName: string;
  formIndustry: string;
  onNameChange: (v: string) => void;
  onIndustryChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-surface-line bg-brand-stone/30 p-5 md:p-6 space-y-4 max-w-md"
    >
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-brand-brown/70 uppercase tracking-wide block mb-1.5">
            Business Name
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-surface-line px-4 py-3 text-sm bg-surface-paper text-brand-brown placeholder:text-surface-line focus:border-brand-copper focus:ring-1 focus:ring-brand-copper focus:outline-none transition-colors"
            placeholder="e.g. Harbour Coffee"
            value={formName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && formName.trim() && formIndustry) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-brown/70 uppercase tracking-wide block mb-1.5">
            Industry
          </label>
          <select
            className="w-full rounded-xl border border-surface-line px-4 py-3 text-sm bg-surface-paper text-brand-brown focus:border-brand-copper focus:ring-1 focus:ring-brand-copper focus:outline-none transition-colors"
            value={formIndustry}
            onChange={(e) => onIndustryChange(e.target.value)}
          >
            <option value="">Select your industry...</option>
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button
        className="w-full rounded-xl"
        disabled={!formName.trim() || !formIndustry}
        onClick={onSubmit}
      >
        Continue
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </motion.div>
  );
}

// ---------------------
// Software Stack Card
// ---------------------
function SoftwareStackCard({
  selectedTools,
  onToggle,
  onSubmit,
}: {
  selectedTools: string[];
  onToggle: (tool: string) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-surface-line bg-brand-stone/30 p-5 md:p-6 space-y-4"
    >
      <div>
        <h3 className="text-sm font-semibold text-brand-brown mb-1">
          What tools does your business use?
        </h3>
        <p className="text-xs text-brand-brown/60">
          Select all that apply. It's fine to skip tools that aren't listed.
        </p>
      </div>

      <div className="space-y-4">
        {(Object.entries(SOFTWARE_STACK_CATEGORIES) as [SoftwareCategory, readonly string[]][]).map(
          ([category, tools]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-brand-copper uppercase tracking-wide mb-2">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => {
                  const checked = selectedTools.includes(tool);
                  return (
                    <label
                      key={tool}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                        checked
                          ? "bg-brand-copper/10 border-brand-copper/40 text-brand-brown"
                          : "bg-surface-paper border-surface-line text-brand-brown/70 hover:border-brand-copper/30"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggle(tool)}
                        className="h-4 w-4"
                      />
                      {tool}
                    </label>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      <Button className="w-full rounded-xl" onClick={onSubmit}>
        Continue
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </motion.div>
  );
}

// ---------------------
// ROI Report View
// ---------------------
function ROIReportView({
  report,
  context,
}: {
  report: ROIReport;
  context: DiagnosticContext;
}) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Back nav */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/fit">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-red">
            Your Automation Analysis
          </h1>
          <p className="text-sm text-surface-line">
            {report.businessName} | {report.industry}
          </p>
        </div>
      </motion.div>

      {/* Top Automation Opportunity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-surface-line bg-surface-paper p-8 md:p-10"
      >
        <p className="text-xs font-semibold text-brand-copper uppercase tracking-wide mb-3">
          Top Automation Opportunity
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-brown leading-snug mb-4">
          {report.topOpportunity.title}
        </h2>
        <p className="text-brand-brown/70 text-base md:text-lg leading-relaxed">
          {report.topOpportunity.description}
        </p>
      </motion.div>

      {/* Estimated Impact — 2x2 grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-4"
      >
        <ImpactCard
          icon={<Clock className="h-5 w-5 text-brand-copper" />}
          label="Time Saved"
          value={`${report.estimatedImpact.timeSavedHoursPerWeek} hrs/week`}
        />
        <ImpactCard
          icon={<DollarSign className="h-5 w-5 text-brand-moss" />}
          label="Annual Value"
          value={formatCurrency(report.estimatedImpact.annualValue)}
        />
        <ImpactCard
          icon={<Calculator className="h-5 w-5 text-brand-brown" />}
          label="Implementation Cost"
          value={formatCurrency(report.estimatedImpact.implementationCost)}
        />
        <ImpactCard
          icon={<TrendingUp className="h-5 w-5 text-brand-copper" />}
          label="Payback Period"
          value={`${report.estimatedImpact.paybackMonths} months`}
        />
      </motion.div>

      {/* Secondary Opportunities */}
      {report.secondaryOpportunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-surface-line bg-surface-paper p-6 md:p-8"
        >
          <p className="text-xs font-semibold text-brand-brown/60 uppercase tracking-wide mb-5">
            Additional Opportunities
          </p>
          <div className="space-y-5">
            {report.secondaryOpportunities.map((opp, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-copper/10 text-brand-copper text-sm font-bold shrink-0 mt-0.5">
                  {idx + 2}
                </div>
                <div>
                  <h4 className="font-semibold text-brand-brown text-sm mb-1">
                    {opp.title}
                    {opp.timeSavedHoursPerWeek != null && (
                      <span className="text-brand-copper font-normal ml-2">
                        ~{opp.timeSavedHoursPerWeek} hrs/week
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-brand-brown/70 leading-relaxed">
                    {opp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-surface-line bg-brand-charcoal p-8 md:p-10 text-center space-y-4"
      >
        <h3 className="text-xl font-bold text-surface-paper">
          Get the Full Implementation Plan
        </h3>
        <p className="text-surface-paper/70 text-sm max-w-lg mx-auto">
          {report.recommendedNextStep}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <ContactDialog>
            <Button className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-white px-8">
              Book a Free Call
            </Button>
          </ContactDialog>
          <Link href="/fit/chat">
            <Button
              variant="outline"
              className="rounded-xl border-surface-paper/30 text-surface-paper hover:bg-surface-paper/10"
              onClick={() => window.location.reload()}
            >
              Start New Diagnostic
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------
// Impact Card
// ---------------------
function ImpactCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface-paper p-5 md:p-6 space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold text-brand-brown/60 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-brand-brown">
        {value}
      </p>
    </div>
  );
}

// ---------------------
// Typing Indicator
// ---------------------
function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-brand-brown/40 animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 rounded-full bg-brand-brown/40 animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 rounded-full bg-brand-brown/40 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}
