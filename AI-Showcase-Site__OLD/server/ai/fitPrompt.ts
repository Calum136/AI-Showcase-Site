import fs from "fs/promises";
import path from "path";

export type FitStage = 0 | 1 | 2 | 3;

export type FitMessage = {
  role: "user" | "assistant";
  content: string;
};

export type FitReport = {
  verdict: "YES" | "NO";
  roleAlignment: string[];
  environmentCompatibility: string[];
  structuralRisks: string[];
  successConditions: string[];
  gapPlan: string[];
};

export type FitChoice = {
  id: string; // stable-ish id for UI
  label: string;
};

export type FitStep = {
  question: string;
  choices?: FitChoice[]; // if present: render as multiple-choice buttons + "Other"
};

type AiOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
};

type NextStepInput = {
  // Instead of only JD, we allow a "problem statement" flow.
  // For now we still accept jdText for backwards compatibility.
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

const DEFAULT_MODEL = "gpt-4.1-mini";

// -----------------------------
// Docs loading (optional, future-proof)
// -----------------------------
async function safeReadText(relativePathFromRepoRoot: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), relativePathFromRepoRoot);
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

async function loadFitDocs() {
  const [systemPrompt, logic, operating] = await Promise.all([
    safeReadText("docs/ai_system_prompt.md"),
    safeReadText("docs/conversation_logic.md"),
    safeReadText("docs/operating_profile.md"),
  ]);

  return {
    combined: [systemPrompt, logic, operating]
      .filter(Boolean)
      .join("\n\n---\n\n"),
  };
}

// -----------------------------
// OpenAI call (Responses API first, Chat Completions fallback)
// -----------------------------
async function callOpenAiText(
  input: string,
  opts: Required<Pick<AiOptions, "apiKey" | "model" | "baseUrl">>,
): Promise<string> {
  const { apiKey, model, baseUrl } = opts;

  // 1) Responses API
  try {
    const r = await fetch(`${baseUrl}/v1/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
        text: { format: { type: "text" } },
      }),
    });

    if (r.ok) {
      const data: any = await r.json();
      const text =
        data?.output?.[0]?.content?.find((c: any) => c?.type === "output_text")
          ?.text ??
        data?.output_text ??
        data?.response?.output_text;

      if (typeof text === "string" && text.trim()) return text.trim();
    }
  } catch {
    // fall through
  }

  // 2) Chat Completions fallback
  const r2 = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "Return only the requested output. No markdown.",
        },
        { role: "user", content: input },
      ],
      temperature: 0.2,
    }),
  });

  if (!r2.ok) {
    const errText = await r2.text().catch(() => "");
    throw new Error(
      `OpenAI request failed (${r2.status}): ${errText || r2.statusText}`,
    );
  }

  const data2: any = await r2.json();
  const out = data2?.choices?.[0]?.message?.content;
  if (typeof out !== "string" || !out.trim()) {
    throw new Error("OpenAI returned an empty response.");
  }
  return out.trim();
}

function getAiOpts(
  overrides?: AiOptions,
): Required<Pick<AiOptions, "apiKey" | "model" | "baseUrl">> {
  const apiKey = overrides?.apiKey ?? process.env.OPENAI_API_KEY ?? "";
  const model = overrides?.model ?? process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  const baseUrl =
    overrides?.baseUrl ??
    process.env.OPENAI_BASE_URL ??
    "https://api.openai.com";

  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it in your Replit Secrets / env vars.",
    );
  }
  return { apiKey, model, baseUrl };
}

// -----------------------------
// NEW: Generate next step as JSON { question, choices[] }
// -----------------------------
export async function aiGenerateNextStep(
  input: NextStepInput,
  overrides?: AiOptions,
): Promise<FitStep> {
  const { combined } = await loadFitDocs();
  const { apiKey, model, baseUrl } = getAiOpts(overrides);

  const problem = String(input.problemStatement ?? "").trim();
  const jd = String(input.jdText ?? "").trim();

  const contextBlock = problem
    ? `Problem statement (from the hiring manager / operator):\n"""${problem.slice(0, 50_000)}"""\n`
    : jd
      ? `Job description:\n"""${jd.slice(0, 50_000)}"""\n`
      : `No JD provided. Ask to describe the gap/pain in simple terms.\n`;

  const prompt = `
You are generating the next assistant step for a mutual-fit BUSINESS PROBLEM assessment.

Audience:
- The user is a hiring manager / operator describing an organizational gap or pain point.
- This is NOT a job interview. Do NOT ask about the user's personal experiences or skills.

Your job:
- Ask ONE simple question that clarifies the business need.
- ALSO provide 3–5 multiple-choice answers that a busy manager can pick from.
- ALWAYS include an "Other (I'll type my own)" option as the last choice.

Hard rules:
- Output VALID JSON ONLY. No markdown.
- Keep the question under 2 short sentences.
- Choices must be short, plain language.
- Each choice must have: { "id": "a", "label": "..." }.
- Use ids: "a","b","c","d","e","other" (only as many as needed, always include "other").

Stage guidance:
- Stage 0: intake — clarify the gap/pain, impact, desired outcome, and whether they think they need person/system/both.
- Stage 1: fast narrowing — what kind of work is needed, what success looks like, what constraints exist.
- Stage 2: deeper — authority/data/tooling constraints, stakeholders, timeline, support for change.
- Stage 3: do not ask questions; stage 3 is report generation.

Conversation stage: ${input.stage}
User turns so far: ${input.userTurns}

${contextBlock}

Conversation so far:
${input.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Optional internal docs (may be empty):
${combined ? `---\n${combined}\n---` : "(none)"}

Return JSON exactly in this shape:
{
  "question": "string",
  "choices": [
    { "id": "a", "label": "..." },
    { "id": "b", "label": "..." },
    { "id": "c", "label": "..." },
    { "id": "other", "label": "Other (I'll type my own)" }
  ]
}
`.trim();

  const raw = await callOpenAiText(prompt, { apiKey, model, baseUrl });

  // Extract JSON safely
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("AI step did not contain valid JSON.");
  }

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
    question:
      question || "What gap or pain point are you trying to solve right now?",
    choices: choices.length
      ? choices
      : [{ id: "other", label: "Other (I'll type my own)" }],
  };
}

// -----------------------------
// Backwards-compatible helper: returns only the question text
// (so existing routes won't break while we update UI)
// -----------------------------
export async function aiGenerateNextPrompt(
  input: NextStepInput,
  overrides?: AiOptions,
) {
  const step = await aiGenerateNextStep(input, overrides);
  return step.question;
}

// -----------------------------
// Report generation (unchanged shape for now)
// We'll update this later to include "need synthesis" explicitly.
// -----------------------------
export async function aiGenerateReport(
  input: ReportInput,
  overrides?: AiOptions,
): Promise<FitReport> {
  const { combined } = await loadFitDocs();
  const { apiKey, model, baseUrl } = getAiOpts(overrides);

  const problem = String(input.problemStatement ?? "").trim();
  const jd = String(input.jdText ?? "").trim();

  const contextBlock = problem
    ? `Problem statement:\n"""${problem.slice(0, 50_000)}"""\n`
    : `Job description:\n"""${jd.slice(0, 50_000)}"""\n`;

  const prompt = `
You are producing the FINAL report for a mutual fit BUSINESS PROBLEM assessment.

Return VALID JSON ONLY (no markdown, no commentary).
Schema:
{
  "verdict": "YES" | "NO",
  "roleAlignment": string[2..5],
  "environmentCompatibility": string[2..5],
  "structuralRisks": string[2..5],
  "successConditions": string[2..5],
  "gapPlan": string[2..5]
}

Rules:
- Verdict must be a realistic mutual-fit conclusion based on the context + conversation.
- Avoid hype, avoid absolutes. Use neutral, observational phrasing.
- If info is missing, reflect it as a condition or risk (don’t invent specifics).

${contextBlock}

Conversation transcript:
${input.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Optional internal docs (may be empty):
${combined ? `---\n${combined}\n---` : "(none)"}

Now output JSON only:
`.trim();

  const raw = await callOpenAiText(prompt, { apiKey, model, baseUrl });

  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("AI report did not contain valid JSON.");
  }

  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

  const verdict = parsed?.verdict === "YES" ? "YES" : "NO";
  const toStringArray = (v: any) =>
    Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : [];

  return {
    verdict,
    roleAlignment: toStringArray(parsed.roleAlignment),
    environmentCompatibility: toStringArray(parsed.environmentCompatibility),
    structuralRisks: toStringArray(parsed.structuralRisks),
    successConditions: toStringArray(parsed.successConditions),
    gapPlan: toStringArray(parsed.gapPlan),
  };
}
