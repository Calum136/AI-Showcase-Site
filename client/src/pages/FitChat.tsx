import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Send,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Target,
  Lightbulb,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { api } from "@shared/routes";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
};

type FitReport = {
  verdict: "YES" | "NO";
  heroRecommendation: string;
  approachSummary: string;
  keyInsights: Array<{ label: string; detail: string }>;
  timeline: {
    phase1: { label: string; action: string };
    phase2: { label: string; action: string };
    phase3: { label: string; action: string };
  };
  fitSignals: string[];
  risks: string[];
};

export default function FitChat() {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FitReport | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [jdText, setJdText] = useState<string>("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // Auto-start conversation on mount
  useEffect(() => {
    if (!hasStarted) {
      startConversation();
    }
  }, []);

  async function startConversation(initialJdText?: string) {
    setIsBusy(true);
    setError(null);
    setReport(null);
    setHasStarted(true);

    const contextText = initialJdText || "";
    if (initialJdText) {
      setJdText(initialJdText);
    }

    // Show typing indicator immediately
    const typingId = crypto.randomUUID();
    setMessages([
      { id: typingId, role: "assistant", content: "", isTyping: true },
    ]);

    try {
      const payload = {
        action: "start" as const,
        jdText: contextText,
      };

      const r = await fetch(api.fit.start.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        throw new Error(data?.message ?? `Start failed (${r.status})`);
      }

      setStage(data.stage);

      const first = String(data.content ?? "").trim();

      // Replace typing indicator with actual message
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            first ||
            "I appreciate you making the time. From your perspective, what's been taking up most of your energy lately?",
        },
      ]);
    } catch (e: any) {
      setMessages([]);
      setError(e?.message ?? "Failed to start conversation.");
      setHasStarted(false);
    } finally {
      setIsBusy(false);
    }
  }

  async function uploadFile(file: File) {
    setIsBusy(true);
    setError(null);

    try {
      const text = await file.text();
      if (!text.trim()) throw new Error("File appears to be empty.");
      setJdText(text);
      await startConversation(text);
    } catch (e: any) {
      setError(
        e?.message ||
          "Could not read file. Please paste the text directly instead.",
      );
      setIsBusy(false);
    }
  }

  async function sendMessage() {
    const text = (draft ?? "").trim();
    if (!text || !hasStarted) return;

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setIsBusy(true);
    setError(null);

    // Add typing indicator
    const typingId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: typingId, role: "assistant", content: "", isTyping: true },
    ]);

    try {
      // Build message history (excluding typing indicators)
      const currentMessages = [...messages, userMsg];
      const historyForServer = currentMessages
        .filter((m) => !m.isTyping)
        .map((m) => ({ role: m.role, content: m.content }));

      const userTurnCount =
        currentMessages.filter((m) => m.role === "user").length;

      const r = await fetch(api.fit.message.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          userMessage: text,
          jdText,
          messages: historyForServer,
          userTurns: userTurnCount,
        }),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        throw new Error(data?.message ?? `Message failed (${r.status})`);
      }

      setStage(data.stage);

      const aiText = String(data.content ?? "").trim();

      // Small delay for natural feel
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Replace typing indicator with actual message
      setMessages((m) =>
        m
          .filter((x) => x.id !== typingId)
          .concat({
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiText || "Let me think about that...",
          }),
      );

      if (data.report) {
        setReport(data.report as FitReport);
      }
    } catch (e: any) {
      setMessages((m) => m.filter((x) => x.id !== typingId));
      setError(e?.message ?? "Failed to send message.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Layout>
      {/* Full-height flex container — chat stays in viewport */}
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-128px)] md:h-[calc(100dvh-144px)]">
        {/* Header — compact, no extra vertical space */}
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
                Fit Lab Diagnostic
              </h1>
              <p className="text-sm text-surface-line">
                Stage {stage} of 3
                {stage === 3 && " — Complete"}
              </p>
            </div>
          </div>

          {/* Upload button (top-right) */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
                e.currentTarget.value = "";
              }}
              disabled={isBusy}
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              title="Upload job description (.txt) for context"
            >
              <Upload className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Upload JD</span>
            </Button>
          </div>
        </motion.div>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-xl p-3 shrink-0"
          >
            {error}
            {!hasStarted && (
              <Button
                variant="link"
                className="ml-2 text-brand-red underline p-0 h-auto"
                onClick={() => startConversation()}
              >
                Try again
              </Button>
            )}
          </motion.div>
        )}

        {/* Chat Container — fills remaining viewport */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-surface-line bg-surface-paper overflow-hidden flex flex-col flex-1 min-h-0"
        >
          {/* Messages Area — scrollable, fills available space */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-0">
            {messages.length === 0 && !isBusy && (
              <p className="text-surface-line text-center py-8">
                Starting conversation...
              </p>
            )}

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

            <div ref={bottomRef} />
          </div>

          {/* Input Area — pinned to bottom of chat container */}
          {stage !== 3 && (
            <div className="border-t border-surface-line p-4 flex gap-3 bg-surface-paper/50 shrink-0">
              <input
                data-testid="input-chat-message"
                className="flex-1 rounded-xl border border-surface-line px-4 py-3 text-sm bg-surface-paper text-brand-brown placeholder:text-surface-line focus:border-brand-copper focus:ring-1 focus:ring-brand-copper focus:outline-none transition-colors"
                placeholder={isBusy ? "Thinking..." : "Type your response..."}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isBusy || !hasStarted}
              />
              <Button
                data-testid="button-send-message"
                size="icon"
                className="h-12 w-12 rounded-xl"
                onClick={sendMessage}
                disabled={!(draft ?? "").trim() || isBusy || !hasStarted}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Report — replaces chat input when stage 3 */}
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-surface-line bg-surface-paper p-6 md:p-8 space-y-8 overflow-y-auto mt-4"
          >
            {/* Hero Recommendation */}
            <div className="text-center space-y-4">
              <Badge
                className={
                  report.verdict === "YES"
                    ? "bg-brand-moss/10 text-brand-moss border-brand-moss"
                    : "bg-brand-red/10 text-brand-red border-brand-red"
                }
              >
                {report.verdict === "YES" ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" /> Good Fit
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" /> Needs Review
                  </>
                )}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-brown leading-snug">
                {report.heroRecommendation}
              </h2>
              <p className="text-brand-brown/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {report.approachSummary}
              </p>
            </div>

            {/* Key Insights — 3 cards */}
            {report.keyInsights && report.keyInsights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.keyInsights.map((insight, idx) => {
                  const icons = [Target, Lightbulb, Zap];
                  const Icon = icons[idx % icons.length];
                  const colors = [
                    "text-brand-red",
                    "text-brand-copper",
                    "text-brand-moss",
                  ];
                  return (
                    <div
                      key={idx}
                      className="bg-brand-stone/40 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colors[idx % colors.length]}`} />
                        <span className="font-semibold text-sm text-brand-brown">
                          {insight.label}
                        </span>
                      </div>
                      <p className="text-sm text-brand-brown/75 leading-relaxed">
                        {insight.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Timeline — 30/60/90 */}
            {report.timeline && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-brand-brown/60 uppercase tracking-wide">
                  Suggested Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    report.timeline.phase1,
                    report.timeline.phase2,
                    report.timeline.phase3,
                  ].map((phase, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-brand-stone/30 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-copper/10 text-brand-copper text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-brand-copper">
                          {phase.label}
                        </div>
                        <p className="text-sm text-brand-brown/75 mt-1">
                          {phase.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fit Signals & Risks — subtle footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-surface-line/50">
              {report.fitSignals && report.fitSignals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-brand-moss uppercase tracking-wide">
                    Why This Fits
                  </h4>
                  <ul className="space-y-1">
                    {report.fitSignals.map((s, i) => (
                      <li
                        key={i}
                        className="text-sm text-brand-brown/70 flex items-start gap-2"
                      >
                        <CheckCircle className="w-3 h-3 text-brand-moss mt-1 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.risks && report.risks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-brand-red/80 uppercase tracking-wide">
                    Watch For
                  </h4>
                  <ul className="space-y-1">
                    {report.risks.map((r, i) => (
                      <li
                        key={i}
                        className="text-sm text-brand-brown/70 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-3 h-3 text-brand-red/60 mt-1 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-4">
              <Link href="/fit">
                <Button variant="outline" className="rounded-xl">
                  Start New Diagnostic
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-brand-brown/40 animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 rounded-full bg-brand-brown/40 animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 rounded-full bg-brand-brown/40 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

