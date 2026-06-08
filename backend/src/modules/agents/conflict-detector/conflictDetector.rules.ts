/**
 * Rule-based conflict detection logic for ConflictDetectorAgent
 *
 * Each rule compares the previous and latest observation for a given key
 * and returns whether a conflict or significant difference exists.
 */

import { ConflictSeverity, ConflictType, DetectedConflict } from './conflictDetector.types.js';

// ============================================
// Conflict thresholds per observation key
// ============================================

/**
 * Minimum numeric difference to consider a significant change (medium severity).
 * If the risk category also changes, severity is promoted to high.
 */
export const CONFLICT_THRESHOLDS: Record<string, number> = {
  ldl_cholesterol: 30,
  total_cholesterol: 40,
  hdl_cholesterol: 15,
  fasting_glucose: 25,
  hba1c: 0.5,
  hemoglobin: 2,
  weight: 5,
};

// ============================================
// Risk category helpers
// ============================================

type RiskCategory = 'normal' | 'elevated' | 'high' | 'critical' | 'unknown';

/**
 * Returns a risk category for a given observation key and numeric value.
 * These are simplified, informational categories only — not clinical guidelines.
 */
export function getRiskCategory(key: string, value: number): RiskCategory {
  switch (key) {
    case 'ldl_cholesterol':
      if (value < 100) return 'normal';
      if (value < 130) return 'elevated';
      if (value < 190) return 'high';
      return 'critical';

    case 'total_cholesterol':
      if (value < 200) return 'normal';
      if (value < 240) return 'elevated';
      return 'high';

    case 'hdl_cholesterol':
      // Higher HDL is better; low HDL is a risk factor
      if (value >= 60) return 'normal';
      if (value >= 40) return 'elevated';
      return 'high';

    case 'fasting_glucose':
      if (value < 100) return 'normal';
      if (value < 126) return 'elevated';
      return 'high';

    case 'hba1c':
      if (value < 5.7) return 'normal';
      if (value < 6.5) return 'elevated';
      return 'high';

    case 'hemoglobin':
      // Normal range roughly 12–17 g/dL (varies by sex)
      if (value >= 12 && value <= 17) return 'normal';
      if (value >= 10) return 'elevated';
      return 'high';

    default:
      return 'unknown';
  }
}

/**
 * Returns whether two risk categories represent a meaningful change.
 */
function isRiskCategoryChange(catA: RiskCategory, catB: RiskCategory): boolean {
  if (catA === 'unknown' || catB === 'unknown') return false;
  return catA !== catB;
}

// ============================================
// Blood pressure conflict detection
// ============================================

/**
 * Parses blood pressure value_json or value_text into { systolic, diastolic }.
 * Returns null if the value cannot be parsed.
 */
function parseBloodPressure(obs: any): { systolic: number; diastolic: number } | null {
  // Try value_json first (e.g. { systolic: 120, diastolic: 78 })
  if (obs.value_json) {
    try {
      const json = typeof obs.value_json === 'string' ? JSON.parse(obs.value_json) : obs.value_json;
      if (json.systolic && json.diastolic) {
        return { systolic: Number(json.systolic), diastolic: Number(json.diastolic) };
      }
    } catch {
      // fall through
    }
  }

  // Try value_text like "120/78" or "120/78 mmHg"
  const text = obs.value_text || obs.source_text || '';
  const match = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    return { systolic: parseInt(match[1], 10), diastolic: parseInt(match[2], 10) };
  }

  return null;
}

/**
 * Blood pressure risk category based on systolic reading.
 */
function getBpRiskCategory(systolic: number, diastolic: number): RiskCategory {
  if (systolic < 120 && diastolic < 80) return 'normal';
  if (systolic < 130 && diastolic < 80) return 'elevated';
  if (systolic < 140 || diastolic < 90) return 'high';
  return 'critical';
}

/**
 * Detects a blood pressure conflict between two observations.
 * Returns a DetectedConflict if a significant difference is found.
 */
export function detectBloodPressureConflict(
  prevObs: any,
  latestObs: any
): DetectedConflict | null {
  const prev = parseBloodPressure(prevObs);
  const latest = parseBloodPressure(latestObs);

  if (!prev || !latest) return null;

  const systolicDiff = Math.abs(latest.systolic - prev.systolic);
  const diastolicDiff = Math.abs(latest.diastolic - prev.diastolic);
  const hasSignificantDiff = systolicDiff >= 20 || diastolicDiff >= 10;

  if (!hasSignificantDiff) return null;

  const prevCategory = getBpRiskCategory(prev.systolic, prev.diastolic);
  const latestCategory = getBpRiskCategory(latest.systolic, latest.diastolic);
  const categoryChanged = isRiskCategoryChange(prevCategory, latestCategory);

  const severity: ConflictSeverity = categoryChanged ? 'high' : 'medium';

  const prevValue = `${prev.systolic}/${prev.diastolic} mmHg`;
  const latestValue = `${latest.systolic}/${latest.diastolic} mmHg`;

  return {
    observationKey: 'blood_pressure',
    conflictType: categoryChanged ? 'risk_category_change' : 'numeric_difference',
    severity,
    previousValue: prevValue,
    latestValue: latestValue,
    previousObservedAt: prevObs.observed_at ? String(prevObs.observed_at) : undefined,
    latestObservedAt: latestObs.observed_at ? String(latestObs.observed_at) : undefined,
    report1Id: prevObs.report_id,
    report2Id: latestObs.report_id,
    difference: systolicDiff,
    explanation:
      `A possible difference was found in blood pressure readings. ` +
      `The previous reading was ${prevValue} and the latest is ${latestValue}. ` +
      `The systolic reading changed by ${systolicDiff} mmHg and the diastolic by ${diastolicDiff} mmHg. ` +
      (categoryChanged
        ? `This represents a change in risk category from "${prevCategory}" to "${latestCategory}". `
        : '') +
      `Differences may be due to time of measurement, activity level, stress, or an actual change in health. ` +
      `Please discuss this with a qualified clinician.`
  };
}

// ============================================
// Generic numeric conflict detection
// ============================================

/**
 * Extracts a numeric value from an observation, trying value_number, value_text, source_text.
 */
export function getNumericValueFromObs(obs: any): number | null {
  if (obs.value_number !== null && obs.value_number !== undefined && !isNaN(Number(obs.value_number))) {
    return Number(obs.value_number);
  }
  const text = obs.value_text || obs.source_text || '';
  const match = text.match(/(\d+\.?\d*)/);
  if (match) {
    const parsed = parseFloat(match[1]);
    if (!isNaN(parsed)) return parsed;
  }
  return null;
}

/**
 * Generic rule for detecting numeric conflicts using per-key thresholds.
 * Returns a DetectedConflict if the difference meets the threshold.
 */
export function detectNumericConflict(
  prevObs: any,
  latestObs: any,
  observationKey: string
): DetectedConflict | null {
  const threshold = CONFLICT_THRESHOLDS[observationKey];
  if (threshold === undefined) return null;

  const prevValue = getNumericValueFromObs(prevObs);
  const latestValue = getNumericValueFromObs(latestObs);

  if (prevValue === null || latestValue === null) return null;

  const diff = Math.abs(latestValue - prevValue);
  if (diff < threshold) return null;

  const prevCategory = getRiskCategory(observationKey, prevValue);
  const latestCategory = getRiskCategory(observationKey, latestValue);
  const categoryChanged = isRiskCategoryChange(prevCategory, latestCategory);

  const severity: ConflictSeverity = categoryChanged ? 'high' : 'medium';
  const conflictType: ConflictType = categoryChanged ? 'risk_category_change' : 'numeric_difference';

  const unit = prevObs.unit || latestObs.unit || '';
  const prevStr = `${prevValue}${unit ? ' ' + unit : ''}`;
  const latestStr = `${latestValue}${unit ? ' ' + unit : ''}`;
  const keyLabel = observationKey.replace(/_/g, ' ');

  return {
    observationKey,
    conflictType,
    severity,
    previousValue: prevStr,
    latestValue: latestStr,
    previousObservedAt: prevObs.observed_at ? String(prevObs.observed_at) : undefined,
    latestObservedAt: latestObs.observed_at ? String(latestObs.observed_at) : undefined,
    report1Id: prevObs.report_id,
    report2Id: latestObs.report_id,
    difference: diff,
    explanation:
      `A possible difference was found in ${keyLabel}. ` +
      `The previous value was ${prevStr} and the latest is ${latestStr}. ` +
      `The difference is ${diff.toFixed(2)}${unit ? ' ' + unit : ''}, ` +
      `which meets the threshold for a significant change. ` +
      (categoryChanged
        ? `This also represents a change in risk category from "${prevCategory}" to "${latestCategory}". `
        : '') +
      `Please discuss this finding with a qualified clinician.`
  };
}

// ============================================
// Medication difference detection
// ============================================

/**
 * Checks if a medication appears in one observation but not another.
 * Returns a low-severity conflict if medication data differs.
 */
export function detectMedicationDifference(
  prevObs: any,
  latestObs: any
): DetectedConflict | null {
  const prevText = (prevObs.value_text || prevObs.source_text || '').toLowerCase();
  const latestText = (latestObs.value_text || latestObs.source_text || '').toLowerCase();

  if (!prevText || !latestText) return null;
  if (prevText === latestText) return null;

  return {
    observationKey: 'medication',
    conflictType: 'medication_difference',
    severity: 'low',
    previousValue: prevObs.value_text || 'See source',
    latestValue: latestObs.value_text || 'See source',
    previousObservedAt: prevObs.observed_at ? String(prevObs.observed_at) : undefined,
    latestObservedAt: latestObs.observed_at ? String(latestObs.observed_at) : undefined,
    report1Id: prevObs.report_id,
    report2Id: latestObs.report_id,
    explanation:
      `A possible difference was found in medication information across reports. ` +
      `Note: a medication appearing in one report but not another does not necessarily mean the medication was started or stopped. ` +
      `Please discuss any medication questions with your prescribing clinician.`
  };
}
