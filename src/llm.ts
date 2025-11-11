import OpenAI from "openai";
import dotenv from "dotenv";
import type { SeldaResult } from "./types";
import type { ScrapedWebsite } from "./scraper";
import { collapseWhitespaceAndTruncate, extractJsonFromText, safeParseJson } from "./utils";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

dotenv.config();

const MODEL_NAME = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SELDA_SCHEMA = `
{
  "company": {
    "name": "string",
    "website": "string | optional",
    "industry": "string | optional",
    "description": "string | optional",
    "tone_of_voice": "string | optional",
    "keywords": "string[] | optional"
  },
  "business_understanding": {
    "problem_they_solve": "string",
    "value_proposition": "string",
    "competitive_advantage": "string",
    "market_position": "string",
    "buying_committee_notes": "string | optional"
  },
  "target_strategy": {
    "decision_maker_profiles": [
      {
        "role": "string",
        "motivations": "string[]",
        "pain_points": "string[]",
        "recommended_angle": "string",
        "recommended_channels": "string[] | optional",
        "messaging_examples": "string[] | optional"
      }
    ],
    "recommended_channels": "string[]",
    "strategic_notes": "string | optional",
    "channel_priority": [
      {
        "channel": "string",
        "priority": "high|medium|low",
        "reason": "string | optional"
      }
    ] | optional
  },
  "action_guidelines": {
    "messaging_style": "string",
    "example_pitch": "string",
    "recommended_next_steps": "string[]"
  },
  "ideal_customer_profiles": {
    "segments": [
      {
        "segment": "string",
        "buying_motivations": "string[]",
        "typical_pains": "string[]",
        "evaluation_criteria": "string[]",
        "suggested_positioning": "string | optional"
      }
    ]
  },
  "buying_triggers": {
    "primary_signals": "string[]",
    "monitoring_channels": "string[]",
    "trigger_actions": [
      {
        "trigger": "string",
        "watch": "string",
        "recommended_action": "string"
      }
    ] | optional
  },
  "product_breakdown": {
    "key_offerings": [
      {
        "name": "string",
        "description": "string",
        "target_customer": "string | optional"
      }
    ],
    "pricing_signals": "string[]"
  },
  "competitive_landscape": {
    "notable_competitors": "string[]",
    "differentiators": "string[]",
    "counterplays": [
      {
        "competitor": "string",
        "counterplay": "string"
      }
    ] | optional
  },
  "content_and_proof": {
    "social_proof": "string[]",
    "call_to_action_assets": [
      {
        "title": "string",
        "type": "string | optional",
        "used_for": "string | optional",
        "url": "string | optional",
        "description": "string | optional"
      }
    ]
  },
  "partnerships": {
    "integration_partners": "string[]",
    "ecosystem_notes": "string | optional"
  },
  "sales_play_recommendations": {
    "priority_sequences": [
      {
        "sequence_name": "string",
        "channel": "string",
        "steps": "string[]",
        "messaging_angle": "string"
      }
    ],
    "objection_handling": [
      {
        "objection": "string",
        "response": "string"
      }
    ],
    "first_touch_template": {
      "email": "string | optional",
      "linkedin_dm": "string | optional",
      "phone_opener": "string | optional",
      "sms": "string | optional"
    } | optional
  },
  "campaign_starter": {
    "objective": "string",
    "sequence_outline": [
      {
        "day": "number",
        "description": "string",
        "channel": "string"
      }
    ],
    "success_metrics": "string[]"
  } | optional,
  "verifier_insights": {
    "testimonials": "string[] | optional",
    "industries_served": "string[] | optional",
    "geographies": "string[] | optional",
    "languages": "string[] | optional",
    "awards_or_certifications": "string[] | optional"
  } | optional,
  "footer": {
    "tagline": "string",
    "description": "string",
    "note": "string",
    "link": "string"
  },
  "metadata": {
    "notes": "string | optional",
    "revops_checklist": "string[] | optional"
  }
}
`.trim();

export async function runLLM(scraped: ScrapedWebsite): Promise<SeldaResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Please add it to your environment.");
  }

  const websiteSnapshot = {
    url: scraped.url,
    fetchedAt: scraped.fetchedAt,
    language: scraped.language,
    title: scraped.title,
    description: scraped.description,
    keywords: scraped.keywords,
    headings: scraped.headings.slice(0, 20),
    metaKeywords: scraped.metaKeywords,
    textExcerpt: collapseWhitespaceAndTruncate(scraped.textExcerpt, 11000),
    socialLinks: scraped.socialLinks,
    contactPages: scraped.contactPages,
    testimonials: scraped.testimonials,
    industriesServed: scraped.industriesServed,
    geographies: scraped.geographies,
    languagesDetected: scraped.languagesDetected,
  };

  const systemPrompt = `
You are Selda AI, a B2B sales intelligence analyst. Produce actionable insights about the company behind the supplied website snapshot, including channel prioritisation, buyer triggers, campaign plans, and RevOps next steps.
Leverage the supplied testimonials, industries, geographies, and language hints where available; infer responsibly when data is missing, and NEVER invent specific individuals or personal contact data.
Respond with JSON that EXACTLY matches the SeldaResult schema shown below. Do not include markdown or commentary.
Always return every array field (use [] when uncertain) and keep responses concise but actionable.
For each new section you generate (channel_priority, trigger_actions, first_touch_template, campaign_starter, verifier_insights, revops_checklist) provide practical, execution-ready guidance.
If data is missing, infer plausible answers from context or clearly state "Unknown".

SeldaResult schema:
${SELDA_SCHEMA}
  `.trim();

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Website snapshot:\n${JSON.stringify(websiteSnapshot, null, 2)}`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: MODEL_NAME,
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages,
  });

  const rawContent = completion.choices[0]?.message?.content ?? "";
  const directParse = safeParseJson<SeldaResult>(rawContent);
  const fallbackContent = extractJsonFromText(rawContent);
  const fallbackParse = fallbackContent
    ? safeParseJson<SeldaResult>(fallbackContent)
    : null;

  const parsed = directParse ?? fallbackParse;

  if (!parsed) {
    throw new Error("Failed to parse LLM response into SeldaResult JSON.");
  }

  const metadata = {
    ...(parsed.metadata ?? {}),
    model_version: MODEL_NAME,
    source_url: scraped.url,
    scraped_at: scraped.fetchedAt,
    social_links: scraped.socialLinks,
    contact_pages: scraped.contactPages,
    revops_checklist: parsed.metadata?.revops_checklist ?? [],
  };

  return {
    ...parsed,
    metadata,
  };
}

