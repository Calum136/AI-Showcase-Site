import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Content Routes ===
  app.get(api.content.resume.path, async (_req, res) => {
    try {
      const data = await storage.getResume();
      res.json(data);
    } catch (error) {
      res.status(404).json({ message: "Resume content not found" });
    }
  });

  app.get(api.content.portfolio.path, async (_req, res) => {
    try {
      const data = await storage.getPortfolio();
      res.json(data);
    } catch (error) {
      res.status(404).json({ message: "Portfolio content not found" });
    }
  });

  app.get(api.content.references.path, async (_req, res) => {
    try {
      const data = await storage.getReferences();
      res.json(data);
    } catch (error) {
      res.status(404).json({ message: "References content not found" });
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
        return res.status(400).json({
          message: err.errors[0].message
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
