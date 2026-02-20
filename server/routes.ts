import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import {
  aiResearchBusiness,
  aiGeneratePainQuestions,
  aiGenerateROIReport,
  fallbackROIReport,
} from "./ai/fitPrompt";
import { generateFitAssessment } from "./ai/fitAssessment";
import { fitAssessmentInputSchema } from "@shared/fitAssessmentSchema";

import { api } from "@shared/routes";
import {
  fitResearchInputSchema,
  fitQuestionsInputSchema,
  fitReportGenerateInputSchema,
} from "@shared/routes";
import { z } from "zod";

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
  // Fit Diagnostic Routes (Enhanced)
  // ======================

  // Research endpoint — generates industry intelligence brief
  app.post(api.fit.research.path, async (req, res) => {
    const parsed = fitResearchInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    try {
      const researchContext = await aiResearchBusiness({
        businessName: parsed.data.businessName,
        industry: parsed.data.industry,
      });
      return res.json({ researchContext });
    } catch (err) {
      console.error("AI research failed:", err);
      return res.status(500).json({
        message: "Failed to generate research context. Please try again.",
      });
    }
  });

  // Questions endpoint — generates tailored pain questions
  app.post(api.fit.questions.path, async (req, res) => {
    const parsed = fitQuestionsInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    try {
      const questions = await aiGeneratePainQuestions({
        businessName: parsed.data.businessName,
        industry: parsed.data.industry,
        researchContext: parsed.data.researchContext,
        softwareStack: parsed.data.softwareStack,
      });
      return res.json({ questions });
    } catch (err) {
      console.error("AI question generation failed:", err);
      return res.status(500).json({
        message: "Failed to generate questions. Please try again.",
      });
    }
  });

  // Report endpoint — generates ROI report from full diagnostic context
  app.post(api.fit.message.path, async (req, res) => {
    const parsed = fitReportGenerateInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const { diagnosticContext } = parsed.data;

    let report;
    try {
      report = await aiGenerateROIReport(diagnosticContext);
    } catch (err) {
      console.error("AI report generation failed, using fallback:", err);
      report = fallbackROIReport(
        diagnosticContext.businessName,
        diagnosticContext.industry,
      );
    }

    return res.json({
      stage: 3 as const,
      role: "assistant" as const,
      content: "Here's your personalized automation analysis.",
      report,
    });
  });

  // ======================
  // Fit Assessment Route (kept for backward compatibility)
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
