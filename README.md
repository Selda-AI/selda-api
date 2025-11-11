# Selda API

Selda API is an open-source core service that turns any public website into a structured sales intelligence brief. It can run as a Fastify HTTP API or as a CLI utility.

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

## Sample Output

Running the CLI against `https://selda.ai` produces a structured `SeldaResult` JSON. Excerpt:

```json
{
  "company": {
    "name": "Selda",
    "industry": "Sales Automation",
    "tone_of_voice": "Conversational, supportive, and innovative"
  },
  "ideal_customer_profiles": {
    "segments": [
      {
        "segment": "Small to Medium Enterprises (SMEs)",
        "buying_motivations": ["Need for efficient customer acquisition"],
        "typical_pains": ["High customer acquisition costs"],
        "evaluation_criteria": ["Ease of integration"]
      }
    ]
  },
  "buying_triggers": {
    "primary_signals": ["Increased sales team workload", "Interest in AI solutions"]
  },
  "product_breakdown": {
    "key_offerings": [
      {
        "name": "AI Sales Automation",
        "description": "Automates the process of finding customers, crafting messages, and booking meetings."
      }
    ],
    "pricing_signals": ["Subscription-based pricing", "Free trial for early adopters"]
  },
  "sales_play_recommendations": {
    "priority_sequences": [
      {
        "sequence_name": "Initial Outreach",
        "channel": "Email",
        "messaging_angle": "Emphasize the ease of use and immediate benefits of automation."
      }
    ],
    "objection_handling": [
      {
        "objection": "We already have a sales process in place.",
        "response": "Selda enhances your existing process by automating repetitive tasks."
      }
    ]
  },
  "metadata": {
    "social_links": [
      { "platform": "LinkedIn", "url": "https://www.linkedin.com/company/getselda" },
      { "platform": "X (Twitter)", "url": "https://x.com/getselda" }
    ]
  }
}
```

## Project Scripts

- `pnpm run dev` – start Fastify with live reload
- `pnpm run build` – compile TypeScript to `dist`
- `pnpm run start` – run the compiled server
- `pnpm run test` – execute Vitest regression suite

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

## Environment Variables

- `OPENAI_API_KEY` – required
- `OPENAI_MODEL` – optional (defaults to `gpt-4o-mini`)
- `PORT` – optional, defaults to `3000`

## License

MIT © Selda
