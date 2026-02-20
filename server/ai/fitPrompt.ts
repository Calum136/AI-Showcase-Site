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
    timeSavedHoursPerWeek: number;
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
// Fallback questions if AI generation fails
// -----------------------------
const FALLBACK_PAIN_QUESTIONS = [
  "Which of these tools causes you the most manual re-entry or copy-paste work?",
  "How many hours per week do you estimate your team spends on repetitive admin tasks?",
  "What's the one thing you wish just 'happened automatically'?",
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

RULES:
- Each question must be 1 sentence, conversational tone
- Questions must be SPECIFIC to this business's industry and tools — never generic
- If they listed specific software tools, at least 1 question must reference their actual tools by name
- Focus on: workflow pain points, time waste, manual data entry, and automation opportunities
- Questions should uncover information needed to recommend specific automations
- Do NOT ask about their budget or timeline
- Do NOT ask yes/no questions — ask open-ended questions that get them describing their workflows

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

  const systemPrompt = `You are a business automation consultant producing a specific ROI analysis based on diagnostic data. Your job is to identify the top automation opportunity and produce grounded, realistic numbers.

ROI CALCULATION RULES:
- Use the hours/week mentioned in the pain answers as your starting baseline
- Estimate hourly cost at $25-45/hr depending on the industry (use the research context for guidance)
- Annual value = hours saved per week * hourly cost * 52
- Implementation cost should be realistic: $2,000-$15,000 range for most SMB automations
- Payback period = implementation cost / (monthly savings)
- Be CONSERVATIVE — it's better to underestimate savings than overpromise
- Round dollar amounts to nearest $100

RECOMMENDATION RULES:
- The top opportunity MUST reference specific tools from their software stack
- Explain HOW the integration would work in plain language (mention Make.com, Zapier, or custom API connections as appropriate)
- Name the exact data flow: "Data moves from [Tool A] to [Tool B] automatically when [trigger]"
- Secondary opportunities should be distinct from the primary one
- The recommended next step should be a clear, specific call to action

LANGUAGE RULES:
- Write everything in plain language a non-technical business owner would understand
- No jargon — no "RAG", "pipeline", "API", "webhook" in the final output
- Describe outcomes, not technology`;

  const userPrompt = `BUSINESS: ${input.businessName}
INDUSTRY: ${input.industry}

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
    "title": "Short name for the automation (e.g., 'Booking-to-Spreadsheet Sync')",
    "description": "2-3 sentences explaining what gets automated, which tools connect, and what changes day-to-day for the team"
  },
  "estimatedImpact": {
    "timeSavedHoursPerWeek": <number>,
    "annualValue": <number in dollars>,
    "implementationCost": <number in dollars>,
    "paybackMonths": <number>
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

  return {
    businessName: String(p.businessName ?? input.businessName),
    industry: String(p.industry ?? input.industry),
    topOpportunity: {
      title: String(p.topOpportunity?.title ?? "Workflow Automation"),
      description: String(p.topOpportunity?.description ?? ""),
    },
    estimatedImpact: {
      timeSavedHoursPerWeek: Math.max(0, Number(p.estimatedImpact?.timeSavedHoursPerWeek ?? 5)),
      annualValue: Math.max(0, Math.round(Number(p.estimatedImpact?.annualValue ?? 0) / 100) * 100),
      implementationCost: Math.max(0, Math.round(Number(p.estimatedImpact?.implementationCost ?? 0) / 100) * 100),
      paybackMonths: Math.max(0, Number(p.estimatedImpact?.paybackMonths ?? 3)),
    },
    secondaryOpportunities: toSecondary(p.secondaryOpportunities),
    recommendedNextStep: String(p.recommendedNextStep ?? "Book a 30-minute call to confirm these numbers with your actual workflow data."),
  };
}

// -----------------------------
// Fallback ROI report for API failures
// -----------------------------
export function fallbackROIReport(businessName: string, industry: string): ROIReport {
  return {
    businessName,
    industry,
    topOpportunity: {
      title: "Repetitive Task Automation",
      description: `Based on what you've shared, the biggest opportunity is automating the manual, repetitive tasks that eat into your team's day. The most common pattern in ${industry} businesses is data that gets entered in one place and then re-typed or copy-pasted into another.`,
    },
    estimatedImpact: {
      timeSavedHoursPerWeek: 8,
      annualValue: 12500,
      implementationCost: 4000,
      paybackMonths: 4,
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
    recommendedNextStep: "Book a 30-minute call to walk through your actual workflows and confirm these numbers.",
  };
}
