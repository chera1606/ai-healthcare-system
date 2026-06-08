/**
 * Utility functions for ConflictDetectorAgent
 */

import { ConflictSource } from './conflictDetector.types.js';

// ============================================
// Keyword → observation key mapping
// ============================================

/**
 * Determines which observation keys to query based on the user's question.
 * Conflict-specific keywords trigger a broad multi-key scan.
 */
export function detectConflictObservationKeys(question: string): string[] {
  const lowerQ = question.toLowerCase();
  const keys: string[] = [];

  // Conflict/comparison intent — scan all major keys
  const broadTriggers = [
    'conflict', 'conflicts', 'conflicting',
    'mismatch', 'inconsistent', 'discrepancy',
    'compare reports', 'reports disagree', 'different reports',
    'why are my reports different', 'old report vs new report',
    'are there conflicts', 'reports show different',
    'disagree', 'do my reports',
  ];
  if (broadTriggers.some(t => lowerQ.includes(t))) {
    return [
      'blood_pressure',
      'total_cholesterol',
      'ldl_cholesterol',
      'hdl_cholesterol',
      'fasting_glucose',
      'hba1c',
      'hemoglobin',
      'medication',
    ];
  }

  // Specific observation mentions
  if (lowerQ.includes('blood pressure') || lowerQ.includes(' bp ') || lowerQ.startsWith('bp ')) {
    keys.push('blood_pressure');
  }
  if (lowerQ.includes('cholesterol') || lowerQ.includes('ldl') || lowerQ.includes('hdl')) {
    keys.push('total_cholesterol', 'ldl_cholesterol', 'hdl_cholesterol');
  }
  if (lowerQ.includes('glucose') || lowerQ.includes('sugar') || lowerQ.includes('diabetes') || lowerQ.includes('hba1c')) {
    keys.push('fasting_glucose', 'hba1c');
  }
  if (lowerQ.includes('hemoglobin') || lowerQ.includes('anemia')) {
    keys.push('hemoglobin');
  }
  if (lowerQ.includes('medication') || lowerQ.includes('medicine') || lowerQ.includes('drug')) {
    keys.push('medication');
  }

  // Fallback — scan all major keys if no specific key identified
  if (keys.length === 0) {
    return [
      'blood_pressure',
      'total_cholesterol',
      'ldl_cholesterol',
      'hdl_cholesterol',
      'fasting_glucose',
      'hba1c',
      'hemoglobin',
    ];
  }

  return keys;
}

// ============================================
// Conflict summary for Gemini prompt
// ============================================

/**
 * Formats detected conflicts into a plain-text summary string for the Gemini prompt.
 */
export function formatConflictSummary(conflicts: Array<{
  observationKey: string;
  severity: string;
  previousValue: string;
  latestValue: string;
  previousObservedAt?: string;
  latestObservedAt?: string;
  explanation: string;
}>): string {
  if (conflicts.length === 0) return 'No significant conflicts detected.';

  return conflicts.map((c, i) => {
    const lines = [
      `Conflict ${i + 1}: ${c.observationKey.replace(/_/g, ' ')} (severity: ${c.severity})`,
      `  Previous value: ${c.previousValue}${c.previousObservedAt ? ` (on ${c.previousObservedAt})` : ''}`,
      `  Latest value:   ${c.latestValue}${c.latestObservedAt ? ` (on ${c.latestObservedAt})` : ''}`,
      `  Rule explanation: ${c.explanation}`,
    ];
    return lines.join('\n');
  }).join('\n\n');
}

// ============================================
// Source citations
// ============================================

/**
 * Builds ConflictSource citations from a list of observations.
 * Deduplicates by normalized source_text to avoid showing the same snippet twice.
 */
export function createConflictSources(observations: any[]): ConflictSource[] {
  const sources: ConflictSource[] = [];
  const seen = new Set<string>();

  for (const obs of observations) {
    const rawText: string = obs.source_text || '';
    const normalizedText = rawText.toLowerCase().trim().replace(/\s+/g, ' ');

    if (seen.has(normalizedText)) continue;
    seen.add(normalizedText);

    sources.push({
      sourceType: 'observation',
      reportId: obs.report_id,
      observationKey: obs.observation_key,
      textPreview: rawText.substring(0, 200) + (rawText.length > 200 ? '...' : ''),
      observedAt: obs.observed_at ? String(obs.observed_at) : undefined,
      confidence: obs.confidence ? Number(obs.confidence) : undefined,
    });
  }

  return sources;
}
