"use client";

import { CategorizedContact, SuggestedTitle, ContactTier } from "@/lib/types";
import PersonCard from "./PersonCard";

interface HierarchyMapProps {
  contacts: CategorizedContact[];
  suggestedTitles: SuggestedTitle[];
}

const tierOrder: ContactTier[] = [
  "decision_maker",
  "champion",
  "evaluator",
  "blocker",
];

const tierHeaders: Record<ContactTier, { title: string; description: string }> =
  {
    decision_maker: {
      title: "Decision Makers",
      description: "C-suite and SVPs with budget authority",
    },
    champion: {
      title: "Champions",
      description: "Internal advocates who push the deal forward",
    },
    evaluator: {
      title: "Evaluators",
      description: "Technical leads who assess product fit",
    },
    blocker: {
      title: "Blockers",
      description: "Stakeholders who may slow or prevent the deal",
    },
  };

const tierBadgeStyles: Record<ContactTier, string> = {
  decision_maker: "bg-red-500/10 text-red-400 border-red-500/20",
  champion: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  evaluator: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  blocker: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function HierarchyMap({ contacts, suggestedTitles }: HierarchyMapProps) {
  if (contacts.length > 0) {
    const grouped = tierOrder
      .map((tier) => ({
        tier,
        contacts: contacts.filter((c) => c.tier === tier),
      }))
      .filter((g) => g.contacts.length > 0);

    return (
      <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
        <h3 className="text-lg font-semibold text-white mb-5">
          Org Hierarchy Map
        </h3>
        <div className="space-y-6">
          {grouped.map(({ tier, contacts: tierContacts }) => (
            <div key={tier}>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-dark-200">
                  {tierHeaders[tier].title}
                </h4>
                <p className="text-dark-500 text-xs">
                  {tierHeaders[tier].description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tierContacts.map((contact, i) => (
                  <PersonCard key={`${contact.name}-${i}`} contact={contact} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestedTitles.length > 0) {
    const grouped = tierOrder
      .map((tier) => ({
        tier,
        titles: suggestedTitles.filter((t) => t.tier === tier),
      }))
      .filter((g) => g.titles.length > 0);

    return (
      <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Org Hierarchy Map
        </h3>
        <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-amber-300/80 text-sm">
            We identified the key roles to target — connect Apollo for contact details
          </p>
        </div>
        <div className="space-y-6">
          {grouped.map(({ tier, titles }) => (
            <div key={tier}>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-dark-200">
                  {tierHeaders[tier].title}
                </h4>
                <p className="text-dark-500 text-xs">
                  {tierHeaders[tier].description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {titles.map((st, i) => (
                  <div
                    key={`${st.title}-${i}`}
                    className={`p-3 rounded-lg border ${tierBadgeStyles[st.tier]}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-dark-200">
                        {st.title}
                      </p>
                      <svg className="w-4 h-4 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-dark-500 text-xs">{st.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
      <h3 className="text-lg font-semibold text-white mb-2">
        Org Hierarchy Map
      </h3>
      <p className="text-dark-500 text-sm">
        No contacts found. Try a different search or check the organization name.
      </p>
    </div>
  );
}
