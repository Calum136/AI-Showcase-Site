import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { aiGenerateNextResponse, aiGenerateReport } from "./ai/fitPrompt";
import { generateFitAssessment } from "./ai/fitAssessment";
import { fitAssessmentInputSchema } from "@shared/fitAssessmentSchema";

import { api } from "@shared/routes";
import { z } from "zod";
// -----------------------------
// Fit (stateless architecture - context passed by client each request)
// -----------------------------
type FitMessage = {
  role: "user" | "assistant";
  content: string;
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
  scores?: Array<{ label: string; current: number; projected: number }>;
  fitSignals: string[];
  risks: string[];
};

// Zod request schemas (stateless)
const fitStartSchema = z.object({
  action: z.literal("start"),
  jdText: z.string().max(50_000).optional(),
});

const fitMessageSchema = z.object({
  action: z.literal("message"),
  userMessage: z.string().min(1).max(20_000),
  jdText: z.string().max(50_000).optional(),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).max(30),
  userTurns: z.number().int().min(0),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // === Content Routes ===
  app.get(api.content.resume.path, async (_req, res) => {
    try {
      const data = await storage.getResume();
      res.json(data);
    } catch {
      res.status(404).json({ message: "Resume content not found" });
    }
  });

  app.get(api.content.portfolio.path, async (_req, res) => {
    try {
      const data = await storage.getPortfolio();
      res.json(data);
    } catch {
      res.status(404).json({ message: "Portfolio content not found" });
    }
  });

  app.get(api.content.site.path, async (_req, res) => {
    try {
      const data = await storage.getSiteCopy();
      res.json(data);
    } catch {
      res.status(404).json({ message: "Site copy not found" });
    }
  });

  app.get(api.content.references.path, async (_req, res) => {
    try {
      const data = await storage.getReferences();
      res.json(data);
    } catch {
      res.status(404).json({ message: "References content not found" });
    }
  });

  // ======================
  // Fit Routes (stateless - context passed by client)
  // ======================

  app.post(api.fit.start.path, async (req, res) => {
    const parsed = fitStartSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const jdText = parsed.data.jdText || "";

    // AI-generated first question (with fallback)
    let firstPrompt = "What's the thing that's eating the most time at work right now?";
    try {
      if (jdText) {
        const result = await aiGenerateNextResponse({
          jdText,
          userTurns: 0,
          messages: [],
        });
        firstPrompt = result.message || firstPrompt;
      }
    } catch (err) {
      console.error("AI start prompt failed, using fallback:", err);
    }

    return res.json({
      stage: 1,
      role: "assistant",
      content: firstPrompt,
    });
  });

  app.post(api.fit.message.path, async (req, res) => {
    const parsed = fitMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const { userMessage, jdText, messages, userTurns } = parsed.data;

    // Add the new user message to history
    const fullMessages: FitMessage[] = [
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: userMessage },
    ];

    // AI decides when it has enough info for a report
    let aiResponse: { message: string; readyForReport: boolean };
    try {
      aiResponse = await aiGenerateNextResponse({
        jdText: jdText || "",
        userTurns,
        messages: fullMessages,
      });
    } catch (err) {
      console.error("AI next response failed:", err);
      aiResponse = {
        message: "I'm having trouble connecting right now — could you try that again?",
        readyForReport: false,
      };
    }

    // If AI says ready, generate the report
    if (aiResponse.readyForReport) {
      const reportMessages: FitMessage[] = [
        ...fullMessages,
        { role: "assistant" as const, content: aiResponse.message },
      ];

      let report: FitReport;
      try {
        report = await aiGenerateReport({
          jdText: jdText ?? "",
          messages: reportMessages,
        });
      } catch (err) {
        console.error("AI report failed, using fallback:", err);
        report = {
          verdict: "YES",
          heroRecommendation: "Free your team from the repetitive tasks that eat their day so they can focus on work that actually matters",
          approachSummary: "The biggest drain is repetitive manual work — the same questions, the same sorting, the same requests over and over. The fix is automating the predictable parts so your team gets their time back.",
          keyInsights: [
            { label: "The Root Problem", detail: "Your team spends hours on tasks that follow the same pattern every time — time they can't spend on work that needs a human." },
            { label: "Where the Fix Lives", detail: "The handoff point where requests come in and someone has to manually sort, respond, or route them." },
            { label: "First Win", detail: "Automate the most common request type — the one that eats the most time. The team feels the difference immediately." },
          ],
          timeline: {
            phase1: { label: "First 30 Days", action: "Map the top 5 repetitive tasks and measure how much time each one takes" },
            phase2: { label: "Days 30-60", action: "Automate the #1 time sink — build it, test it, get the team using it" },
            phase3: { label: "Days 60-90", action: "Expand to the next 2-3 tasks and set up a rhythm so improvements stick" },
          },
          scores: [
            { label: "Information Flow", current: 4, projected: 7 },
            { label: "Staff Capacity", current: 3, projected: 7 },
            { label: "Process Clarity", current: 5, projected: 7 },
            { label: "Response Time", current: 4, projected: 8 },
            { label: "Automation Level", current: 2, projected: 7 },
          ],
          fitSignals: [
            "The challenges match Calum's track record of automating repetitive workflows",
            "The team is ready to move faster — they just need the repetitive parts handled",
          ],
          risks: [
            "If the team is too stretched to participate in the transition, automation can stall",
            "Early wins are critical to keep momentum",
          ],
        };
      }

      return res.json({
        stage: 3,
        verdict: report.verdict,
        report,
        role: "assistant",
        content: aiResponse.message,
      });
    }

    return res.json({
      stage: 1,
      role: "assistant",
      content: aiResponse.message,
    });
  });

  // Upload endpoint - now handled client-side for .txt files
  // Keep route for backwards compatibility but simplified
  app.post(api.fit.upload.path, async (req, res) => {
    return res.status(400).json({
      message: "File upload is now handled client-side. Please use the chat interface to paste text directly.",
    });
  });

  // ======================
  // Fit Assessment Route
  // ======================

  // Simple in-memory rate limiter
  const fitAssessmentRateLimit = new Map<string, { count: number; resetAt: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

  function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = fitAssessmentRateLimit.get(ip);

    if (!record || now > record.resetAt) {
      fitAssessmentRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return true;
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    record.count++;
    return true;
  }

  // Clean up old rate limit entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of Array.from(fitAssessmentRateLimit.entries())) {
      if (now > record.resetAt) {
        fitAssessmentRateLimit.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  app.post(api.fitAssessment.analyze.path, async (req, res) => {
    const startTime = Date.now();
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";

    // Rate limit check
    if (!checkRateLimit(clientIp)) {
      console.log(`[fit-assessment] Rate limited: ${clientIp}`);
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please wait a minute before trying again.",
      });
    }

    // Validate input
    const parsed = fitAssessmentInputSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log(`[fit-assessment] Validation error: ${parsed.error.errors[0]?.message}`);
      return res.status(400).json({
        success: false,
        error: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const { inputText } = parsed.data;
    console.log(`[fit-assessment] Processing request (${inputText.length} chars)`);

    try {
      const result = await generateFitAssessment(inputText);
      const duration = Date.now() - startTime;
      console.log(`[fit-assessment] Success (${duration}ms)`);

      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`[fit-assessment] Error (${duration}ms):`, err?.message || err);

      // Determine appropriate status code
      const isTimeout = err?.name === "AbortError" || err?.message?.includes("timeout");
      const isApiError = err?.message?.includes("API error");

      return res.status(isTimeout || isApiError ? 502 : 500).json({
        success: false,
        error: isTimeout
          ? "Analysis took too long. Please try again with a shorter input."
          : "Failed to generate assessment. Please try again.",
      });
    }
  });

  // === Chat Routes ===
  app.get(api.chat.list.path, async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post(api.chat.create.path, async (req, res) => {
    try {
      const input = api.chat.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
