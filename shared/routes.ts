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
// Fit schemas (server-led, no persistence)
// -----------------------------
export const fitStageSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const fitReportSchema = z.object({
  verdict: z.union([z.literal("YES"), z.literal("NO")]),
  roleAlignment: z.array(z.string()),
  environmentCompatibility: z.array(z.string()),
  structuralRisks: z.array(z.string()),
  successConditions: z.array(z.string()),
  gapPlan: z.array(z.string()),
});

export const fitStartInputSchema = z.object({
  action: z.literal("start"),
  jdText: z.string().max(50_000).optional(),
});

export const fitStartResponseSchema = z.object({
  stage: fitStageSchema,
  role: z.literal("assistant"),
  content: z.string(),
});

export const fitMessageInputSchema = z.object({
  action: z.literal("message"),
  userMessage: z.string().min(1).max(20_000),
  jdText: z.string().max(50_000).optional(),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).max(30),
  userTurns: z.number().int().min(0),
});

export const fitMessageResponseSchema = z.object({
  stage: fitStageSchema,
  role: z.literal("assistant"),
  content: z.string(),
  verdict: z.union([z.literal("YES"), z.literal("NO")]).optional(),
  report: fitReportSchema.optional(),
});

// Upload returns same shape as start (it just extracts text first)
export const fitUploadResponseSchema = fitStartResponseSchema;

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
    start: {
      method: "POST" as const,
      path: "/api/fit/start",
      input: fitStartInputSchema,
      responses: {
        200: fitStartResponseSchema,
        400: errorSchemas.badRequest,
        500: errorSchemas.internal,
      },
    },
    message: {
      method: "POST" as const,
      path: "/api/fit/message",
      input: fitMessageInputSchema,
      responses: {
        200: fitMessageResponseSchema,
        400: errorSchemas.badRequest,
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    },
    upload: {
      method: "POST" as const,
      path: "/api/fit/upload",
      // multipart/form-data, so we intentionally omit `input` here
      responses: {
        200: fitUploadResponseSchema,
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
