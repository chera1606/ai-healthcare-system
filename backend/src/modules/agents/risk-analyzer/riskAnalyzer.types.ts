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
  | 'abnormal'
  | 'unknown';

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
  observationKey: string;
  valueText: string;
  valueJson?: any;
  valueNumber?: number;
  unit?: string;
  riskLevel: RiskLevel;
  ruleApplied: string;
  sourceText: string;
  reportId?: number;
  observedAt?: string;
  confidence?: number;
}

/**
 * Source citation from observations
 */
export interface ObservationSource {
  sourceType: 'observation';
  reportId: number;
  observationKey: string;
  textPreview: string;
  observedAt?: string;
  confidence?: number;
}

/**
 * Source citation from chunks (fallback)
 */
export interface ChunkSource {
  sourceType: 'chunk';
  chunkId: number;
  reportId: number;
  fileName: string;
  textPreview: string;
  similarity?: number;
}

/**
 * Input for the RiskAnalyzerAgent
 */
export interface RiskAnalyzerInput {
  question: string;
  patientId?: number;
  reportId?: number;
  retrievedChunks?: Array<{
    chunkId: number;
    reportId: number;
    chunkText: string;
    chunkIndex: number;
    originalName: string;
    similarity: number;
  }>;
}

/**
 * Output from the RiskAnalyzerAgent
 */
export interface RiskAnalyzerOutput {
  ok: boolean;
  selectedAgent: string;
  reply: string;
  risks: RiskAssessment[];
  sources: Array<ObservationSource | ChunkSource>;
  confidence: number;
  disclaimer: string;
}
