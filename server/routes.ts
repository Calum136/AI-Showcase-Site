import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { aiGenerateNextPrompt, aiGenerateReport } from "./ai/fitPrompt";
import { generateFitAssessment } from "./ai/fitAssessment";
import { fitAssessmentInputSchema } from "@shared/fitAssessmentSchema";

import { api } from "@shared/routes";
import { z } from "zod";
// -----------------------------
// Fit (stateless architecture - context passed by client each request)
// -----------------------------
type FitStage = 1 | 2 | 3;

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

function computeStage(userTurns: number): FitStage {
  if (userTurns >= 8) return 3;
  if (userTurns >= 4) return 2;
  return 1;
}

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
    let firstPrompt = "";
    try {
      firstPrompt = await aiGenerateNextPrompt({
        jdText,
        stage: 1,
        userTurns: 0,
        messages: [],
      });
    } catch (err) {
      console.error("AI start prompt failed, using fallback:", err);
      firstPrompt = "I appreciate you making the time. From your perspective, what's been taking up most of your energy lately?";
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

    const stage = computeStage(userTurns);

    // Generate report after 8 user turns
    if (userTurns >= 8) {
      let report: FitReport;
      try {
        report = await aiGenerateReport({
          jdText: jdText ?? "",
          messages: fullMessages,
        });
      } catch (err) {
        console.error("AI report failed, using fallback:", err);
        report = {
          verdict: "YES",
          heroRecommendation: "Get your team unstuck by clearing the bottlenecks that slow down every decision",
          approachSummary: "The biggest drag on your team is waiting — waiting for approvals, waiting for information, waiting for decisions that should be straightforward. The fix is identifying the specific handoff points where things stall, and making them flow.",
          keyInsights: [
            { label: "The Problem", detail: "Work gets stuck between people, not inside their work. The team knows what to do but can't move." },
            { label: "Where the Fix Lives", detail: "The handoff points between teams or between a team and leadership — that's where days get lost." },
            { label: "First Win", detail: "Map where things stall and remove one unnecessary approval step. The team feels the difference immediately." },
          ],
          timeline: {
            phase1: { label: "First 30 Days", action: "Observe and map where work actually stalls — talk to the people doing the work" },
            phase2: { label: "Days 30-60", action: "Fix the worst bottleneck with a simple, visible change the team can feel" },
            phase3: { label: "Days 60-90", action: "Build on momentum — automate the repetitive parts and set up a rhythm so improvements stick" },
          },
          fitSignals: [
            "The challenges described are exactly the kind of systems problems Calum solves",
            "The team is ready to move faster — they just need the blockers removed",
          ],
          risks: [
            "If leadership isn't ready to let go of some approval steps, even the best fixes won't stick",
            "The team needs to see early wins to stay bought in",
          ],
        };
      }

      return res.json({
        stage: 3,
        verdict: report.verdict,
        report,
        role: "assistant",
        content: "Thank you for sharing all of that. I have enough context now to put together a FitReport for you. Here's what I'm seeing...",
      });
    }

    // AI next prompt with fallback
    let nextPrompt = "";
    try {
      nextPrompt = await aiGenerateNextPrompt({
        jdText: jdText || "",
        stage,
        userTurns,
        messages: fullMessages,
      });
    } catch (err) {
      console.error("AI next prompt failed, using fallback:", err);
      nextPrompt = "That's interesting context. Can you tell me more about how that plays out day-to-day?";
    }

    return res.json({
      stage,
      role: "assistant",
      content: nextPrompt,
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
