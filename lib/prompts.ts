import { CompanyConfig, ApolloContact, ApolloOrganization } from "./types";

function formatValueProps(config: CompanyConfig, orgType: "payer" | "provider" | "both"): string {
  if (orgType === "payer") {
    return `VALUE PROPOSITIONS FOR PAYERS:\n${config.valueProps.payer.map((v) => `- ${v}`).join("\n")}`;
  }
  if (orgType === "provider") {
    return `VALUE PROPOSITIONS FOR PROVIDERS:\n${config.valueProps.provider.map((v) => `- ${v}`).join("\n")}`;
  }
  return `VALUE PROPOSITIONS FOR PAYERS:\n${config.valueProps.payer.map((v) => `- ${v}`).join("\n")}\n\nVALUE PROPOSITIONS FOR PROVIDERS:\n${config.valueProps.provider.map((v) => `- ${v}`).join("\n")}`;
}

export function buildResearchPrompt(
  orgName: string,
  targetCompany: CompanyConfig,
  orgType: "payer" | "provider" | "both"
): string {
  return `You are an elite enterprise sales strategist specializing in selling AI/technology solutions to large healthcare organizations. You are researching "${orgName}" to build an account plan for selling ${targetCompany.name}'s products.

${targetCompany.name} — ${targetCompany.product}
${targetCompany.tagline}

${formatValueProps(targetCompany, orgType)}

KNOWN COMPETITORS IN THIS SPACE:
${targetCompany.competitors.map((c) => `- ${c}`).join("\n")}

Research "${orgName}" and provide a comprehensive analysis. Use web search to find:
1. Their current AI/technology initiatives and digital transformation strategy
2. Recent news, partnerships, or announcements related to technology
3. Any job postings related to AI, data science, or digital transformation
4. Their technology stack and vendor relationships
5. Pain points and challenges they face

Return your findings as a JSON object with this exact structure:
{
  "signals": {
    "ai_strategy": ["<3-5 bullet points about their AI/tech strategy>"],
    "hiring_signals": ["<2-4 bullet points about relevant job postings or team growth>"],
    "recent_news": ["<3-5 recent news items or announcements>"],
    "technology_stack": ["<3-5 known technology vendors or platforms>"]
  }
}

Return ONLY valid JSON, no markdown formatting or code blocks.`;
}

export function buildAccountPlanPrompt(
  orgName: string,
  targetCompany: CompanyConfig,
  org: ApolloOrganization,
  signals: string,
  orgType: "payer" | "provider" | "both"
): string {
  return `You are an elite enterprise sales strategist. Build a detailed account plan for selling ${targetCompany.name}'s products to ${orgName}.

ABOUT ${targetCompany.name.toUpperCase()}:
Product: ${targetCompany.product}
Tagline: ${targetCompany.tagline}

${formatValueProps(targetCompany, orgType)}

KNOWN COMPETITORS:
${targetCompany.competitors.map((c) => `- ${c}`).join("\n")}

ABOUT ${orgName.toUpperCase()}:
Industry: ${org.industry}
Employees: ${org.estimated_num_employees}
Revenue: ${org.annual_revenue_printed}
Description: ${org.short_description}
Location: ${org.city}, ${org.state}

AI & MARKET SIGNALS:
${signals}

Build a comprehensive account plan. Reference ${targetCompany.name}'s SPECIFIC product capabilities and value propositions when mapping to ${orgName}'s pain points. Address the known competitors by name.

Return as JSON with this exact structure:
{
  "plan": {
    "executive_summary": "<2-3 paragraph strategic overview of why ${orgName} is a strong target for ${targetCompany.name}>",
    "pain_product_fit": "<Detailed mapping of ${orgName}'s pain points to ${targetCompany.name}'s specific product capabilities. Be specific about WHICH product/feature solves WHICH pain.>",
    "competitive_threats": "<Analysis of the known competitors listed above plus any others likely in the deal. For EACH competitor, explain their specific threat and how to differentiate.>",
    "timing_urgency": "<Why NOW is the right time to engage. Reference specific signals, fiscal cycles, regulatory deadlines, or strategic initiatives>",
    "deal_strategy": "<Step-by-step approach: who to contact first, what messaging to use, how to navigate the org, what proof points to lead with>",
    "discovery_questions": ["<8-10 sharp discovery questions that demonstrate deep healthcare knowledge and uncover real pain>"],
    "roi_framework": "<Specific ROI model: what metrics to measure, realistic benchmarks, how to build the business case for ${targetCompany.name} at ${orgName}>",
    "first_touch_email": "<A compelling, personalized cold email to the most senior relevant contact. Reference specific ${orgName} initiatives and ${targetCompany.name} capabilities. Under 150 words.>"
  },
  "fit_score": [
    {"dimension": "Strategic Alignment", "score": <1-10>, "reasoning": "<one line>"},
    {"dimension": "Budget Capacity", "score": <1-10>, "reasoning": "<one line>"},
    {"dimension": "Technical Readiness", "score": <1-10>, "reasoning": "<one line>"},
    {"dimension": "Urgency / Timing", "score": <1-10>, "reasoning": "<one line>"},
    {"dimension": "Champion Access", "score": <1-10>, "reasoning": "<one line>"}
  ]
}

Return ONLY valid JSON, no markdown formatting or code blocks.`;
}

export function buildContactCategorizationPrompt(
  contacts: ApolloContact[],
  orgName: string,
  targetCompany: CompanyConfig,
  orgType: "payer" | "provider" | "both"
): string {
  const contactList = contacts
    .map(
      (c) =>
        `- ${c.name} | ${c.title} | Seniority: ${c.seniority} | Departments: ${c.departments.join(", ")}`
    )
    .join("\n");

  return `You are an enterprise sales strategist. Categorize these contacts at ${orgName} into a buying committee for selling ${targetCompany.name}'s products.

${targetCompany.name} — ${targetCompany.product}

${formatValueProps(targetCompany, orgType)}

CONTACTS:
${contactList}

Categorize each person into exactly one tier:
- decision_maker: C-suite or SVP who signs the check. Usually CIO, CTO, CDO, CMO, or CEO.
- champion: Director/VP level who will internally advocate. Usually in IT, digital, data, innovation, or the operational area the product serves.
- evaluator: Technical leads who assess the product. Usually directors or senior managers in relevant departments.
- blocker: People who might slow or stop the deal (procurement, compliance, security, legal, existing vendor relationships).

Return as JSON array. Include ALL contacts from the list above:
[
  {
    "name": "<full name>",
    "tier": "<decision_maker|champion|evaluator|blocker>",
    "reasoning": "<one sentence explaining why this person is in this tier>"
  }
]

Return ONLY valid JSON, no markdown formatting or code blocks.`;
}
