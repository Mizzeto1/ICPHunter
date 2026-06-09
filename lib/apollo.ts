import { ApolloOrganization, ApolloContact } from "./types";

const APOLLO_BASE = "https://api.apollo.io/v1";
const headers = {
  "Content-Type": "application/json",
  "X-Api-Key": process.env.APOLLO_API_KEY!,
};

export async function searchApolloCompany(
  name: string
): Promise<ApolloOrganization | null> {
  const res = await fetch(`${APOLLO_BASE}/mixed_companies/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      q_organization_name: name,
      page: 1,
      per_page: 1,
    }),
  });
  const data = await res.json();
  const org = data.organizations?.[0] || data.accounts?.[0];
  if (!org) return null;

  return {
    id: org.id || "",
    name: org.name || "",
    website_url: org.website_url || "",
    domain: org.primary_domain || org.domain || "",
    industry: org.industry || "",
    estimated_num_employees: org.estimated_num_employees || 0,
    annual_revenue_printed: org.annual_revenue_printed || "N/A",
    short_description: org.short_description || "",
    logo_url: org.logo_url || "",
    founded_year: org.founded_year || 0,
    linkedin_url: org.linkedin_url || "",
    phone: org.phone || "",
    city: org.primary_address?.city || org.city || "",
    state: org.primary_address?.state || org.state || "",
    country: org.primary_address?.country || org.country || "",
  };
}

export async function searchApolloContacts(
  domain: string,
  titles: string[]
): Promise<ApolloContact[]> {
  const uniqueTitles = Array.from(new Set(titles));

  const res = await fetch(`${APOLLO_BASE}/mixed_people/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      q_organization_domains: [domain],
      person_titles: uniqueTitles,
      page: 1,
      per_page: 25,
    }),
  });
  const data = await res.json();
  return (data.people || []).map(
    (p: Record<string, unknown>): ApolloContact => ({
      name: `${p.first_name || ""} ${p.last_name || ""}`.trim() || (p.name as string) || "",
      title: (p.title as string) || "",
      linkedinUrl: (p.linkedin_url as string) || "",
      seniority: (p.seniority as string) || "",
      department: ((p.departments as string[]) || [])[0] || "Unknown",
    })
  );
}
