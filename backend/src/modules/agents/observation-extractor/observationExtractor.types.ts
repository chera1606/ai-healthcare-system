// ============================================
// TypeScript Interfaces for ObservationExtractorAgent
// ============================================

/**
 * Observation type categories
 */
export type ObservationType = 
  | 'demographic'      // Patient info: name, age, gender
  | 'vital'            // Vital signs: blood pressure, heart rate, temperature, weight
  | 'lab'              // Lab results: cholesterol, glucose, hemoglobin
  | 'medication'       // Medications: name, dosage
  | 'diagnosis'        // Assessment/diagnosis
  | 'recommendation'   // Recommendations from report
  | 'appointment'      // Next appointment date
  | 'visit_info'       // Visit date, hospital name
  | 'other';

/**
 * Extracted observation from medical report
 */
export interface ExtractedObservation {
  observationType: ObservationType;
  observationKey: string;
  valueText?: string;
  valueNumber?: number;
  valueJson?: Record<string, any>;
  unit?: string;
  normalRangeText?: string;
  reportInterpretation?: string;
  sourceText: string;
  sourceChunkId?: number;
  confidence: number;
  observedAt?: string;
  hospitalName?: string;
}

/**
 * Input for ObservationExtractorAgent
 */
export interface ObservationExtractorInput {
  reportText: string;
  reportId: number;
  patientId: number;
  hospitalName?: string;
  reportDate?: string;
  chunks?: Array<{
    chunkId: number;
    chunkText: string;
  }>;
}

/**
 * Output from ObservationExtractorAgent
 */
export interface ObservationExtractorOutput {
  observations: ExtractedObservation[];
  extractionSummary: {
    totalExtracted: number;
    byType: Record<string, number>;
    averageConfidence: number;
  };
}

/**
 * Regex extraction result
 */
export interface RegexExtractionResult {
  observationType: ObservationType;
  observationKey: string;
  valueText: string;
  valueNumber?: number;
  valueJson?: Record<string, any>;
  unit?: string;
  sourceText: string;
  confidence: number;
}

/**
 * Gemini extraction result
 */
export interface GeminiExtractionResult {
  observations: Array<{
    observationType: ObservationType;
    observationKey: string;
    valueText?: string;
    valueNumber?: number;
    valueJson?: Record<string, any>;
    unit?: string;
    sourceText: string;
    confidence: number;
  }>;
}
