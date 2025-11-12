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

## Demo

<video controls width="100%" src="docs/assets/selda-demo.mp4" title="Selda demo">
  Your browser does not support the video tag. You can download the demo video
  <a href="docs/assets/selda-demo.mp4">here</a>.
</video>

> Tallenna demovideo polkuun `docs/assets/selda-demo.mp4`, niin se näkyy yllä.

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

## Configuration

| Variable          | Description                                             | Default        |
|-------------------|---------------------------------------------------------|----------------|
| `OPENAI_API_KEY`  | OpenAI API token (required)                             | –              |
| `OPENAI_MODEL`    | Chat completion model name                              | `gpt-4o-mini`  |
| `PORT`            | Fastify server port                                     | `3000`         |
| `HOST`            | Fastify server host                                     | `0.0.0.0`      |
| `SELDA_API_MODE`  | Deployment mode (`open` now, `private` for gateway v2)  | `open`         |

Set variables in `.env` or export them before starting the process.

---

## Response structure

The API always returns a `SeldaResult` object with these top-level sections:

- **company** – brand identity: name, website, industry, tone of voice, elevator pitch, keywords.
- **business_understanding** – what problem the company solves, their value proposition, competitive edge, market position, and who signs off on the purchase.
- **target_strategy** – decision-maker personas with motivations, pain points, recommended angles, channel recommendations, and optional channel_priority ordering.
- **action_guidelines** – sales messaging style, a ready-to-use pitch, and suggested next steps.
- **ideal_customer_profiles** – prioritized segments with motivations, pains, evaluation criteria, and positioning guidance.
- **buying_triggers** – signals worth monitoring, the channels where those signals surface, plus trigger_actions that map signal → recommended next move.
- **product_breakdown** – key offerings, short descriptions, target customer types, and pricing hints.
- **competitive_landscape** – notable competitors, stated differentiators, and optional counterplays that help reposition against each rival.
- **content_and_proof** – social proof and call-to-action assets enriched with type, use-case, and URL metadata.
- **partnerships** – integration partners or ecosystem notes, useful for co-selling opportunities or platform alignment.
- **sales_play_recommendations** – multi-step outreach sequences with channel choice, messaging angle, objection handling, and an optional first_touch_template for email/LinkedIn/phone/SMS.
- **campaign_starter** – (optional) objective, day-by-day sequence outline, and success metrics to kick off a focused campaign.
- **verifier_insights** – (optional) testimonials, industries served, geographies, languages, and awards to help validate positioning.
- **metadata** – model version used, source URL, scrape timestamp, extracted social links, contact pages, RevOps checklist, and other diagnostic notes for traceability.
- **footer** – optional call-to-action block used to keep downstream experiences aligned with Selda-brand messaging.

### Example: Analysis for `https://selda.ai`

```json
{
  "company": {
    "name": "Selda",
    "website": "https://selda.ai/",
    "industry": "Sales Automation",
    "description": "Selda helps businesses find and reach customers automatically, aiming to build entire businesses from idea to income using AI.",
    "tone_of_voice": "Conversational, supportive, and innovative",
    "keywords": [
      "build business with AI",
      "chat with AI to grow",
      "autonomous sales",
      "AI customer finder",
      "personalized outreach",
      "meeting booking AI",
      "sales automation",
      "lead generation AI",
      "B2B sales automation",
      "AI business development"
    ]
  },
  "business_understanding": {
    "problem_they_solve": "Businesses struggle with customer acquisition and outreach efficiency.",
    "value_proposition": "Automates the process of finding customers, crafting personalized messages, and booking meetings, enabling rapid business growth.",
    "competitive_advantage": "Fully autonomous outreach with no setup required, leveraging AI for personalized communication.",
    "market_position": "Innovative leader in AI-driven sales automation, targeting businesses of all sizes.",
    "buying_committee_notes": "Typically includes founders, sales managers, and marketing teams."
  },
  "target_strategy": {
    "decision_maker_profiles": [
      {
        "role": "Founder/CEO",
        "motivations": [
          "Rapid growth",
          "Cost efficiency",
          "Automation of repetitive tasks"
        ],
        "pain_points": [
          "Limited sales resources",
          "Inefficient outreach processes",
          "Difficulty in customer acquisition"
        ],
        "recommended_angle": "Highlight the speed and efficiency of customer acquisition.",
        "recommended_channels": [
          "Email",
          "LinkedIn"
        ],
        "messaging_examples": [
          "Transform your outreach with AI-driven automation.",
          "Book qualified meetings in under 30 seconds!"
        ]
      }
    ],
    "recommended_channels": [
      "Email",
      "LinkedIn",
      "Social Media"
    ],
    "strategic_notes": "Focus on showcasing case studies and testimonials to build trust.",
    "channel_priority": [
      { "channel": "Email", "priority": "high", "reason": "Strong case studies and template assets" },
      { "channel": "LinkedIn", "priority": "medium", "reason": "Active founder presence and community" },
      { "channel": "Social Media", "priority": "low", "reason": "Useful for retargeting and awareness" }
    ]
  },
  "action_guidelines": {
    "messaging_style": "Conversational and informative, emphasizing ease of use and efficiency.",
    "example_pitch": "Imagine booking qualified meetings in under 30 seconds without lifting a finger. Selda automates your outreach and finds your ideal customers effortlessly.",
    "recommended_next_steps": [
      "Schedule a demo",
      "Join the waitlist for early access",
      "Explore case studies on the website"
    ]
  },
  "ideal_customer_profiles": {
    "segments": [
      {
        "segment": "Small to Medium Enterprises (SMEs)",
        "buying_motivations": [
          "Need for efficient sales processes",
          "Desire for rapid customer acquisition",
          "Limited sales staff"
        ],
        "typical_pains": [
          "High customer acquisition costs",
          "Ineffective outreach strategies",
          "Time-consuming manual processes"
        ],
        "evaluation_criteria": [
          "Ease of integration",
          "Cost-effectiveness",
          "Proven ROI"
        ],
        "suggested_positioning": "Position Selda as a cost-effective solution for automating sales outreach."
      }
    ]
  },
  "buying_triggers": {
    "primary_signals": [
      "Launching a new product",
      "Expanding into new markets",
      "Hiring new sales staff"
    ],
    "monitoring_channels": [
      "LinkedIn",
      "Industry news",
      "Business forums"
    ],
    "trigger_actions": [
      {
        "trigger": "Hiring new sales staff",
        "watch": "LinkedIn jobs",
        "recommended_action": "Send demo CTA emphasizing faster ramp-up with fully automated outreach."
      },
      {
        "trigger": "New market launch",
        "watch": "Press releases, company blog",
        "recommended_action": "Share geo-specific case study highlighting global reach of Selda."
      }
    ]
  },
  "product_breakdown": {
    "key_offerings": [
      {
        "name": "AI Sales Automation",
        "description": "Automates customer outreach, message crafting, and meeting scheduling.",
        "target_customer": "B2B companies looking to streamline their sales processes."
      }
    ],
    "pricing_signals": [
      "Free credits for early members",
      "Subscription-based pricing model"
    ]
  },
  "competitive_landscape": {
    "notable_competitors": [
      "Salesloft",
      "Outreach",
      "HubSpot"
    ],
    "differentiators": [
      "Fully autonomous outreach",
      "No setup required",
      "Personalized messaging without templates"
    ],
    "counterplays": [
      {
        "competitor": "Salesloft",
        "counterplay": "Emphasize zero-setup automation versus manual sequencing and admin work."
      },
      {
        "competitor": "HubSpot",
        "counterplay": "Highlight Selda's focus on booking meetings automatically rather than CRM maintenance."
      }
    ]
  },
  "content_and_proof": {
    "social_proof": [
      "Trustpilot reviews",
      "Case studies on the website"
    ],
    "call_to_action_assets": [
      {
        "title": "Join the waitlist",
        "type": "landing-page",
        "used_for": "Top-of-funnel capture",
        "url": "https://selda.ai/",
        "description": "Primary CTA for early adopters"
      },
      {
        "title": "Schedule a demo",
        "type": "demo",
        "used_for": "Middle-of-funnel follow-up",
        "url": "https://selda.ai/#demo",
        "description": "Live walkthrough request form"
      }
    ]
  },
  "partnerships": {
    "integration_partners": [
      "CRM platforms",
      "Email service providers"
    ],
    "ecosystem_notes": "Focus on building partnerships with platforms that enhance sales automation."
  },
  "sales_play_recommendations": {
    "priority_sequences": [
      {
        "sequence_name": "Initial Outreach Campaign",
        "channel": "Email",
        "steps": [
          "Identify target customers",
          "Craft personalized messages",
          "Schedule follow-ups"
        ],
        "messaging_angle": "Emphasize the speed and efficiency of Selda's automation."
      }
    ],
    "objection_handling": [
      {
        "objection": "We already have a sales team.",
        "response": "Selda complements your sales team by automating repetitive tasks, allowing them to focus on closing deals."
      }
    ],
    "first_touch_template": {
      "email": "Subject: Book meetings without adding headcount\nHi {{first_name}}, noticed {{company}} is scaling quickly. Selda finds ideal targets, writes the outreach, and books meetings autonomously – teams plug it in and see pipeline in days. Worth a quick look?",
      "linkedin_dm": "Hi {{first_name}}, curious how you're handling outbound volume. Selda automates prospecting + outreach and books meetings for teams like yours. Happy to share how it works.",
      "phone_opener": "Calling because many founders are letting Selda handle outbound while their team focuses on demos. Mind if I explain how it books meetings on autopilot?",
      "sms": "Selda books meetings for you in under 30 seconds. Want the quick overview link?"
    }
  },
  "campaign_starter": {
    "objective": "Book 10 qualified demos in 14 days for AI-forward SaaS founders",
    "sequence_outline": [
      { "day": 1, "description": "Send personalized intro email with Trustpilot proof", "channel": "Email" },
      { "day": 3, "description": "Share LinkedIn DM summarizing 30-second onboarding", "channel": "LinkedIn" },
      { "day": 5, "description": "Follow-up email with case study and calendar link", "channel": "Email" },
      { "day": 9, "description": "Social retargeting with waitlist CTA", "channel": "Social Media" }
    ],
    "success_metrics": [
      "Demo bookings",
      "Replies referencing automation pain",
      "Waitlist conversions"
    ]
  },
  "verifier_insights": {
    "testimonials": [
      "\"Selda booked more demos in one week than our reps did in a month.\" – Head of Growth, BetaCo"
    ],
    "industries_served": [
      "AI startups",
      "B2B SaaS",
      "Agencies"
    ],
    "geographies": [
      "Global",
      "North America",
      "Europe"
    ],
    "languages": [
      "English"
    ],
    "awards_or_certifications": [
      "Featured on Product Hunt"
    ]
  },
  "metadata": {
    "notes": "Selda is positioned as a game-changer in the sales automation landscape, appealing to businesses looking for innovative solutions.",
    "model_version": "gpt-4o-mini",
    "source_url": "https://selda.ai/",
    "scraped_at": "2025-11-11T18:46:53.797Z",
    "social_links": [
      {
        "platform": "LinkedIn",
        "url": "https://www.linkedin.com/company/getselda"
      },
      {
        "platform": "X (Twitter)",
        "url": "https://x.com/getselda"
      },
      {
        "platform": "Instagram",
        "url": "https://instagram.com/getselda"
      }
    ],
    "contact_pages": [
      "https://selda.ai/how-it-works#sales-teams",
      "https://selda.ai/compare/selda-vs-salesloft",
      "https://selda.ai/how-it-works",
      "https://www.trustpilot.com/review/selda.ai",
      "https://selda.ai/blog/zero-to-hero-ai-sales-automation-2025",
      "https://selda.ai/blog/ai-sales-automation-guide-2025",
      "https://selda.ai/about"
    ],
    "revops_checklist": [
      "Tag accounts interested in AI-led outbound",
      "Sync Selda waitlist signups into CRM",
      "Build dashboard tracking booking rate vs outreach volume"
    ],
    "generated_at": "2025-11-11T18:47:25.441Z"
  },
  "footer": {
    "tagline": "Find your customers — automatically.",
    "description": "Give us your website, and Selda will analyze your business, find your best customers, and book meetings for you.",
    "note": "No setup. No learning curve. Just growth.",
    "link": "https://selda.ai"
  }
}
```

---

Find your customers automatically with Selda → [https://selda.ai](https://selda.ai)

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

## Upcoming: Selda API Gateway (v2)

Stage 1 (this repository) keeps `/analyze` public, unauthenticated, and returns the JSON schema documented above.

Planned extensions:

- Authenticated `POST /v1/analyze` returning richer payloads (lead previews, refined angles, update suggestions).
- `GET /v1/account` for credit/usage tracking.
- API key or OAuth flows for partner integrations.

Deployment toggle (already supported):

```
SELDA_API_MODE=open    # open | private
```

Later, setting `SELDA_API_MODE=private` can enable the gateway layer without changing `analyze()` itself.

Beyond that, an “Intelligence Mode” could add site update recommendations and advanced sales angles using the same foundation.

---

## License

MIT © Selda
