import { CompanyConfig } from "@/lib/types";

const config: CompanyConfig = {
  slug: "elevenlabs",
  name: "ElevenLabs",
  product: "AI Voice Platform — Text-to-Speech, Voice Cloning & Conversational AI",
  tagline: "AI Voice Technology for Healthcare",
  loomUrl: "",
  accentColor: "#F59E0B",

  valueProps: {
    payer: [
      "Conversational AI agents for member service calls — natural, multilingual voice interactions",
      "Automated outbound calls for care gap closures, appointment reminders, and preventive health",
      "Real-time voice translation for diverse Medicaid/Medicare populations (100+ languages)",
      "Call center QA and coaching — voice analysis for agent performance and compliance",
    ],
    provider: [
      "AI voice agents for patient scheduling, prescription refills, and post-visit follow-up",
      "Multilingual patient education content — convert written materials to natural spoken audio",
      "Ambient clinical documentation via real-time speech-to-text + note generation",
      "Personalized voice notifications for chronic disease management and medication adherence",
    ],
  },

  competitors: [
    "Amazon Polly + Connect — voice + contact center, generic/non-healthcare",
    "Google Cloud TTS + CCAI — strong NLU but requires heavy integration",
    "Nuance/Microsoft — clinical documentation focus, less member-facing voice",
    "Hyro — healthcare-specific conversational AI, narrower voice capability",
  ],

  targetTitles: {
    payer: [
      "CEO", "CMO", "COO", "CTO", "CIO", "Chief Digital Officer",
      "VP Contact Center", "VP Member Services", "VP Consumer Experience",
      "VP Member Engagement", "VP Digital", "VP Technology",
      "VP Clinical Operations", "VP Innovation",
      "Director Contact Center", "Director Member Services",
      "Director Digital Experience", "Director Innovation",
      "Director Consumer Engagement", "Director Technology",
      "CISO", "Chief Compliance Officer", "VP Compliance",
    ],
    provider: [
      "CEO", "CMO", "COO", "CIO", "CNO",
      "VP Patient Experience", "VP Digital Health", "VP Innovation",
      "VP Clinical Operations", "VP Ambulatory Services",
      "VP Population Health", "VP Marketing",
      "Director Patient Experience", "Director Digital Health",
      "Director Clinical Informatics", "Director Innovation",
      "Director Marketing", "Director Patient Engagement",
      "CISO", "Chief Compliance Officer", "Chief Privacy Officer",
    ],
  },
};

export default config;
