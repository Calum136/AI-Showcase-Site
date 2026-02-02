import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getSiteCopy(): Promise<any>;
  getResume(): Promise<any>;
  getReferences(): Promise<any>;
  getPortfolio(): Promise<any>;
  getMessages(): Promise<any[]>;
  createMessage(input: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  private contentDir = path.join(process.cwd(), "content");

  private async readJson<T>(relativePath: string): Promise<T> {
    const filePath = path.join(this.contentDir, relativePath);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error reading ${relativePath}:`, error);
      throw new Error(`Failed to read content: ${relativePath}`);
    }
  }

  // ✅ SITE COPY (single source of truth)
  async getSiteCopy() {
    return this.readJson("site/copy.json");
  }

  // ✅ MODULAR RESUME DATA
  async getResume() {
    return this.readJson("resume/index.json");
  }

  // ✅ REFERENCE AGENTS
  async getReferences() {
    return this.readJson("references/index.json");
  }

  // ✅ PORTFOLIO / CASE STUDIES
  async getPortfolio() {
    return this.readJson("portfolio/index.json");
  }

  // Legacy chat methods (not actively used - stubs for API compatibility)
  async getMessages(): Promise<any[]> {
    return [];
  }

  async createMessage(input: any): Promise<any> {
    return { id: 1, ...input, createdAt: new Date() };
  }
}

// Singleton export (simple + predictable)
export const storage = new DatabaseStorage();
