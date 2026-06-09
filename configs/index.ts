import { CompanyConfig } from "@/lib/types";
import { config as openai } from "./openai";
import { config as cohere } from "./cohere";
import { config as elevenlabs } from "./elevenlabs";
import { config as innovaccer } from "./innovaccer";

const configs: Record<string, CompanyConfig> = {
  openai,
  cohere,
  elevenlabs,
  innovaccer,
};

export function getCompanyConfig(slug: string): CompanyConfig | null {
  return configs[slug] || null;
}

export function getAllCompanySlugs(): string[] {
  return Object.keys(configs);
}

export default configs;
