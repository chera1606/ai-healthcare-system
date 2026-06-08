/**
 * Deterministic rules for medical observation risk assessment
 */

export interface RiskAssessmentResult {
  level: 'normal' | 'elevated' | 'high' | 'critical' | 'unknown';
  explanation: string;
}

/**
 * Assesses blood pressure risk based on systolic and diastolic readings
 * 
 * @param systolic - Systolic blood pressure value
 * @param diastolic - Diastolic blood pressure value
 */
export function assessBloodPressure(systolic: number, diastolic: number): RiskAssessmentResult {
  if (systolic >= 180 || diastolic >= 120) {
    return {
      level: 'critical',
      explanation: 'Critical: Hypertensive crisis. Seek immediate medical attention.'
    };
  }
  
  if (systolic >= 140 || diastolic >= 90) {
    return {
      level: 'high',
      explanation: 'High: Stage 2 Hypertension.'
    };
  }
  
  if (systolic >= 130 || diastolic >= 80) {
    return {
      level: 'elevated',
      explanation: 'Elevated: Stage 1 Hypertension / Elevated range.'
    };
  }
  
  return {
    level: 'normal',
    explanation: 'Normal: Blood pressure is within healthy limits.'
  };
}
