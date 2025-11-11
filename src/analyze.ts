import { scrapeWebsite } from "./scraper.js";
import { runLLM } from "./llm.js";
import { SeldaResult } from "./types.js";

export async function analyze(url: string): Promise<SeldaResult> {
  const html = await scrapeWebsite(url);
  const llmOutput = await runLLM(html);
  return llmOutput;
}

