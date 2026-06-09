"use client";

import { AISignals } from "@/lib/types";

interface SignalsPanelProps {
  signals: AISignals;
}

const signalSections: {
  key: keyof AISignals;
  title: string;
  icon: string;
  color: string;
}[] = [
  {
    key: "ai_strategy",
    title: "AI & Technology Strategy",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "text-blue-400",
  },
  {
    key: "hiring_signals",
    title: "Hiring Signals",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    color: "text-emerald-400",
  },
  {
    key: "recent_news",
    title: "Recent News & Signals",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    color: "text-purple-400",
  },
  {
    key: "technology_stack",
    title: "Technology Stack",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    color: "text-amber-400",
  },
];

export default function SignalsPanel({ signals }: SignalsPanelProps) {
  return (
    <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        AI & Hiring Signals
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {signalSections.map((section) => {
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
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${section.color.replace("text-", "bg-")} shrink-0`} />
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
