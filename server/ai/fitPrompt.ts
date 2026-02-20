export type FitMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ROIReport = {
  businessName: string;
  industry: string;
  topOpportunity: {
    title: string;
    description: string;
  };
  estimatedImpact: {
    currentHoursPerWeek: number;
    automationPercentage: number;
    timeSavedHoursPerWeek: number;
    hourlyRate: number;
    annualValue: number;
    implementationCost: number;
    paybackMonths: number;
  };
  secondaryOpportunities: Array<{
    title: string;
    description: string;
    timeSavedHoursPerWeek?: number;
  }>;
  recommendedNextStep: string;
};

export type DiagnosticContext = {
  businessName: string;
  industry: string;
  researchContext: string;
  softwareStack: string[];
  painAnswers: Array<{ question: string; answer: string }>;
};

type AiOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  provider?: "anthropic" | "openai";
};

// -----------------------------
// Industry hourly rates (conservative admin/ops averages)
// -----------------------------
export const INDUSTRY_HOURLY_RATES: Record<string, number> = {
  "Hospitality": 20,
  "Trades": 30,
  "Retail": 18,
  "Healthcare": 28,
  "Professional Services": 35,
  "Other": 25,
};

// -----------------------------
// Fallback questions if AI generation fails
// -----------------------------
const FALLBACK_PAIN_QUESTIONS = [
  "Which of your tools or daily processes causes the most headaches — where does work get stuck, duplicated, or slowed down?",
  "Across your whole team, roughly how many hours per week go into that problem area — including all the manual steps, re-entry, and follow-ups?",
  "If you could wave a magic wand and have one thing just happen automatically, what would it be?",
];

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

// -----------------------------
// Research: Industry intelligence brief
// -----------------------------
export async function aiResearchBusiness(
  input: { businessName: string; industry: string },
  overrides?: AiOptions
): Promise<string> {
  const opts = getAiOpts(overrides);

  const systemPrompt = `You are a business research analyst specializing in small and medium businesses. Given a business name and industry, produce a concise operational intelligence brief.

Focus on:
1. The 3-5 most common operational pain points in this specific industry
2. Typical software tools used in this industry and their common integration challenges
3. Average hourly labor cost range for admin/operations staff in this industry ($XX-$XX/hr)
4. The most impactful automation opportunities that exist TODAY using tools like Make.com, Zapier, or custom integrations
5. Industry-specific workflow bottlenecks that waste the most time

Be specific and factual. Reference real tools and real workflows. 600 words max. No fluff, no disclaimers.`;

  const userPrompt = `Business: ${input.businessName}\nIndustry: ${input.industry}`;

  if (opts.provider === "anthropic") {
    return await callAnthropicText(systemPrompt, userPrompt, opts);
  } else {
    return await callOpenAiText(`${systemPrompt}\n\n${userPrompt}`, opts);
  }
}

// -----------------------------
// Generate tailored pain questions
// -----------------------------
export async function aiGeneratePainQuestions(
  input: {
    businessName: string;
    industry: string;
    researchContext: string;
    softwareStack: string[];
  },
  overrides?: AiOptions
): Promise<string[]> {
  const opts = getAiOpts(overrides);

  const stackList = input.softwareStack.length > 0
    ? input.softwareStack.join(", ")
    : "no specific tools selected";

  const systemPrompt = `You are a business diagnostic specialist. Generate exactly 3 targeted discovery questions for a business diagnostic.

QUESTION STRUCTURE (you MUST follow this exact structure):

Q1: Ask which specific tool, process, or workflow from their stack causes them the MOST problems, friction, or wasted time. If they listed specific tools, name 2-3 of their tools as examples in the question. This question must identify their single biggest pain point.

Q2: Ask how many TOTAL hours per week their team spends on that problem area. Push for a concrete number. Emphasize "across your whole team" so they include all staff time — not just one person. Example framing: "Across everyone on your team, roughly how many total hours per week go into [the problem area] — including the manual steps, re-entry, double-checking, and follow-ups?"

Q3: Ask what one thing they most wish happened automatically. Reference their specific tools and connect it to the pain they described. This should uncover their ideal automation outcome.

RULES:
- Each question must be 1 sentence, conversational tone
- Questions must be SPECIFIC to this business's industry and tools — never generic
- Do NOT ask about budget or timeline
- Do NOT ask yes/no questions

Return ONLY a valid JSON array of exactly 3 strings. Example:
["Question 1?", "Question 2?", "Question 3?"]`;

  const userPrompt = `Business: ${input.businessName}
Industry: ${input.industry}
Software Stack: ${stackList}

Industry Research Context:
${input.researchContext.slice(0, 2000)}`;

  let raw: string;
  if (opts.provider === "anthropic") {
    raw = await callAnthropicText(systemPrompt, userPrompt, opts);
  } else {
    raw = await callOpenAiText(`${systemPrompt}\n\n${userPrompt}`, opts);
  }

  try {
    const arrStart = raw.indexOf("[");
    const arrEnd = raw.lastIndexOf("]");
    if (arrStart >= 0 && arrEnd > arrStart) {
      const parsed = JSON.parse(raw.slice(arrStart, arrEnd + 1));
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed.slice(0, 3).map(String);
      }
    }
  } catch {}

  return FALLBACK_PAIN_QUESTIONS;
}

// -----------------------------
// Server-side ROI math enforcement
// -----------------------------
function enforceROIMath(
  parsed: any,
  industry: string,
): ROIReport["estimatedImpact"] {
  const hourlyRate = INDUSTRY_HOURLY_RATES[industry] ?? 25;

  // Extract what Claude estimated
  const currentHoursPerWeek = Math.max(1, Number(parsed?.currentHoursPerWeek ?? parsed?.timeSavedHoursPerWeek ?? 10));
  const automationPercentage = Math.min(80, Math.max(20, Number(parsed?.automationPercentage ?? 60)));
  const timeSavedHoursPerWeek = Math.round(currentHoursPerWeek * automationPercentage / 100 * 10) / 10;
  const implementationCost = Math.max(2000, Math.round(Number(parsed?.implementationCost ?? 5000) / 100) * 100);

  // Always recalculate these from the formula — never trust Claude's arithmetic
  const annualValue = Math.round((timeSavedHoursPerWeek * hourlyRate * 52) / 100) * 100;
  const paybackMonths = annualValue > 0
    ? Math.round((implementationCost / (annualValue / 12)) * 10) / 10
    : 0;

  return {
    currentHoursPerWeek,
    automationPercentage,
    timeSavedHoursPerWeek,
    hourlyRate,
    annualValue,
    implementationCost,
    paybackMonths,
  };
}

// -----------------------------
// ROI Report generation
// -----------------------------
export async function aiGenerateROIReport(
  input: DiagnosticContext,
  overrides?: AiOptions
): Promise<ROIReport> {
  const opts = getAiOpts(overrides);

  const stackList = input.softwareStack.length > 0
    ? input.softwareStack.join(", ")
    : "No specific tools listed";

  const painQA = input.painAnswers
    .map((pa, i) => `Q${i + 1}: ${pa.question}\nA${i + 1}: ${pa.answer}`)
    .join("\n\n");

  const hourlyRate = INDUSTRY_HOURLY_RATES[input.industry] ?? 25;

  const systemPrompt = `You are a business automation consultant producing a specific ROI analysis based on diagnostic data. Your job is to identify the top automation opportunity and produce grounded, realistic numbers.

TIME ESTIMATION RULES:
- Extract the TOTAL hours/week the user mentioned from their answers (this is "currentHoursPerWeek")
- Be honest about what percentage can actually be automated (typically 40-70%, never claim 100%)
- timeSavedHoursPerWeek = currentHoursPerWeek × automationPercentage / 100
- The industry hourly rate for ${input.industry} is $${hourlyRate}/hr
- NEVER claim you can automate 100% of someone's time — be realistic

ROI CALCULATION RULES:
- annualValue = timeSavedHoursPerWeek × ${hourlyRate} × 52
- Implementation cost should be realistic: $2,000-$15,000 range for most SMB automations
- paybackMonths = implementationCost / (annualValue / 12)
- Be CONSERVATIVE — underpromise so results overdeliver

WORKED EXAMPLE (follow this math pattern):
If the user says ~20 hrs/week on manual tasks, and you estimate 55% can be automated:
- currentHoursPerWeek: 20
- automationPercentage: 55
- timeSavedHoursPerWeek: 20 × 0.55 = 11
- annualValue: 11 × ${hourlyRate} × 52 = ${11 * hourlyRate * 52}
- implementationCost: $6,000 (based on complexity)
- paybackMonths: 6000 / (${11 * hourlyRate * 52} / 12) = ${Math.round(6000 / (11 * hourlyRate * 52 / 12) * 10) / 10}

RECOMMENDATION RULES:
- The top opportunity MUST reference specific tools from their software stack
- Explain HOW the integration would work in plain language (mention Make.com, Zapier, or custom connections as appropriate)
- Name the exact data flow: "Data moves from [Tool A] to [Tool B] automatically when [trigger]"
- Secondary opportunities should be distinct from the primary one
- The recommended next step should be a clear, specific call to action

LANGUAGE RULES:
- Write everything in plain language a non-technical business owner would understand
- No jargon — no "RAG", "pipeline", "API", "webhook" in the final output
- Describe outcomes, not technology`;

  const userPrompt = `BUSINESS: ${input.businessName}
INDUSTRY: ${input.industry}
HOURLY RATE: $${hourlyRate}/hr (industry average for admin/ops staff)

SOFTWARE STACK: ${stackList}

INDUSTRY RESEARCH:
${input.researchContext.slice(0, 3000)}

DIAGNOSTIC ANSWERS:
${painQA}

Generate the ROI report. Return ONLY valid JSON:
{
  "businessName": "${input.businessName}",
  "industry": "${input.industry}",
  "topOpportunity": {
    "title": "Short name for the automation",
    "description": "2-3 sentences explaining what gets automated, which tools connect, and what changes day-to-day"
  },
  "estimatedImpact": {
    "currentHoursPerWeek": <number - total hours the user reported spending>,
    "automationPercentage": <number 0-100 - realistic % that can be automated>,
    "timeSavedHoursPerWeek": <number - currentHoursPerWeek * automationPercentage / 100>,
    "implementationCost": <number in dollars>
  },
  "secondaryOpportunities": [
    { "title": "...", "description": "...", "timeSavedHoursPerWeek": <number> },
    { "title": "...", "description": "...", "timeSavedHoursPerWeek": <number> }
  ],
  "recommendedNextStep": "A specific CTA sentence"
}`;

  let raw: string;
  if (opts.provider === "anthropic") {
    raw = await callAnthropicText(systemPrompt, userPrompt, opts);
  } else {
    raw = await callOpenAiText(`${systemPrompt}\n\n${userPrompt}`, opts);
  }

  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("AI report did not contain valid JSON.");
  }

  const p = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

  const toSecondary = (v: any) =>
    Array.isArray(v)
      ? v.slice(0, 3).map((x: any) => ({
          title: String(x?.title ?? ""),
          description: String(x?.description ?? ""),
          timeSavedHoursPerWeek: typeof x?.timeSavedHoursPerWeek === "number"
            ? x.timeSavedHoursPerWeek
            : undefined,
        }))
      : [];

  // Server-side math enforcement — always recalculate annualValue and paybackMonths
  const impact = enforceROIMath(p.estimatedImpact, input.industry);

  return {
    businessName: String(p.businessName ?? input.businessName),
    industry: String(p.industry ?? input.industry),
    topOpportunity: {
      title: String(p.topOpportunity?.title ?? "Workflow Automation"),
      description: String(p.topOpportunity?.description ?? ""),
    },
    estimatedImpact: impact,
    secondaryOpportunities: toSecondary(p.secondaryOpportunities),
    recommendedNextStep: String(p.recommendedNextStep ?? "Get in touch to walk through your actual workflows and refine these numbers."),
  };
}

// -----------------------------
// Fallback ROI report for API failures
// -----------------------------
export function fallbackROIReport(businessName: string, industry: string): ROIReport {
  const hourlyRate = INDUSTRY_HOURLY_RATES[industry] ?? 25;
  const currentHours = 15;
  const automationPct = 55;
  const timeSaved = Math.round(currentHours * automationPct / 100 * 10) / 10;
  const annualValue = Math.round((timeSaved * hourlyRate * 52) / 100) * 100;
  const implCost = 5000;
  const payback = Math.round((implCost / (annualValue / 12)) * 10) / 10;

  return {
    businessName,
    industry,
    topOpportunity: {
      title: "Repetitive Task Automation",
      description: `Based on what you've shared, the biggest opportunity is automating the manual, repetitive tasks that eat into your team's day. The most common pattern in ${industry} businesses is data that gets entered in one place and then re-typed or copy-pasted into another.`,
    },
    estimatedImpact: {
      currentHoursPerWeek: currentHours,
      automationPercentage: automationPct,
      timeSavedHoursPerWeek: timeSaved,
      hourlyRate,
      annualValue,
      implementationCost: implCost,
      paybackMonths: payback,
    },
    secondaryOpportunities: [
      {
        title: "Automated Customer Communication",
        description: "Set up automatic responses and follow-ups for common customer requests, reducing response time and freeing up staff.",
        timeSavedHoursPerWeek: 3,
      },
      {
        title: "Reporting & Data Consolidation",
        description: "Automatically pull data from your tools into a single dashboard or spreadsheet, eliminating manual report building.",
        timeSavedHoursPerWeek: 2,
      },
    ],
    recommendedNextStep: "Get in touch to walk through your actual workflows and refine these numbers.",
  };
}
