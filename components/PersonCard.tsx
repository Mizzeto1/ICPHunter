"use client";

import { ContactAnalysis } from "@/lib/types";

interface PersonCardProps {
  contact: ContactAnalysis;
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

const dealRoleLabels: Record<string, string> = {
  economic_buyer: "Economic Buyer",
  champion: "Champion",
  evaluator: "Evaluator",
  blocker: "Blocker",
};

export default function PersonCard({ contact }: PersonCardProps) {
  const style = tierStyles[contact.tier] || tierStyles.evaluator;
  const initials = contact.name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("");

  return (
    <div className={`p-4 rounded-lg border ${style.bg} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 text-sm font-bold shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {contact.name}
            </h4>
            <p className="text-dark-400 text-xs">{contact.title}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${style.text} ${style.bg} border`}
          >
            {style.label}
          </span>
          {contact.dealRole && contact.dealRole !== contact.tier && (
            <span className="text-dark-500 text-[10px]">
              {dealRoleLabels[contact.dealRole] || contact.dealRole}
            </span>
          )}
        </div>
      </div>
      <div className="pl-[52px] space-y-1">
        <p className="text-dark-400 text-xs">{contact.whyTheyMatter}</p>
        {contact.approachAngle && (
          <p className="text-dark-500 text-xs italic">{contact.approachAngle}</p>
        )}
      </div>
    </div>
  );
}
