import { AISignals, ApolloContact, ApolloOrganization, CompanyConfig } from "./types";
import { SYSTEM_PROMPT } from "./prompts";

export async function researchCompanySignals(
  companyName: string
): Promise<AISignals> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [
        {
          role: "user",
          content: `Research "${companyName}" healthcare organization. Return ONLY valid JSON:
{
  "orgType": "payer" or "provider" or "integrated" or "bpo",
  "aiStrategy": "2-3 sentences on their AI/digital strategy",
  "recentNews": ["3-5 recent headlines relevant to AI, operations, or strategy"],
  "hiringSignals": ["any AI/ML/automation job postings or hiring trends"],
  "partnerships": ["known technology vendor relationships"],
  "riskFactors": ["regulatory, financial, or leadership risks"]
}
No markdown. No explanation. Just JSON.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content
    .filter((item: any) => item.type === "text")
    .map((item: any) => item.text)
    .join("");

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function synthesizePlan(input: {
  company: ApolloOrganization;
  contacts: ApolloContact[];
  signals: AISignals;
  config: CompanyConfig;
}) {
  const { company, contacts, signals, config } = input;

  const orgType = signals.orgType || "payer";
  const valueProps =
    orgType === "provider"
      ? config.valueProps.provider
      : config.valueProps.payer;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a strategic account plan for selling ${config.product} to ${company.name}.

ORG TYPE: ${orgType}

COMPANY DATA: ${JSON.stringify(company)}

CONTACTS FOUND:
${contacts.map((c) => `- ${c.name}, ${c.title} (${c.seniority})`).join("\n")}

SIGNALS: ${JSON.stringify(signals)}

PRODUCT VALUE PROPS: ${valueProps.join("; ")}

COMPETITORS: ${config.competitors.join("; ")}

Return ONLY valid JSON with these fields:
{
  "executiveSummary": "3 sentences max",
  "contactAnalysis": [
    {
      "name": "from contacts list above",
      "title": "their title",
      "dealRole": "economic_buyer | champion | evaluator | blocker",
      "tier": "decision_maker | champion | evaluator | blocker",
      "whyTheyMatter": "one sentence",
      "approachAngle": "one sentence on how to engage"
    }
  ],
  "painToProductFit": "3-4 specific pain points mapped to product capabilities",
  "competitiveThreats": "who else is selling here, how we differentiate",
  "timingUrgency": "what creates a buying window right now",
  "dealStrategy": "entry point, pilot scope, estimated deal size, sales cycle, risks",
  "discoveryQuestions": "5 questions that show deep domain expertise",
  "roiFramework": "back-of-napkin ROI with real healthcare economics",
  "firstTouchEmail": "under 80 words, to the most likely champion, specific to this org",
  "fitScore": {
    "aiReadiness": { "score": 1-5, "reason": "one sentence" },
    "buyingUrgency": { "score": 1-5, "reason": "one sentence" },
    "whiteSpace": { "score": 1-5, "reason": "one sentence" },
    "accessibility": { "score": 1-5, "reason": "one sentence" },
    "strategicValue": { "score": 1-5, "reason": "one sentence" }
  }
}
No markdown. No explanation. Just JSON.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content
    .filter((item: any) => item.type === "text")
    .map((item: any) => item.text)
    .join("");

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
