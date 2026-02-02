import {
  fitAssessmentOutputSchema,
  type FitAssessmentOutput,
} from "../../shared/fitAssessmentSchema";

type AiOptions = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  provider?: "anthropic" | "openai";
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

async function callAnthropicText(
  systemPrompt: string,
  userPrompt: string,
  opts: { apiKey: string; model: string }
): Promise<string> {
  const { apiKey, model } = opts;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000); // 40s timeout

  try {
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
      signal: controller.signal,
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
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenAiText(
  systemPrompt: string,
  userPrompt: string,
  opts: { apiKey: string; model: string; baseUrl: string }
): Promise<string> {
  const { apiKey, model, baseUrl } = opts;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000); // 40s timeout

  try {
    const r = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      throw new Error(
        `OpenAI request failed (${r.status}): ${errText || r.statusText}`
      );
    }

    const data: any = await r.json();
    const out = data?.choices?.[0]?.message?.content;
    if (typeof out !== "string" || !out.trim()) {
      throw new Error("OpenAI returned an empty response.");
    }
    return out.trim();
  } finally {
    clearTimeout(timeout);
  }
}

function getAiOpts(overrides?: AiOptions): {
  provider: "anthropic" | "openai";
  apiKey: string;
  model: string;
  baseUrl: string;
} {
  // Check for Anthropic first (preferred)
  const anthropicKey =
    overrides?.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
  if (anthropicKey) {
    return {
      provider: "anthropic",
      apiKey: anthropicKey,
      model:
        overrides?.model ??
        process.env.ANTHROPIC_MODEL ??
        "claude-sonnet-4-20250514",
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
      baseUrl:
        overrides?.baseUrl ??
        process.env.OPENAI_BASE_URL ??
        "https://api.openai.com",
    };
  }

  throw new Error(
    "Missing API key. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in environment variables."
  );
}

export async function generateFitAssessment(
  inputText: string,
  overrides?: AiOptions
): Promise<FitAssessmentOutput> {
  const opts = getAiOpts(overrides);

  const systemPrompt = `You are an expert career analyst who turns unstructured job descriptions and workflow requirements into structured fit analysis.

${CALUM_RESUME_CONTEXT}

Your task is to analyze the provided text (job description, workflow description, or requirements) and produce a structured assessment of fit.

IMPORTANT RULES:
1. Return ONLY valid JSON - no markdown, no commentary, no explanations outside the JSON
2. Match the schema exactly
3. Be honest and specific - reference actual details from the input
4. Fit score should be realistic (70-85 is good fit, 50-70 is moderate, below 50 is weak)
5. All arrays should have substantive, specific content - not generic filler`;

  const userPrompt = `Analyze the following input and produce a structured fit assessment:

"""
${inputText.slice(0, 10000)}
"""

Return ONLY valid JSON matching this exact schema:
{
  "summary": "2-4 sentence summary of the fit analysis",
  "fitScore": 0-100,
  "strengths": ["3-8 specific strengths/alignment points"],
  "gaps": ["3-10 specific gaps or areas of mismatch"],
  "risks": ["2-8 potential risks or challenges"],
  "recommendedNextSteps": ["3-8 specific actionable next steps"],
  "keywords": ["8-20 relevant keywords extracted from the input"],
  "roleSignals": {
    "seniority": "e.g., Entry, Mid, Senior, Lead, Manager, Director",
    "domain": "e.g., Engineering, Operations, Data, Product",
    "primaryTools": ["main tools/technologies mentioned"],
    "coreResponsibilities": ["3-6 main responsibilities"]
  }
}

Be specific and reference actual content from the input. Do not use generic filler text.`;

  let raw: string;
  if (opts.provider === "anthropic") {
    raw = await callAnthropicText(systemPrompt, userPrompt, opts);
  } else {
    raw = await callOpenAiText(systemPrompt, userPrompt, opts);
  }

  // Extract JSON from response
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("AI response did not contain valid JSON structure.");
  }

  const jsonStr = raw.slice(jsonStart, jsonEnd + 1);
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Failed to parse AI response as JSON.");
  }

  // Validate against schema
  const result = fitAssessmentOutputSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Schema validation failed:", result.error.errors);
    throw new Error(
      `AI response did not match expected schema: ${result.error.errors[0]?.message}`
    );
  }

  return result.data;
}
