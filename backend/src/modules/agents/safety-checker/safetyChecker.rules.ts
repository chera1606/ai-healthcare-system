import type { SafetyCheckerInput, SafetyFlag } from "./safetyChecker.types.js";
import {
  HIGH_SEVERITY_PHRASES,
  containsAny,
  hasClinicianRecommendation,
  hasRequiredDisclaimer,
  hasSourceCitation,
  hasUncertaintyLanguage,
  mentionsMedicalCondition,
  normalizeSafetyText,
  shouldExpectSources
} from "./safetyChecker.utils.js";

export function evaluateSafetyRules(input: SafetyCheckerInput): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  const normalized = normalizeSafetyText(input.aiResponse);
  const sourcesExpected = shouldExpectSources(input.agentUsed, input.sources);

  for (const phrase of HIGH_SEVERITY_PHRASES) {
    if (normalized.includes(phrase)) {
      flags.push({
        type: "unsafe_medical_instruction",
        severity: "high",
        message: `Response contains unsafe medical phrase: "${phrase}".`
      });
    }
  }

  if (!hasRequiredDisclaimer(input.aiResponse)) {
    flags.push({
      type: "missing_disclaimer",
      severity: "medium",
      message: 'Required disclaimer is missing: "This is informational and not medical advice."'
    });
  }

  if (
    ["report_explainer", "risk_analyzer", "timeline_memory", "conflict_detector", "care_plan_generator", "doctor_voice_analyzer"].includes(
      input.agentUsed.toLowerCase()
    ) &&
    !hasClinicianRecommendation(input.aiResponse)
  ) {
    flags.push({
      type: "missing_clinician_recommendation",
      severity: "medium",
      message: "Response should encourage clinician review for this type of medical content."
    });
  }

  if (mentionsMedicalCondition(input.aiResponse) && !hasUncertaintyLanguage(input.aiResponse)) {
    flags.push({
      type: "overconfident_medical_claim",
      severity: "medium",
      message: "Response mentions a medical condition without uncertainty language."
    });
  }

  const strongAdvicePattern = /\b(should|must|need to|start|stop|increase|decrease)\b/i;
  if (strongAdvicePattern.test(input.aiResponse) && sourcesExpected && !hasSourceCitation(input.aiResponse)) {
    flags.push({
      type: "strong_advice_without_sources",
      severity: "medium",
      message: "Strong medical advice is given without source citations."
    });
  }

  if (sourcesExpected && !hasSourceCitation(input.aiResponse)) {
    flags.push({
      type: "missing_source_citation",
      severity: "low",
      message: "Sources were expected, but no citation pattern was found in the response."
    });
  }

  if (containsAny(normalized, ["definitely", "certainly", "absolutely", "guaranteed", "always", "never"])) {
    flags.push({
      type: "overconfident_tone",
      severity: "low",
      message: "Response tone sounds too certain for healthcare guidance."
    });
  }

  return dedupeFlags(flags);
}

function dedupeFlags(flags: SafetyFlag[]): SafetyFlag[] {
  const seen = new Set<string>();
  const deduped: SafetyFlag[] = [];

  for (const flag of flags) {
    const key = `${flag.type}:${flag.severity}:${flag.message}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(flag);
  }

  return deduped;
}

