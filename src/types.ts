export interface SeldaResult {
  company: {
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    keywords?: string[];
  };
  business_understanding: {
    problem_they_solve: string;
    value_proposition: string;
    competitive_advantage: string;
    market_position: string;
  };
  target_strategy: {
    decision_maker_profiles: Array<{
      role: string;
      motivations: string[];
      pain_points: string[];
      recommended_angle: string;
    }>;
    recommended_channels: string[];
  };
  action_guidelines: {
    messaging_style: string;
    example_pitch: string;
    recommended_next_steps: string[];
  };
  metadata?: Record<string, any>;
}

