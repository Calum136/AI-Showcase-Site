import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Fit() {
  const [text, setText] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");

  function startConversation() {
    if (!text.trim()) return;
    setStarted(true);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Thanks for sharing the job description! I'll ask you a few questions to evaluate fit. (AI integration coming soon)",
      },
    ]);
  }

  function sendMessage() {
    if (!draft.trim()) return;
    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: draft,
    };
    setMessages((m) => [...m, userMsg]);
    setDraft("");

    setTimeout(() => {
      const aiMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "This is a placeholder response. AI integration coming soon!",
      };
      setMessages((m) => [...m, aiMsg]);
    }, 500);
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold">Fit Conversation</h1>
          <p className="text-muted-foreground mt-2">
            Paste a job description to begin. I'll ask a few questions to
            evaluate fit.
          </p>
        </motion.div>

        <div className="space-y-4">
          {!started ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <textarea
                data-testid="input-job-description"
                className="w-full min-h-[200px] rounded-xl border border-border p-4 text-sm bg-background"
                placeholder="Paste job description here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button
                data-testid="button-start-conversation"
                onClick={startConversation}
                disabled={!text.trim()}
              >
                Start Conversation
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Conversation in progress
              </div>
            </motion.div>
          )}

          <motion.div
            initial={false}
            animate={{ opacity: started ? 1 : 0.6, y: started ? 0 : 6 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-card"
          >
            <div className="h-[320px] overflow-y-auto p-6 text-sm space-y-3">
              {messages.length === 0 && (
                <p className="text-muted-foreground">
                  Conversation output will appear here.
                </p>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    m.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl px-4 py-2 bg-primary text-primary-foreground whitespace-pre-wrap"
                        : "max-w-[85%] rounded-2xl px-4 py-2 bg-muted text-muted-foreground whitespace-pre-wrap border border-border"
                    }
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {started && (
              <div className="border-t border-border p-4 flex gap-2">
                <input
                  data-testid="input-chat-message"
                  className="flex-1 rounded-xl border border-border px-4 py-2 text-sm bg-background"
                  placeholder="Type a response…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <Button
                  data-testid="button-send-message"
                  size="icon"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
