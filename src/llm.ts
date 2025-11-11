import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runLLM(html: string) {
  const prompt = `
  You are Selda AI. Analyze this website HTML and describe:
  1. Company name, industry, value proposition
  2. Business understanding (problem, market, strengths)
  3. Target strategy (decision makers & sales angles)
  4. Action guidelines (tone, example pitch)
  Return JSON strictly following SeldaResult schema.
  `;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: html.slice(0, 10000) },
    ],
    temperature: 0.3,
  });

  try {
    return JSON.parse(res.choices[0].message?.content ?? "{}");
  } catch {
    return { error: "Failed to parse LLM output" };
  }
}

