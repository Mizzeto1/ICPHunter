"use client";

import { ContactAnalysis } from "@/lib/types";

interface PersonCardProps {
  contact: ContactAnalysis;
}

const dealRoleStyles: Record<string, { bg: string; text: string; label: string }> = {
  economic_buyer: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-400",
    label: "Economic Buyer",
  },
  champion: {
    bg: "bg-violet-500/10 border-violet-500/20",
    text: "text-violet-400",
    label: "Champion",
  },
  evaluator: {
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-400",
    label: "Evaluator",
  },
  blocker: {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-400",
    label: "Blocker",
  },
};

export default function PersonCard({ contact }: PersonCardProps) {
  const style = dealRoleStyles[contact.dealRole] || dealRoleStyles.evaluator;
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
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${style.text} ${style.bg} border shrink-0`}
        >
          {style.label}
        </span>
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
