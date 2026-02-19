import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";

// ---------------------
// Input validation
// ---------------------
const fitAssessmentInputSchema = z.object({
  inputText: z
    .string()
    .min(1, "Input text is required")
    .max(10000, "Input text must be 10,000 characters or less")
    .transform((s) => s.trim()),
});

// ---------------------
// Resume Context
// ---------------------
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

// ---------------------
// OpenAI Helper
// ---------------------
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.3,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000); // 40s timeout

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(
        `OpenAI request failed (${response.status}): ${errText || response.statusText}`,
      );
    }

    const data: any = await response.json();
    const out = data?.choices?.[0]?.message?.content;
    if (typeof out !== "string" || !out.trim()) {
      throw new Error("OpenAI returned an empty response.");
    }
    return out.trim();
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------
// Output schema (inline for Netlify bundling)
// ---------------------
const roleSignalsSchema = z.object({
  seniority: z.string(),
  domain: z.string(),
  primaryTools: z.array(z.string()),
  coreResponsibilities: z.array(z.string()),
});

const fitAssessmentOutputSchema = z.object({
  summary: z.string().min(1),
  fitScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  gaps: z.array(z.string()),
  risks: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()).min(1),
  keywords: z.array(z.string()),
  roleSignals: roleSignalsSchema,
});

// ---------------------
// Assessment Generation
// ---------------------
async function generateFitAssessment(inputText: string) {
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

  const raw = await callOpenAI(systemPrompt, userPrompt);

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
      `AI response did not match expected schema: ${result.error.errors[0]?.message}`,
    );
  }

  return result.data;
}

// ---------------------
// Rate limiting (simple in-memory)
// ---------------------
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// ---------------------
// Handler
// ---------------------
export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext,
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
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const clientIp =
      event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      event.headers["client-ip"] ||
      "unknown";

    // Rate limit check
    if (!checkRateLimit(clientIp)) {
      console.log(`[fit-assessment] Rate limited: ${clientIp}`);
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Too many requests. Please wait a minute before trying again.",
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    // Validate input
    const parsed = fitAssessmentInputSchema.safeParse(body);
    if (!parsed.success) {
      console.log(
        `[fit-assessment] Validation error: ${parsed.error.errors[0]?.message}`,
      );
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: parsed.error.errors[0]?.message ?? "Invalid input",
        }),
      };
    }

    const { inputText } = parsed.data;
    console.log(
      `[fit-assessment] Processing request (${inputText.length} chars)`,
    );

    const startTime = Date.now();
    const result = await generateFitAssessment(inputText);
    const duration = Date.now() - startTime;
    console.log(`[fit-assessment] Success (${duration}ms)`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result,
      }),
    };
  } catch (err: any) {
    console.error("[fit-assessment] Error:", err?.message || err);

    const isTimeout =
      err?.name === "AbortError" || err?.message?.includes("timeout");
    const isApiError = err?.message?.includes("API error");

    return {
      statusCode: isTimeout || isApiError ? 502 : 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: isTimeout
          ? "Analysis took too long. Please try again with a shorter input."
          : "Failed to generate assessment. Please try again.",
      }),
    };
  }
};
