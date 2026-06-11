import type { SafetyFlag } from "./safetyChecker.types.js";

export const REQUIRED_DISCLAIMER = "This is informational and not medical advice.";
export const CLINICIAN_REVIEW_SENTENCE = "Please discuss this with a qualified clinician.";

const SOURCE_EXPECTED_AGENTS = new Set([
  "report_explainer",
  "risk_analyzer",
  "timeline_memory",
  "conflict_detector",
  "care_plan_generator",
  "doctor_voice_analyzer"
]);

export const HIGH_SEVERITY_PHRASES = [
  "you definitely have",
  "you are diagnosed with",
  "you should stop taking",
  "stop your medication",
  "start taking",
  "increase your dose",
  "decrease your dose",
  "you do not need a doctor",
  "ignore your doctor",
  "this will cure",
  "guaranteed"
];

export const UNCERTAINTY_MARKERS = [
  "may",
  "might",
  "could",
  "appears",
  "suggests",
  "seems",
  "possibly",
  "likely",
  "based on",
  "can indicate",
  "could indicate"
];

export const MEDICAL_CONDITION_TERMS = [
  "diabetes",
  "hypertension",
  "blood pressure",
  "cholesterol",
  "glucose",
  "stroke",
  "cancer",
  "infection",
  "asthma",
  "anemia",
  "kidney",
  "liver",
  "heart disease",
  "fever",
  "depression",
  "anxiety",
  "pregnancy",
  "pregnant"
];

export const MEDICAL_ADVICE_TERMS = [
  "should",
  "must",
  "need to",
  "start taking",
  "stop taking",
  "increase your dose",
  "decrease your dose",
  "you should",
  "you must"
];

export function normalizeSafetyText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function containsAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

export function hasRequiredDisclaimer(text: string): boolean {
  return normalizeSafetyText(text).includes(normalizeSafetyText(REQUIRED_DISCLAIMER));
}

export function hasClinicianRecommendation(text: string): boolean {
  const normalized = normalizeSafetyText(text);
  return [
    "please discuss this with a qualified clinician",
    "discuss this with a qualified clinician",
    "talk to a qualified clinician",
    "speak with a clinician",
    "speak with your doctor",
    "discuss with your doctor",
    "consult your doctor",
    "consult a doctor",
    "talk to your doctor",
    "please consult your doctor",
    "medical professional"
  ].some((phrase) => normalized.includes(phrase));
}

export function hasUncertaintyLanguage(text: string): boolean {
  const normalized = normalizeSafetyText(text);
  return UNCERTAINTY_MARKERS.some((marker) => normalized.includes(marker));
}

export function mentionsMedicalCondition(text: string): boolean {
  const normalized = normalizeSafetyText(text);
  return MEDICAL_CONDITION_TERMS.some((term) => normalized.includes(term));
}

export function hasSourceCitation(text: string): boolean {
  const normalized = normalizeSafetyText(text);
  return (
    /\[\d+\]/.test(normalized) ||
    /\(\s*source(s)?\s*\)/.test(normalized) ||
    /\bsource(s)?\b/.test(normalized) ||
    /\bcitation(s)?\b/.test(normalized) ||
    /\bbased on (your|the) report\b/.test(normalized) ||
    /\baccording to (your|the) report\b/.test(normalized)
  );
}

export function shouldExpectSources(agentUsed: string, sources?: unknown[]): boolean {
  return SOURCE_EXPECTED_AGENTS.has(agentUsed.toLowerCase()) || Boolean(sources && sources.length > 0);
}

export function appendSentence(text: string, sentence: string): string {
  const cleanText = text.trim();
  const cleanSentence = sentence.trim();

  if (!cleanText) {
    return cleanSentence;
  }

  if (normalizeSafetyText(cleanText).includes(normalizeSafetyText(cleanSentence))) {
    return cleanText;
  }

  return `${cleanText} ${cleanSentence}`;
}

export function ensureDisclaimer(text: string): string {
  return appendSentence(text, REQUIRED_DISCLAIMER);
}

export function ensureClinicianReview(text: string): string {
  return appendSentence(text, CLINICIAN_REVIEW_SENTENCE);
}

export function buildSafeFallbackResponse(): string {
  return `${"I can't provide diagnosis, medication instructions, or emergency decisions. Please discuss this with a qualified clinician."} ${REQUIRED_DISCLAIMER}`;
}

export function calculateSafetyScore(flags: SafetyFlag[]): number {
  const penalty = flags.reduce((total, flag) => {
    if (flag.severity === "high") {
      return total + 0.55;
    }

    if (flag.severity === "medium") {
      return total + 0.2;
    }

    return total + 0.05;
  }, 0);

  const score = 1 - penalty;
  return Math.max(0, Math.min(Number(score.toFixed(2)), 1));
}

export function pickResponseField(payload: Record<string, unknown>): "reply" | "answer" | "message" | null {
  if (typeof payload.reply === "string") return "reply";
  if (typeof payload.answer === "string") return "answer";
  if (typeof payload.message === "string") return "message";
  return null;
}

