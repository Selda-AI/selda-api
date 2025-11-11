import { describe, expect, it, vi, beforeEach } from "vitest";

const mockScrapedWebsite = {
  url: "https://notion.so/",
  fetchedAt: "2025-01-01T00:00:00.000Z",
  status: 200,
  title: "Notion – The connected workspace",
  description: "Notion is the connected workspace for teams.",
  language: "en",
  headings: ["Organize everything", "Collaborate with anyone"],
  textExcerpt: "Notion brings together notes, docs, and projects.",
  keywords: ["notion", "workspace"],
  metaKeywords: ["knowledge", "docs"],
  socialLinks: [{ platform: "LinkedIn", url: "https://www.linkedin.com/company/notionhq" }],
  contactPages: ["https://www.notion.so/contact"],
  testimonials: ["\"Notion keeps our entire org in sync.\" – COO, Example Corp"],
  industriesServed: ["Technology companies", "Agencies"],
  geographies: ["Global", "North America", "Europe"],
  languagesDetected: ["en"],
  rawHtml: "<html></html>",
};

const mockSeldaResult = {
  company: {
    name: "Notion",
    website: "https://notion.so/",
    industry: "Productivity SaaS",
    description: "All-in-one workspace",
    tone_of_voice: "Clear and collaborative",
    keywords: ["workspace"],
  },
  business_understanding: {
    problem_they_solve: "Fragmented knowledge",
    value_proposition: "Centralized workspace",
    competitive_advantage: "Customization and templates",
    market_position: "Leading collaborative workspace",
    buying_committee_notes: "Product, operations, and IT leaders",
  },
  target_strategy: {
    decision_maker_profiles: [
      {
        role: "Head of Operations",
        motivations: ["Team alignment"],
        pain_points: ["Tool sprawl"],
        recommended_angle: "Single source of truth",
        recommended_channels: ["Email"],
        messaging_examples: ["Keep every team aligned"],
      },
    ],
    recommended_channels: ["Email", "LinkedIn"],
    strategic_notes: "Showcase asynchronous collaboration",
    channel_priority: [
      { channel: "Email", priority: "high", reason: "Asynchronous collaboration story resonates" },
      { channel: "LinkedIn", priority: "medium", reason: "Strong community presence" },
    ],
  },
  action_guidelines: {
    messaging_style: "Practical and design-led",
    example_pitch: "Notion keeps your team aligned in one place.",
    recommended_next_steps: ["Book demo", "Share templates"],
  },
  ideal_customer_profiles: {
    segments: [
      {
        segment: "Product-led SaaS (20-200 employees)",
        buying_motivations: ["Faster onboarding"],
        typical_pains: ["Knowledge scattered"],
        evaluation_criteria: ["Ease of use"],
        suggested_positioning: "Design-led workspace",
      },
    ],
  },
  buying_triggers: {
    primary_signals: ["Rapid hiring"],
    monitoring_channels: ["LinkedIn"],
    trigger_actions: [
      {
        trigger: "Rapid hiring",
        watch: "LinkedIn jobs",
        recommended_action: "Share onboarding template to shorten ramp time.",
      },
    ],
  },
  product_breakdown: {
    key_offerings: [
      {
        name: "Team Workspace",
        description: "Collaborative docs and tasks.",
        target_customer: "Product teams",
      },
    ],
    pricing_signals: ["Freemium"],
  },
  competitive_landscape: {
    notable_competitors: ["Coda", "Airtable"],
    differentiators: ["Community templates"],
    counterplays: [
      {
        competitor: "Airtable",
        counterplay: "Highlight Notion's unified docs and tasks versus disparate grids.",
      },
    ],
  },
  content_and_proof: {
    social_proof: ["Used by Figma"],
    call_to_action_assets: [
      {
        title: "Book a demo",
        type: "demo",
        used_for: "follow-up email",
        url: "https://www.notion.so/demo",
      },
    ],
  },
  partnerships: {
    integration_partners: ["Slack", "Jira"],
    ecosystem_notes: "Deep integrations with productivity tools",
  },
  sales_play_recommendations: {
    priority_sequences: [
      {
        sequence_name: "Ops leader outreach",
        channel: "Email",
        steps: ["Intro", "Template share"],
        messaging_angle: "Reduce tool chaos",
      },
    ],
    objection_handling: [
      {
        objection: "We already use multiple tools",
        response: "Notion consolidates them in one workspace.",
      },
    ],
    first_touch_template: {
      email: "Subject: Give your team one source of truth\nHi {{first_name}}, noticed your team ships fast. The teams we work with replace scattered docs + dashboards with a single Notion workspace. Worth 15 minutes to see how?",
      linkedin_dm: "Hi {{first_name}}, curious how you keep ops and product aligned today. We help teams like Figma run docs, projects, and knowledge in one place. Want to compare notes?",
      phone_opener: "Calling to share how teams are decluttering their tooling stack with a single workspace. Is now a quick moment to explain?",
    },
  },
  campaign_starter: {
    objective: "Book 5 operations leader demos in 14 days",
    sequence_outline: [
      { day: 1, description: "Personalized intro email with template pack", channel: "Email" },
      { day: 3, description: "Share customer story and async collaboration tips", channel: "LinkedIn" },
      { day: 7, description: "Send notion playbook PDF with calendar link", channel: "Email" },
    ],
    success_metrics: ["Reply rate > 20%", "Booked demos", "Template downloads"],
  },
  verifier_insights: {
    testimonials: ["\"Notion is the nerve center of everything we do.\" – COO, Example Corp"],
    industries_served: ["Technology", "Agencies"],
    geographies: ["Global", "North America"],
    languages: ["en"],
  },
  metadata: {
    model_version: "mock-model",
    social_links: mockScrapedWebsite.socialLinks,
    contact_pages: mockScrapedWebsite.contactPages,
    revops_checklist: [
      "Tag lead as 'Notion ICP - Ops'",
      "Sync LinkedIn company page into CRM",
      "Track hiring signals for ops roles",
    ],
  },
};

vi.mock("../src/scraper", () => ({
  scrapeWebsite: vi.fn().mockResolvedValue(mockScrapedWebsite),
}));

vi.mock("../src/llm", () => ({
  runLLM: vi.fn().mockResolvedValue(mockSeldaResult),
}));

const { scrapeWebsite } = await import("../src/scraper");
const { runLLM } = await import("../src/llm");
const { analyze } = await import("../src/analyze");

describe("analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes the URL, uses scraper/LLM, and augments metadata", async () => {
    const result = await analyze("https://notion.so");

    expect(scrapeWebsite).toHaveBeenCalledWith("https://notion.so/");
    expect(runLLM).toHaveBeenCalledWith(mockScrapedWebsite);

    expect(result.company.name).toBe("Notion");
    expect(result.metadata).toMatchObject({
      model_version: "mock-model",
      social_links: mockScrapedWebsite.socialLinks,
      contact_pages: mockScrapedWebsite.contactPages,
    });
    expect(result.metadata?.generated_at).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });
});
