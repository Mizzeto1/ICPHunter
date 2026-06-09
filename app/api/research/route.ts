import { NextRequest, NextResponse } from "next/server";
import { searchApolloCompany, searchApolloContacts } from "@/lib/apollo";
import {
  researchWithWebSearch,
  generateWithClaude,
  parseJSON,
} from "@/lib/claude";
import {
  buildSignalsPrompt,
  buildSynthesisPrompt,
  buildWebOnlyPlanPrompt,
} from "@/lib/prompts";
import { getCompanyConfig } from "@/configs";
import {
  ResearchResult,
  AISignals,
  AccountPlan,
  FitDimension,
  CategorizedContact,
  ApolloOrganization,
  ApolloContact,
  CompanyConfig,
} from "@/lib/types";

export const maxDuration = 60;

function parseSignals(raw: string): AISignals {
  try {
    const parsed = parseJSON<{ signals: AISignals }>(raw);
    return parsed.signals;
  } catch {
    return {
      ai_strategy: ["Research data unavailable — manual review recommended"],
      hiring_signals: ["Research data unavailable"],
      recent_news: ["Research data unavailable"],
      technology_stack: ["Research data unavailable"],
    };
  }
}

async function generateWebOnlyPlan(
  companyName: string,
  config: CompanyConfig
): Promise<Response> {
  const signalsRaw = await researchWithWebSearch(
    buildSignalsPrompt(companyName, config)
  );
  const signals = parseSignals(signalsRaw);

  const planRaw = await generateWithClaude(
    buildWebOnlyPlanPrompt(companyName, JSON.stringify(signals), config)
  );

  let plan: AccountPlan;
  let fitScore: FitDimension[];
  try {
    const parsed = parseJSON<{ plan: AccountPlan; fit_score: FitDimension[] }>(planRaw);
    plan = parsed.plan;
    fitScore = parsed.fit_score;
  } catch {
    plan = {
      executive_summary: "Plan generation failed — please retry.",
      pain_product_fit: "",
      competitive_threats: "",
      timing_urgency: "",
      deal_strategy: "",
      discovery_questions: [],
      roi_framework: "",
      first_touch_email: "",
    };
    fitScore = [];
  }

  const overallScore =
    fitScore.length > 0
      ? Math.round(fitScore.reduce((sum, f) => sum + f.score, 0) / fitScore.length)
      : 0;

  const fallbackOrg: ApolloOrganization = {
    id: "",
    name: companyName,
    website_url: "",
    domain: "",
    industry: "Healthcare",
    estimated_num_employees: 0,
    annual_revenue_printed: "N/A",
    short_description: "",
    logo_url: "",
    founded_year: 0,
    linkedin_url: "",
    phone: "",
    city: "",
    state: "",
    country: "",
  };

  const result: ResearchResult = {
    organization: fallbackOrg,
    contacts: [],
    signals,
    plan,
    fit_score: fitScore,
    overall_score: overallScore,
    generated_at: new Date().toISOString(),
    target_company: config.slug,
  };

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const { company, configSlug } = await request.json();

    if (!company || !configSlug) {
      return NextResponse.json(
        { error: "Missing company or configSlug" },
        { status: 400 }
      );
    }

    const config = getCompanyConfig(configSlug);
    if (!config) {
      return NextResponse.json(
        { error: `Unknown config: ${configSlug}` },
        { status: 400 }
      );
    }

    // STEP 1: Find the company in Apollo (need the domain for contact search)
    const apolloCompany = await searchApolloCompany(company);
    if (!apolloCompany?.domain) {
      return generateWebOnlyPlan(company, config);
    }

    // STEP 2: Run in parallel — contacts by domain + web research signals
    const allTitles = Array.from(
      new Set([...config.targetTitles.payer, ...config.targetTitles.provider])
    );

    const [contacts, signalsRaw] = await Promise.all([
      searchApolloContacts(apolloCompany.domain, allTitles),
      researchWithWebSearch(buildSignalsPrompt(company, config)),
    ]);

    const signals = parseSignals(signalsRaw);

    // STEP 3: Claude synthesizes everything in one call
    const synthesisRaw = await generateWithClaude(
      buildSynthesisPrompt(apolloCompany, contacts, JSON.stringify(signals), config)
    );

    let plan: AccountPlan;
    let fitScore: FitDimension[];
    let categorizedContacts: CategorizedContact[];

    try {
      const parsed = parseJSON<{
        contacts: { name: string; tier: string; reasoning: string }[];
        plan: AccountPlan;
        fit_score: FitDimension[];
      }>(synthesisRaw);

      plan = parsed.plan;
      fitScore = parsed.fit_score;

      const categoryMap = new Map(
        parsed.contacts.map((c) => [c.name, { tier: c.tier, reasoning: c.reasoning }])
      );

      categorizedContacts = contacts.map((contact: ApolloContact) => {
        const cat = categoryMap.get(contact.name);
        return {
          ...contact,
          tier: (cat?.tier as CategorizedContact["tier"]) || "evaluator",
          reasoning: cat?.reasoning || "Categorization pending",
        };
      });
    } catch {
      plan = {
        executive_summary: "Plan generation failed — please retry.",
        pain_product_fit: "",
        competitive_threats: "",
        timing_urgency: "",
        deal_strategy: "",
        discovery_questions: [],
        roi_framework: "",
        first_touch_email: "",
      };
      fitScore = [];
      categorizedContacts = contacts.map((c: ApolloContact) => ({
        ...c,
        tier: "evaluator" as const,
        reasoning: "Auto-categorized — synthesis failed",
      }));
    }

    const overallScore =
      fitScore.length > 0
        ? Math.round(fitScore.reduce((sum, f) => sum + f.score, 0) / fitScore.length)
        : 0;

    const result: ResearchResult = {
      organization: apolloCompany,
      contacts: categorizedContacts,
      signals,
      plan,
      fit_score: fitScore,
      overall_score: overallScore,
      generated_at: new Date().toISOString(),
      target_company: configSlug,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
