import { z } from "zod";
import {
  insertMessageSchema,
  messages,
  resumeSchema,
  portfolioSchema,
  referencesSchema,
} from "./schema";
import {
  fitAssessmentInputSchema,
  fitAssessmentResponseSchema,
  fitAssessmentErrorSchema,
} from "./fitAssessmentSchema";

// Content schemas
export const siteSchema = z.any();

// Shared error schemas
export const errorSchemas = {
  internal: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  badRequest: z.object({ message: z.string() }),
};

// -----------------------------
// Legacy Fit schemas (kept for backward compatibility)
// -----------------------------
export const fitStageSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const fitReportSchema = z.object({
  verdict: z.union([z.literal("YES"), z.literal("NO")]),
  heroRecommendation: z.string(),
  approachSummary: z.string(),
  keyInsights: z.array(
    z.object({ label: z.string(), detail: z.string() })
  ),
  timeline: z.object({
    phase1: z.object({ label: z.string(), action: z.string() }),
    phase2: z.object({ label: z.string(), action: z.string() }),
    phase3: z.object({ label: z.string(), action: z.string() }),
  }),
  scores: z.array(z.object({
    label: z.string(),
    current: z.number().min(0).max(10),
    projected: z.number().min(0).max(10),
  })).optional(),
  fitSignals: z.array(z.string()),
  risks: z.array(z.string()),
});

// -----------------------------
// Enhanced Fit Diagnostic schemas
// -----------------------------

// Diagnostic context — accumulated through the intake flow
export const diagnosticContextSchema = z.object({
  businessName: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
  researchContext: z.string(),
  softwareStack: z.array(z.string()),
  painAnswers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
});

// ROI Report — the new output format
export const roiReportSchema = z.object({
  businessName: z.string(),
  industry: z.string(),
  topOpportunity: z.object({
    title: z.string(),
    description: z.string(),
  }),
  estimatedImpact: z.object({
    timeSavedHoursPerWeek: z.number(),
    annualValue: z.number(),
    implementationCost: z.number(),
    paybackMonths: z.number(),
  }),
  secondaryOpportunities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    timeSavedHoursPerWeek: z.number().optional(),
  })).max(3),
  recommendedNextStep: z.string(),
});

// Research endpoint
export const fitResearchInputSchema = z.object({
  businessName: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
});

export const fitResearchResponseSchema = z.object({
  researchContext: z.string(),
});

// Questions endpoint
export const fitQuestionsInputSchema = z.object({
  businessName: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
  researchContext: z.string(),
  softwareStack: z.array(z.string()),
});

export const fitQuestionsResponseSchema = z.object({
  questions: z.array(z.string()).min(1).max(5),
});

// Report generation endpoint
export const fitReportGenerateInputSchema = z.object({
  diagnosticContext: diagnosticContextSchema,
});

export const fitReportGenerateResponseSchema = z.object({
  stage: z.literal(3),
  role: z.literal("assistant"),
  content: z.string(),
  report: roiReportSchema,
});

export const api = {
  content: {
    resume: {
      method: "GET" as const,
      path: "/api/content/resume",
      responses: { 200: resumeSchema, 404: errorSchemas.notFound },
    },
    portfolio: {
      method: "GET" as const,
      path: "/api/content/portfolio",
      responses: { 200: portfolioSchema, 404: errorSchemas.notFound },
    },
    references: {
      method: "GET" as const,
      path: "/api/content/references",
      responses: { 200: referencesSchema, 404: errorSchemas.notFound },
    },
    site: {
      method: "GET" as const,
      path: "/api/content/site",
      responses: { 200: siteSchema, 404: errorSchemas.notFound },
    },
  },

  fit: {
    research: {
      method: "POST" as const,
      path: "/api/fit/research",
      input: fitResearchInputSchema,
      responses: {
        200: fitResearchResponseSchema,
        400: errorSchemas.badRequest,
        500: errorSchemas.internal,
      },
    },
    questions: {
      method: "POST" as const,
      path: "/api/fit/questions",
      input: fitQuestionsInputSchema,
      responses: {
        200: fitQuestionsResponseSchema,
        400: errorSchemas.badRequest,
        500: errorSchemas.internal,
      },
    },
    message: {
      method: "POST" as const,
      path: "/api/fit/message",
      input: fitReportGenerateInputSchema,
      responses: {
        200: fitReportGenerateResponseSchema,
        400: errorSchemas.badRequest,
        500: errorSchemas.internal,
      },
    },
  },

  chat: {
    list: {
      method: "GET" as const,
      path: "/api/messages",
      responses: { 200: z.array(z.custom<typeof messages.$inferSelect>()) },
    },
    create: {
      method: "POST" as const,
      path: "/api/messages",
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        500: errorSchemas.internal,
      },
    },
  },

  fitAssessment: {
    analyze: {
      method: "POST" as const,
      path: "/api/fit-assessment",
      input: fitAssessmentInputSchema,
      responses: {
        200: fitAssessmentResponseSchema,
        400: fitAssessmentErrorSchema,
        429: fitAssessmentErrorSchema,
        500: fitAssessmentErrorSchema,
        502: fitAssessmentErrorSchema,
      },
    },
  },
};
