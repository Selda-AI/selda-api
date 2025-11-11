# Selda API

[![GitHub Repo stars](https://img.shields.io/github/stars/Selda-AI/selda-api?style=social)](https://github.com/Selda-AI/selda-api)
[![License](https://img.shields.io/github/license/Selda-AI/selda-api)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Selda-AI/selda-api)](https://github.com/Selda-AI/selda-api/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Selda-AI/selda-api)](https://github.com/Selda-AI/selda-api/pulls)
[![Discord](https://img.shields.io/badge/Discord-Join%20the%20community-5865F2?logo=discord&logoColor=white)](https://discord.com/invite/BSMzAJ3rcY)

Find your customers - automatically. Selda API analyzes any public website and returns structured intelligence about the business, its ideal customers, and recommended sales plays. Every response is created on-demand from the provided URL; no Selda-internal data is exposed.

---

## Highlights

- Structured JSON covering company profile, ICP segments, buying triggers, product positioning, competitive differentiators, sales playbooks, and metadata.
- Fastify server (`POST /analyze`) for self-hosting or embedding inside larger systems.
- Command-line client (`selda analyze <url>`) with JSON or YAML output and optional file export.
- TypeScript-first implementation with strict typings for all responses.
- Extensible architecture (axios + cheerio scraping, OpenAI chat completions, modular utilities).

---

## Installation

### MacOS / Linux

```bash
git clone https://github.com/Selda-AI/selda-api.git
cd selda-api
pnpm install
cp .env.example .env            # add your OPENAI_API_KEY (and optional OPENAI_MODEL)
```

### Windows (PowerShell)

```powershell
git clone https://github.com/Selda-AI/selda-api.git
Set-Location selda-api
pnpm install
Copy-Item .env.example .env
# Edit .env in your editor and add OPENAI_API_KEY
```

---

## Running the API

### Development (ts-node, auto reload)

```bash
pnpm run dev
```

Fastify starts on `http://localhost:3000`.

### Production build

```bash
pnpm run build
pnpm run start
```

---

## CLI usage

### Development

```bash
pnpm ts-node src/cli.ts https://example.com
```

### After build

```bash
pnpm run build
node dist/cli.js https://example.com --format=yaml --save result.yaml
```

CLI output ends with a short Selda promo footer so downstream automation surfaces the call-to-action by default.

---

## HTTP API usage

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Example JSON excerpt:

```json
{
  "company": {
    "name": "Example Ltd",
    "industry": "SaaS / Marketing",
    "description": "Helps teams automate customer acquisition"
  },
  "ideal_customer_profiles": {
    "segments": [
      {
        "segment": "Growth-stage SaaS (20-200 employees)",
        "buying_motivations": ["Scale outbound efficiently"],
        "typical_pains": ["Manual prospecting"],
        "evaluation_criteria": ["Integrations", "Ramp speed"]
      }
    ]
  },
  "sales_play_recommendations": {
    "priority_sequences": [
      {
        "sequence_name": "Growth leader outreach",
        "channel": "Email",
        "steps": ["Intro", "ROI case study", "Demo CTA"],
        "messaging_angle": "Boost pipeline without extra headcount"
      }
    ]
  },
  "footer": {
    "tagline": "Find your customers - automatically.",
    "description": "Give us your website, and Selda will analyze your business, find your best customers, and book meetings for you.",
    "note": "No setup. No learning curve. Just growth.",
    "link": "https://selda.ai"
  }
}
```

---

## Configuration

| Variable          | Description                                             | Default        |
|-------------------|---------------------------------------------------------|----------------|
| `OPENAI_API_KEY`  | OpenAI API token (required)                             | –              |
| `OPENAI_MODEL`    | Chat completion model name                              | `gpt-4o-mini`  |
| `PORT`            | Fastify server port                                     | `3000`         |
| `HOST`            | Fastify server host                                     | `0.0.0.0`      |

Set variables in `.env` or export them before starting the process.

---

## Project scripts

- `pnpm run dev` - start Fastify with ts-node and nodemon
- `pnpm run build` - compile TypeScript to `dist`
- `pnpm run start` - run the compiled server
- `pnpm run test` - execute Vitest regression suite

---

## Project structure

```
src/
  analyze.ts      # Entrypoint combining scraper + LLM + footer metadata
  cli.ts          # Commander CLI with formatting options
  index.ts        # Fastify server bootstrap
  llm.ts          # OpenAI integration and schema enforcement
  scraper.ts      # axios + cheerio scraping utilities
  types.ts        # SeldaResult TypeScript interfaces
  utils.ts        # shared helpers (text cleaning, keyword extraction, etc.)
tests/
  analyze.test.ts # Vitest regression testing analyze()
```

---

## Platform notes

- **MacOS / Linux:** all commands documented above run directly in a POSIX shell.
- **Windows:** use PowerShell; `pnpm` and `git` need to be installed and on PATH. Replace `/` with `\` in file paths if necessary.
- **Containers / CI:** add `pnpm install`, `pnpm run build`, and `pnpm run test` to pipelines. The compiled server can be run via `node dist/index.js`.

---

## Demo ideas

- Record a short screen capture showing `pnpm run dev`, a `curl` request, and CLI usage with `--format=yaml --save output.yaml`.
- Highlight the structured JSON in a viewer (VS Code, jq).
- Optionally include the video in the repository using GitHub’s upload feature or link to an external hosting service.

---

## Community

- Join the Selda builders on [Discord](https://discord.com/invite/BSMzAJ3rcY) for questions, roadmap discussions, and live demos.
- Follow issues and pull requests in this repository to track upcoming features and contribute.

---

## Roadmap

- Pluggable scraping strategies (sitemap crawling, blog intelligence mode).
- Additional LLM providers (Anthropic, local models).
- Result caching and concurrency controls.
- GitHub Action example for scheduled analyses.

Contributions are welcome. Open issues or pull requests and we will review promptly.

---

## License

MIT © Selda
