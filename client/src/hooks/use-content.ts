import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Resume, type PortfolioItem, type Reference } from "@shared/schema";

// GET /api/content/resume
export function useResume() {
  return useQuery({
    queryKey: [api.content.resume.path],
    queryFn: async () => {
      const res = await fetch(api.content.resume.path);
      if (!res.ok) throw new Error("Failed to fetch resume");
      // Validate with Zod schema from routes
      return api.content.resume.responses[200].parse(await res.json());
    },
  });
}

// GET /api/content/portfolio
export function usePortfolio() {
  return useQuery({
    queryKey: [api.content.portfolio.path],
    queryFn: async () => {
      const res = await fetch(api.content.portfolio.path);
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      return api.content.portfolio.responses[200].parse(await res.json());
    },
  });
}

// GET /api/content/references
export function useReferences() {
  return useQuery({
    queryKey: [api.content.references.path],
    queryFn: async () => {
      const res = await fetch(api.content.references.path);
      if (!res.ok) throw new Error("Failed to fetch references");
      return api.content.references.responses[200].parse(await res.json());
    },
  });
}
