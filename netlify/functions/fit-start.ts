import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";
import { randomUUID } from "crypto";

// In-memory sessions (note: will reset on cold starts)
const fitSessions = new Map<string, any>();

const DEFAULT_OPENING = "I appreciate you making the time. From your perspective, what's been taking up most of your energy lately?";

const fitStartSchema = z.object({
  text: z.string().max(50_000).optional(),
  jdText: z.string().max(50_000).optional(),
});
// Note: Both text and jdText are now optional - empty start triggers default diagnostic opening

const DIAGNOSTIC_SYSTEM_PROMPT = `You are Calum Kershaw's diagnostic AI assistant. Your job is to conduct a calm, systems-focused conversation that reveals operational bottlenecks in the user's organization.

**Your Persona:**
- Systems-thinking consultant
- Genuinely curious, not interrogating
- Synthesize before asking next question
- Focus on operations, not emotions
- Grounded, professional, unhurried

**Conversation Goals:**
1. Identify energy drains (what's consuming capacity)
2. Diagnose bottlenecks (approval delays, coordination gaps, unclear ownership)
3. Explore workaround behavior (reveals misalignment)
4. Map improvement opportunities (where leverage lives)
5. Understand resource constraints (capacity vs running)

**CRITICAL RULES:**
- Never use corporate jargon ("synergy", "bandwidth", "touch base")
- Never sell Calum directly ("I can help with that")
- Always synthesize what they said before asking next question
- Stay diagnostic, not prescriptive
- If they provide context (like a JD), extract role context and adjust questions accordingly
- Keep responses 2-4 sentences max (this is conversation, not essay)

**Opening:**
Start with: "I appreciate you making the time. From your perspective, what's been taking up most of your energy lately?"
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
  // If no JD provided, use the default opening
  if (!jdText || jdText.trim().length === 0) {
    return DEFAULT_OPENING;
  }

  const userPrompt = `The user has provided this context (likely a job description):
"""
${jdText.slice(0, 10000)}
"""

Based on this context, generate an appropriate opening question that acknowledges you've seen their context and asks about their current operational challenges or energy drains.

Keep it 1-2 sentences. Be warm but professional. Don't use corporate jargon.
Return ONLY the question text, nothing else.`;

  try {
    const question = await callOpenAI(DIAGNOSTIC_SYSTEM_PROMPT, userPrompt);
    return question || DEFAULT_OPENING;
  } catch (err) {
    console.error("AI failed, using fallback:", err);
    return DEFAULT_OPENING;
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
