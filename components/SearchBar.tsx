"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  quickChips: { name: string; slug: string }[];
  onChipClick: (slug: string) => void;
}

export default function SearchBar({
  onSearch,
  isLoading,
  quickChips,
  onChipClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Research any healthcare organization..."
            disabled={isLoading}
            className="w-full pl-12 pr-32 py-4 bg-dark-800 border border-dark-600 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-dark-600 disabled:text-dark-400 text-white rounded-lg font-medium text-sm transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Researching
              </span>
            ) : (
              "Research"
            )}
          </button>
        </div>
      </form>
      <div className="flex flex-wrap gap-2 mt-3">
        {quickChips.map((chip) => (
          <button
            key={chip.slug}
            onClick={() => onChipClick(chip.slug)}
            disabled={isLoading}
            className="px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-full text-dark-300 text-sm hover:bg-dark-700 hover:text-dark-100 hover:border-dark-500 transition-all disabled:opacity-50"
          >
            {chip.name}
          </button>
        ))}
      </div>
    </div>
  );
}
