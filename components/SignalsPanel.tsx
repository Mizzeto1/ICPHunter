"use client";

import { AISignals } from "@/lib/types";

interface SignalsPanelProps {
  signals: AISignals;
}

const listSections: {
  key: keyof Pick<AISignals, "recentNews" | "hiringSignals" | "partnerships" | "riskFactors">;
  title: string;
  icon: string;
  color: string;
}[] = [
  {
    key: "recentNews",
    title: "Recent News & Signals",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    color: "text-purple-400",
  },
  {
    key: "hiringSignals",
    title: "Hiring Signals",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    color: "text-emerald-400",
  },
  {
    key: "partnerships",
    title: "Technology Partnerships",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    color: "text-amber-400",
  },
  {
    key: "riskFactors",
    title: "Risk Factors",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    color: "text-red-400",
  },
];

const orgTypeLabels: Record<string, string> = {
  payer: "Payer",
  provider: "Provider",
  integrated: "Integrated",
  bpo: "BPO",
};

export default function SignalsPanel({ signals }: SignalsPanelProps) {
  return (
    <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        AI & Market Signals
      </h3>

      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
            {orgTypeLabels[signals.orgType] || signals.orgType}
          </span>
        </div>
        {signals.aiStrategy && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h4 className="text-sm font-medium text-dark-200">
                AI & Digital Strategy
              </h4>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              {signals.aiStrategy}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listSections.map((section) => {
          const items = signals[section.key] || [];
          if (items.length === 0) return null;
          return (
            <div key={section.key}>
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className={`w-4 h-4 ${section.color}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={section.icon}
                  />
                </svg>
                <h4 className="text-sm font-medium text-dark-200">
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="text-dark-400 text-sm flex items-start gap-2"
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full ${section.color.replace("text-", "bg-")} shrink-0`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
