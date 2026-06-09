import { CompanyConfig } from "@/lib/types";

const config: CompanyConfig = {
  slug: "openai",
  name: "OpenAI",
  product: "ChatGPT Enterprise & OpenAI API",
  tagline: "Enterprise AI for Healthcare",
  loomUrl: "",
  accentColor: "#10B981",

  valueProps: {
    payer: [
      "GPT-4 for member service chatbots, call summarization, real-time agent assist",
      "Whisper for call transcription, QA monitoring, multilingual processing",
      "Fine-tuning for claims adjudication, HCC coding, risk adjustment",
      "Custom GPTs for benefits navigation, policy lookup, agent tooling",
    ],
    provider: [
      "GPT-4 for clinical documentation, discharge summaries, note generation",
      "Whisper for ambient clinical transcription",
      "API for patient communication, scheduling, triage automation",
      "Fine-tuning for CDI, coding accuracy, revenue cycle optimization",
    ],
  },

  competitors: [
    "Google Cloud Healthcare API + Vertex AI — infrastructure play, less vertical",
    "Microsoft Azure + Nuance DAX — clinical documentation focus",
    "AWS HealthLake + Bedrock — data lake, less application-layer",
    "Epic Cogito/Nebula — EHR-native AI, provider-only",
  ],

  targetTitles: {
    payer: [
      "CEO", "CMO", "Chief Medical Officer", "CTO", "CIO", "COO",
      "Chief Digital Officer",
      "VP Member Services", "VP Quality", "VP Quality Improvement",
      "VP Clinical Operations", "VP Digital", "VP Technology",
      "VP Innovation", "VP Consumer Experience", "VP Contact Center",
      "Director AI", "Director Machine Learning", "Director Analytics",
      "Director Quality", "Director Digital", "Director Member Services",
      "CISO", "Chief Compliance Officer", "VP Compliance", "General Counsel",
    ],
    provider: [
      "CEO", "CMO", "CMIO", "Chief Medical Informatics Officer",
      "CIO", "CNO", "COO",
      "VP Clinical Operations", "VP Medical Affairs", "VP Digital Health",
      "VP Innovation", "VP Revenue Cycle", "VP Patient Experience",
      "VP Quality and Safety", "VP Population Health",
      "Director Clinical Informatics", "Director AI",
      "Director Health IT", "Director Quality", "Medical Director",
      "CISO", "Chief Compliance Officer", "Chief Privacy Officer",
      "VP Compliance", "General Counsel",
    ],
  },
};

export default config;
