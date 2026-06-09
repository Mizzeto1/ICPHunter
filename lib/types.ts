export interface CompanyConfig {
  slug: string;
  name: string;
  product: string;
  tagline: string;
  loomUrl: string;
  accentColor: string;
  valueProps: {
    payer: string[];
    provider: string[];
  };
  competitors: string[];
  targetTitles: {
    payer: string[];
    provider: string[];
  };
}

export interface ApolloOrganization {
  id: string;
  name: string;
  website_url: string;
  industry: string;
  estimated_num_employees: number;
  annual_revenue_printed: string;
  short_description: string;
  logo_url: string;
  founded_year: number;
  linkedin_url: string;
  phone: string;
  city: string;
  state: string;
  country: string;
}

export interface ApolloContact {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string;
  linkedin_url: string;
  email: string;
  photo_url: string;
  organization_name: string;
  city: string;
  state: string;
  departments: string[];
  seniority: string;
}

export type ContactTier = "decision_maker" | "champion" | "evaluator" | "blocker";

export interface CategorizedContact extends ApolloContact {
  tier: ContactTier;
  reasoning: string;
}

export interface FitDimension {
  dimension: string;
  score: number;
  reasoning: string;
}

export interface AccountPlan {
  executive_summary: string;
  pain_product_fit: string;
  competitive_threats: string;
  timing_urgency: string;
  deal_strategy: string;
  discovery_questions: string[];
  roi_framework: string;
  first_touch_email: string;
}

export interface AISignals {
  ai_strategy: string[];
  hiring_signals: string[];
  recent_news: string[];
  technology_stack: string[];
}

export interface ResearchResult {
  organization: ApolloOrganization;
  contacts: CategorizedContact[];
  signals: AISignals;
  plan: AccountPlan;
  fit_score: FitDimension[];
  overall_score: number;
  generated_at: string;
  target_company: string;
}

export interface PrebuiltAccount {
  slug: string;
  name: string;
  type: string;
  description: string;
}
