import { scrapeWebsite } from "./scraper";
import { runLLM } from "./llm";
import type { SeldaResult } from "./types";
import { normalizeUrl } from "./utils";

export async function analyze(url: string): Promise<SeldaResult> {
  const normalizedUrl = normalizeUrl(url);
  const scraped = await scrapeWebsite(normalizedUrl);
  const result = await runLLM(scraped);
  return {
    ...result,
    metadata: {
      ...(result.metadata ?? {}),
      generated_at: new Date().toISOString(),
    },
  };
}

