import Anthropic from "@anthropic-ai/sdk";
import { AISignals } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

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

export async function generateWithClaude(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n");
}

export function parseJSON<T>(text: string): T {
  const cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }
  return JSON.parse(jsonMatch[0]);
}
