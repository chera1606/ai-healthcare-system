import { RiskAssessment } from './riskAnalyzer.types.js';

// ============================================
// Prompt Templates for RiskAnalyzerAgent
// ============================================

/**
 * Generates the prompt for Gemini to explain risk assessment results
 * in beginner-friendly language
 * 
 * @param question - The user's original question
 * @param riskAssessments - Array of risk assessments from rule-based checks
 * @returns The formatted prompt for the AI
 */
export function generateRiskExplanationPrompt(
  question: string,
  riskAssessments: RiskAssessment[]
): string {
  // Build the risk assessment summary
  const riskSummary = riskAssessments.map(assessment => {
    return `- ${assessment.type}: ${assessment.extractedValue || 'Not found'} - Risk Level: ${assessment.riskLevel} - ${assessment.explanation}`;
  }).join('\n');

  return `You are a helpful medical assistant. Explain the following health risk assessment results to the user in simple, beginner-friendly language.

CRITICAL: Risk levels were already calculated by deterministic logic rules. DO NOT change the risk levels. Only explain them in simple language.

IMPORTANT SAFETY RULES:
- Do NOT diagnose medical conditions.
- Do NOT prescribe medications or recommend treatments.
- Do NOT say the patient definitely has a disease.
- Use ONLY the provided risk assessment results.
- The risk levels shown are authoritative based on medical guidelines.
- Explain what the values mean in simple terms.
- If a value is high or abnormal, explain what that means without causing panic.
- Tell the user to discuss important findings with a qualified clinician.
- Always include: "This is informational and not medical advice."

User's Question:
${question}

Risk Assessment Results (from rule-based analysis):
${riskSummary}

Please provide a clear, simple explanation that:
1. Answers the user's question directly
2. Focuses on the specific health indicator the user asked about first
3. Explains what the values mean in plain language
4. Confirms the risk level shown above (do not change it)
5. Describes what the risk level means in understandable terms
6. Includes appropriate safety reminders
7. Encourages discussion with a healthcare provider

Answer:`;
}
