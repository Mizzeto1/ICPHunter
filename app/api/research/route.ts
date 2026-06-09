import { NextRequest, NextResponse } from "next/server";
import { searchOrganization, searchContacts, HEALTHCARE_TITLES } from "@/lib/apollo";
import {
  researchWithWebSearch,
  generateWithClaude,
  parseJSON,
} from "@/lib/claude";
import {
  buildResearchPrompt,
  buildAccountPlanPrompt,
  buildContactCategorizationPrompt,
} from "@/lib/prompts";
import { getCompanyConfig } from "@/configs";
import {
  ResearchResult,
  AISignals,
  AccountPlan,
  FitDimension,
  CategorizedContact,
  ApolloOrganization,
} from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { orgName, targetCompany } = await request.json();

    if (!orgName || !targetCompany) {
      return NextResponse.json(
        { error: "Missing orgName or targetCompany" },
        { status: 400 }
      );
    }

    const config = getCompanyConfig(targetCompany);
    if (!config) {
      return NextResponse.json(
        { error: `Unknown company: ${targetCompany}` },
        { status: 400 }
      );
    }

    const [org, contacts] = await Promise.all([
      searchOrganization(orgName),
      searchContacts(orgName, HEALTHCARE_TITLES),
    ]);

    const fallbackOrg: ApolloOrganization = org || {
      id: "",
      name: orgName,
      website_url: "",
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

    const researchPrompt = buildResearchPrompt(orgName, config);
    const signalsRaw = await researchWithWebSearch(researchPrompt);
    let signals: AISignals;
    try {
      const parsed = parseJSON<{ signals: AISignals }>(signalsRaw);
      signals = parsed.signals;
    } catch {
      signals = {
        ai_strategy: ["Research data unavailable — manual review recommended"],
        hiring_signals: ["Research data unavailable"],
        recent_news: ["Research data unavailable"],
        technology_stack: ["Research data unavailable"],
      };
    }

    const [planRaw, categorizationRaw] = await Promise.all([
      generateWithClaude(
        buildAccountPlanPrompt(orgName, config, fallbackOrg, JSON.stringify(signals))
      ),
      contacts.length > 0
        ? generateWithClaude(
            buildContactCategorizationPrompt(contacts, orgName, config)
          )
        : Promise.resolve("[]"),
    ]);

    let plan: AccountPlan;
    let fitScore: FitDimension[];
    try {
      const parsed = parseJSON<{ plan: AccountPlan; fit_score: FitDimension[] }>(
        planRaw
      );
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

    let categorizedContacts: CategorizedContact[] = [];
    if (contacts.length > 0) {
      try {
        const categories = parseJSON<
          { name: string; tier: string; reasoning: string }[]
        >(categorizationRaw);
        const categoryMap = new Map(
          categories.map((c) => [c.name, { tier: c.tier, reasoning: c.reasoning }])
        );

        categorizedContacts = contacts.map((contact) => {
          const cat = categoryMap.get(contact.name);
          return {
            ...contact,
            tier: (cat?.tier as CategorizedContact["tier"]) || "evaluator",
            reasoning: cat?.reasoning || "Categorization pending",
          };
        });
      } catch {
        categorizedContacts = contacts.map((c) => ({
          ...c,
          tier: "evaluator" as const,
          reasoning: "Auto-categorized — manual review recommended",
        }));
      }
    }

    const overallScore =
      fitScore.length > 0
        ? Math.round(
            fitScore.reduce((sum, f) => sum + f.score, 0) / fitScore.length
          )
        : 0;

    const result: ResearchResult = {
      organization: fallbackOrg,
      contacts: categorizedContacts,
      signals,
      plan,
      fit_score: fitScore,
      overall_score: overallScore,
      generated_at: new Date().toISOString(),
      target_company: targetCompany,
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
