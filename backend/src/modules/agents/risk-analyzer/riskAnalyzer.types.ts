// ============================================
// TypeScript Interfaces for RiskAnalyzerAgent
// ============================================

/**
 * Risk level categories for health indicators
 */
export type RiskLevel = 
  | 'normal'
  | 'borderline_high'
  | 'high'
  | 'very_high'
  | 'critical'
  | 'elevated'
  | 'abnormal';

/**
 * Extracted health value from text
 */
export interface ExtractedValue {
  type: 'blood_pressure' | 'total_cholesterol' | 'ldl_cholesterol' | 'fasting_glucose' | 'hemoglobin';
  value: string;
  rawText: string;
  sourceChunkId: number;
}

/**
 * Blood pressure specific value
 */
export interface BloodPressureValue {
  systolic: number;
  diastolic: number;
  unit: string;
}

/**
 * Risk assessment result for a single indicator
 */
export interface RiskAssessment {
  type: string;
  extractedValue?: string;
  riskLevel: RiskLevel;
  ruleApplied: string;
  explanation?: string;
}

/**
 * Input for the RiskAnalyzerAgent
 */
export interface RiskAnalyzerInput {
  question: string;
  retrievedChunks: Array<{
    chunkId: number;
    reportId: number;
    chunkText: string;
    chunkIndex: number;
    originalName: string;
    similarity: number;
  }>;
  patientId?: string;
}

/**
 * Output from the RiskAnalyzerAgent
 */
export interface RiskAnalyzerOutput {
  answer: string;
  risks: RiskAssessment[];
  sources: Array<{
    chunkId: number;
    reportId: number;
    fileName: string;
    textPreview: string;
    similarity: number;
  }>;
  disclaimer: string;
  confidence: number;
}
