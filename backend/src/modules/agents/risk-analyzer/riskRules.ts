import { RiskLevel, ExtractedValue, RiskAssessment, BloodPressureValue } from './riskAnalyzer.types.js';

// ============================================
// Regex Patterns for Extracting Health Values
// ============================================

/**
 * Regular expressions to extract health values from text
 * These patterns match common medical report formats
 */
export const VALUE_PATTERNS = {
  // Blood pressure: matches "148/95 mmHg" or "148/95"
  blood_pressure: /(\d{2,3})\/(\d{2,3})\s*(?:mmHg)?/gi,
  
  // Total cholesterol: matches "245 mg/dL" or "245"
  total_cholesterol: /total\s*cholesterol[:\s]*(\d{2,3})\s*(?:mg\/dL)?/gi,
  
  // LDL cholesterol: matches "165 mg/dL" or "165"
  ldl_cholesterol: /ldl\s*(?:cholesterol)?[:\s]*(\d{2,3})\s*(?:mg\/dL)?/gi,
  
  // Fasting glucose: matches "102 mg/dL" or "102"
  fasting_glucose: /fasting\s*(?:blood\s*)?glucose[:\s]*(\d{2,3})\s*(?:mg\/dL)?/gi,
  
  // Hemoglobin: matches "13.8 g/dL" or "13.8"
  hemoglobin: /hemoglobin[:\s]*(\d{1,2}\.?\d*)\s*(?:g\/dL)?/gi
};

// ============================================
// Risk Assessment Rules
// ============================================

/**
 * Assesses blood pressure risk level based on systolic and diastolic values
 * 
 * @param systolic - Systolic blood pressure (top number)
 * @param diastolic - Diastolic blood pressure (bottom number)
 * @returns Risk level and explanation
 */
export function assessBloodPressure(systolic: number, diastolic: number): { level: RiskLevel; explanation: string } {
  // Critical: Hypertensive Crisis
  if (systolic >= 180 || diastolic >= 120) {
    return {
      level: 'critical',
      explanation: 'Blood pressure is in the critical range (Hypertensive Crisis). Seek immediate medical attention.'
    };
  }
  
  // High: Stage 2 Hypertension
  if (systolic >= 140 || diastolic >= 90) {
    return {
      level: 'high',
      explanation: 'Blood pressure is in the high range (Stage 2 Hypertension). Consult with a healthcare provider.'
    };
  }
  
  // Elevated: Elevated Blood Pressure
  if (systolic >= 130 || diastolic >= 80) {
    return {
      level: 'elevated',
      explanation: 'Blood pressure is elevated. Lifestyle changes may help.'
    };
  }
  
  // Normal
  return {
    level: 'normal',
    explanation: 'Blood pressure is within normal range.'
  };
}

/**
 * Assesses LDL cholesterol risk level
 * 
 * @param value - LDL cholesterol value in mg/dL
 * @returns Risk level and explanation
 */
export function assessLDLCholesterol(value: number): { level: RiskLevel; explanation: string } {
  if (value >= 190) {
    return {
      level: 'very_high',
      explanation: 'LDL cholesterol is very high. Immediate medical consultation recommended.'
    };
  }
  
  if (value >= 160) {
    return {
      level: 'high',
      explanation: 'LDL cholesterol is high. Consult with a healthcare provider.'
    };
  }
  
  if (value >= 130) {
    return {
      level: 'borderline_high',
      explanation: 'LDL cholesterol is borderline high. Monitor and consider lifestyle changes.'
    };
  }
  
  return {
    level: 'normal',
    explanation: 'LDL cholesterol is within normal range.'
  };
}

/**
 * Assesses total cholesterol risk level
 * 
 * @param value - Total cholesterol value in mg/dL
 * @returns Risk level and explanation
 */
export function assessTotalCholesterol(value: number): { level: RiskLevel; explanation: string } {
  if (value >= 240) {
    return {
      level: 'high',
      explanation: 'Total cholesterol is high. Consult with a healthcare provider.'
    };
  }
  
  if (value >= 200) {
    return {
      level: 'borderline_high',
      explanation: 'Total cholesterol is borderline high. Monitor and consider lifestyle changes.'
    };
  }
  
  return {
    level: 'normal',
      explanation: 'Total cholesterol is within normal range.'
  };
}

/**
 * Assesses fasting glucose risk level
 * 
 * @param value - Fasting glucose value in mg/dL
 * @returns Risk level and explanation
 */
export function assessFastingGlucose(value: number): { level: RiskLevel; explanation: string } {
  if (value >= 126) {
    return {
      level: 'high',
      explanation: 'Fasting glucose is high. May indicate diabetes. Consult with a healthcare provider.'
    };
  }
  
  if (value >= 100) {
    return {
      level: 'borderline_high',
      explanation: 'Fasting glucose is borderline high (prediabetes range). Monitor and consider lifestyle changes.'
    };
  }
  
  return {
    level: 'normal',
    explanation: 'Fasting glucose is within normal range.'
  };
}

/**
 * Assesses hemoglobin risk level
 * 
 * @param value - Hemoglobin value in g/dL
 * @returns Risk level and explanation
 */
export function assessHemoglobin(value: number): { level: RiskLevel; explanation: string } {
  // Normal range for adults: 12-17 g/dL
  if (value >= 12 && value <= 17) {
    return {
      level: 'normal',
      explanation: 'Hemoglobin is within normal range.'
    };
  }
  
  return {
    level: 'abnormal',
    explanation: 'Hemoglobin is outside normal range. Consult with a healthcare provider.'
  };
}

// ============================================
// Value Extraction Functions
// ============================================

/**
 * Extracts health values from text using regex patterns
 * 
 * @param text - The text to search for values
 * @param chunkId - The chunk ID for source tracking
 * @returns Array of extracted values
 */
export function extractValuesFromText(text: string, chunkId: number): ExtractedValue[] {
  const extracted: ExtractedValue[] = [];
  
  // Extract blood pressure
  const bpMatch = text.match(VALUE_PATTERNS.blood_pressure);
  if (bpMatch) {
    extracted.push({
      type: 'blood_pressure',
      value: `${bpMatch[1]}/${bpMatch[2]}`,
      rawText: bpMatch[0],
      sourceChunkId: chunkId
    });
  }
  
  // Extract total cholesterol
  const tcMatch = text.match(VALUE_PATTERNS.total_cholesterol);
  if (tcMatch) {
    extracted.push({
      type: 'total_cholesterol',
      value: tcMatch[1],
      rawText: tcMatch[0],
      sourceChunkId: chunkId
    });
  }
  
  // Extract LDL cholesterol
  const ldlMatch = text.match(VALUE_PATTERNS.ldl_cholesterol);
  if (ldlMatch) {
    extracted.push({
      type: 'ldl_cholesterol',
      value: ldlMatch[1],
      rawText: ldlMatch[0],
      sourceChunkId: chunkId
    });
  }
  
  // Extract fasting glucose
  const fgMatch = text.match(VALUE_PATTERNS.fasting_glucose);
  if (fgMatch) {
    extracted.push({
      type: 'fasting_glucose',
      value: fgMatch[1],
      rawText: fgMatch[0],
      sourceChunkId: chunkId
    });
  }
  
  // Extract hemoglobin
  const hbMatch = text.match(VALUE_PATTERNS.hemoglobin);
  if (hbMatch) {
    extracted.push({
      type: 'hemoglobin',
      value: hbMatch[1],
      rawText: hbMatch[0],
      sourceChunkId: chunkId
    });
  }
  
  return extracted;
}

/**
 * Parses blood pressure value string into systolic and diastolic numbers
 * 
 * @param value - Blood pressure string like "148/95"
 * @returns BloodPressureValue object
 */
export function parseBloodPressure(value: string): BloodPressureValue {
  const parts = value.split('/');
  return {
    systolic: parseInt(parts[0], 10),
    diastolic: parseInt(parts[1], 10),
    unit: 'mmHg'
  };
}

/**
 * Applies risk assessment rules to extracted values
 * 
 * @param extractedValues - Array of extracted health values
 * @returns Array of risk assessments
 */
export function assessRisks(extractedValues: ExtractedValue[]): RiskAssessment[] {
  const assessments: RiskAssessment[] = [];
  
  for (const extracted of extractedValues) {
    let assessment: RiskAssessment;
    
    switch (extracted.type) {
      case 'blood_pressure': {
        const bp = parseBloodPressure(extracted.value);
        const result = assessBloodPressure(bp.systolic, bp.diastolic);
        assessment = {
          type: 'blood_pressure',
          extractedValue: extracted.value,
          riskLevel: result.level,
          ruleApplied: `Systolic: ${bp.systolic}, Diastolic: ${bp.diastolic}`,
          explanation: result.explanation
        };
        break;
      }
      
      case 'total_cholesterol': {
        const value = parseInt(extracted.value, 10);
        const result = assessTotalCholesterol(value);
        assessment = {
          type: 'total_cholesterol',
          extractedValue: extracted.value,
          riskLevel: result.level,
          ruleApplied: `Value: ${value} mg/dL`,
          explanation: result.explanation
        };
        break;
      }
      
      case 'ldl_cholesterol': {
        const value = parseInt(extracted.value, 10);
        const result = assessLDLCholesterol(value);
        assessment = {
          type: 'ldl_cholesterol',
          extractedValue: extracted.value,
          riskLevel: result.level,
          ruleApplied: `Value: ${value} mg/dL`,
          explanation: result.explanation
        };
        break;
      }
      
      case 'fasting_glucose': {
        const value = parseInt(extracted.value, 10);
        const result = assessFastingGlucose(value);
        assessment = {
          type: 'fasting_glucose',
          extractedValue: extracted.value,
          riskLevel: result.level,
          ruleApplied: `Value: ${value} mg/dL`,
          explanation: result.explanation
        };
        break;
      }
      
      case 'hemoglobin': {
        const value = parseFloat(extracted.value);
        const result = assessHemoglobin(value);
        assessment = {
          type: 'hemoglobin',
          extractedValue: extracted.value,
          riskLevel: result.level,
          ruleApplied: `Value: ${value} g/dL`,
          explanation: result.explanation
        };
        break;
      }
      
      default:
        continue;
    }
    
    assessments.push(assessment);
  }
  
  return assessments;
}
