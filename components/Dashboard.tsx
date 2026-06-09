"use client";

import { useState, useEffect, useCallback, CSSProperties } from "react";
import LoomEmbed from "@/components/LoomEmbed";
import SearchBar from "@/components/SearchBar";
import PrebuiltCard from "@/components/PrebuiltCard";
import CompanyOverview from "@/components/CompanyOverview";
import SignalsPanel from "@/components/SignalsPanel";
import HierarchyMap from "@/components/HierarchyMap";
import PlanSection from "@/components/PlanSection";
import FitScore from "@/components/FitScore";
import LoadingState from "@/components/LoadingState";
import { ResearchResult, CompanyConfig, PrebuiltAccount } from "@/lib/types";

const PREBUILT_ACCOUNTS: PrebuiltAccount[] = [
  {
    slug: "centene",
    name: "Centene Corporation",
    type: "Payer",
    description:
      "Largest Medicaid managed care org in the US. 28M+ members, $154B revenue. Active AI Center of Excellence.",
  },
  {
    slug: "caresource",
    name: "CareSource",
    type: "Payer",
    description:
      "Nonprofit Medicaid plan, 2.4M members. Investing in SDoH analytics and digital-first member experience.",
  },
  {
    slug: "mount-sinai",
    name: "Mount Sinai Health System",
    type: "Provider",
    description:
      "Leading NYC academic medical center. Hasso Plattner Institute for Digital Health. 200+ AI publications.",
  },
  {
    slug: "sentara",
    name: "Sentara Health",
    type: "Provider + Health Plan",
    description:
      "Integrated delivery system — 12 hospitals + 1M member health plan. $500M tech investment post-merger.",
  },
  {
    slug: "kaiser-permanente",
    name: "Kaiser Permanente",
    type: "Integrated",
    description:
      "Largest integrated system in the US. 12.5M members, 39 hospitals, $2B+ annual tech spend. 50+ deployed AI models.",
  },
];

const QUICK_CHIPS = [
  { name: "Centene", slug: "centene" },
  { name: "CareSource", slug: "caresource" },
  { name: "Mount Sinai", slug: "mount-sinai" },
  { name: "Sentara", slug: "sentara" },
  { name: "Kaiser", slug: "kaiser-permanente" },
];

interface DashboardProps {
  config: CompanyConfig;
}

export default function Dashboard({ config }: DashboardProps) {
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [prebuiltScores, setPrebuiltScores] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    async function loadScores() {
      const scores: Record<string, number> = {};
      for (const account of PREBUILT_ACCOUNTS) {
        try {
          const data = await import(`@/data/prebuilt/${account.slug}.json`);
          scores[account.slug] = data.overall_score;
        } catch {
          scores[account.slug] = 0;
        }
      }
      setPrebuiltScores(scores);
    }
    loadScores();
  }, []);

  const loadPrebuilt = useCallback(async (slug: string) => {
    setIsLoading(true);
    setError(null);
    setActiveCard(slug);
    try {
      const data = await import(`@/data/prebuilt/${slug}.json`);
      setResult(data as ResearchResult);
    } catch {
      setError("Failed to load pre-generated data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleSearch(query: string) {
    setIsLoading(true);
    setError(null);
    setActiveCard(null);
    setResult(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName: query, targetCompany: config.slug }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Research failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleChipClick(slug: string) {
    const account = PREBUILT_ACCOUNTS.find((a) => a.slug === slug);
    if (account) {
      loadPrebuilt(slug);
    }
  }

  const accent = config.accentColor;
  const accentStyle = { "--accent": accent } as CSSProperties;

  return (
    <div className="min-h-screen bg-dark-950" style={accentStyle}>
      {/* Accent gradient at top */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80, transparent)` }}
      />

      <header className="border-b border-dark-800 bg-dark-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">
                Healthcare Account Intelligence{" "}
                <span style={{ color: accent }}>· {config.name}</span>
              </h1>
              <p className="text-dark-400 text-sm mt-0.5">
                {config.product}
              </p>
              <p className="text-dark-500 text-xs mt-0.5">
                Built by Yuvraj · Goldman Sachs → Mizzeto (Healthcare AI) ·{" "}
                <a
                  href="https://www.linkedin.com/in/yuvrajwalia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: accent }}
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Loom Embed */}
        <section>
          <LoomEmbed url={config.loomUrl} title={config.tagline} />
        </section>

        {/* Value Props */}
        {(config.valueProps.payer.length > 0 || config.valueProps.provider.length > 0) && (
          <section className="rounded-xl border border-dark-700 bg-dark-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              What {config.name} Sells Into Healthcare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.valueProps.payer.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    For Payers
                  </h3>
                  <ul className="space-y-2">
                    {config.valueProps.payer.map((prop, i) => (
                      <li key={i} className="text-dark-400 text-sm flex items-start gap-2">
                        <span className="text-dark-600 mt-0.5 shrink-0">-</span>
                        {prop}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {config.valueProps.provider.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    For Providers
                  </h3>
                  <ul className="space-y-2">
                    {config.valueProps.provider.map((prop, i) => (
                      <li key={i} className="text-dark-400 text-sm flex items-start gap-2">
                        <span className="text-dark-600 mt-0.5 shrink-0">-</span>
                        {prop}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {config.competitors.length > 0 && (
              <div className="mt-6 pt-4 border-t border-dark-800">
                <h3 className="text-sm font-medium text-dark-300 mb-3">
                  Competitive Landscape
                </h3>
                <ul className="space-y-1.5">
                  {config.competitors.map((comp, i) => (
                    <li key={i} className="text-dark-500 text-sm flex items-start gap-2">
                      <span className="text-dark-600 mt-0.5 shrink-0">-</span>
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Search Bar */}
        <section>
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            quickChips={QUICK_CHIPS}
            onChipClick={handleChipClick}
          />
        </section>

        {/* Pre-Generated Account Cards */}
        <section>
          <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wide mb-4">
            Pre-Generated Accounts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREBUILT_ACCOUNTS.map((account) => (
              <PrebuiltCard
                key={account.slug}
                name={account.name}
                type={account.type}
                description={account.description}
                score={prebuiltScores[account.slug] || 0}
                onClick={() => loadPrebuilt(account.slug)}
                isActive={activeCard === account.slug}
              />
            ))}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && !result && <LoadingState />}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-dark-400 text-xs hover:text-dark-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            <CompanyOverview org={result.organization} />
            <SignalsPanel signals={result.signals} />
            <HierarchyMap contacts={result.contacts} />

            {/* Account Plan */}
            <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Account Plan
              </h3>
              <PlanSection
                title="Executive Summary"
                content={result.plan.executive_summary}
                defaultOpen={true}
              />
              <PlanSection
                title="Pain → Product Fit"
                content={result.plan.pain_product_fit}
              />
              <PlanSection
                title="Competitive Threats"
                content={result.plan.competitive_threats}
              />
              <PlanSection
                title="Timing & Urgency"
                content={result.plan.timing_urgency}
              />
              <PlanSection
                title="Deal Strategy"
                content={result.plan.deal_strategy}
              />
              <PlanSection
                title="Discovery Questions"
                content={result.plan.discovery_questions}
              />
              <PlanSection
                title="ROI Framework"
                content={result.plan.roi_framework}
              />
              <PlanSection
                title="First Touch Email"
                content={result.plan.first_touch_email}
              />
            </div>

            <FitScore
              dimensions={result.fit_score}
              overallScore={result.overall_score}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-dark-500 text-sm">
            <p>
              Built by{" "}
              <span className="text-dark-300 font-medium">Yuvraj</span> ·
              Goldman Sachs → Mizzeto (Healthcare AI)
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/yuvrajwalia/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dark-300 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="mailto:ywalia@mizzeto.com"
                className="hover:text-dark-300 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
