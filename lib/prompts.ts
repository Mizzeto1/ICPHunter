import { CompanyConfig, ApolloContact, ApolloOrganization } from "./types";

export function buildSignalsPrompt(
  companyName: string,
  config: CompanyConfig
): string {
  return `You are an elite enterprise sales strategist specializing in selling AI/technology solutions to large healthcare organizations. You are researching "${companyName}" to build an account plan for selling ${config.name}'s products.

${config.name} — ${config.product}
${config.tagline}

VALUE PROPOSITIONS FOR PAYERS:
${config.valueProps.payer.map((v) => `- ${v}`).join("\n")}

VALUE PROPOSITIONS FOR PROVIDERS:
${config.valueProps.provider.map((v) => `- ${v}`).join("\n")}

KNOWN COMPETITORS IN THIS SPACE:
${config.competitors.map((c) => `- ${c}`).join("\n")}

Research "${companyName}" and provide a comprehensive analysis. Use web search to find:
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

export function buildSynthesisPrompt(
  apolloCompany: ApolloOrganization,
  contacts: ApolloContact[],
  signals: string,
  config: CompanyConfig
): string {
  const contactList = contacts.length > 0
    ? contacts
        .map(
          (c) =>
            `- ${c.name} | ${c.title} | Seniority: ${c.seniority} | Departments: ${c.departments.join(", ")} | LinkedIn: ${c.linkedin_url || "N/A"}`
        )
        .join("\n")
    : "No contacts found in Apollo.";

  return `You are an elite enterprise sales strategist. Synthesize all the data below into a complete account plan for selling ${config.name}'s products to ${apolloCompany.name}.

===== ABOUT ${config.name.toUpperCase()} =====
Product: ${config.product}
Tagline: ${config.tagline}

Value Props for Payers:
${config.valueProps.payer.map((v) => `- ${v}`).join("\n")}

Value Props for Providers:
${config.valueProps.provider.map((v) => `- ${v}`).join("\n")}

Known Competitors:
${config.competitors.map((c) => `- ${c}`).join("\n")}

===== ABOUT ${apolloCompany.name.toUpperCase()} (from Apollo) =====
Industry: ${apolloCompany.industry}
Employees: ${apolloCompany.estimated_num_employees}
Revenue: ${apolloCompany.annual_revenue_printed}
Description: ${apolloCompany.short_description}
Location: ${[apolloCompany.city, apolloCompany.state].filter(Boolean).join(", ")}
Website: ${apolloCompany.website_url}

===== CONTACTS AT ${apolloCompany.name.toUpperCase()} (from Apollo) =====
${contactList}

===== MARKET & AI SIGNALS (from web research) =====
${signals}

===== YOUR TASK =====
Synthesize everything above into a complete, actionable account plan. You must:

1. Determine whether ${apolloCompany.name} is a PAYER, PROVIDER, or INTEGRATED system and select the most relevant value propositions accordingly.

2. Categorize EVERY contact into a buying committee tier:
   - decision_maker: C-suite or SVP who signs the check
   - champion: Director/VP who will internally advocate
   - evaluator: Technical leads who assess the product
   - blocker: People who may slow the deal (procurement, compliance, security, legal)

3. Build the account plan with specific references to ${config.name}'s products and ${apolloCompany.name}'s situation.

4. Score account fit across 5 dimensions.

Return as a SINGLE JSON object with this exact structure:
{
  "contacts": [
    {
      "name": "<full name exactly as listed above>",
      "tier": "<decision_maker|champion|evaluator|blocker>",
      "reasoning": "<one sentence>"
    }
  ],
  "plan": {
    "executive_summary": "<2-3 paragraph strategic overview>",
    "pain_product_fit": "<Detailed mapping of pains to SPECIFIC ${config.name} products/features>",
    "competitive_threats": "<For EACH known competitor, their specific threat and how to differentiate>",
    "timing_urgency": "<Why NOW — reference specific signals, fiscal cycles, regulatory deadlines>",
    "deal_strategy": "<Step-by-step: who to contact first, messaging, org navigation, proof points>",
    "discovery_questions": ["<8-10 sharp questions demonstrating deep healthcare knowledge>"],
    "roi_framework": "<Specific ROI model with metrics, benchmarks, and business case approach>",
    "first_touch_email": "<Personalized cold email referencing ${apolloCompany.name} initiatives and ${config.name} capabilities. Under 150 words.>"
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

export function buildWebOnlyPlanPrompt(
  companyName: string,
  signals: string,
  config: CompanyConfig
): string {
  return `You are an elite enterprise sales strategist. Build an account plan for selling ${config.name}'s products to "${companyName}" using ONLY web research signals (no contact data available).

===== ABOUT ${config.name.toUpperCase()} =====
Product: ${config.product}
Tagline: ${config.tagline}

Value Props for Payers:
${config.valueProps.payer.map((v) => `- ${v}`).join("\n")}

Value Props for Providers:
${config.valueProps.provider.map((v) => `- ${v}`).join("\n")}

Known Competitors:
${config.competitors.map((c) => `- ${c}`).join("\n")}

===== MARKET & AI SIGNALS FOR "${companyName.toUpperCase()}" =====
${signals}

Build an account plan based on the available signals. Determine whether "${companyName}" is a payer, provider, or integrated system and select the most relevant value propositions.

Return as JSON:
{
  "plan": {
    "executive_summary": "<2-3 paragraph strategic overview>",
    "pain_product_fit": "<Map pains to SPECIFIC ${config.name} products/features>",
    "competitive_threats": "<For EACH known competitor, their threat and differentiation>",
    "timing_urgency": "<Why NOW>",
    "deal_strategy": "<Approach without specific contacts>",
    "discovery_questions": ["<8-10 sharp questions>"],
    "roi_framework": "<ROI model with metrics and benchmarks>",
    "first_touch_email": "<Personalized cold email. Under 150 words.>"
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
