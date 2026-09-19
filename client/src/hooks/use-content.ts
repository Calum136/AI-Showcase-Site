import { useQuery } from "@tanstack/react-query";
import { type PortfolioItem, type Reference } from "@shared/schema";

// Import JSON files directly for static deployment
import portfolioData from "../../../content/portfolio.json";
import referencesData from "../../../content/references.json";

// GET portfolio data
export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      // Return imported JSON directly
      return portfolioData as PortfolioItem[];
    },
  });
}

// GET references data
export function useReferences() {
  return useQuery({
    queryKey: ["references"],
    queryFn: async () => {
      // Return imported JSON directly
      return referencesData as Reference[];
    },
  });
}
