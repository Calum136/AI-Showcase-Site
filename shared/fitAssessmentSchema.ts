import { z } from "zod";

// Input schema - what the client sends
export const fitAssessmentInputSchema = z.object({
  inputText: z
    .string()
    .min(1, "Input text is required")
    .max(10000, "Input text must be 10,000 characters or less")
    .transform((s) => s.trim()),
});

export type FitAssessmentInput = z.infer<typeof fitAssessmentInputSchema>;

// Role signals schema
export const roleSignalsSchema = z.object({
  seniority: z.string(),
  domain: z.string(),
  primaryTools: z.array(z.string()),
  coreResponsibilities: z.array(z.string()),
});

export type RoleSignals = z.infer<typeof roleSignalsSchema>;

// Output schema - what the server returns
export const fitAssessmentOutputSchema = z.object({
  summary: z.string().min(1),
  fitScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  gaps: z.array(z.string()),
  risks: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()).min(1),
  keywords: z.array(z.string()),
  roleSignals: roleSignalsSchema,
});

export type FitAssessmentOutput = z.infer<typeof fitAssessmentOutputSchema>;

// API response wrapper
export const fitAssessmentResponseSchema = z.object({
  success: z.literal(true),
  data: fitAssessmentOutputSchema,
});

export const fitAssessmentErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export type FitAssessmentResponse = z.infer<typeof fitAssessmentResponseSchema>;
export type FitAssessmentError = z.infer<typeof fitAssessmentErrorSchema>;
