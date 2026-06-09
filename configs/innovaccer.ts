import { CompanyConfig } from "@/lib/types";

const config: CompanyConfig = {
  slug: "innovaccer",
  name: "Innovaccer",
  product: "Health Cloud — Data Platform, Care Management & Patient Engagement",
  tagline: "Healthcare Data Platform for Value-Based Care",
  loomUrl: "",
  accentColor: "#3B82F6",

  valueProps: {
    payer: [
      "Unified member 360 view across claims, clinical, SDoH, and pharmacy data sources",
      "AI-powered risk stratification and HCC gap identification for Medicare Advantage",
      "Automated care gap closure workflows with real-time provider and member outreach",
      "Network performance analytics — cost benchmarking, quality scorecards, and leakage analysis",
    ],
    provider: [
      "EHR-agnostic data unification across Epic, Cerner, Meditech, athenahealth",
      "Population health dashboard with risk scores, care gaps, and intervention tracking",
      "Care management workflow engine for chronic disease, transitions of care, and TCM",
      "Referral management and care coordination across network partners",
    ],
  },

  competitors: [
    "Health Catalyst — data platform + analytics, overlapping VBC use cases",
    "Arcadia — population health analytics, strong payer-provider alignment features",
    "Lightbeam Health — VBC-focused analytics, smaller but competitive in ACO space",
    "Optum/Change Healthcare — data + analytics giant, less platform flexibility",
  ],

  targetTitles: {
    payer: [
      "CEO", "CMO", "Chief Medical Officer", "COO", "CTO", "CIO",
      "VP Population Health", "VP Value-Based Care", "VP Clinical Operations",
      "VP Quality", "VP Analytics", "VP Data", "VP Technology",
      "VP Network Management", "VP Provider Relations",
      "Director Population Health", "Director Value-Based Care",
      "Director Analytics", "Director Quality", "Director Data",
      "CISO", "Chief Compliance Officer", "VP Compliance",
    ],
    provider: [
      "CEO", "CMO", "CMIO", "COO", "CIO", "CFO",
      "VP Population Health", "VP Value-Based Care", "VP Quality",
      "VP Clinical Operations", "VP Medical Affairs", "VP Analytics",
      "VP Revenue Cycle", "VP Care Management",
      "Director Population Health", "Director Clinical Informatics",
      "Director Quality", "Director Analytics", "Director Care Management",
      "Medical Director", "Director Health IT",
      "CISO", "Chief Compliance Officer", "VP Compliance",
    ],
  },
};

export default config;
