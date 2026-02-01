import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";

// Shared session storage (persisted across function invocations via external store would be better)
// For MVP, we'll use a simple approach
const fitMessageSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(20_000),
});

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
  const conversation = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

  const stageGuidance = stage === 1
    ? "You are in Stage 1 (Energy Mapping). Focus on understanding what's consuming their capacity, where friction lives, and what patterns they're seeing."
    : stage === 2
    ? "You are in Stage 2 (Bottleneck Diagnosis). Focus on impact of bottlenecks, workaround behaviors, and whether information flows properly."
    : "You are in Stage 3 (Improvement & Ownership). Focus on where leverage lives, who owns improvement, and whether teams have capacity to change.";

  const userPrompt = `${jdText ? `Context provided by user:\n"""\n${jdText.slice(0, 6000)}\n"""\n\n` : ""}Conversation so far:
${conversation}

${stageGuidance}

User turn count: ${userTurns}

Based on their last response, generate your next message. Remember to:
1. Briefly synthesize or acknowledge what they shared (1 sentence)
2. Ask your next diagnostic question (1-2 sentences)

Keep the total response to 2-4 sentences. Be conversational and curious, not interrogating.
Return ONLY your response text.`;

  try {
    const response = await callOpenAI(DIAGNOSTIC_SYSTEM_PROMPT, userPrompt);
    return response || getFallbackQuestion(stage, userTurns);
  } catch {
    return getFallbackQuestion(stage, userTurns);
  }
}

function getFallbackQuestion(stage: number, userTurns: number): string {
  const questions = stage === 1
    ? FALLBACK_QUESTIONS.stage1
    : stage === 2
    ? FALLBACK_QUESTIONS.stage2
    : FALLBACK_QUESTIONS.stage3;
  return questions[userTurns % questions.length];
}

async function generateReport(jdText: string, messages: any[]): Promise<any> {
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

  const conversation = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

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
    const raw = await callOpenAI(reportSystemPrompt, userPrompt);
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
      "Data analysis background supports evidence-based improvement"
    ],
    environmentCompatibility: [
      "Adaptable to environments in transition",
      "Comfortable working across multiple stakeholders",
      "Quick learner in new domains"
    ],
    structuralRisks: [
      "Improvement initiatives need clear ownership to succeed",
      "Capacity constraints may limit ability to drive change",
      "Scope clarity important for early wins"
    ],
    successConditions: [
      "Clear mandate to identify and address bottlenecks",
      "Access to key stakeholders and decision-makers",
      "Time allocated for improvement work, not just maintenance"
    ],
    gapPlan: [
      "Map current information flows in first 30 days",
      "Identify 2-3 quick wins that demonstrate value",
      "Build relationships with process owners early",
      "Document baseline metrics to show improvement"
    ],
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

    // Stage transitions for 3-stage conversation (8-12 exchanges)
    // Stage 1: Turns 1-4 (Energy Mapping)
    // Stage 2: Turns 5-8 (Bottleneck Diagnosis)
    // Stage 3: Turn 9+ (Report generation)

    if (session.userTurns >= 4 && session.stage === 1) {
      session.stage = 2;
    }

    // Generate report after 8 turns (allowing for 8-12 exchange range)
    if (session.userTurns >= 8) {
      session.stage = 3;
      const report = await generateReport(session.jdText, session.messages);
      session.verdict = report.verdict;
      session.report = report;

      const closingMessage = "Thank you for sharing all of that. I have enough context now to put together a FitReport for you. Here's what I'm seeing...";
      session.messages.push({ role: "assistant", content: closingMessage });

      sessions.set(sessionId, session);

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
