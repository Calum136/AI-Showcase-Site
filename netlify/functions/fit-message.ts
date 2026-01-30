import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";

// Shared session storage (persisted across function invocations via external store would be better)
// For MVP, we'll use a simple approach
const fitMessageSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(20_000),
});

const STAGE_1_QUESTIONS = [
  "At a high level, what problem is this role primarily responsible for solving?",
  "What does "success" look like in the first 30–90 days for this person?",
  "What kind of environment is this role stepping into?",
];

const STAGE_2_QUESTIONS = [
  "Where does this role have real decision-making authority vs. influence-only?",
  "What are the biggest blockers or risks you expect this person to run into?",
  "What support exists for improving systems/processes—not just maintaining them?",
];

const CALUM_RESUME_CONTEXT = `
CANDIDATE PROFILE: Calum Kershaw
Title: AI Solutions Developer & Systems Thinker

SUMMARY:
Developer focused on AI systems integration, automation, and decision support tools.

SKILLS: TypeScript, Python, React, Node.js, OpenAI API, Anthropic Claude, RAG Systems, PostgreSQL

EXPERIENCE:
1. AI Systems Developer (2025-Present) - RAG systems, Fit Check AI
2. Operations Supervisor - Jolly Tails (2022, 2025-Present)
3. Data Analyst - STFX (2024-2025)

STRENGTHS: Systems thinking, AI integration, data quality, quick learning
GROWTH AREAS: Enterprise architecture, team leadership
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

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data: any = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

async function generateNextQuestion(jdText: string, messages: any[], stage: number, userTurns: number): Promise<string> {
  const systemPrompt = `You are an AI career advisor evaluating job fit for Calum Kershaw.
${CALUM_RESUME_CONTEXT}
Ask focused questions to understand role fit. Be conversational.`;

  const conversation = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

  const userPrompt = `Job Description:
"""
${jdText.slice(0, 8000)}
"""

Conversation so far:
${conversation}

Stage: ${stage} (1=initial, 2=deep dive)
User turns: ${userTurns}

Generate the next question. Focus on:
- Stage 1: Role responsibilities, success metrics, team structure
- Stage 2: Decision authority, blockers, growth support

Return ONLY the question text.`;

  try {
    return await callOpenAI(systemPrompt, userPrompt);
  } catch {
    // Fallback to hardcoded questions
    if (stage === 1) return STAGE_1_QUESTIONS[userTurns % 3];
    return STAGE_2_QUESTIONS[(userTurns - 3) % 3];
  }
}

async function generateReport(jdText: string, messages: any[]): Promise<any> {
  const systemPrompt = `You are an AI career advisor producing a fit analysis for Calum Kershaw.
${CALUM_RESUME_CONTEXT}
Be honest and balanced. If something is a weak fit, say so.`;

  const conversation = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

  const userPrompt = `Job Description:
"""
${jdText.slice(0, 8000)}
"""

Conversation:
${conversation}

Analyze fit and return ONLY valid JSON (no markdown):
{
  "verdict": "YES" or "NO",
  "roleAlignment": ["2-4 alignment points"],
  "environmentCompatibility": ["2-4 environment observations"],
  "structuralRisks": ["2-4 potential challenges"],
  "successConditions": ["2-4 conditions for success"],
  "gapPlan": ["2-4 actions to address gaps"]
}`;

  try {
    const raw = await callOpenAI(systemPrompt, userPrompt);
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      return JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    }
  } catch (err) {
    console.error("Report generation failed:", err);
  }

  // Fallback report
  return {
    verdict: "YES",
    roleAlignment: ["Systems thinking aligns with role needs", "AI/automation skills relevant"],
    environmentCompatibility: ["Adaptable to various environments", "Quick learner"],
    structuralRisks: ["May need mentorship in enterprise contexts", "Scope clarity important"],
    successConditions: ["Clear success metrics defined", "Access to stakeholders"],
    gapPlan: ["Shadow senior team members", "Document early wins"],
  };
}

// Simple in-memory session store (for demo - won't persist across deploys)
const sessions = new Map<string, any>();

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
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
    const parsed = fitMessageSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: parsed.error.errors[0]?.message ?? "Invalid input" }),
      };
    }

    const { sessionId, message } = parsed.data;

    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      // For serverless, session may not exist - create minimal one
      session = {
        id: sessionId,
        jdText: message, // Use first message as context if no session
        stage: 1,
        userTurns: 0,
        messages: [],
        verdict: null,
        report: null,
      };
    }

    // Record user message
    session.userTurns += 1;
    session.messages.push({ role: "user", content: message });

    // Check if we should generate report (after 6 turns)
    if (session.userTurns >= 6) {
      session.stage = 3;
      const report = await generateReport(session.jdText, session.messages);
      session.verdict = report.verdict;
      session.report = report;
      session.messages.push({ role: "assistant", content: `Verdict: ${report.verdict}` });

      sessions.set(sessionId, session);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          stage: 3,
          verdict: report.verdict,
          report,
          role: "assistant",
          content: "Verdict reached.",
        }),
      };
    }

    // Stage transition at turn 3
    if (session.userTurns >= 3 && session.stage === 1) {
      session.stage = 2;
    }

    // Generate next question
    const nextPrompt = await generateNextQuestion(
      session.jdText,
      session.messages,
      session.stage,
      session.userTurns
    );

    session.messages.push({ role: "assistant", content: nextPrompt });
    sessions.set(sessionId, session);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        stage: session.stage,
        role: "assistant",
        content: nextPrompt,
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
