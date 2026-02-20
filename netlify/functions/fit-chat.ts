import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";

// ---------------------
// Schemas
// ---------------------
const fitChatSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("research"),
    businessName: z.string().min(1).max(200),
    industry: z.string().min(1).max(100),
  }),
  z.object({
    action: z.literal("questions"),
    businessName: z.string().min(1).max(200),
    industry: z.string().min(1).max(100),
    researchContext: z.string(),
    softwareStack: z.array(z.string()),
  }),
  z.object({
    action: z.literal("report"),
    diagnosticContext: z.object({
      businessName: z.string().min(1).max(200),
      industry: z.string().min(1).max(100),
      researchContext: z.string(),
      softwareStack: z.array(z.string()),
      painAnswers: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })),
    }),
  }),
]);

// ---------------------
// Fallback questions if AI generation fails
// ---------------------
const FALLBACK_PAIN_QUESTIONS = [
  "Which of these tools causes you the most manual re-entry or copy-paste work?",
  "How many hours per week do you estimate your team spends on repetitive admin tasks?",
  "What's the one thing you wish just 'happened automatically'?",
];

// ---------------------
// OpenAI Helper
// ---------------------
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  temperature = 0.3,
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
// Research: Industry intelligence brief
// ---------------------
async function generateResearch(businessName: string, industry: string): Promise<string> {
  const systemPrompt = `You are a business research analyst specializing in small and medium businesses. Given a business name and industry, produce a concise operational intelligence brief.

Focus on:
1. The 3-5 most common operational pain points in this specific industry
2. Typical software tools used in this industry and their common integration challenges
3. Average hourly labor cost range for admin/operations staff in this industry ($XX-$XX/hr)
4. The most impactful automation opportunities that exist TODAY using tools like Make.com, Zapier, or custom integrations
5. Industry-specific workflow bottlenecks that waste the most time

Be specific and factual. Reference real tools and real workflows. 600 words max. No fluff, no disclaimers.`;

  return await callOpenAI([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Business: ${businessName}\nIndustry: ${industry}` },
  ]);
}

// ---------------------
// Generate tailored pain questions
// ---------------------
async function generateQuestions(
  businessName: string,
  industry: string,
  researchContext: string,
  softwareStack: string[],
): Promise<string[]> {
  const stackList = softwareStack.length > 0 ? softwareStack.join(", ") : "no specific tools selected";

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

  const raw = await callOpenAI([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Business: ${businessName}\nIndustry: ${industry}\nSoftware Stack: ${stackList}\n\nIndustry Research Context:\n${researchContext.slice(0, 2000)}`,
    },
  ]);

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

// ---------------------
// ROI Report generation
// ---------------------
async function generateROIReport(diagnosticContext: {
  businessName: string;
  industry: string;
  researchContext: string;
  softwareStack: string[];
  painAnswers: Array<{ question: string; answer: string }>;
}): Promise<any> {
  const stackList = diagnosticContext.softwareStack.length > 0
    ? diagnosticContext.softwareStack.join(", ")
    : "No specific tools listed";

  const painQA = diagnosticContext.painAnswers
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

  const raw = await callOpenAI([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `BUSINESS: ${diagnosticContext.businessName}
INDUSTRY: ${diagnosticContext.industry}

SOFTWARE STACK: ${stackList}

INDUSTRY RESEARCH:
${diagnosticContext.researchContext.slice(0, 3000)}

DIAGNOSTIC ANSWERS:
${painQA}

Generate the ROI report. Return ONLY valid JSON:
{
  "businessName": "${diagnosticContext.businessName}",
  "industry": "${diagnosticContext.industry}",
  "topOpportunity": {
    "title": "Short name for the automation",
    "description": "2-3 sentences explaining what gets automated, which tools connect, and what changes day-to-day"
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
}`,
    },
  ], 0.3);

  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    const p = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    return {
      businessName: String(p.businessName ?? diagnosticContext.businessName),
      industry: String(p.industry ?? diagnosticContext.industry),
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
      secondaryOpportunities: Array.isArray(p.secondaryOpportunities)
        ? p.secondaryOpportunities.slice(0, 3).map((x: any) => ({
            title: String(x?.title ?? ""),
            description: String(x?.description ?? ""),
            timeSavedHoursPerWeek: typeof x?.timeSavedHoursPerWeek === "number" ? x.timeSavedHoursPerWeek : undefined,
          }))
        : [],
      recommendedNextStep: String(p.recommendedNextStep ?? "Book a 30-minute call to confirm these numbers with your actual workflow data."),
    };
  }

  throw new Error("AI report did not contain valid JSON.");
}

// Fallback report
function fallbackReport(businessName: string, industry: string) {
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

    // ========== RESEARCH ACTION ==========
    if (data.action === "research") {
      const researchContext = await generateResearch(data.businessName, data.industry);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ researchContext }),
      };
    }

    // ========== QUESTIONS ACTION ==========
    if (data.action === "questions") {
      const questions = await generateQuestions(
        data.businessName,
        data.industry,
        data.researchContext,
        data.softwareStack,
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ questions }),
      };
    }

    // ========== REPORT ACTION ==========
    if (data.action === "report") {
      let report;
      try {
        report = await generateROIReport(data.diagnosticContext);
      } catch (err) {
        console.error("ROI report generation failed, using fallback:", err);
        report = fallbackReport(
          data.diagnosticContext.businessName,
          data.diagnosticContext.industry,
        );
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          stage: 3,
          role: "assistant",
          content: "Here's your personalized automation analysis.",
          report,
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
