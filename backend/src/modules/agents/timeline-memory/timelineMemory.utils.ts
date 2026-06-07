/**
 * Utility functions for TimelineMemoryAgent
 */

import { ChangeDirection, Trend } from './timelineMemory.types';

/**
 * Detects relevant observation keys based on the user's question
 */
export function detectTimelineObservationKeys(question: string): string[] {
  const lowerQuestion = question.toLowerCase();
  const keys: string[] = [];

  if (lowerQuestion.includes('blood pressure') || lowerQuestion.includes('bp')) {
    keys.push('blood_pressure');
  }
  if (lowerQuestion.includes('cholesterol') || lowerQuestion.includes('ldl') || lowerQuestion.includes('hdl')) {
    keys.push('total_cholesterol', 'ldl_cholesterol', 'hdl_cholesterol');
  }
  if (lowerQuestion.includes('glucose') || lowerQuestion.includes('sugar') || lowerQuestion.includes('diabetes') || lowerQuestion.includes('hba1c')) {
    keys.push('fasting_glucose', 'hba1c');
  }
  if (lowerQuestion.includes('hemoglobin') || lowerQuestion.includes('anemia')) {
    keys.push('hemoglobin');
  }
  if (lowerQuestion.includes('weight')) {
    keys.push('weight');
  }
  if (lowerQuestion.includes('trend') || lowerQuestion.includes('history') || lowerQuestion.includes('changed') || 
      lowerQuestion.includes('improved') || lowerQuestion.includes('worse') || lowerQuestion.includes('better') ||
      lowerQuestion.includes('compare') || lowerQuestion.includes('between reports') || lowerQuestion.includes('since my last report')) {
    // General trend question - use all major keys
    keys.push('blood_pressure', 'total_cholesterol', 'ldl_cholesterol', 'hdl_cholesterol', 'fasting_glucose', 'hba1c', 'hemoglobin', 'weight');
  }

  return keys;
}

/**
 * Extracts numeric value from observation with fallback parsing
 */
export function getNumericValue(observation: any): number | null {
  // 1. Prefer value_number if valid
  if (observation.value_number !== null && observation.value_number !== undefined && !isNaN(observation.value_number)) {
    return observation.value_number;
  }

  // 2. Parse from value_text
  if (observation.value_text) {
    const match = observation.value_text.match(/(\d+\.?\d*)/);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed)) return parsed;
    }
  }

  // 3. Parse from source_text
  if (observation.source_text) {
    const match = observation.source_text.match(/(\d+\.?\d*)/);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed)) return parsed;
    }
  }

  return null;
}

/**
 * Calculates trend between previous and latest observations
 */
export function calculateTrend(previous: any, latest: any): ChangeDirection {
  const previousValue = getNumericValue(previous);
  const latestValue = getNumericValue(latest);

  if (previousValue === null || latestValue === null) {
    return 'unknown';
  }

  const diff = latestValue - previousValue;
  const threshold = 0.01; // Small threshold for stable

  if (diff > threshold) {
    return 'increased';
  } else if (diff < -threshold) {
    return 'decreased';
  } else {
    return 'stable';
  }
}

/**
 * Calculates trend for blood pressure (systolic and diastolic)
 */
export function calculateBloodPressureTrend(previous: any, latest: any): ChangeDirection {
  const previousJson = previous.value_json ? JSON.parse(previous.value_json) : null;
  const latestJson = latest.value_json ? JSON.parse(latest.value_json) : null;

  if (!previousJson || !latestJson || !previousJson.systolic || !previousJson.diastolic || 
      !latestJson.systolic || !latestJson.diastolic) {
    return 'unknown';
  }

  const systolicDiff = latestJson.systolic - previousJson.systolic;
  const diastolicDiff = latestJson.diastolic - previousJson.diastolic;
  const threshold = 1; // Threshold for blood pressure

  // If both increased
  if (systolicDiff > threshold && diastolicDiff > threshold) {
    return 'increased';
  }
  // If both decreased
  if (systolicDiff < -threshold && diastolicDiff < -threshold) {
    return 'decreased';
  }
  // If one increased and one decreased significantly
  if (Math.abs(systolicDiff) > threshold && Math.abs(diastolicDiff) > threshold) {
    return 'unknown'; // Mixed trend
  }
  // If both stable
  if (Math.abs(systolicDiff) <= threshold && Math.abs(diastolicDiff) <= threshold) {
    return 'stable';
  }

  return 'unknown';
}

/**
 * Formats observation value for display
 */
export function formatObservationValue(observation: any): string {
  if (observation.value_text) {
    return observation.value_text;
  }
  if (observation.value_number !== null && observation.value_number !== undefined) {
    return observation.value_number.toString();
  }
  if (observation.value_json) {
    try {
      const json = JSON.parse(observation.value_json);
      if (json.systolic && json.diastolic) {
        return `${json.systolic}/${json.diastolic}`;
      }
      return JSON.stringify(json);
    } catch {
      return observation.value_json;
    }
  }
  return 'unknown';
}

/**
 * Creates a trend object from observations
 */
export function createTrend(observationKey: string, previous: any | null, latest: any): Trend {
  const latestValue = formatObservationValue(latest);
  const previousValue = previous ? formatObservationValue(previous) : undefined;
  
  let changeDirection: ChangeDirection = 'unknown';
  let explanation = '';

  if (!previous) {
    changeDirection = 'unknown';
    explanation = 'Only one value is available, so a trend cannot be calculated yet.';
  } else {
    if (observationKey === 'blood_pressure') {
      changeDirection = calculateBloodPressureTrend(previous, latest);
    } else {
      changeDirection = calculateTrend(previous, latest);
    }

    switch (changeDirection) {
      case 'increased':
        explanation = `Your ${observationKey} appears higher in the latest uploaded report compared to the previous one.`;
        break;
      case 'decreased':
        explanation = `Your ${observationKey} appears lower in the latest uploaded report compared to the previous one.`;
        break;
      case 'stable':
        explanation = `Your ${observationKey} appears stable between the two reports.`;
        break;
      default:
        explanation = 'Unable to determine trend from the available data.';
    }
  }

  return {
    observationKey,
    latestValue,
    previousValue,
    changeDirection,
    latestObservedAt: latest.observed_at,
    previousObservedAt: previous?.observed_at,
    explanation
  };
}
