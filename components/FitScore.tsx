"use client";

import { FitScore as FitScoreType, FitScoreDimension } from "@/lib/types";

interface FitScoreProps {
  fitScore: FitScoreType;
  overallScore: number;
}

const dimensions: {
  key: keyof FitScoreType;
  label: string;
}[] = [
  { key: "aiReadiness", label: "AI Readiness" },
  { key: "buyingUrgency", label: "Buying Urgency" },
  { key: "whiteSpace", label: "White Space" },
  { key: "accessibility", label: "Accessibility" },
  { key: "strategicValue", label: "Strategic Value" },
];

export default function FitScore({ fitScore, overallScore }: FitScoreProps) {
  return (
    <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">Fit Score</h3>
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
            overallScore >= 4
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : overallScore >= 3
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {overallScore}
        </div>
      </div>
      <div className="space-y-4">
        {dimensions.map(({ key, label }) => {
          const dim: FitScoreDimension = fitScore[key];
          if (!dim) return null;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-dark-300">{label}</span>
                <span
                  className={`text-sm font-semibold ${
                    dim.score >= 4
                      ? "text-emerald-400"
                      : dim.score >= 3
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {dim.score}/5
                </span>
              </div>
              <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dim.score >= 4
                      ? "bg-emerald-500"
                      : dim.score >= 3
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${dim.score * 20}%` }}
                />
              </div>
              <p className="text-dark-500 text-xs">{dim.reason}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
