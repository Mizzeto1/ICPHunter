import { CompanyConfig } from "@/lib/types";

export const config: CompanyConfig = {
  slug: "cohere",
  name: "Cohere Health",
  product: "AI-Powered Prior Authorization & Utilization Management Platform",
  tagline: "Intelligent Prior Authorization for Healthcare",
  loomUrl: "",
  accentColor: "#8B5CF6",

  valueProps: {
    payer: [
      "Real-time prior auth determination engine — sub-24-hour turnaround vs. industry 5-day average",
      "AI-driven clinical review automation reducing nurse reviewer workload by 50%+",
      "Intelligent routing that auto-approves low-complexity cases and escalates appropriately",
      "CMS/state compliance built-in — auto-updates for regulatory changes across Medicaid/Medicare",
    ],
    provider: [
      "Provider-facing portal with real-time auth status and auto-populated clinical data",
      "Reduced auth-related claim denials through upfront clinical data capture",
      "Integration with major EHRs (Epic, Cerner, athenahealth) for seamless submission",
      "Analytics dashboard showing auth patterns, approval rates, and bottleneck identification",
    ],
  },

  competitors: [
    "Olive AI — RPA-based auth automation, less clinical intelligence",
    "Availity / Waystar — clearinghouse + auth, transactional focus",
    "EviCore (Evernorth/Cigna) — incumbent auth vendor, payer-owned bias concern",
    "Rhyme (acquired by WellSky) — prior auth for post-acute, narrow vertical",
  ],

  targetTitles: {
    payer: [
      "CEO", "CMO", "Chief Medical Officer", "COO", "CTO", "CIO",
      "VP Utilization Management", "VP Medical Management",
      "VP Clinical Operations", "VP Medical Policy", "VP Network Operations",
      "VP Provider Relations", "VP Technology", "VP Innovation",
      "Director Utilization Management", "Director Prior Authorization",
      "Director Clinical Operations", "Director Medical Policy",
      "Director Provider Experience", "Director Digital",
      "CISO", "Chief Compliance Officer", "VP Compliance", "General Counsel",
    ],
    provider: [
      "CEO", "CMO", "COO", "CIO", "CFO",
      "VP Revenue Cycle", "VP Clinical Operations", "VP Medical Affairs",
      "VP Patient Access", "VP Provider Operations",
      "Director Revenue Cycle", "Director Patient Access",
      "Director Clinical Informatics", "Director Health IT",
      "Director Prior Authorization", "Medical Director",
      "CISO", "Chief Compliance Officer", "VP Compliance",
    ],
  },
};

