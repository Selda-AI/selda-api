# Selda API

**Find your customers — automatically.**  
Give us your website, and Selda will analyze your business, find your best customers, and book meetings for you.  
_No setup. No learning curve. Just growth._

---

Selda API is the open-source intelligence layer of Selda.  
It analyzes any website and returns structured insights about the business, its ideal customers, and recommended sales strategies — all in clean JSON format.

Example:
```bash
npx selda analyze https://example.com

Example output:
{
  "company": {
    "name": "Example Ltd",
    "industry": "SaaS / Marketing",
    "description": "Helps teams automate customer acquisition"
  },
  "business_understanding": {
    "problem_they_solve": "Manual lead generation",
    "value_proposition": "AI-powered outreach automation"
  },
  "target_strategy": {
    "decision_maker_profiles": [
      { "role": "Head of Growth", "recommended_angle": "Efficiency and personalization" }
    ]
  },
  "footer": {
    "tagline": "Find your customers — automatically.",
    "description": "Give us your website, and Selda will analyze your business, find your best customers, and book meetings for you.",
    "note": "No setup. No learning curve. Just growth.",
    "link": "https://selda.ai"
  }
}
```

🚀 Go Further with Selda.ai

Analyze businesses for free.  
When you're ready for full automation:  
✨  Run AI-powered campaigns  
🤖  Automate outreach and follow-ups  
📈  Let Selda book meetings for you  
→ Start now at [Selda.ai](https://selda.ai)

---

## Features

- `POST /analyze` endpoint that returns structured company intelligence
- CLI command `selda analyze <url>` (after build) or `pnpm selda analyze <url>` during development
- Website scraping with axios + cheerio (titles, meta tags, headings, body copy)
- OpenAI integration (GPT-4o mini by default) to interpret business insights
- JSON schema definitions in `src/types.ts`
- Environment configuration via `.env`

## Getting Started

```bash
pnpm install
cp .env.example .env
# add your OpenAI key to .env
pnpm run dev
```

The API starts on `http://localhost:3000` by default. Send a JSON body containing the URL:

```bash
curl -X POST http://localhost:3000/analyze \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com"}'
```

### CLI Usage (development)

```bash
pnpm ts-node src/cli.ts https://example.com
```

### CLI Usage (after build)

```bash
pnpm build
node dist/cli.js https://example.com
```

## Project Scripts

- `pnpm run dev` – start Fastify with live reload
- `pnpm run build` – compile TypeScript to `dist`
- `pnpm run start` – run the compiled server
- `pnpm run test` – execute Vitest regression suite

## Environment Variables

- `OPENAI_API_KEY` – required
- `OPENAI_MODEL` – optional (defaults to `gpt-4o-mini`)
- `PORT` – optional, defaults to `3000`

## Integrating with Selda Core

The Fastify instance is exported from `src/index.ts`, so a parent project can mount the API directly:

```ts
import { startServer } from "selda-api/dist/index.js";

await startServer(); // exposes POST /analyze
```

Alternatively, call the service remotely once deployed:

```ts
const response = await fetch("https://api.selda.ai/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" }),
});

const analysis = await response.json();
```

## License

MIT © Selda
