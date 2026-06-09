"use client";

import { useState } from "react";

interface PlanSectionProps {
  title: string;
  content: string | string[];
  defaultOpen?: boolean;
}

export default function PlanSection({
  title,
  content,
  defaultOpen = false,
}: PlanSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isEmpty =
    !content || (Array.isArray(content) && content.length === 0);

  if (isEmpty) return null;

  return (
    <div className="border-b border-dark-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <h4 className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors">
          {title}
        </h4>
        <svg
          className={`w-4 h-4 text-dark-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 animate-fade-in">
          {Array.isArray(content) ? (
            <ol className="space-y-2">
              {content.map((item, i) => (
                <li key={i} className="text-dark-400 text-sm flex items-start gap-3">
                  <span className="text-dark-600 text-xs font-mono mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-dark-400 text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
