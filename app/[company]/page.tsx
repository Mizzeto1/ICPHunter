import { notFound } from "next/navigation";
import { CompanyConfig } from "@/lib/types";
import Dashboard from "@/components/Dashboard";

const CONFIGS: Record<string, () => Promise<{ config: CompanyConfig }>> = {
  openai: () => import("@/configs/openai"),
  cohere: () => import("@/configs/cohere"),
  elevenlabs: () => import("@/configs/elevenlabs"),
  innovaccer: () => import("@/configs/innovaccer"),
};

export default async function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  const loader = CONFIGS[params.company];
  if (!loader) notFound();

  const { config } = await loader();
  return <Dashboard config={config} />;
}
