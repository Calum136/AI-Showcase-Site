import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";

// ---------------------
// Input validation
// ---------------------
const fitLeadSchema = z.object({
  email: z.string().email(),
  name: z.string().max(200).optional(),
  businessName: z.string(),
  industry: z.string(),
  topRecommendation: z.string(),
});

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
    const body = JSON.parse(event.body || "{}");

    // Validate input
    const parsed = fitLeadSchema.safeParse(body);
    if (!parsed.success) {
      console.log(
        `[fit-lead] Validation error: ${parsed.error.errors[0]?.message}`,
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

    const lead = parsed.data;

    // Log the lead to Netlify function logs (no persistent filesystem available)
    console.log(`[fit-lead] New lead captured:`, JSON.stringify(lead));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (err: any) {
    console.error("[fit-lead] Error:", err?.message || err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Failed to process lead. Please try again.",
      }),
    };
  }
};
