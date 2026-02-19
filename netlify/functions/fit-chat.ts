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
// System Prompt — Natural Diagnostic Conversation
// ---------------------
const DIAGNOSTIC_SYSTEM_PROMPT = `You are Calum Kershaw's diagnostic AI assistant. Your job is to have a real conversation that finds the ONE biggest operational pain point and drills into the root cause.

**Your Persona:**
- Systems-thinking consultant who actually listens
- Genuinely curious, not interrogating
- Grounded, professional, unhurried
- You sound like a person, not a chatbot

**Your Goal:**
Find the ONE root cause bottleneck. NOT survey the whole business. Start with a symptom, dig until you hit the actual problem.

**Example of a good conversation:**
- User: "Too many customer complaints about finding info online"
- You: "And how is that information structured right now?"
- User: "Hierarchical menus on our website"
- You: "So likely a navigation issue — are customers calling in when they can't find things?"
- User: "Yeah, staff spend half their day answering calls, emails, and sorting files"
- You: "That's the real problem — your staff are burning hours on repetitive information requests instead of doing their actual work."

**How to respond:**
- Every response is 1-2 sentences max
- DO NOT repeat or restate what the user just said. They already know what they told you — go straight to your insight or follow-up question
- Show you understood by building ON what they said, not by echoing it back
- Your response should feel like a natural next beat in the conversation — the way a sharp consultant would respond
- Every question must ONLY make sense as a response to what they just said
- Never ask a question that could apply to any business — it must be specific to their situation

**CRITICAL RULES:**
- NEVER start your response by summarizing or paraphrasing what the user just said. No "So you're saying...", no "It sounds like...", no restating their words back to them
- Jump straight to your observation, insight, or follow-up question
- Use their specific terminology naturally (if they say "emails" you say "emails") but do NOT repeat their sentences
- NEVER give generic responses ("That's interesting", "I hear you", "That makes sense")
- NEVER ask checklist questions ("What about your team structure?", "How do you handle approvals?")
- If the user gives garbage input (single words, "test", "asdf", nonsense), respond: "I want to give you something actually useful — could you share what's taking up the most time or causing the most friction in your day-to-day?"
- Keep drilling into ONE thread. Don't branch to new topics
- Never sell Calum directly

**About Calum Kershaw:**
AI Systems Developer & Process Analyst who translates business priorities into working systems.
Builds tools that automate repetitive work, improve information flow, and help teams make decisions faster.
Client experience includes Blackbird Brewing (~120 emails/week automated), JollyTails (20+ SOPs consolidated).
Background in operations management, data analysis, and end-to-end project delivery.

**RESPONSE FORMAT:**
You MUST return valid JSON (no markdown, no code blocks):
{
  "message": "Your conversational response here",
  "readyForReport": false
}

Set readyForReport to true ONLY when you can name the root pain point in one sentence. This typically takes 3-5 exchanges.`;

const DEFAULT_OPENING = "What's the thing that's eating the most time at work right now?";

// ---------------------
// OpenAI Helper
// ---------------------
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  temperature = 0.4,
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
// Parse AI JSON response safely
// ---------------------
function parseAiResponse(raw: string): { message: string; readyForReport: boolean } {
  try {
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      return {
        message: String(parsed.message || "").trim(),
        readyForReport: Boolean(parsed.readyForReport),
      };
    }
  } catch {}
  // If not valid JSON, treat the whole response as the message
  return { message: raw.trim(), readyForReport: false };
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
        content: `The user has provided this context about their business or role:
"""
${jdText.slice(0, 10000)}
"""

Based on this context, ask ONE specific opening question about what's causing the most friction in their day-to-day operations. Reference something specific from what they shared.

Return ONLY valid JSON: { "message": "your question", "readyForReport": false }`,
      },
    ]);
    const parsed = parseAiResponse(result);
    return parsed.message || DEFAULT_OPENING;
  } catch (err) {
    console.error("AI failed for first question:", err);
    return DEFAULT_OPENING;
  }
}

// ---------------------
// Generate Next Response
// ---------------------
async function generateNextResponse(
  jdText: string,
  messages: Array<{ role: string; content: string }>,
  userTurns: number,
): Promise<{ message: string; readyForReport: boolean }> {
  const chatMessages: Array<{ role: string; content: string }> = [
    { role: "system", content: DIAGNOSTIC_SYSTEM_PROMPT },
  ];

  if (jdText) {
    chatMessages.push({
      role: "system",
      content: `Context the user provided about their business:\n"""\n${jdText.slice(0, 6000)}\n"""`,
    });
  }

  // Add conversation history as proper multi-turn messages
  for (const msg of messages) {
    chatMessages.push({ role: msg.role, content: msg.content });
  }

  // Add turn-count guidance
  let turnGuidance = "";
  if (userTurns <= 2) {
    turnGuidance = "You are early in the conversation. Focus on understanding the symptom and asking what the current process looks like. Do NOT set readyForReport to true yet.";
  } else if (userTurns <= 4) {
    turnGuidance = "You are mid-conversation. You should be drilling into the root cause — who feels it, what breaks when it piles up. If you can name the root pain point clearly, you can set readyForReport to true.";
  } else {
    turnGuidance = "You've had several exchanges. You should have enough context now. Summarize the root pain point back to them and set readyForReport to true. If you genuinely don't have enough info, ask one final clarifying question.";
  }

  chatMessages.push({
    role: "user",
    content: `[SYSTEM INSTRUCTION - NOT A USER MESSAGE]
${turnGuidance}
User turn count: ${userTurns}

Based on the conversation, generate your next response. Follow the thread — don't introduce new topics.

Return ONLY valid JSON (no markdown): { "message": "your response", "readyForReport": true/false }`,
  });

  try {
    const raw = await callOpenAI(chatMessages);
    const parsed = parseAiResponse(raw);

    if (!parsed.message) {
      return {
        message: "I want to make sure I understand — could you tell me a bit more about how that plays out day-to-day?",
        readyForReport: false,
      };
    }

    // Safety rails: minimum 3 turns before report, force report at 6
    if (parsed.readyForReport && userTurns < 3) {
      parsed.readyForReport = false;
    }
    if (userTurns >= 6 && !parsed.readyForReport) {
      parsed.readyForReport = true;
    }

    return parsed;
  } catch (err) {
    console.error("AI call failed:", err);
    return {
      message: "I'm having trouble connecting right now — could you try that again?",
      readyForReport: false,
    };
  }
}

// ---------------------
// Generate Report (with operational scores)
// ---------------------
async function generateReport(
  jdText: string,
  messages: Array<{ role: string; content: string }>,
): Promise<any> {
  const reportSystemPrompt = `You are producing a FitReport based on a diagnostic conversation where you identified a specific operational pain point.

Your job is to synthesize the conversation into ONE clear, actionable recommendation focused on the root cause you discovered.

LANGUAGE RULES (CRITICAL):
- Write EVERYTHING in plain language a non-technical business owner would understand
- NO tech jargon: no "AI-powered", "RAG system", "pipeline", "API", "integration layer"
- INSTEAD use: "automate the repetitive part", "sort incoming requests automatically", "give your team one place to find everything", "stop things from falling through the cracks"
- The hero recommendation should describe the OUTCOME for the team, not the technology
- Reference specific things they said in the conversation

SCORING RULES:
- Score 5-6 operational dimensions on a 0-10 scale based on what was discussed
- Pick dimensions RELEVANT to what came up (not a generic set for every business)
- Labels must be action-oriented and specific — describe what gets better, not abstract categories
  GOOD: "Time Freed Up", "Customer Self-Service", "Info Findability", "Manual Work Reduced", "Response Speed"
  BAD: "Staff Capacity", "Process Clarity", "Automation Level" (too vague — what does that mean to a business owner?)
- Keep labels SHORT (2-3 words max) so they display well on charts
- "current" = where they are now based on the conversation
- "projected" = realistic expected improvement if the recommended solution is implemented
- Be honest — don't inflate projected scores unrealistically. A 3→7 jump is more credible than 2→9

About Calum Kershaw:
- AI Systems Developer & Process Analyst with client delivery experience
- Builds tools that automate repetitive work, improve information flow, and help teams make decisions faster
- Delivered AI email automation for Blackbird Brewing (~120 emails/week automated)
- Background in operations management, data analysis, and end-to-end project delivery

Be honest, specific, and grounded in what was actually discussed.`;

  const conversation = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const userPrompt = `${jdText ? `Context provided:\n"""\n${jdText.slice(0, 6000)}\n"""\n\n` : ""}Diagnostic Conversation:
${conversation}

Based on this conversation, generate a FitReport focused on the ONE pain point you identified.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "verdict": "YES" or "NO",
  "heroRecommendation": "One bold sentence describing the outcome — what changes for the team",
  "approachSummary": "2-3 plain-language sentences: what the root problem is, what the fix looks like, and what changes day-to-day",
  "keyInsights": [
    { "label": "The Root Problem", "detail": "plain language — the one thing causing the most pain, using their words" },
    { "label": "Where the Fix Lives", "detail": "plain language — what part of the workflow to change" },
    { "label": "First Win", "detail": "one concrete thing that improves within weeks" }
  ],
  "timeline": {
    "phase1": { "label": "First 30 Days", "action": "plain language action step" },
    "phase2": { "label": "Days 30-60", "action": "plain language action step" },
    "phase3": { "label": "Days 60-90", "action": "plain language action step" }
  },
  "scores": [
    { "label": "Info Findability", "current": 4, "projected": 8 },
    { "label": "Time Freed Up", "current": 3, "projected": 7 },
    { "label": "Response Speed", "current": 3, "projected": 7 },
    { "label": "Manual Work", "current": 6, "projected": 2 },
    { "label": "Customer Access", "current": 3, "projected": 8 }
  ],
  "fitSignals": ["2-3 plain-language reasons this is a good fit"],
  "risks": ["1-2 honest risks or things to watch for"]
}

Pick 5-6 dimensions most relevant to THIS conversation. Don't use the example dimensions if they don't fit — choose ones that reflect what was actually discussed.`;

  try {
    const raw = await callOpenAI([
      { role: "system", content: reportSystemPrompt },
      { role: "user", content: userPrompt },
    ], 0.3);
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
    heroRecommendation:
      "Free your team from the repetitive tasks that eat their day so they can focus on work that actually matters",
    approachSummary:
      "Based on our conversation, the biggest drain is repetitive manual work — answering the same questions, sorting the same files, handling the same requests over and over. The fix is identifying those repeating patterns and automating the predictable parts so your team gets their time back.",
    keyInsights: [
      {
        label: "The Root Problem",
        detail: "Your team is spending hours on tasks that follow the same pattern every time — that's time they can't spend on the work that actually needs a human.",
      },
      {
        label: "Where the Fix Lives",
        detail: "The handoff point where requests come in and someone has to manually sort, respond, or route them. That's where automation has the biggest impact.",
      },
      {
        label: "First Win",
        detail: "Automate the most common request type — the one that eats the most time. The team feels the difference immediately.",
      },
    ],
    timeline: {
      phase1: {
        label: "First 30 Days",
        action: "Map the top 5 repetitive tasks and measure how much time each one takes",
      },
      phase2: {
        label: "Days 30-60",
        action: "Automate the #1 time sink — build it, test it, get the team using it",
      },
      phase3: {
        label: "Days 60-90",
        action: "Expand to the next 2-3 tasks and set up a rhythm so improvements stick",
      },
    },
    scores: [
      { label: "Info Findability", current: 4, projected: 7 },
      { label: "Time Freed Up", current: 3, projected: 7 },
      { label: "Response Speed", current: 4, projected: 8 },
      { label: "Manual Work", current: 6, projected: 2 },
      { label: "Team Focus", current: 3, projected: 7 },
    ],
    fitSignals: [
      "The challenges described match Calum's track record of automating repetitive workflows for real businesses",
      "The team is ready to move faster — they just need the repetitive parts handled",
    ],
    risks: [
      "If the team is too stretched to participate in the transition, even good automation can stall",
      "Change takes time — early wins are critical to keep momentum",
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

      const fullMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage },
      ];

      // Get AI's next response (AI decides readiness)
      const aiResponse = await generateNextResponse(jdText, fullMessages, userTurns);

      // If AI says ready for report, generate it
      if (aiResponse.readyForReport) {
        // Add the AI's closing synthesis to the conversation before generating report
        const reportMessages = [
          ...fullMessages,
          { role: "assistant" as const, content: aiResponse.message },
        ];

        const report = await generateReport(jdText, reportMessages);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            stage: 3,
            verdict: report.verdict,
            report,
            role: "assistant",
            content: aiResponse.message,
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          stage: 1,
          role: "assistant",
          content: aiResponse.message,
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
