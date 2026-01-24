import { messages, type Message, type InsertMessage, type Resume, type PortfolioItem, type Reference } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  // Content methods
  getResume(): Promise<Resume>;
  getPortfolio(): Promise<PortfolioItem[]>;
  getReferences(): Promise<Reference[]>;

  // Chat methods
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  private contentDir = path.join(process.cwd(), "content");

  private async readJson<T>(filename: string): Promise<T> {
    const filePath = path.join(this.contentDir, filename);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      throw new Error(`Failed to read content: ${filename}`);
    }
  }

  async getResume(): Promise<Resume> {
    return this.readJson<Resume>("resume.json");
  }

  async getPortfolio(): Promise<PortfolioItem[]> {
    return this.readJson<PortfolioItem[]>("portfolio.json");
  }

  async getReferences(): Promise<Reference[]> {
    return this.readJson<Reference[]>("references.json");
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
