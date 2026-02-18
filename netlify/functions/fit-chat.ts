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
- Dig into their specific situation using THEIR words

**Stage 2 - Bottleneck Diagnosis (3-4 exchanges)**
- Impact, behavior, workarounds, process maturity
- Go deeper on what THEY brought up, don't introduce new topics

**Stage 3 - Improvement & Ownership (3-4 exchanges)**
- Opportunity, ownership, resources, capacity for change

**CRITICAL RULES:**
- You MUST use specific words, phrases, or details from the user's last message in your synthesis. Quote or paraphrase them directly. Example: if they say "micromanagement", you say "You mentioned micromanagement — when that pressure shows up..."
- NEVER give generic acknowledgements like "That's interesting context" or "I hear you" or "That makes sense" without immediately connecting to something specific they said
- Never use corporate jargon ("synergy", "bandwidth", "touch base")
- Never sell Calum directly ("I can help with that")
- Keep responses 2-3 sentences max. One sentence of synthesis using their words, one question that digs deeper
- Be warm and human, not robotic
- Each response must feel like it could ONLY have been written after reading what the user just said

**About Calum Kershaw:**
AI Solutions Developer & Systems Thinker focused on AI systems integration, automation, and decision support tools.
Skills: TypeScript, Python, React, Node.js, OpenAI API, Anthropic Claude, RAG Systems, PostgreSQL
Experience: AI Systems Developer, Operations Supervisor, Data Analyst
Strengths: Systems thinking, AI integration, data quality, quick learning
`;

const DEFAULT_OPENING =
  "I appreciate you making the time. From your perspective, what's been taking up most of your energy lately?";

// ---------------------
// Fallback Questions (templated with user context)
// ---------------------
// Templates use {topic} which gets replaced with a keyword from the user's last message
const FALLBACK_TEMPLATES = {
  stage1: [
    "You brought up {topic} — when that tension shows up, does it tend to slow things down for just your team, or does it ripple across the organization?",
    "That point about {topic} stands out. Is that something that's been building over time, or did it surface recently?",
    "When you think about {topic}, is the core issue about how decisions get made, or about how information moves between people?",
    "{topic} — is that something people have tried to fix before, or is it one of those things everyone just works around?",
    "You mentioned {topic}. When that creates friction, where do you feel it first — in delivery timelines, in team energy, or somewhere else?",
    "Interesting that {topic} came up. Is the team aware that's a drag, or is it one of those invisible costs nobody talks about?",
  ],
  stage2: [
    "So when {topic} hits, what usually gives first — the timeline, the quality, or the team's focus?",
    "With {topic} being a factor, have people started building their own workarounds, or do they wait for the bottleneck to clear?",
    "On the {topic} side — does the right information exist but not reach the right people, or is it never captured in the first place?",
    "When {topic} creates delays, is it because someone specific needs to approve, or because nobody's sure who owns the decision?",
    "You're describing {topic} as a recurring issue. Has the team tried changing the process around it, or has it just become 'how things work here'?",
    "With {topic} in the picture — if you could wave a wand and fix one piece of how work flows, what would have the most immediate impact?",
  ],
  stage3: [
    "Given everything around {topic}, if one part of how work moves got noticeably smoother, where would you feel the biggest relief?",
    "When it comes to fixing {topic}, is that something someone owns, or does it fall between the cracks because everyone's busy keeping things running?",
    "On {topic} — does your team have breathing room to change how they work, or is most capacity locked into keeping today's plates spinning?",
    "If you solved the {topic} issue, what would that actually look like day-to-day for your team?",
    "You've painted a clear picture around {topic}. What would 'good' look like in 90 days if things started moving in the right direction?",
    "Last question on {topic} — is the organization ready to invest in fixing this, or is it still in the 'we know it's a problem but...' stage?",
  ],
};

/**
 * Extract a meaningful topic phrase from the user's last message.
 * Grabs the longest noun-phrase-ish chunk, or falls back to first several words.
 */
function extractTopic(userMessage: string): string {
  const cleaned = userMessage.trim().replace(/[.!?]+$/g, "");
  // If short enough, just use it
  if (cleaned.split(/\s+/).length <= 5) return cleaned.toLowerCase();
  // Take first meaningful clause (before first comma or period)
  const clause = cleaned.split(/[,.\n]/)[0].trim();
  if (clause.split(/\s+/).length <= 6) return clause.toLowerCase();
  // Last resort: first 5 words
  return clause.split(/\s+/).slice(0, 5).join(" ").toLowerCase();
}

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

function getFallbackQuestion(
  stage: number,
  userTurns: number,
  lastUserMessage?: string,
): string {
  const templates =
    stage === 1
      ? FALLBACK_TEMPLATES.stage1
      : stage === 2
        ? FALLBACK_TEMPLATES.stage2
        : FALLBACK_TEMPLATES.stage3;

  // Pick a random template (not sequential — feels less scripted)
  const template = templates[Math.floor(Math.random() * templates.length)];
  const topic = lastUserMessage
    ? extractTopic(lastUserMessage)
    : "what you described";
  return template.replace(/\{topic\}/g, topic);
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

Based on the user's LAST response, generate your next message. You MUST:
1. Reference a specific word, phrase, or idea from what they just said (not a generic "that's interesting")
2. Ask one diagnostic question that digs deeper into THEIR specific situation

Keep it to 2-3 sentences total. The response must feel like it could only exist because of what they just told you.
Return ONLY your response text.`,
  });

  // Extract last user message for fallback context
  const lastUserMsg = [...messages]
    .reverse()
    .find((m) => m.role === "user")?.content;

  try {
    const response = await callOpenAI(chatMessages);
    return response || getFallbackQuestion(stage, userTurns, lastUserMsg);
  } catch {
    return getFallbackQuestion(stage, userTurns, lastUserMsg);
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

Your job is to synthesize the conversation into ONE clear, actionable recommendation — not a generic assessment.

LANGUAGE RULES (CRITICAL):
- Write EVERYTHING in plain language a non-technical business owner would understand
- NO tech jargon: no "AI-powered", "RAG system", "pipeline", "API", "integration layer"
- INSTEAD use: "automate the repetitive part", "sort incoming requests automatically", "give your team one place to see everything", "stop things from falling through the cracks"
- The hero recommendation should describe the OUTCOME for the user's team, not the technology
- Reference specific things they said in the conversation

About Calum Kershaw:
- AI Solutions Developer & Systems Thinker
- Builds tools that automate repetitive work, improve information flow, and help teams make better decisions faster
- Background in operations management and data analysis
- Quickly learns new domains and finds the leverage points

Be honest, specific, and grounded in what was actually discussed.`;

  const conversation = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const userPrompt = `${jdText ? `Context provided:\n"""\n${jdText.slice(0, 6000)}\n"""\n\n` : ""}Diagnostic Conversation:
${conversation}

Based on this conversation, generate a FitReport. The heroRecommendation should be a single bold sentence describing the outcome — what changes for the team. NOT a technology pitch.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "verdict": "YES" or "NO",
  "heroRecommendation": "One bold sentence describing the outcome — e.g. 'Free your team from the approval bottleneck so they can move at the speed they want to'",
  "approachSummary": "2-3 plain-language sentences: what the problem is, what the fix looks like, and what changes day-to-day for the team",
  "keyInsights": [
    { "label": "The Problem", "detail": "plain language — what's actually slowing things down, referencing what they said" },
    { "label": "Where the Fix Lives", "detail": "plain language — what part of the system to change" },
    { "label": "First Win", "detail": "one concrete thing that would visibly improve within weeks" }
  ],
  "timeline": {
    "phase1": { "label": "First 30 Days", "action": "plain language action step" },
    "phase2": { "label": "Days 30-60", "action": "plain language action step" },
    "phase3": { "label": "Days 60-90", "action": "plain language action step" }
  },
  "fitSignals": ["2-3 plain-language reasons this is a good fit, referencing the conversation"],
  "risks": ["1-2 honest risks or things to watch for"]
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

  // Fallback report — plain language, matches new schema
  return {
    verdict: "YES",
    heroRecommendation:
      "Get your team unstuck by clearing the bottlenecks that slow down every decision",
    approachSummary:
      "Based on our conversation, the biggest drag on your team is waiting — waiting for approvals, waiting for information, waiting for decisions that should be straightforward. The fix isn't more meetings or more tools. It's identifying the 2-3 specific handoff points where things stall, and making them flow.",
    keyInsights: [
      {
        label: "The Problem",
        detail:
          "Work gets stuck between people, not inside their work. The team knows what to do but can't move until someone else weighs in.",
      },
      {
        label: "Where the Fix Lives",
        detail:
          "The handoff points between teams or between a team and leadership. That's where days get lost.",
      },
      {
        label: "First Win",
        detail:
          "Map out exactly where things stall and remove one unnecessary approval step. The team feels the difference immediately.",
      },
    ],
    timeline: {
      phase1: {
        label: "First 30 Days",
        action:
          "Observe and map where work actually stalls — talk to the people doing the work, not just leadership",
      },
      phase2: {
        label: "Days 30-60",
        action:
          "Fix the worst bottleneck with a simple, visible change that the team can feel immediately",
      },
      phase3: {
        label: "Days 60-90",
        action:
          "Build on the momentum — automate the repetitive parts and set up a rhythm so improvements stick",
      },
    },
    fitSignals: [
      "The challenges described are exactly the kind of systems problems Calum is built to solve",
      "The team is ready to move faster — they just need the blockers removed",
      "This is an operations-first problem, which matches Calum's background in operations and systems thinking",
    ],
    risks: [
      "If leadership isn't ready to let go of some approval steps, even the best fixes won't stick",
      "Change takes time — the team needs to see early wins to stay bought in",
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
