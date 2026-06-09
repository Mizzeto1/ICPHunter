"use client";

import { CategorizedContact } from "@/lib/types";

interface PersonCardProps {
  contact: CategorizedContact;
}

const tierStyles: Record<string, { bg: string; text: string; label: string }> = {
  decision_maker: {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-400",
    label: "Decision Maker",
  },
  champion: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-400",
    label: "Champion",
  },
  evaluator: {
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-400",
    label: "Evaluator",
  },
  blocker: {
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-400",
    label: "Blocker",
  },
};

export default function PersonCard({ contact }: PersonCardProps) {
  const style = tierStyles[contact.tier] || tierStyles.evaluator;

  return (
    <div className={`p-4 rounded-lg border ${style.bg} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 text-sm font-bold shrink-0">
            {contact.first_name?.charAt(0)}
            {contact.last_name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">
                {contact.name}
              </h4>
              {contact.linkedin_url && (
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
            </div>
            <p className="text-dark-400 text-xs">{contact.title}</p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${style.text} ${style.bg} border`}
        >
          {style.label}
        </span>
      </div>
      <p className="text-dark-500 text-xs mt-2 pl-[52px]">
        {contact.reasoning}
      </p>
    </div>
  );
}
