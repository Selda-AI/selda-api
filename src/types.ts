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
  };
  content_and_proof: {
    social_proof: string[];
    call_to_action_assets: string[];
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
  };
  metadata?: {
    model_version?: string;
    source_url?: string;
    scraped_at?: string;
    generated_at?: string;
    social_links?: Array<{ platform: string; url: string }>;
    contact_pages?: string[];
    snapshot_notes?: string[];
    [key: string]: unknown;
  };
}

