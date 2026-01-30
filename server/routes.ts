import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { aiGenerateNextStep, aiGenerateReport } from "./ai/fitPrompt";

import { api } from "@shared/routes";
import { z } from "zod";
import { randomUUID } from "crypto";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// -----------------------------
// Fit (in-memory, privacy-first)
// -----------------------------
type FitStage = 1 | 2 | 3;

type FitMessage = {
  role: "user" | "assistant";
  content: string;
};

type FitReport = {
  verdict: "YES" | "NO";
  roleAlignment: string[];
  environmentCompatibility: string[];
  structuralRisks: string[];
  successConditions: string[];
  gapPlan: string[];
};

type FitSession = {
  id: string;
  createdAt: number;
  lastActiveAt: number;
  jdText: string;
  stage: FitStage;
  userTurns: number;
  messages: FitMessage[];
  verdict: "YES" | "NO" | null;
  report: FitReport | null;
};

const fitSessions = new Map<string, FitSession>();

// TTL: expire sessions after 30 minutes of inactivity
const FIT_SESSION_TTL_MS = 30 * 60 * 1000;

function cleanupExpiredFitSessions() {
  const now = Date.now();
  for (const [id, s] of fitSessions.entries()) {
    if (now - s.lastActiveAt > FIT_SESSION_TTL_MS) {
      fitSessions.delete(id);
    }
  }
}

setInterval(cleanupExpiredFitSessions, 5 * 60 * 1000);

const STAGE_1_QUESTIONS = [
  "At a high level, what problem is this role primarily responsible for solving?",
  "What does “success” look like in the first 30–90 days for this person?",
  "What kind of environment is this role stepping into (process maturity, pace, and change expectations)?",
];

const STAGE_2_QUESTIONS = [
  "Where does this role have real decision-making authority vs. influence-only?",
  "What are the biggest blockers or risks you expect this person to run into?",
  "What support exists (people, tools, time) for improving systems/processes—not just maintaining them?",
];

// Zod request schemas
const fitStartSchema = z.object({
  text: z.string().min(1).max(50_000).optional(),
  jdText: z.string().min(1).max(50_000).optional(),
}).refine(data => data.text || data.jdText, {
  message: "Either text or jdText is required",
});

const fitMessageSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(20_000),
});

function buildVerdictStub(session: FitSession): FitReport {
  const jdShort = session.jdText.trim().length < 200;
  const userMsgs = session.messages.filter((m) => m.role === "user");
  const avgUserLen =
    userMsgs.reduce((sum, m) => sum + m.content.trim().length, 0) /
    Math.max(1, userMsgs.length);

  const verdict: "YES" | "NO" = jdShort || avgUserLen < 40 ? "NO" : "YES";

  return {
    verdict,
    roleAlignment: [
      "Stub: confirm the role is systems/process + automation-heavy.",
      "Stub: verify scope matches ownership and expected outcomes.",
    ],
    environmentCompatibility: [
      "Stub: assess pace, ambiguity tolerance, and change appetite.",
      "Stub: confirm stakeholders support improvement work.",
    ],
    structuralRisks: [
      "Stub: responsibility without authority.",
      "Stub: unclear ownership across teams.",
    ],
    successConditions: [
      "Stub: clear success metrics by day 30/60/90.",
      "Stub: access to systems/tools and decision makers.",
    ],
    gapPlan:
      verdict === "YES"
        ? [
            "Stub: align on first 2–3 highest leverage problems.",
            "Stub: define decision rights + escalation path.",
          ]
        : [
            "Stub: reduce scope density or add authority.",
            "Stub: provide explicit support for change work.",
          ],
  };
}

type NextStep =
  | { kind: "prompt"; content: string }
  | { kind: "report"; report: FitReport };

function nextAssistantStep(session: FitSession): NextStep | null {
  if (session.stage === 3) return null;

  if (session.userTurns >= 6) {
    session.stage = 3;
    const report = buildVerdictStub(session);
    session.verdict = report.verdict;
    session.report = report;
    return { kind: "report", report };
  }

  if (session.userTurns >= 3 && session.stage === 1) {
    session.stage = 2;
    return {
      kind: "prompt",
      content: `Stage 1 complete. Moving to deeper evaluation.\n\n${STAGE_2_QUESTIONS[0]}`,
    };
  }

  if (session.stage === 1) {
    const idx = session.userTurns;
    const q = STAGE_1_QUESTIONS[idx];
    return q ? { kind: "prompt", content: q } : null;
  }

  if (session.stage === 2) {
    const idx = session.userTurns - 3;
    const q = STAGE_2_QUESTIONS[idx];
    return q ? { kind: "prompt", content: q } : null;
  }

  return null;
}

// -----------------------------
// Upload handling (memory only)
// -----------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

function fileExt(name?: string) {
  const n = (name ?? "").toLowerCase();
  const idx = n.lastIndexOf(".");
  return idx >= 0 ? n.slice(idx + 1) : "";
}
function resolvePdfParse(
  mod: any,
): (data: Uint8Array | Buffer) => Promise<any> {
  // Most common shapes we’ve seen in ESM/CJS toolchains:
  // - function
  // - { default: function }
  // - { default: { default: function } }
  // - { pdfParse: function } or similar
  if (typeof mod === "function") return mod;
  if (typeof mod?.default === "function") return mod.default;
  if (typeof mod?.default?.default === "function") return mod.default.default;

  // Fall back: find the first function-valued property on the object
  if (mod && typeof mod === "object") {
    for (const v of Object.values(mod)) {
      if (typeof v === "function") return v as any;
      if (typeof (v as any)?.default === "function") return (v as any).default;
    }
  }

  throw new Error("pdf-parse module did not expose a callable parser function");
}
async function loadPdfJs() {
  // pdfjs-dist export paths vary by version/tooling.
  // We try a few common ones and normalize the module shape.
  const candidates = [
    "pdfjs-dist/legacy/build/pdf.cjs",
    "pdfjs-dist/legacy/build/pdf.js",
    "pdfjs-dist/legacy/build/pdf",
  ];

  for (const id of candidates) {
    try {
      const mod = require(id);
      return mod?.default ?? mod;
    } catch {
      // keep trying
    }
  }

  // ESM fallback (some installs only expose .mjs)
  try {
    const mod = await import("pdfjs-dist/legacy/build/pdf.mjs");
    return (mod as any)?.default ?? (mod as any);
  } catch {
    // ignore
  }

  throw new Error("Unable to load pdfjs-dist legacy build");
}

async function extractPdfTextWithPdfJs(buffer: Buffer): Promise<string> {
  const pdfjs: any = await loadPdfJs();

  if (typeof pdfjs?.getDocument !== "function") {
    throw new Error("pdfjs-dist loaded but getDocument() was not found");
  }

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const strings = (content.items as any[])
      .map((it) => (typeof it.str === "string" ? it.str : ""))
      .filter(Boolean);

    fullText += strings.join(" ") + "\n";
  }

  return fullText.trim();
}

async function extractTextFromUpload(
  file: Express.Multer.File,
): Promise<string> {
  const ext = fileExt(file.originalname);

  if (ext === "txt") {
    return file.buffer.toString("utf8");
  }

  if (ext === "pdf") {
    try {
      const text = await extractPdfTextWithPdfJs(file.buffer);

      if (!text) {
        throw new Error(
          "This PDF appears to have no selectable text (likely scanned/image-only). Please upload a .txt/.docx or paste the job description text.",
        );
      }

      return text;
    } catch (e: any) {
      throw new Error(
        `PDF parse failed: ${e?.message ?? "Unknown error"}. If the PDF is scanned/image-only, it won't extract.`,
      );
    }
  }

  if (ext === "docx") {
    // mammoth
    const mod = await import("mammoth");
    const mammoth = (mod as any).default ?? (mod as any);
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return String(result?.value ?? "");
  }

  throw new Error("Unsupported file type. Please upload .txt, .pdf, or .docx");
}

async function startFitSessionFromText(text: string) {
  const id = randomUUID();
  const now = Date.now();

  const session: FitSession = {
    id,
    createdAt: now,
    lastActiveAt: now,
    jdText: text,
    stage: 1,
    userTurns: 0,
    messages: [],
    verdict: null,
    report: null,
  };

  fitSessions.set(id, session);

  // ✅ AI-generated first step (question + choices)
  // Fallback: stage 1 question list if AI fails
  let firstQuestion = STAGE_1_QUESTIONS[0];
  let choices: any[] | undefined = undefined;

  try {
    const step = await aiGenerateNextStep({
      // We’re still using jdText as the starting context for now.
      // Later you’ll rename this to problemStatement and shift the UI copy.
      jdText: session.jdText,
      stage: session.stage as any,
      userTurns: session.userTurns,
      messages: session.messages,
    });

    firstQuestion = step.question || firstQuestion;
    choices = step.choices;
  } catch (err) {
    console.error("AI start step failed, using fallback:", err);
  }

  session.messages.push({ role: "assistant", content: firstQuestion });

  return {
    sessionId: id,
    stage: session.stage,
    role: "assistant" as const,
    content: firstQuestion,
    choices, // ✅ NEW: UI can render buttons if present
    message: "Fit conversation started.",
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // === Content Routes ===
  app.get(api.content.resume.path, async (_req, res) => {
    try {
      const data = await storage.getResume();
      res.json(data);
    } catch {
      res.status(404).json({ message: "Resume content not found" });
    }
  });

  app.get(api.content.portfolio.path, async (_req, res) => {
    try {
      const data = await storage.getPortfolio();
      res.json(data);
    } catch {
      res.status(404).json({ message: "Portfolio content not found" });
    }
  });

  app.get(api.content.site.path, async (_req, res) => {
    try {
      const data = await storage.getSiteCopy();
      res.json(data);
    } catch {
      res.status(404).json({ message: "Site copy not found" });
    }
  });

  app.get(api.content.references.path, async (_req, res) => {
    try {
      const data = await storage.getReferences();
      res.json(data);
    } catch {
      res.status(404).json({ message: "References content not found" });
    }
  });

  // ======================
  // Fit Routes
  // ======================

  app.post(api.fit.start.path, async (req, res) => {
    cleanupExpiredFitSessions();

    const parsed = fitStartSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const jdText = parsed.data.jdText || parsed.data.text || "";

    const sessionId = crypto.randomUUID();

    fitSessions.set(sessionId, {
      id: sessionId,
      jdText,
      stage: 1,
      userTurns: 0,
      messages: [],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    });

    // 🔌 AI-generated FIRST question (with fallback)
    let firstPrompt = "";
    try {
      firstPrompt = await aiGenerateNextPrompt({
        jdText,
        stage: 1,
        userTurns: 0,
        messages: [],
      });
    } catch (err) {
      console.error("AI start prompt failed, using fallback:", err);
      firstPrompt = STAGE_1_QUESTIONS[0];
    }

    const session = fitSessions.get(sessionId)!;
    session.messages.push({ role: "assistant", content: firstPrompt });

    return res.json({
      sessionId,
      stage: 1,
      role: "assistant",
      content: firstPrompt,
    });
  });

  app.post(api.fit.message.path, async (req, res) => {
    cleanupExpiredFitSessions();

    const parsed = fitMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const { sessionId, message } = parsed.data;

    const session = fitSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found (expired?)" });
    }

    session.lastActiveAt = Date.now();

    // If verdict already reached, return it
    if (session.stage === 3 && session.report) {
      return res.json({
        stage: 3,
        verdict: session.report.verdict,
        report: session.report,
        role: "assistant",
        content: "Verdict already reached.",
      });
    }

    // Record user turn
    session.userTurns += 1;
    session.messages.push({ role: "user", content: message });

    // Deterministic stage transitions (guardrails)
    if (session.userTurns >= 6) {
      session.stage = 3;

      // AI report with fallback
      let report: FitReport;
      try {
        report = await aiGenerateReport({
          jdText: session.jdText ?? "",
          messages: session.messages,
        });
      } catch (err) {
        console.error("AI report failed, using stub fallback:", err);
        report = buildVerdictStub(session);
      }

      session.verdict = report.verdict;
      session.report = report;

      session.messages.push({
        role: "assistant",
        content: `Verdict: ${report.verdict}`,
      });

      return res.json({
        stage: 3,
        verdict: report.verdict,
        report,
        role: "assistant",
        content: "Verdict reached.",
      });
    }

    // Stage boundary: after 3 user turns, move from Stage 1 -> Stage 2
    if (session.userTurns >= 3 && session.stage === 1) {
      session.stage = 2;
    }

    // AI next prompt with fallback to the hardcoded questions
    let nextPrompt = "";
    try {
      nextPrompt = await aiGenerateNextPrompt({
        jdText: session.jdText,
        stage: session.stage,
        userTurns: session.userTurns,
        messages: session.messages,
      });
    } catch (err) {
      console.error("AI next prompt failed, using fallback question:", err);

      if (session.stage === 1) {
        const idx = session.userTurns; // after user message, next question index aligns to turns
        nextPrompt = STAGE_1_QUESTIONS[idx] ?? STAGE_1_QUESTIONS[0];
      } else {
        const idx = session.userTurns - 3;
        nextPrompt = STAGE_2_QUESTIONS[idx] ?? STAGE_2_QUESTIONS[0];
      }
    }

    session.messages.push({ role: "assistant", content: nextPrompt });

    return res.json({
      stage: session.stage,
      role: "assistant",
      content: nextPrompt,
    });
  });

  // Upload endpoint (multipart file -> extracted text -> start session)
  app.post(api.fit.upload.path, upload.single("file"), async (req, res) => {
    try {
      cleanupExpiredFitSessions();

      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const extracted = (await extractTextFromUpload(file)).trim();
      if (!extracted) {
        return res
          .status(400)
          .json({ message: "Could not extract any text from file" });
      }

      const payload = await startFitSessionFromText(extracted);
      return res.json(payload);
    } catch (err: any) {
      return res.status(400).json({
        message: err?.message ?? "Upload failed",
      });
    }
  });

  // === Chat Routes ===
  app.get(api.chat.list.path, async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post(api.chat.create.path, async (req, res) => {
    try {
      const input = api.chat.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
