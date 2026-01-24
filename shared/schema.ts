import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === DB TABLES (For Fit Conversation) ===
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // 'user' or 'ai'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// === JSON CONTENT SCHEMAS ===
// These schemas define the structure of your local JSON files

export const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    title: z.string(),
    email: z.string(),
    location: z.string(),
    summary: z.string()
  }),
  skills: z.array(z.string()),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    period: z.string(),
    description: z.string(),
    highlights: z.array(z.string())
  })),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    year: z.string()
  }))
});

export const portfolioSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
  link: z.string().optional()
}));

export const referencesSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  quote: z.string(),
  relationship: z.string()
}));

// Export types
export type Resume = z.infer<typeof resumeSchema>;
export type PortfolioItem = z.infer<typeof portfolioSchema>[number];
export type Reference = z.infer<typeof referencesSchema>[number];
