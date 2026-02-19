export type FitMessage = {
  role: "user" | "assistant";
  content: string;
};

export type FitReport = {
  verdict: "YES" | "NO";
  heroRecommendation: string;
  approachSummary: string;
  keyInsights: Array<{ label: string; detail: string }>;
  timeline: {
    phase1: { label: string; action: string };
    phase2: { label: string; action: string };
    phase3: { label: string; action: string };
  };
  scores?: Array<{ label: string; current: number; projected: number }>;
  fitSignals: string[];
  risks: string[];
};

type AiOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  provider?: "anthropic" | "openai";
};

type NextResponseInput = {
  jdText?: string;
  userTurns: number;
  messages: FitMessage[];
};

type ReportInput = {
  jdText?: string;
  messages: FitMessage[];
};

// Calum's resume context for fit analysis
const CALUM_RESUME_CONTEXT = `
CANDIDATE PROFILE: Calum Kershaw
Title: AI Systems Developer & Process Analyst
Location: Truro, Nova Scotia

SUMMARY:
Technology leader who translates business priorities into working systems. Combines hands-on AI development with operations experience to deliver tools that reduce manual work, improve information flow, and help teams make better decisions faster. Currently delivering client AI automation and building agent-orchestrated systems for real businesses.

TECHNICAL SKILLS:
- AI & Automation: OpenAI API, Anthropic Claude, RAG Systems, Vector DBs, Embeddings, Agent Orchestration, MCP Servers, Make.com
- Development: TypeScript, Python, React, Node.js, Express, PostgreSQL, SQLite, REST APIs
- Data & Analytics: Power BI, SQL, ETL Pipelines, Data Profiling, Root Cause Analysis, Dashboard Design
- Process & Delivery: Systems Thinking, Process Automation, Workflow Design, Stakeholder Management, Requirements Translation

KEY EXPERIENCE:
1. AI Solutions Developer (Independent Practice, 2025-Present)
   - Blackbird Brewing: End-to-end AI email automation — 17-category classifier with escalation rules, brand-voice matching, ~120 emails/week, delivered on budget in 3 weeks
   - JollyTails Resort: RAG-powered Q&A system consolidating 20+ fragmented SOPs with admin analytics dashboard
   - Built MCP server for cross-tool project memory bridging Claude Code, Claude Desktop, GPT, and Codex
   - Multi-agent workflows for parallel execution of frontend, backend, SEO, and documentation tasks

2. Operations Supervisor - Jolly Tails Pet Resort (2022, 2025-Present)
   - Improved operational KPIs by ~10% through data profiling and process optimization
   - Technology liaison translating operational needs into system requirements

3. Data Analyst - St. Francis Xavier University, Advancement Office (2024-2025)
   - Power BI dashboards with rule-based quality checks
   - SQL queries for complex data extraction and reporting

4. Student Manager - Kevin's Corner Food Bank, StFX (2023-2024)
   - Scaled operations to support 140+ additional users
   - Designed workflows enabling 300% increase in operational hours

EDUCATION:
- Post-Bacc Diploma, Enterprise IT Management - St. Francis Xavier (2024)
- BSc, Biology & Psychology - Dalhousie University (2022)

CERTIFICATIONS:
- AI & Agentic Workflows - Maven (2025)
- Generative AI Leader - Google Cloud (2025)
- AI Mastery Program - Marketing AI Institute (2024-Present)
`;

const DIAGNOSTIC_SYSTEM_PROMPT = `You are Calum Kershaw's diagnostic AI assistant. Your job is to have a real conversation that finds the ONE biggest operational pain point and drills into the root cause.

${CALUM_RESUME_CONTEXT}

**Your Persona:**
- Systems-thinking consultant who actually listens
- Genuinely curious, not interrogating
- Grounded, professional, unhurried

**Your Goal:**
Find the ONE root cause bottleneck. Start with a symptom, dig until you hit the actual problem.

**How to respond:**
- Every response is 1-2 sentences max
- DO NOT repeat or restate what the user just said. They already know what they told you — go straight to your insight or follow-up question
- Show you understood by building ON what they said, not by echoing it back
- Your response should feel like a natural next beat in the conversation

**CRITICAL RULES:**
- NEVER start your response by summarizing or paraphrasing what the user just said. No "So you're saying...", no "It sounds like...", no restating their words
- Jump straight to your observation, insight, or follow-up question
- Use their specific terminology naturally but do NOT repeat their sentences
- NEVER give generic responses
- NEVER ask checklist questions
- If the user gives garbage input, respond: "I want to give you something actually useful — could you share what's taking up the most time or causing the most friction in your day-to-day?"
- Keep drilling into ONE thread
- Never sell Calum directly

**RESPONSE FORMAT:**
Return ONLY valid JSON: { "message": "your response", "readyForReport": false }
Set readyForReport to true when you can name the root pain point. Typically 3-5 exchanges.`;

// -----------------------------
// Anthropic Claude API call (single turn)
// -----------------------------
async function callAnthropicText(
  systemPrompt: string,
  userPrompt: string,
  opts: { apiKey: string; model: string }
): Promise<string> {
  const { apiKey, model } = opts;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Anthropic API error (${response.status}): ${errorText || response.statusText}`);
  }

  const data: any = await response.json();
  const content = data?.content?.[0]?.text;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Anthropic returned an empty response.");
  }
  return content.trim();
}

// -----------------------------
// Anthropic multi-turn call
// -----------------------------
async function callAnthropicMultiTurn(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  opts: { apiKey: string; model: string }
): Promise<string> {
  const { apiKey, model } = opts;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Anthropic API error (${response.status}): ${errorText || response.statusText}`);
  }

  const data: any = await response.json();
  const content = data?.content?.[0]?.text;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Anthropic returned an empty response.");
  }
  return content.trim();
}

// -----------------------------
// OpenAI API call (fallback)
// -----------------------------
async function callOpenAiText(
  input: string,
  opts: { apiKey: string; model: string; baseUrl: string }
): Promise<string> {
  const { apiKey, model, baseUrl } = opts;

  const r = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Return only the requested output. No markdown wrappers." },
        { role: "user", content: input },
      ],
      temperature: 0.3,
    }),
  });

  if (!r.ok) {
    const errText = await r.text().catch(() => "");
    throw new Error(`OpenAI request failed (${r.status}): ${errText || r.statusText}`);
  }

  const data: any = await r.json();
  const out = data?.choices?.[0]?.message?.content;
  if (typeof out !== "string" || !out.trim()) {
    throw new Error("OpenAI returned an empty response.");
  }
  return out.trim();
}

function getAiOpts(overrides?: AiOptions) {
  const anthropicKey = overrides?.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
  if (anthropicKey) {
    return {
      provider: "anthropic" as const,
      apiKey: anthropicKey,
      model: overrides?.model ?? process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      baseUrl: "https://api.anthropic.com",
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY ?? "";
  if (openaiKey) {
    return {
      provider: "openai" as const,
      apiKey: openaiKey,
      model: overrides?.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      baseUrl: overrides?.baseUrl ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com",
    };
  }

  throw new Error("Missing API key. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.");
}

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
  return { message: raw.trim(), readyForReport: false };
}

// -----------------------------
// Generate next response (AI-driven readiness)
// -----------------------------
export async function aiGenerateNextResponse(
  input: NextResponseInput,
  overrides?: AiOptions
): Promise<{ message: string; readyForReport: boolean }> {
  const opts = getAiOpts(overrides);
  const jd = String(input.jdText ?? "").trim();

  const chatMessages: Array<{ role: string; content: string }> = [];

  if (jd) {
    chatMessages.push({
      role: "user",
      content: `Context about my business:\n"""\n${jd.slice(0, 6000)}\n"""`,
    });
    chatMessages.push({
      role: "assistant",
      content: '{"message": "Thanks for sharing that context. Let me ask you about it.", "readyForReport": false}',
    });
  }

  for (const msg of input.messages) {
    chatMessages.push({ role: msg.role, content: msg.content });
  }

  let turnGuidance = "";
  if (input.userTurns <= 2) {
    turnGuidance = "Early in the conversation. Understand the symptom, ask what the current process looks like. Do NOT set readyForReport to true.";
  } else if (input.userTurns <= 4) {
    turnGuidance = "Mid-conversation. Drill into the root cause. If you can name it clearly, set readyForReport to true.";
  } else {
    turnGuidance = "Several exchanges done. Summarize the root pain point and set readyForReport to true.";
  }

  chatMessages.push({
    role: "user",
    content: `[SYSTEM INSTRUCTION - NOT A USER MESSAGE]
${turnGuidance}
User turn count: ${input.userTurns}

Generate your next response. Follow the thread.
Return ONLY valid JSON: { "message": "your response", "readyForReport": true/false }`,
  });

  let raw: string;
  if (opts.provider === "anthropic") {
    raw = await callAnthropicMultiTurn(DIAGNOSTIC_SYSTEM_PROMPT, chatMessages, opts);
  } else {
    const prompt = `${DIAGNOSTIC_SYSTEM_PROMPT}\n\nConversation:\n${chatMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}`;
    raw = await callOpenAiText(prompt, opts);
  }

  const parsed = parseAiResponse(raw);

  if (!parsed.message) {
    return {
      message: "I want to make sure I understand — could you tell me a bit more about how that plays out day-to-day?",
      readyForReport: false,
    };
  }

  // Safety rails
  if (parsed.readyForReport && input.userTurns < 3) {
    parsed.readyForReport = false;
  }
  if (input.userTurns >= 6 && !parsed.readyForReport) {
    parsed.readyForReport = true;
  }

  return parsed;
}

// -----------------------------
// Report generation (with scores)
// -----------------------------
export async function aiGenerateReport(
  input: ReportInput,
  overrides?: AiOptions
): Promise<FitReport> {
  const opts = getAiOpts(overrides);
  const jd = String(input.jdText ?? "").trim();

  const systemPrompt = `You are producing a FitReport based on a diagnostic conversation where you identified a specific operational pain point.

${CALUM_RESUME_CONTEXT}

LANGUAGE RULES (CRITICAL):
- Write EVERYTHING in plain language a non-technical business owner would understand
- NO tech jargon
- The hero recommendation should describe the OUTCOME for the team
- Reference specific things from the conversation

SCORING RULES:
- Score 5-6 operational dimensions on a 0-10 scale based on what was discussed
- Pick dimensions RELEVANT to what came up
- Labels must be action-oriented and specific — describe what gets better, not abstract categories
  GOOD: "Time Freed Up", "Customer Self-Service", "Info Findability", "Manual Work Reduced", "Response Speed"
  BAD: "Staff Capacity", "Process Clarity", "Automation Level" (too vague)
- Keep labels SHORT (2-3 words max) so they display well on charts
- Be honest — a 3→7 jump is more credible than 2→9`;

  const userPrompt = `
${jd ? `Context:\n"""\n${jd.slice(0, 30000)}\n"""\n\n` : ""}Conversation:
${input.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Generate a FitReport focused on the ONE pain point identified.

Return ONLY valid JSON:
{
  "verdict": "YES" or "NO",
  "heroRecommendation": "One bold sentence — the outcome",
  "approachSummary": "2-3 plain sentences",
  "keyInsights": [
    { "label": "The Root Problem", "detail": "..." },
    { "label": "Where the Fix Lives", "detail": "..." },
    { "label": "First Win", "detail": "..." }
  ],
  "timeline": {
    "phase1": { "label": "First 30 Days", "action": "..." },
    "phase2": { "label": "Days 30-60", "action": "..." },
    "phase3": { "label": "Days 60-90", "action": "..." }
  },
  "scores": [
    { "label": "Time Freed Up", "current": 3, "projected": 7 },
    { "label": "Response Speed", "current": 3, "projected": 7 },
    { "label": "Info Findability", "current": 4, "projected": 8 },
    { "label": "Manual Work", "current": 6, "projected": 2 },
    { "label": "Customer Access", "current": 3, "projected": 8 }
  ],
  "fitSignals": ["..."],
  "risks": ["..."]
}

Pick 5-6 dimensions most relevant to THIS conversation. Don't use the examples if they don't fit.`;

  let raw: string;
  if (opts.provider === "anthropic") {
    raw = await callAnthropicText(systemPrompt, userPrompt, opts);
  } else {
    raw = await callOpenAiText(systemPrompt + "\n\n" + userPrompt, opts);
  }

  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("AI report did not contain valid JSON.");
  }

  const p = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

  const toStringArray = (v: any) =>
    Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : [];
  const toInsightArray = (v: any) =>
    Array.isArray(v) ? v.map((x: any) => ({ label: String(x?.label ?? ""), detail: String(x?.detail ?? "") })) : [];
  const toPhase = (v: any) => ({ label: String(v?.label ?? ""), action: String(v?.action ?? "") });
  const toScores = (v: any) =>
    Array.isArray(v)
      ? v.map((x: any) => ({
          label: String(x?.label ?? ""),
          current: Math.min(10, Math.max(0, Number(x?.current ?? 5))),
          projected: Math.min(10, Math.max(0, Number(x?.projected ?? 7))),
        }))
      : [];

  return {
    verdict: p?.verdict === "YES" ? "YES" : "NO",
    heroRecommendation: String(p.heroRecommendation ?? ""),
    approachSummary: String(p.approachSummary ?? ""),
    keyInsights: toInsightArray(p.keyInsights),
    timeline: {
      phase1: toPhase(p.timeline?.phase1),
      phase2: toPhase(p.timeline?.phase2),
      phase3: toPhase(p.timeline?.phase3),
    },
    scores: toScores(p.scores),
    fitSignals: toStringArray(p.fitSignals),
    risks: toStringArray(p.risks),
  };
}
