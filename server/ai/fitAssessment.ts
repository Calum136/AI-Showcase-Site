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
Title: AI Systems Developer & Process Analyst
Location: Truro, Nova Scotia

SUMMARY:
Technology leader who translates business priorities into working systems. Combines hands-on AI development with operations experience to deliver tools that reduce manual work, improve information flow, and help teams make better decisions faster. Currently delivering client AI automation and building agent-orchestrated systems for real businesses.

TECHNICAL SKILLS:
- AI & Automation: OpenAI API, Anthropic Claude, RAG Systems, Vector DBs, Embeddings, Agent Orchestration, MCP Servers, Make.com
- Development: TypeScript, Python, React, Node.js, Express, PostgreSQL, SQLite, REST APIs
- Data & Analytics: Power BI, Tableau, Excel, Google Sheets, SQL, ETL Pipelines, Data Warehousing, Data Profiling, Statistical Modeling, Root Cause Analysis, Dashboard Design
- Process & Delivery: Systems Thinking, Process Automation, Workflow Design, Stakeholder Management, Requirements Translation

KEY EXPERIENCE:
1. AI Solutions Developer (Independent Practice, 2025-Present)
   - Blackbird Brewing: End-to-end AI email automation — 17-category classifier, ~120 emails/week, delivered on budget
   - JollyTails Resort: RAG-powered Q&A system consolidating 20+ fragmented SOPs
   - Built MCP server for cross-tool project memory
   - Multi-agent workflows for parallel task execution

2. Operations Supervisor - Jolly Tails Pet Resort (2022, 2025-Present)
   - Improved operational KPIs by ~10% through data profiling and process optimization
   - Technology liaison translating operational needs into system requirements

3. Data Analyst - St. Francis Xavier University, Advancement Office (2024-2025)
   - Power BI dashboards with rule-based quality checks
   - SQL queries for complex data extraction and reporting
   - Root cause analysis on legacy system inconsistencies

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

STRENGTHS:
- End-to-end delivery: requirements gathering through deployment and client handoff
- Bridging technical implementation and operational strategy
- Building AI systems that solve real, measurable business problems
- Data quality focus and systematic root cause analysis

AREAS OF GROWTH:
- Enterprise-scale system architecture
- Team leadership in technical roles
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

  const systemPrompt = `You are an expert career analyst producing a fit assessment for Calum Kershaw. Your job is to be HONEST but frame things constructively — like a sharp recruiter advocating for a strong candidate, not writing a rejection letter.

${CALUM_RESUME_CONTEXT}

TONE RULES (CRITICAL):
- This is an ADVOCACY document, not a neutral evaluation. You're answering: "Why should they hire Calum, and what should he be ready to address?"
- Strengths should be SPECIFIC and CONFIDENT. Don't say "Proficient in data analysis" — say "Built production BI dashboards and automated reporting pipelines, directly matching this role's analytics requirements"
- Lead every strength with evidence: a project, a result, a concrete skill match
- Gaps are NOT deal-breakers — frame them as "areas to address in the interview" or "things to proactively demonstrate." Use language like "Could strengthen positioning by..." or "Worth addressing proactively:..."
- Risks should be HONEST but brief and balanced — always pair with a mitigating factor. "While X could be a concern, Y from his background directly offsets this"
- Next steps should be ACTIONABLE POSITIONING ADVICE, not homework. Not "Consider gaining experience with..." but "In the interview, lead with the Blackbird Brewing project to demonstrate..."
- Summary should open with the strongest match point, not a hedge

SCORING RULES:
- 75-90 = strong fit (most roles that overlap with his skills)
- 60-74 = moderate fit (partial overlap, stretch role)
- Below 60 = weak fit (major skill gaps)
- An 80+ score should FEEL like a strong match when reading the output

FORMAT RULES:
1. Return ONLY valid JSON - no markdown, no commentary
2. Match the schema exactly
3. Reference actual details from the input
4. All arrays should have substantive, specific content`;

  const userPrompt = `Analyze the following input and produce a structured fit assessment:

"""
${inputText.slice(0, 10000)}
"""

Return ONLY valid JSON matching this exact schema:
{
  "summary": "2-4 sentences. Open with the STRONGEST match point. Frame overall fit confidently if score is 70+.",
  "fitScore": 0-100,
  "strengths": ["5-8 specific strengths. Each should lead with EVIDENCE: a project name, a metric, a concrete skill. Be confident, not hedging."],
  "gaps": ["2-5 gaps framed as areas to ADDRESS, not deal-breakers. Use 'Could strengthen by...' or 'Worth addressing:...' Never say 'Limited experience' or 'lacks'."],
  "risks": ["2-4 honest risks, each paired with a mitigating factor. 'While X, his experience with Y offsets this.'"],
  "recommendedNextSteps": ["3-6 POSITIONING strategies, not homework. 'In the interview, lead with...' or 'Highlight the X project to demonstrate...'"],
  "keywords": ["8-20 relevant keywords extracted from the input"],
  "roleSignals": {
    "seniority": "e.g., Entry, Mid, Senior, Lead, Manager, Director",
    "domain": "e.g., Engineering, Operations, Data, Product",
    "primaryTools": ["main tools/technologies mentioned"],
    "coreResponsibilities": ["3-6 main responsibilities"]
  }
}

Be specific and reference actual content from the input.`;

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
