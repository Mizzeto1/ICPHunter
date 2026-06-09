import { NextRequest, NextResponse } from "next/server";
import { searchOrganization, searchContacts, getTitlesForOrgType } from "@/lib/apollo";
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

type OrgType = "payer" | "provider" | "both";

function inferOrgType(org: ApolloOrganization | null): OrgType {
  if (!org) return "both";
  const industry = (org.industry || "").toLowerCase();
  const desc = (org.short_description || "").toLowerCase();
  const combined = `${industry} ${desc}`;

  const payerSignals = ["insurance", "payer", "health plan", "managed care", "medicaid", "medicare advantage"];
  const providerSignals = ["hospital", "health system", "medical center", "clinic", "physician", "ambulatory"];
  const isPayer = payerSignals.some((s) => combined.includes(s));
  const isProvider = providerSignals.some((s) => combined.includes(s));

  if (isPayer && isProvider) return "both";
  if (isPayer) return "payer";
  if (isProvider) return "provider";
  return "both";
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

    const org = await searchOrganization(company);

    const fallbackOrg: ApolloOrganization = org || {
      id: "",
      name: company,
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

    const orgType = inferOrgType(fallbackOrg);
    const titles = getTitlesForOrgType(config.targetTitles, orgType);

    const [contacts, signalsRaw] = await Promise.all([
      searchContacts(company, titles),
      researchWithWebSearch(buildResearchPrompt(company, config, orgType)),
    ]);

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
        buildAccountPlanPrompt(company, config, fallbackOrg, JSON.stringify(signals), orgType)
      ),
      contacts.length > 0
        ? generateWithClaude(
            buildContactCategorizationPrompt(contacts, company, config, orgType)
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
