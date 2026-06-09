"use client";

import { ApolloOrganization } from "@/lib/types";

interface CompanyOverviewProps {
  org: ApolloOrganization;
}

export default function CompanyOverview({ org }: CompanyOverviewProps) {
  const hasApolloData = !!org.domain;

  const stats = [
    { label: "Industry", value: org.industry || "Healthcare" },
    {
      label: "Employees",
      value: org.estimated_num_employees
        ? org.estimated_num_employees.toLocaleString()
        : "N/A",
    },
    { label: "Revenue", value: org.annual_revenue_printed || "N/A" },
    {
      label: "Founded",
      value: org.founded_year ? String(org.founded_year) : "N/A",
    },
    {
      label: "Location",
      value:
        [org.city, org.state].filter(Boolean).join(", ") || "United States",
    },
  ].filter((s) => hasApolloData || s.value !== "N/A");

  return (
    <div className="rounded-xl border border-dark-700 bg-dark-900 p-6">
      <div className="flex items-start gap-4 mb-5">
        {org.logo_url ? (
          <img
            src={org.logo_url}
            alt={org.name}
            className="w-12 h-12 rounded-lg object-contain bg-white p-1"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center text-dark-300 text-lg font-bold shrink-0">
            {org.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">{org.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            {org.website_url && (
              <a
                href={org.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:underline"
              >
                {org.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
            {org.linkedin_url && (
              <a
                href={org.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:underline"
              >
                LinkedIn
              </a>
            )}
            {!hasApolloData && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-dark-800 text-dark-400 border border-dark-700">
                Web research only
              </span>
            )}
          </div>
        </div>
      </div>
      {org.short_description && (
        <p className="text-dark-300 text-sm mb-5 leading-relaxed">
          {org.short_description}
        </p>
      )}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-dark-500 text-xs uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="text-dark-200 text-sm font-medium">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
