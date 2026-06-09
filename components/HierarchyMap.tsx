"use client";

import { ContactAnalysis, ContactTier } from "@/lib/types";
import PersonCard from "./PersonCard";

interface HierarchyMapProps {
  contacts: ContactAnalysis[];
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

export default function HierarchyMap({ contacts }: HierarchyMapProps) {
  if (contacts.length === 0) {
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
