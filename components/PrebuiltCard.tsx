"use client";

interface PrebuiltCardProps {
  name: string;
  type: string;
  description: string;
  score: number;
  onClick: () => void;
  isActive: boolean;
}

const typeColors: Record<string, string> = {
  Payer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Provider: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Provider + Health Plan":
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Integrated: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function PrebuiltCard({
  name,
  type,
  description,
  score,
  onClick,
  isActive,
}: PrebuiltCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group ${
        isActive
          ? "bg-dark-800 border-blue-500 ring-1 ring-blue-500/50"
          : "bg-dark-900 border-dark-700 hover:border-dark-500 hover:bg-dark-800/50"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-dark-100 group-hover:text-white transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1 shrink-0 ml-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
              score >= 80
                ? "bg-emerald-500/10 text-emerald-400"
                : score >= 60
                ? "bg-amber-500/10 text-amber-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {score}
          </div>
        </div>
      </div>
      <span
        className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium border mb-2 ${
          typeColors[type] || "bg-dark-700 text-dark-300 border-dark-600"
        }`}
      >
        {type}
      </span>
      <p className="text-dark-400 text-sm line-clamp-2">{description}</p>
    </button>
  );
}
