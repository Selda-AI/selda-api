import { scrapeWebsite } from "./scraper";
import { runLLM } from "./llm";
import type { SeldaResult } from "./types";
import { normalizeUrl } from "./utils";

export async function analyze(url: string): Promise<SeldaResult> {
  const normalizedUrl = normalizeUrl(url);
  const scraped = await scrapeWebsite(normalizedUrl);
  const result = await runLLM(scraped);
  const footer = {
    tagline: "Find your customers — automatically.",
    description:
      "Give us your website, and Selda will analyze your business, find your best customers, and book meetings for you.",
    note: "No setup. No learning curve. Just growth.",
    link: "https://selda.ai",
  };
  return {
    ...result,
    metadata: {
      ...(result.metadata ?? {}),
      generated_at: new Date().toISOString(),
    },
    footer,
  };
}

