import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function researchWithWebSearch(
  systemPrompt: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    tools: [
      {
        type: "web_search",
        name: "web_search",
        max_uses: 5,
      } as unknown as Anthropic.Tool,
    ],
    messages: [
      {
        role: "user",
        content: systemPrompt,
      },
    ],
  });

  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks.map((b) => (b as { type: "text"; text: string }).text).join("\n");
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
  return textBlocks.map((b) => (b as { type: "text"; text: string }).text).join("\n");
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
