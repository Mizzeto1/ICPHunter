import { CompanyConfig } from "@/lib/types";
import openai from "./openai";
import cohere from "./cohere";
import elevenlabs from "./elevenlabs";
import innovaccer from "./innovaccer";

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
