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
  domain: string;
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
  name: string;
  title: string;
  linkedinUrl: string;
  seniority: string;
  department: string;
}

export type ContactTier = "decision_maker" | "champion" | "evaluator" | "blocker";
export type DealRole = "economic_buyer" | "champion" | "evaluator" | "blocker";

export interface ContactAnalysis {
  name: string;
  title: string;
  dealRole: DealRole;
  tier: ContactTier;
  whyTheyMatter: string;
  approachAngle: string;
}

export interface FitScoreDimension {
  score: number;
  reason: string;
}

export interface FitScore {
  aiReadiness: FitScoreDimension;
  buyingUrgency: FitScoreDimension;
  whiteSpace: FitScoreDimension;
  accessibility: FitScoreDimension;
  strategicValue: FitScoreDimension;
}

export interface AccountPlan {
  executiveSummary: string;
  painToProductFit: string;
  competitiveThreats: string;
  timingUrgency: string;
  dealStrategy: string;
  discoveryQuestions: string;
  roiFramework: string;
  firstTouchEmail: string;
}

export interface AISignals {
  orgType: "payer" | "provider" | "integrated" | "bpo";
  aiStrategy: string;
  recentNews: string[];
  hiringSignals: string[];
  partnerships: string[];
  riskFactors: string[];
}

export interface ResearchResult {
  organization: ApolloOrganization;
  contactAnalysis: ContactAnalysis[];
  signals: AISignals;
  plan: AccountPlan;
  fitScore: FitScore;
  overallScore: number;
  generatedAt: string;
  targetCompany: string;
}

export interface PrebuiltAccount {
  slug: string;
  name: string;
  type: string;
  description: string;
}
