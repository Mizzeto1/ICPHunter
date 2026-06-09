import { CompanyConfig, ApolloContact, ApolloOrganization } from "./types";

export function buildSynthesisPrompt(
  apolloCompany: ApolloOrganization,
  contacts: ApolloContact[],
  signals: string,
  config: CompanyConfig
): string {
  const contactList =
    contacts.length > 0
      ? contacts
          .map(
            (c) =>
              `- ${c.name} | ${c.title} | Seniority: ${c.seniority} | Department: ${c.department} | LinkedIn: ${c.linkedinUrl || "N/A"}`
          )
          .join("\n")
      : "No contacts found in Apollo.";

  const contactInstruction =
    contacts.length > 0
      ? `2. Categorize EVERY contact into a buying committee tier:
   - decision_maker: C-suite or SVP who signs the check
   - champion: Director/VP who will internally advocate
   - evaluator: Technical leads who assess the product
   - blocker: People who may slow the deal (procurement, compliance, security, legal)`
      : `2. Since no contacts were found, suggest 8-12 specific titles to target at this organization, categorized by buying committee tier:
   - decision_maker: C-suite or SVP who signs the check
   - champion: Director/VP who will internally advocate
   - evaluator: Technical leads who assess the product
   - blocker: People who may slow the deal (procurement, compliance, security, legal)`;

  const contactsJsonSpec =
    contacts.length > 0
      ? `"contacts": [
    {
      "name": "<full name exactly as listed above>",
      "tier": "<decision_maker|champion|evaluator|blocker>",
      "reasoning": "<one sentence>"
    }
  ],
  "suggested_titles": [],`
      : `"contacts": [],
  "suggested_titles": [
    {
      "title": "<specific title like 'Chief Information Officer' or 'VP Digital Transformation'>",
      "tier": "<decision_maker|champion|evaluator|blocker>",
      "reasoning": "<one sentence on why this role matters for this deal>"
    }
  ],`;

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

1. Use the org type and AI strategy signals above to select the most relevant value propositions for ${apolloCompany.name}.

${contactInstruction}

3. Build the account plan with specific references to ${config.name}'s products and ${apolloCompany.name}'s situation.

4. Score account fit across 5 dimensions.

Return as a SINGLE JSON object with this exact structure:
{
  ${contactsJsonSpec}
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
  return `You are an elite enterprise sales strategist. Build an account plan for selling ${config.name}'s products to "${companyName}" using ONLY web research signals (no Apollo contact data available).

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

Build an account plan based on the available signals. Use the org type and AI strategy signals above to select the most relevant value propositions.

Since no contacts are available from Apollo, suggest 8-12 specific titles to target, categorized by deal role:
- decision_maker: C-suite/SVP who signs the check
- champion: Director/VP who will advocate internally
- evaluator: Technical leads who assess the product
- blocker: People who may slow the deal (procurement, compliance, security, legal)

Return as JSON:
{
  "suggested_titles": [
    {
      "title": "<specific title>",
      "tier": "<decision_maker|champion|evaluator|blocker>",
      "reasoning": "<one sentence>"
    }
  ],
  "plan": {
    "executive_summary": "<2-3 paragraph strategic overview>",
    "pain_product_fit": "<Map pains to SPECIFIC ${config.name} products/features>",
    "competitive_threats": "<For EACH known competitor, their threat and differentiation>",
    "timing_urgency": "<Why NOW>",
    "deal_strategy": "<Approach referencing the suggested titles above>",
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
