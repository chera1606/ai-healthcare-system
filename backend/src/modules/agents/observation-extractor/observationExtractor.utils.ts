import { RegexExtractionResult, ObservationType } from './observationExtractor.types.js';

// ============================================
// Regex Patterns for Extracting Medical Observations
// ============================================

/**
 * Regular expressions to extract structured medical values from text
 * These patterns match common medical report formats
 */
export const EXTRACTION_PATTERNS = {
  // Blood pressure: matches "148/95 mmHg" or "148/95"
  blood_pressure: /blood\s*pressure[:\s]*(\d{2,3})\/(\d{2,3})\s*(?:mmHg)?/gi,
  
  // Heart rate: matches "82 bpm" or "82 beats/min" or "heart rate: 82"
  heart_rate: /heart\s*rate[:\s]*(\d{2,3})\s*(?:bpm|beats\/min)?/gi,
  
  // Temperature: matches "98.6°F" or "98.6 F" or "temperature: 98.6"
  temperature: /temperature[:\s]*(\d{2,3}\.?\d*)\s*(?:°?F|°?C)?/gi,
  
  // Weight: matches "72 kg" or "72kg" or "weight: 72"
  weight: /weight[:\s]*(\d{2,3}\.?\d*)\s*(?:kg|lbs)?/gi,
  
  // Total cholesterol: matches "245 mg/dL" or "total cholesterol: 245"
  total_cholesterol: /total\s*cholesterol[:\s]*(\d{2,3})\s*(?:mg\/dL)?/gi,
  
  // LDL cholesterol: matches "165 mg/dL" or "ldl: 165"
  ldl_cholesterol: /ldl\s*(?:cholesterol)?[:\s]*(\d{2,3})\s*(?:mg\/dL)?/gi,
  
  // HDL cholesterol: matches "48 mg/dL" or "hdl: 48"
  hdl_cholesterol: /hdl\s*(?:cholesterol)?[:\s]*(\d{2,3})\s*(?:mg\/dL)?/gi,
  
  // Fasting glucose: matches "102 mg/dL" or "fasting glucose: 102"
  fasting_glucose: /fasting\s*(?:blood\s*)?glucose[:\s]*(\d{2,3})\s*(?:mg\/dL)?/gi,
  
  // Hemoglobin: matches "13.8 g/dL" or "hemoglobin: 13.8"
  hemoglobin: /hemoglobin[:\s]*(\d{1,2}\.?\d*)\s*(?:g\/dL)?/gi,
  
  // Age: matches "age: 45" or "45 years old" or "45-year-old"
  age: /age[:\s]*(\d{1,3})\s*(?:years?\s*old)?/gi,
  
  // Visit date: matches "June 1, 2026" or "01/06/2026" or "visit date: June 1, 2026"
  visit_date: /(?:visit\s*date|date\s*of\s*visit|date)[:\s]*([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/gi
};

// ============================================
// Extraction Functions
// ============================================

/**
 * Extracts blood pressure from text using regex
 */
export function extractBloodPressure(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.blood_pressure);
  if (!match) return null;
  
  const systolic = parseInt(match[1], 10);
  const diastolic = parseInt(match[2], 10);
  
  return {
    observationType: 'vital',
    observationKey: 'blood_pressure',
    valueText: `${systolic}/${diastolic}`,
    valueJson: { systolic, diastolic },
    unit: 'mmHg',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts heart rate from text using regex
 */
export function extractHeartRate(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.heart_rate);
  if (!match) return null;
  
  const value = parseInt(match[1], 10);
  
  return {
    observationType: 'vital',
    observationKey: 'heart_rate',
    valueText: match[1],
    valueNumber: value,
    unit: 'bpm',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts temperature from text using regex
 */
export function extractTemperature(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.temperature);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  
  return {
    observationType: 'vital',
    observationKey: 'temperature',
    valueText: match[1],
    valueNumber: value,
    unit: '°F',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts weight from text using regex
 */
export function extractWeight(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.weight);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  
  return {
    observationType: 'vital',
    observationKey: 'weight',
    valueText: match[1],
    valueNumber: value,
    unit: 'kg',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts total cholesterol from text using regex
 */
export function extractTotalCholesterol(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.total_cholesterol);
  if (!match) return null;
  
  const value = parseInt(match[1], 10);
  
  return {
    observationType: 'lab',
    observationKey: 'total_cholesterol',
    valueText: match[1],
    valueNumber: value,
    unit: 'mg/dL',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts LDL cholesterol from text using regex
 */
export function extractLDLCholesterol(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.ldl_cholesterol);
  if (!match) return null;
  
  const value = parseInt(match[1], 10);
  
  return {
    observationType: 'lab',
    observationKey: 'ldl_cholesterol',
    valueText: match[1],
    valueNumber: value,
    unit: 'mg/dL',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts HDL cholesterol from text using regex
 */
export function extractHDLCholesterol(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.hdl_cholesterol);
  if (!match) return null;
  
  const value = parseInt(match[1], 10);
  
  return {
    observationType: 'lab',
    observationKey: 'hdl_cholesterol',
    valueText: match[1],
    valueNumber: value,
    unit: 'mg/dL',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts fasting glucose from text using regex
 */
export function extractFastingGlucose(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.fasting_glucose);
  if (!match) return null;
  
  const value = parseInt(match[1], 10);
  
  return {
    observationType: 'lab',
    observationKey: 'fasting_glucose',
    valueText: match[1],
    valueNumber: value,
    unit: 'mg/dL',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts hemoglobin from text using regex
 */
export function extractHemoglobin(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.hemoglobin);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  
  return {
    observationType: 'lab',
    observationKey: 'hemoglobin',
    valueText: match[1],
    valueNumber: value,
    unit: 'g/dL',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts age from text using regex
 */
export function extractAge(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.age);
  if (!match) return null;
  
  const value = parseInt(match[1], 10);
  
  return {
    observationType: 'demographic',
    observationKey: 'age',
    valueText: match[1],
    valueNumber: value,
    unit: 'years',
    sourceText: match[0],
    confidence: 0.95
  };
}

/**
 * Extracts visit date from text using regex
 */
export function extractVisitDate(text: string): RegexExtractionResult | null {
  const match = text.match(EXTRACTION_PATTERNS.visit_date);
  if (!match) return null;
  
  return {
    observationType: 'visit_info',
    observationKey: 'visit_date',
    valueText: match[1],
    sourceText: match[0],
    confidence: 0.90
  };
}

/**
 * Runs all regex extractions on the given text
 */
export function extractAllWithRegex(text: string): RegexExtractionResult[] {
  const results: RegexExtractionResult[] = [];
  
  const extractors = [
    extractBloodPressure,
    extractHeartRate,
    extractTemperature,
    extractWeight,
    extractTotalCholesterol,
    extractLDLCholesterol,
    extractHDLCholesterol,
    extractFastingGlucose,
    extractHemoglobin,
    extractAge,
    extractVisitDate
  ];
  
  for (const extractor of extractors) {
    const result = extractor(text);
    if (result) {
      results.push(result);
    }
  }
  
  return results;
}
