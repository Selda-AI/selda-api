export interface SeldaResult {
  company: {
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    keywords?: string[];
    tone_of_voice?: string;
  };
  business_understanding: {
    problem_they_solve: string;
    value_proposition: string;
    competitive_advantage: string;
    market_position: string;
    buying_committee_notes?: string;
  };
  target_strategy: {
    decision_maker_profiles: Array<{
      role: string;
      motivations: string[];
      pain_points: string[];
      recommended_angle: string;
      recommended_channels?: string[];
      messaging_examples?: string[];
    }>;
    recommended_channels: string[];
    strategic_notes?: string;
    channel_priority?: Array<{
      channel: string;
      priority: "high" | "medium" | "low";
      reason?: string;
    }>;
  };
  action_guidelines: {
    messaging_style: string;
    example_pitch: string;
    recommended_next_steps: string[];
  };
  ideal_customer_profiles: {
    segments: Array<{
      segment: string;
      buying_motivations: string[];
      typical_pains: string[];
      evaluation_criteria: string[];
      suggested_positioning?: string;
    }>;
  };
  buying_triggers: {
    primary_signals: string[];
    monitoring_channels: string[];
    trigger_actions?: Array<{
      trigger: string;
      watch: string;
      recommended_action: string;
    }>;
  };
  product_breakdown: {
    key_offerings: Array<{
      name: string;
      description: string;
      target_customer?: string;
    }>;
    pricing_signals: string[];
  };
  competitive_landscape: {
    notable_competitors: string[];
    differentiators: string[];
    counterplays?: Array<{
      competitor: string;
      counterplay: string;
    }>;
  };
  content_and_proof: {
    social_proof: string[];
    call_to_action_assets: Array<{
      title: string;
      type?: string;
      used_for?: string;
      url?: string;
      description?: string;
    }>;
  };
  partnerships: {
    integration_partners: string[];
    ecosystem_notes?: string;
  };
  sales_play_recommendations: {
    priority_sequences: Array<{
      sequence_name: string;
      channel: string;
      steps: string[];
      messaging_angle: string;
    }>;
    objection_handling: Array<{
      objection: string;
      response: string;
    }>;
    first_touch_template?: {
      email?: string;
      linkedin_dm?: string;
      phone_opener?: string;
      sms?: string;
    };
  };
  campaign_starter?: {
    objective: string;
    sequence_outline: Array<{
      day: number;
      description: string;
      channel: string;
    }>;
    success_metrics: string[];
  };
  verifier_insights?: {
    testimonials?: string[];
    industries_served?: string[];
    geographies?: string[];
    languages?: string[];
    awards_or_certifications?: string[];
  };
  footer?: {
    tagline: string;
    description: string;
    note: string;
    link: string;
  };
  metadata?: {
    model_version?: string;
    source_url?: string;
    scraped_at?: string;
    generated_at?: string;
    social_links?: Array<{ platform: string; url: string }>;
    contact_pages?: string[];
    snapshot_notes?: string[];
    revops_checklist?: string[];
    [key: string]: unknown;
  };
}

