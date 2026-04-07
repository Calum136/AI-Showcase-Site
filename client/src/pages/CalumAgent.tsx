import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, Loader2, MessageSquare } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What have you actually built?",
  "How do you decide what to build vs what to use off the shelf?",
  "What's your take on where AI is going for small teams?",
  "Walk me through a decision that didn't go as planned",
];

export default function CalumAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(content: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setDraft("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.response },
      ]);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-brand-copper" />
            <span className="text-xs font-medium tracking-widest uppercase text-brand-copper">
              AI Representative
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-brand-brown mb-2">
            Talk to Calum's Agent
          </h1>
          <p className="text-brand-brown/60 text-sm max-w-lg mx-auto">
            Ask anything about Calum's background, projects, thinking, or approach.
            This agent is grounded in what he's actually built.
          </p>
        </motion.div>

        {/* Chat container */}
        <div className="flex-1 flex flex-col rounded-2xl border border-surface-line bg-surface-paper shadow-sm overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" style={{ minHeight: "400px" }}>
            {/* Suggested questions before first message */}
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center h-full gap-4 py-8"
              >
                <p className="text-sm text-brand-brown/50 mb-2">
                  Try one of these to get started:
                </p>
                <div className="grid gap-2 w-full max-w-md">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left px-4 py-3 rounded-xl border border-surface-line hover:border-brand-copper/40 hover:bg-brand-copper/5 text-sm text-brand-brown transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message bubbles */}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-brand-copper text-surface-paper rounded-2xl rounded-br-md"
                      : "bg-brand-stone/10 text-brand-brown rounded-2xl rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-brand-stone/10 text-brand-brown/60 rounded-2xl rounded-bl-md px-4 py-3 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-red-500 py-2"
              >
                {error}
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-surface-line p-3 md:p-4 flex gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask something about Calum..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-surface-line px-4 py-3 text-sm bg-surface-paper text-brand-brown placeholder:text-brand-brown/30 focus:border-brand-copper focus:ring-1 focus:ring-brand-copper outline-none transition-all disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isLoading || !draft.trim()}
              className="rounded-xl bg-brand-copper hover:bg-brand-copper/90 text-surface-paper px-4 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
