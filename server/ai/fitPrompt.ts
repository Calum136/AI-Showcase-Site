import fs from "fs/promises";
import path from "path";

export type FitStage = 0 | 1 | 2 | 3;

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
  fitSignals: string[];
  risks: string[];
};

export type FitChoice = {
  id: string;
  label: string;
};

export type FitStep = {
  question: string;
  choices?: FitChoice[];
};

type AiOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  provider?: "anthropic" | "openai";
};

type NextStepInput = {
  problemStatement?: string;
  jdText?: string;
  stage: FitStage;
  userTurns: number;
  messages: FitMessage[];
};

type ReportInput = {
  problemStatement?: string;
  jdText?: string;
  messages: FitMessage[];
};

// Calum's resume context for fit analysis
const CALUM_RESUME_CONTEXT = `
CANDIDATE PROFILE: Calum Kershaw
Title: AI Solutions Developer & Systems Thinker
Location: Truro, Nova Scotia

SUMMARY:
Developer focused on AI systems integration, automation, and decision support tools. Building practical solutions that solve real operational problems through strategic AI implementation. Combines data analysis background with modern AI development.

TECHNICAL SKILLS:
- Languages: TypeScript, Python, JavaScript, SQL
- Frameworks: React, Node.js, Express
- AI/ML: OpenAI API, Anthropic Claude, RAG Systems, Vector Databases, Embeddings
- Data: PostgreSQL, Power BI, Data Analysis, ETL
- Other: Systems Design, Process Automation, API Development

KEY EXPERIENCE:
1. AI Systems Developer (Independent, 2025-Present)
   - Built JollyTails Staff Assistant: RAG-based knowledge system consolidating 20+ SOPs
   - Developed Fit Check AI using Claude API for job evaluation
   - Created MCP server integrations for workflow automation
   - Full-stack TypeScript applications

2. Operations Supervisor - Jolly Tails Pet Resort (2022, 2025-Present)
   - Improved operational KPIs by ~10% through data profiling
   - Built cross-system validation workflows
   - Technology liaison role

3. Data Analyst - STFX Advancement (2024-2025)
   - Power BI dashboards with rule-based quality checks
   - SQL data extraction and transformation
   - Root cause analysis

4. Student Manager - Kevin's Corner Food Bank (2023-2024)
   - Scaled operations supporting 140+ additional users
   - Designed workflows enabling 300% increase in operational hours

EDUCATION:
- Post-Bacc Diploma, Enterprise IT Management - St. Francis Xavier (2024)
- BSc, Biology & Psychology - Dalhousie University (2022)

CERTIFICATIONS:
- AI & Agentic Workflows - Maven (2025)
- Generative AI Leader - Google Cloud (2025)
- AI Mastery - Marketing AI Institute (2024-Present)

STRENGTHS:
- Bridging technical and operational perspectives
- Building AI systems that solve real business problems
- Data quality and systems thinking
- Quick learning and practical implementation

AREAS OF GROWTH:
- Enterprise-scale system architecture
- Team leadership in technical roles
- Deepening ML/AI theoretical foundations
`;

// -----------------------------
// Anthropic Claude API call
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
    throw new Error(
      `Anthropic API error (${response.status}): ${errorText || response.statusText}`
    );
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

function getAiOpts(overrides?: AiOptions): {
  provider: "anthropic" | "openai";
  apiKey: string;
  model: string;
  baseUrl: string;
} {
  // Check for Anthropic first (preferred)
  const anthropicKey = overrides?.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
  if (anthropicKey) {
    return {
      provider: "anthropic",
      apiKey: anthropicKey,
      model: overrides?.model ?? process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      baseUrl: "https://api.anthropic.com",
    };
  }

  // Fallback to OpenAI
  const openaiKey = process.env.OPENAI_API_KEY ?? "";
  if (openaiKey) {
    return {
      provider: "openai",
      apiKey: openaiKey,
      model: overrides?.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      baseUrl: overrides?.baseUrl ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com",
    };
  }

  throw new Error(
    "Missing API key. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in environment variables."
  );
}

// -----------------------------
// Generate next step as JSON { question, choices[] }
// -----------------------------
export async function aiGenerateNextStep(
  input: NextStepInput,
  overrides?: AiOptions
): Promise<FitStep> {
  const opts = getAiOpts(overrides);
  const jd = String(input.jdText ?? "").trim();

  const systemPrompt = `You are an AI career advisor helping evaluate job fit for Calum Kershaw.

${CALUM_RESUME_CONTEXT}

Your role is to ask clarifying questions about the job to better understand fit. Be conversational but focused.`;

  const userPrompt = `
Job Description:
"""
${jd.slice(0, 30000)}
"""

Conversation so far:
${input.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Current stage: ${input.stage} (0=intake, 1=narrowing, 2=deep dive, 3=report)
User turns: ${input.userTurns}

Generate the next question to ask about this job opportunity. Focus on understanding:
- Stage 0-1: Role responsibilities, team structure, key challenges
- Stage 2: Growth opportunities, decision-making authority, success metrics

Return ONLY valid JSON in this exact format (no markdown):
{
  "question": "Your question here",
  "choices": [
    { "id": "a", "label": "Choice 1" },
    { "id": "b", "label": "Choice 2" },
    { "id": "c", "label": "Choice 3" },
    { "id": "other", "label": "Other (I'll type my own)" }
  ]
}
`;

  let raw: string;
  if (opts.provider === "anthropic") {
    raw = await callAnthropicText(systemPrompt, userPrompt, opts);
  } else {
    raw = await callOpenAiText(systemPrompt + "\n\n" + userPrompt, opts);
  }

  // Extract JSON
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return {
      question: "What aspects of this role interest you most?",
      choices: [{ id: "other", label: "Type your answer" }],
    };
  }

  try {
    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    const question = String(parsed?.question ?? "").trim();
    const choicesRaw = Array.isArray(parsed?.choices) ? parsed.choices : [];

    const choices: FitChoice[] = choicesRaw
      .map((c: any) => ({
        id: String(c?.id ?? "").trim(),
        label: String(c?.label ?? "").trim(),
      }))
      .filter((c: FitChoice) => c.id && c.label);

    return {
      question: question || "What aspects of this role interest you most?",
      choices: choices.length ? choices : [{ id: "other", label: "Type your answer" }],
    };
  } catch {
    return {
      question: "What aspects of this role interest you most?",
      choices: [{ id: "other", label: "Type your answer" }],
    };
  }
}

// Backwards-compatible helper
export async function aiGenerateNextPrompt(
  input: NextStepInput,
  overrides?: AiOptions
) {
  const step = await aiGenerateNextStep(input, overrides);
  return step.question;
}

// -----------------------------
// Report generation
// -----------------------------
export async function aiGenerateReport(
  input: ReportInput,
  overrides?: AiOptions
): Promise<FitReport> {
  const opts = getAiOpts(overrides);
  const jd = String(input.jdText ?? "").trim();

  const systemPrompt = `You are producing a FitReport based on a diagnostic conversation about operational challenges.

${CALUM_RESUME_CONTEXT}

LANGUAGE RULES (CRITICAL):
- Write EVERYTHING in plain language a non-technical business owner would understand
- NO tech jargon: no "AI-powered", "RAG system", "pipeline", "API", "integration layer"
- INSTEAD use: "automate the repetitive part", "sort incoming requests automatically", "give your team one place to see everything"
- The hero recommendation should describe the OUTCOME for the user's team, not the technology
- Reference specific things from the conversation
- Be honest and balanced.`;

  const userPrompt = `
Job Description / Context:
"""
${jd.slice(0, 30000)}
"""

Conversation transcript:
${input.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Generate a FitReport. The heroRecommendation should be a single bold sentence describing the outcome — what changes for the team.

Return ONLY valid JSON (no markdown):
{
  "verdict": "YES" or "NO",
  "heroRecommendation": "One bold sentence describing the outcome for the team",
  "approachSummary": "2-3 plain-language sentences: what the problem is, what the fix looks like, what changes day-to-day",
  "keyInsights": [
    { "label": "The Problem", "detail": "plain language description" },
    { "label": "Where the Fix Lives", "detail": "plain language description" },
    { "label": "First Win", "detail": "one concrete thing that improves within weeks" }
  ],
  "timeline": {
    "phase1": { "label": "First 30 Days", "action": "plain language action" },
    "phase2": { "label": "Days 30-60", "action": "plain language action" },
    "phase3": { "label": "Days 60-90", "action": "plain language action" }
  },
  "fitSignals": ["2-3 plain-language reasons this is a good fit"],
  "risks": ["1-2 honest risks to flag"]
}
`;

  let raw: string;
  if (opts.provider === "anthropic") {
    raw = await callAnthropicText(systemPrompt, userPrompt, opts);
  } else {
    raw = await callOpenAiText(systemPrompt + "\n\n" + userPrompt, opts);
  }

  // Extract JSON
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("AI report did not contain valid JSON.");
  }

  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

  const verdict = parsed?.verdict === "YES" ? "YES" : "NO";
  const toStringArray = (v: any) =>
    Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : [];
  const toInsightArray = (v: any) =>
    Array.isArray(v)
      ? v.map((x: any) => ({
          label: String(x?.label ?? ""),
          detail: String(x?.detail ?? ""),
        }))
      : [];
  const toPhase = (v: any) => ({
    label: String(v?.label ?? ""),
    action: String(v?.action ?? ""),
  });

  return {
    verdict,
    heroRecommendation: String(parsed.heroRecommendation ?? ""),
    approachSummary: String(parsed.approachSummary ?? ""),
    keyInsights: toInsightArray(parsed.keyInsights),
    timeline: {
      phase1: toPhase(parsed.timeline?.phase1),
      phase2: toPhase(parsed.timeline?.phase2),
      phase3: toPhase(parsed.timeline?.phase3),
    },
    fitSignals: toStringArray(parsed.fitSignals),
    risks: toStringArray(parsed.risks),
  };
}
