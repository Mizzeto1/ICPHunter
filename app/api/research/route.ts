import { NextRequest, NextResponse } from "next/server";
import { searchApolloCompany, searchApolloContacts } from "@/lib/apollo";
import { researchCompanySignals, synthesizePlan } from "@/lib/claude";
import { getCompanyConfig } from "@/configs";
import {
  ResearchResult,
  AISignals,
  AccountPlan,
  ContactAnalysis,
  FitScore,
  ApolloOrganization,
} from "@/lib/types";

export const maxDuration = 60;

function emptySignals(): AISignals {
  return {
    orgType: "provider",
    aiStrategy: "Research data unavailable — manual review recommended",
    recentNews: ["Research data unavailable"],
    hiringSignals: ["Research data unavailable"],
    partnerships: ["Research data unavailable"],
    riskFactors: ["Research data unavailable"],
  };
}

function emptyOrg(name: string): ApolloOrganization {
  return {
    id: "",
    name,
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
}

function emptyPlan(): AccountPlan {
  return {
    executiveSummary: "Plan generation failed — please retry.",
    painToProductFit: "",
    competitiveThreats: "",
    timingUrgency: "",
    dealStrategy: "",
    discoveryQuestions: "",
    roiFramework: "",
    firstTouchEmail: "",
  };
}

function emptyFitScore(): FitScore {
  return {
    aiReadiness: { score: 0, reason: "Unable to assess" },
    buyingUrgency: { score: 0, reason: "Unable to assess" },
    whiteSpace: { score: 0, reason: "Unable to assess" },
    accessibility: { score: 0, reason: "Unable to assess" },
    strategicValue: { score: 0, reason: "Unable to assess" },
  };
}

function computeOverallScore(fitScore: FitScore): number {
  const scores = [
    fitScore.aiReadiness.score,
    fitScore.buyingUrgency.score,
    fitScore.whiteSpace.score,
    fitScore.accessibility.score,
    fitScore.strategicValue.score,
  ];
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round((sum / scores.length) * 10) / 10;
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
    const org = apolloCompany?.domain ? apolloCompany : emptyOrg(company);

    // STEP 2: Run in parallel — contacts (if we have domain) + web research signals
    const allTitles = [
      ...config.targetTitles.payer,
      ...config.targetTitles.provider,
    ];

    const [contacts, signals] = await Promise.all([
      org.domain
        ? searchApolloContacts(org.domain, allTitles)
        : Promise.resolve([]),
      researchCompanySignals(company).catch(() => emptySignals()),
    ]);

    // STEP 3: Synthesize everything in one call
    let contactAnalysis: ContactAnalysis[];
    let plan: AccountPlan;
    let fitScore: FitScore;

    try {
      const synthesis = await synthesizePlan({
        company: org,
        contacts,
        signals,
        config,
      });

      contactAnalysis = synthesis.contactAnalysis || [];
      plan = {
        executiveSummary: synthesis.executiveSummary || "",
        painToProductFit: synthesis.painToProductFit || "",
        competitiveThreats: synthesis.competitiveThreats || "",
        timingUrgency: synthesis.timingUrgency || "",
        dealStrategy: synthesis.dealStrategy || "",
        discoveryQuestions: synthesis.discoveryQuestions || "",
        roiFramework: synthesis.roiFramework || "",
        firstTouchEmail: synthesis.firstTouchEmail || "",
      };
      fitScore = synthesis.fitScore || emptyFitScore();
    } catch {
      contactAnalysis = [];
      plan = emptyPlan();
      fitScore = emptyFitScore();
    }

    const result: ResearchResult = {
      organization: org,
      contactAnalysis,
      signals,
      plan,
      fitScore,
      overallScore: computeOverallScore(fitScore),
      generatedAt: new Date().toISOString(),
      targetCompany: configSlug,
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
