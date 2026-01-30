import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Send, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { api } from "@shared/routes";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
};

type FitReport = {
  verdict: "YES" | "NO";
  roleAlignment: string[];
  environmentCompatibility: string[];
  structuralRisks: string[];
  successConditions: string[];
  gapPlan: string[];
};

export default function Fit() {
  const [jdText, setJdText] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FitReport | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const canStart = useMemo(() => (jdText ?? "").trim().length > 0, [jdText]);

  async function startConversation() {
    if (!canStart) return;

    setIsBusy(true);
    setError(null);
    setReport(null);

    try {
      const payload = {
        text: (jdText ?? "").trim(),
        jdText: (jdText ?? "").trim(),
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

      setSessionId(data.sessionId);
      setStage(data.stage);
      setStarted(true);

      const first = String(data.content ?? "").trim();
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: first || "Paste a job description or upload one to begin.",
        },
      ]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to start conversation.");
    } finally {
      setIsBusy(false);
    }
  }

  async function uploadFile(file: File) {
    setIsBusy(true);
    setError(null);
    setReport(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const r = await fetch(api.fit.upload.path, {
        method: "POST",
        body: form,
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        throw new Error(data?.message ?? `Upload failed (${r.status})`);
      }

      setSessionId(data.sessionId);
      setStage(data.stage);
      setStarted(true);

      const first = String(data.content ?? "").trim();
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: first || "Thanks — I've extracted the text. Let's start.",
        },
      ]);
    } catch (e: any) {
      setError(e?.message ?? "Upload failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function sendMessage() {
    const text = (draft ?? "").trim();
    if (!text || !sessionId) return;

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setIsBusy(true);
    setError(null);

    const typingId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: typingId, role: "assistant", content: "…", isTyping: true },
    ]);

    try {
      const r = await fetch(api.fit.message.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        throw new Error(data?.message ?? `Message failed (${r.status})`);
      }

      setStage(data.stage);

      const aiText = String(data.content ?? "").trim();

      await new Promise((resolve) => setTimeout(resolve, 250));

      setMessages((m) =>
        m
          .filter((x) => x.id !== typingId)
          .concat({
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiText || "…",
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
      <div className="max-w-4xl mx-auto py-16 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-brand-red">Fit Conversation</h1>
          <p className="text-brand-brown mt-2">
            Paste or upload a job description to begin. Nothing is stored —
            session only.
          </p>
        </motion.div>

        {!started ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <textarea
              data-testid="input-job-description"
              className="w-full min-h-[220px] rounded-xl border border-surface-line p-4 text-sm bg-surface-paper text-brand-brown placeholder:text-surface-line focus:border-brand-copper focus:ring-1 focus:ring-brand-copper focus:outline-none transition-colors"
              placeholder="Paste job description here…"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={isBusy}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                data-testid="button-start-conversation"
                onClick={startConversation}
                disabled={!canStart || isBusy}
                className="rounded-xl"
              >
                Start Conversation
              </Button>

              <label className="inline-flex">
                <input
                  type="file"
                  className="hidden"
                  accept=".txt,.pdf,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFile(f);
                    e.currentTarget.value = "";
                  }}
                  disabled={isBusy}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl w-full sm:w-auto"
                  disabled={isBusy}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload (.txt/.pdf/.docx)
                </Button>
              </label>
            </div>

            {error && (
              <div className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-xl p-3">
                {error}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="text-xs uppercase tracking-wider text-surface-line">
              Conversation in progress • Stage {stage}
            </div>

            {error && (
              <div className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-xl p-3">
                {error}
              </div>
            )}
          </motion.div>
        )}

        {/* Chat Panel */}
        <motion.div
          initial={false}
          animate={{ opacity: started ? 1 : 0.6, y: started ? 0 : 6 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-surface-line bg-surface-paper"
        >
          <div className="h-[360px] overflow-y-auto p-6 text-sm space-y-3">
            {messages.length === 0 && (
              <p className="text-surface-line">
                Conversation output will appear here.
              </p>
            )}

            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl px-4 py-2 bg-brand-copper text-surface-paper whitespace-pre-wrap"
                      : `max-w-[85%] rounded-2xl px-4 py-2 whitespace-pre-wrap border border-surface-line ${
                          m.isTyping
                            ? "bg-brand-stone text-surface-line italic"
                            : "bg-brand-stone text-brand-brown"
                        }`
                  }
                >
                  {m.content}
                </div>
              </motion.div>
            ))}

            <div ref={bottomRef} />
          </div>

          {started && stage !== 3 && (
            <div className="border-t border-surface-line p-4 flex gap-2">
              <input
                data-testid="input-chat-message"
                className="flex-1 rounded-xl border border-surface-line px-4 py-2 text-sm bg-surface-paper text-brand-brown placeholder:text-surface-line focus:border-brand-copper focus:ring-1 focus:ring-brand-copper focus:outline-none transition-colors"
                placeholder={isBusy ? "Thinking…" : "Type a response…"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isBusy}
              />
              <Button
                data-testid="button-send-message"
                size="icon"
                onClick={sendMessage}
                disabled={!(draft ?? "").trim() || isBusy}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Report */}
        {report && (
          <div className="rounded-2xl border border-surface-line bg-surface-paper p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-semibold text-brand-brown">Fit Report</h2>
              <Badge
                className={
                  report.verdict === "YES"
                    ? "bg-brand-moss/10 text-brand-moss border-brand-moss"
                    : "bg-brand-red/10 text-brand-red border-brand-red"
                }
              >
                {report.verdict === "YES" ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Good Fit</>
                ) : (
                  <><AlertTriangle className="w-3 h-3 mr-1" /> Needs Review</>
                )}
              </Badge>
            </div>

            <Section
              title="Role Alignment"
              items={report.roleAlignment}
              borderColor="border-brand-moss"
            />
            <Section
              title="Environment Compatibility"
              items={report.environmentCompatibility}
              borderColor="border-brand-copper"
            />
            <Section
              title="Structural Risk Factors"
              items={report.structuralRisks}
              borderColor="border-brand-red"
            />
            <Section
              title="Success Conditions Observed"
              items={report.successConditions}
              borderColor="border-brand-moss"
            />
            <Section
              title="30–90 Day Gap Plan"
              items={report.gapPlan}
              borderColor="border-brand-copper"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

function Section({
  title,
  items,
  borderColor = "border-surface-line",
}: {
  title: string;
  items: string[];
  borderColor?: string;
}) {
  return (
    <div className={`space-y-2 border-l-4 ${borderColor} pl-4 bg-brand-stone/30 py-3 pr-3 rounded-r-lg`}>
      <div className="font-semibold text-brand-brown">{title}</div>
      <ul className="list-disc pl-5 text-sm text-brand-brown/80 space-y-1">
        {(items || []).map((x, idx) => (
          <li key={`${title}-${idx}`}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
