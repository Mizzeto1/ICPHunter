import { ApolloOrganization, ApolloContact } from "./types";

const APOLLO_API_BASE = "https://api.apollo.io/v1";

async function apolloFetch(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${APOLLO_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.APOLLO_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apollo API error (${res.status}): ${text}`);
  }

  return res.json();
}

export async function searchOrganization(
  name: string
): Promise<ApolloOrganization | null> {
  const data = await apolloFetch("/mixed_companies/search", {
    q_organization_name: name,
    page: 1,
    per_page: 1,
  });

  const org = data.organizations?.[0] || data.accounts?.[0];
  if (!org) return null;

  return {
    id: org.id,
    name: org.name,
    website_url: org.website_url || "",
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

export async function searchContacts(
  organizationName: string,
  titles: string[]
): Promise<ApolloContact[]> {
  const data = await apolloFetch("/mixed_people/search", {
    q_organization_name: organizationName,
    person_titles: titles,
    page: 1,
    per_page: 25,
  });

  const people = data.people || [];
  return people.map(
    (p: Record<string, unknown>): ApolloContact => ({
      id: (p.id as string) || "",
      first_name: (p.first_name as string) || "",
      last_name: (p.last_name as string) || "",
      name: (p.name as string) || `${p.first_name} ${p.last_name}`,
      title: (p.title as string) || "",
      linkedin_url: (p.linkedin_url as string) || "",
      email: (p.email as string) || "",
      photo_url: (p.photo_url as string) || "",
      organization_name: (p.organization_name as string) || organizationName,
      city: (p.city as string) || "",
      state: (p.state as string) || "",
      departments: (p.departments as string[]) || [],
      seniority: (p.seniority as string) || "",
    })
  );
}

export const HEALTHCARE_TITLES = [
  "Chief Information Officer",
  "Chief Technology Officer",
  "Chief Digital Officer",
  "Chief Data Officer",
  "Chief Medical Officer",
  "Chief Medical Information Officer",
  "VP Information Technology",
  "VP Digital Transformation",
  "VP Engineering",
  "VP Data",
  "VP Analytics",
  "VP Innovation",
  "VP Clinical Informatics",
  "Director AI",
  "Director Machine Learning",
  "Director Data Science",
  "Director Information Technology",
  "Director Digital",
  "Director Innovation",
  "Director Analytics",
  "Director Clinical Informatics",
  "Head of AI",
  "Head of Data",
  "Head of Engineering",
  "Head of Digital",
  "Senior Director Technology",
  "Senior Director Engineering",
];
