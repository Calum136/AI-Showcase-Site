import type { Handler } from "@netlify/functions";
import { z } from "zod";
import { buildSystemPrompt } from "./agent-context";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(50),
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Currently using OpenAI for testing. To switch to Anthropic:
// 1. Add ANTHROPIC_API_KEY to Netlify env vars
// 2. Change fetch URL to https://api.anthropic.com/v1/messages
// 3. Change headers to { "x-api-key": apiKey, "anthropic-version": "2023-06-01" }
// 4. Change body to { model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages }
// 5. Change response parsing to data?.content?.[0]?.text
async function callLLM(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
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
      max_tokens: 1000,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const data: any = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const parsed = chatSchema.parse(body);

    const systemPrompt = buildSystemPrompt();
    const reply = await callLLM(systemPrompt, parsed.messages);

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ response: reply }),
    };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid request", details: err.errors }),
      };
    }

    console.error("agent-chat error:", err);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Something went wrong. Please try again." }),
    };
  }
};

export { handler };
