import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";

// ---------------------
// Schemas
// ---------------------
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const fitChatSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("start"),
    jdText: z.string().max(50_000).optional().default(""),
  }),
  z.object({
    action: z.literal("message"),
    userMessage: z.string().min(1).max(20_000),
    jdText: z.string().max(50_000).optional().default(""),
    messages: z.array(messageSchema).max(30),
    userTurns: z.number().int().min(0).max(30),
  }),
]);

// ---------------------
// System Prompt
// ---------------------
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

**Conversation Structure (3 Stages, 8-12 Total Exchanges):**

**Stage 1 - Opening & Energy Mapping (3-4 exchanges)**
- Listen for: Projects, approvals, coordination, delivery pressure
- Synthesize: "That tension between [X] and [Y] shows up a lot once organizations grow..."
- Dig: "When [bottleneck] happens, does it feel like [root cause A] or [root cause B]?"

**Stage 2 - Bottleneck Diagnosis (3-4 exchanges)**
- Impact: "When [bottleneck] happens, what gives first—speed, focus, or team capacity?"
- Behavior: "Do teams wait it out, or find ways around it?"
- Synthesize: "Workaround behavior tells you where the real flow wants to be."
- Process maturity: "Does the information exist but not travel well, or is it never captured?"

**Stage 3 - Improvement & Ownership (3-4 exchanges)**
- Opportunity: "If one part of how work moves felt noticeably smoother, where would you feel the biggest difference?"
- Ownership: "Is that something people are expected to improve in their regular roles, or does it not have a clear owner?"
- Resources: "Do teams have room to improve how they work, or is most capacity tied up keeping things running?"
- Synthesize: "Sounds like the organization has strong capabilities, but the flow between pieces is where leverage lives."

**CRITICAL RULES:**
- Never use corporate jargon ("synergy", "bandwidth", "touch base")
- Never sell Calum directly ("I can help with that")
- Always synthesize what they said before asking next question
- Stay diagnostic, not prescriptive
- Keep responses 2-4 sentences max (this is conversation, not essay)
- Be warm and human, not robotic

**About Calum Kershaw:**
AI Solutions Developer & Systems Thinker focused on AI systems integration, automation, and decision support tools.
Skills: TypeScript, Python, React, Node.js, OpenAI API, Anthropic Claude, RAG Systems, PostgreSQL
Experience: AI Systems Developer, Operations Supervisor, Data Analyst
Strengths: Systems thinking, AI integration, data quality, quick learning
`;

const DEFAULT_OPENING =
  "I appreciate you making the time. From your perspective, what's been taking up most of your energy lately?";

// ---------------------
// Fallback Questions
// ---------------------
const FALLBACK_QUESTIONS = {
  stage1: [
    "That's interesting context. When that tension comes up, does it feel more like a communication gap or a structural one?",
    "I hear you. When things slow down, is it usually waiting on decisions, or waiting on information?",
    "That makes sense. Does the team have clarity on what 'done' looks like, or does that shift mid-stream?",
  ],
  stage2: [
    "When that happens, what gives first—speed, focus, or team capacity?",
    "Do people tend to wait it out, or find ways around the bottleneck?",
    "Does the information exist somewhere but not travel well, or is it never captured in the first place?",
  ],
  stage3: [
    "If one part of how work moves felt noticeably smoother, where would you feel the biggest difference?",
    "Is improving that something people are expected to do in their regular roles, or does it not have a clear owner?",
    "Do teams have room to improve how they work, or is most capacity tied up keeping things running?",
  ],
};

// ---------------------
// OpenAI Helpers
// ---------------------
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  temperature = 0.3,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data: any = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

// ---------------------
// Stage Logic
// ---------------------
function computeStage(userTurns: number): 1 | 2 | 3 {
  if (userTurns >= 8) return 3;
  if (userTurns >= 4) return 2;
  return 1;
}

function getFallbackQuestion(stage: number, userTurns: number): string {
  const questions =
    stage === 1
      ? FALLBACK_QUESTIONS.stage1
      : stage === 2
        ? FALLBACK_QUESTIONS.stage2
        : FALLBACK_QUESTIONS.stage3;
  return questions[userTurns % questions.length];
}

// ---------------------
// Generate First Question
// ---------------------
async function generateFirstQuestion(jdText: string): Promise<string> {
  if (!jdText || jdText.trim().length === 0) {
    return DEFAULT_OPENING;
  }

  try {
    const result = await callOpenAI([
      { role: "system", content: DIAGNOSTIC_SYSTEM_PROMPT },
      {
        role: "user",
        content: `The user has provided this context (likely a job description):
"""
${jdText.slice(0, 10000)}
"""

Based on this context, generate an appropriate opening question that acknowledges you've seen their context and asks about their current operational challenges or energy drains.

Keep it 1-2 sentences. Be warm but professional. Don't use corporate jargon.
Return ONLY the question text, nothing else.`,
      },
    ]);
    return result || DEFAULT_OPENING;
  } catch (err) {
    console.error("AI failed for first question, using fallback:", err);
    return DEFAULT_OPENING;
  }
}

// ---------------------
// Generate Next Question
// ---------------------
async function generateNextQuestion(
  jdText: string,
  messages: Array<{ role: string; content: string }>,
  stage: number,
  userTurns: number,
): Promise<string> {
  const stageGuidance =
    stage === 1
      ? "You are in Stage 1 (Energy Mapping). Focus on understanding what's consuming their capacity, where friction lives, and what patterns they're seeing."
      : stage === 2
        ? "You are in Stage 2 (Bottleneck Diagnosis). Focus on impact of bottlenecks, workaround behaviors, and whether information flows properly."
        : "You are in Stage 3 (Improvement & Ownership). Focus on where leverage lives, who owns improvement, and whether teams have capacity to change.";

  // Build proper multi-turn messages for OpenAI
  const chatMessages: Array<{ role: string; content: string }> = [
    { role: "system", content: DIAGNOSTIC_SYSTEM_PROMPT },
  ];

  if (jdText) {
    chatMessages.push({
      role: "system",
      content: `Context provided by the user:\n"""\n${jdText.slice(0, 6000)}\n"""`,
    });
  }

  // Add conversation history as proper multi-turn messages
  for (const msg of messages) {
    chatMessages.push({ role: msg.role, content: msg.content });
  }

  // Add generation instruction
  chatMessages.push({
    role: "user",
    content: `[SYSTEM INSTRUCTION - NOT A USER MESSAGE]
${stageGuidance}
User turn count: ${userTurns}

Based on the last user response, generate your next message. Remember to:
1. Briefly synthesize or acknowledge what they shared (1 sentence)
2. Ask your next diagnostic question (1-2 sentences)

Keep the total response to 2-4 sentences. Be conversational and curious, not interrogating.
Return ONLY your response text.`,
  });

  try {
    const response = await callOpenAI(chatMessages);
    return response || getFallbackQuestion(stage, userTurns);
  } catch {
    return getFallbackQuestion(stage, userTurns);
  }
}

// ---------------------
// Generate Report
// ---------------------
async function generateReport(
  jdText: string,
  messages: Array<{ role: string; content: string }>,
): Promise<any> {
  const reportSystemPrompt = `You are producing a FitReport based on a diagnostic conversation about operational bottlenecks and organizational challenges.

Your job is to synthesize the conversation into actionable insights about:
1. Where leverage lives in their organization
2. What bottlenecks were identified
3. How Calum Kershaw's skills could address these challenges
4. What conditions would need to be true for success

About Calum Kershaw:
- AI Solutions Developer & Systems Thinker
- Skills: TypeScript, Python, React, Node.js, OpenAI API, RAG Systems
- Strengths: Systems thinking, process optimization, AI integration, data quality
- Experience: Building AI tools, operations management, data analysis

Be honest and specific. Reference actual points from the conversation.`;

  const conversation = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const userPrompt = `${jdText ? `Context provided:\n"""\n${jdText.slice(0, 6000)}\n"""\n\n` : ""}Diagnostic Conversation:
${conversation}

Based on this diagnostic conversation, generate a FitReport. Return ONLY valid JSON (no markdown, no code blocks):
{
  "verdict": "YES" or "NO" (based on whether Calum's skills match the identified needs),
  "roleAlignment": ["2-4 specific points about how Calum's skills align with the challenges discussed"],
  "environmentCompatibility": ["2-4 observations about organizational fit based on what was revealed"],
  "structuralRisks": ["2-4 potential challenges or red flags identified in the conversation"],
  "successConditions": ["2-4 conditions that would need to be true for success"],
  "gapPlan": ["2-4 specific actions for the first 30-90 days to address gaps"]
}`;

  try {
    const raw = await callOpenAI([
      { role: "system", content: reportSystemPrompt },
      { role: "user", content: userPrompt },
    ]);
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
    roleAlignment: [
      "Systems thinking approach aligns with identifying operational bottlenecks",
      "AI/automation skills relevant to improving information flow",
      "Data analysis background supports evidence-based improvement",
    ],
    environmentCompatibility: [
      "Adaptable to environments in transition",
      "Comfortable working across multiple stakeholders",
      "Quick learner in new domains",
    ],
    structuralRisks: [
      "Improvement initiatives need clear ownership to succeed",
      "Capacity constraints may limit ability to drive change",
      "Scope clarity important for early wins",
    ],
    successConditions: [
      "Clear mandate to identify and address bottlenecks",
      "Access to key stakeholders and decision-makers",
      "Time allocated for improvement work, not just maintenance",
    ],
    gapPlan: [
      "Map current information flows in first 30 days",
      "Identify 2-3 quick wins that demonstrate value",
      "Build relationships with process owners early",
      "Document baseline metrics to show improvement",
    ],
  };
}

// ---------------------
// Handler
// ---------------------
export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const parsed = fitChatSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: parsed.error.errors[0]?.message ?? "Invalid input",
        }),
      };
    }

    const data = parsed.data;

    // ========== START ACTION ==========
    if (data.action === "start") {
      const firstPrompt = await generateFirstQuestion(data.jdText);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          stage: 1,
          role: "assistant",
          content: firstPrompt,
        }),
      };
    }

    // ========== MESSAGE ACTION ==========
    if (data.action === "message") {
      const { userMessage, jdText, messages, userTurns } = data;

      // Add the new user message to the history
      const fullMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage },
      ];

      const currentTurns = userTurns;
      const stage = computeStage(currentTurns);

      // Generate report after 8 user turns
      if (currentTurns >= 8) {
        const report = await generateReport(jdText, fullMessages);

        const closingMessage =
          "Thank you for sharing all of that. I have enough context now to put together a FitReport for you. Here's what I'm seeing...";

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            stage: 3,
            verdict: report.verdict,
            report,
            role: "assistant",
            content: closingMessage,
          }),
        };
      }

      // Generate next question
      const nextPrompt = await generateNextQuestion(
        jdText,
        fullMessages,
        stage,
        currentTurns,
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          stage,
          role: "assistant",
          content: nextPrompt,
        }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Unknown action" }),
    };
  } catch (err: any) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: err?.message || "Internal server error",
      }),
    };
  }
};
