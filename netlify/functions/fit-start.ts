import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";
import { randomUUID } from "crypto";

// In-memory sessions (note: will reset on cold starts)
const fitSessions = new Map<string, any>();

const STAGE_1_QUESTIONS = [
  "At a high level, what problem is this role primarily responsible for solving?",
  "What does 'success' look like in the first 30-90 days for this person?",
  "What kind of environment is this role stepping into (process maturity, pace, and change expectations)?",
];

const fitStartSchema = z.object({
  text: z.string().min(1).max(50_000).optional(),
  jdText: z.string().min(1).max(50_000).optional(),
}).refine(data => data.text || data.jdText, {
  message: "Either text or jdText is required",
});

const CALUM_RESUME_CONTEXT = `
CANDIDATE PROFILE: Calum Kershaw
Title: AI Solutions Developer & Systems Thinker

SUMMARY:
Developer focused on AI systems integration, automation, and decision support tools.

TECHNICAL SKILLS:
TypeScript, Python, React, Node.js, OpenAI API, Anthropic Claude, RAG Systems, PostgreSQL, Power BI

KEY EXPERIENCE:
1. AI Systems Developer (2025-Present) - RAG systems, Fit Check AI, MCP integrations
2. Operations Supervisor - Jolly Tails (2022, 2025-Present) - Data profiling, process optimization
3. Data Analyst - STFX (2024-2025) - Power BI dashboards, SQL, data quality
`;

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`);
  }

  const data: any = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

async function generateFirstQuestion(jdText: string): Promise<string> {
  const systemPrompt = `You are an AI career advisor helping evaluate job fit for Calum Kershaw.
${CALUM_RESUME_CONTEXT}
Ask a clarifying question about the job to understand fit. Be conversational but focused.`;

  const userPrompt = `Job Description:
"""
${jdText.slice(0, 10000)}
"""

Generate ONE opening question to start evaluating this role. Focus on understanding the core problem this role solves.
Return ONLY the question text, nothing else.`;

  try {
    const question = await callOpenAI(systemPrompt, userPrompt);
    return question || STAGE_1_QUESTIONS[0];
  } catch (err) {
    console.error("AI failed, using fallback:", err);
    return STAGE_1_QUESTIONS[0];
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const parsed = fitStartSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: parsed.error.errors[0]?.message ?? "Invalid input" }),
      };
    }

    const jdText = parsed.data.jdText || parsed.data.text || "";
    const sessionId = randomUUID();

    // Generate first question
    const firstPrompt = await generateFirstQuestion(jdText);

    // Store session
    fitSessions.set(sessionId, {
      id: sessionId,
      jdText,
      stage: 1,
      userTurns: 0,
      messages: [{ role: "assistant", content: firstPrompt }],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      verdict: null,
      report: null,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId,
        stage: 1,
        role: "assistant",
        content: firstPrompt,
      }),
    };
  } catch (err: any) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: err?.message || "Internal server error" }),
    };
  }
};
