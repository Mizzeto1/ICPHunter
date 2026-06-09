"use client";

import { useState, useEffect } from "react";

const phases = [
  {
    label: "Searching Apollo for company data...",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    label: "Researching AI signals & hiring activity...",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    label: "Identifying key stakeholders...",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    label: "Building account plan & deal strategy...",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    label: "Scoring account fit...",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
];

export default function LoadingState() {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-dark-700 bg-dark-900 p-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center animate-pulse-glow">
            <svg
              className="w-6 h-6 text-blue-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          {phases.map((phase, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${
                i < currentPhase
                  ? "opacity-50"
                  : i === currentPhase
                  ? "opacity-100"
                  : "opacity-30"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  i < currentPhase
                    ? "bg-emerald-500/20"
                    : i === currentPhase
                    ? "bg-blue-500/20"
                    : "bg-dark-800"
                }`}
              >
                {i < currentPhase ? (
                  <svg
                    className="w-3.5 h-3.5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : i === currentPhase ? (
                  <svg
                    className="w-3.5 h-3.5 text-blue-400 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={phase.icon}
                    />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-dark-600" />
                )}
              </div>
              <span
                className={`text-sm ${
                  i === currentPhase
                    ? "text-dark-200 font-medium"
                    : "text-dark-500"
                }`}
              >
                {phase.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
