/**
 * TypeScript interfaces for ConflictDetectorAgent
 */

// ============================================
// Severity and conflict classification
// ============================================

export type ConflictSeverity = 'low' | 'medium' | 'high';

export type ConflictType =
  | 'numeric_difference'
  | 'risk_category_change'
  | 'textual_contradiction'
  | 'medication_difference';

// ============================================
// Conflict data structure
// ============================================

/**
 * A single detected conflict between two observations
 */
export interface DetectedConflict {
  observationKey: string;
  conflictType: ConflictType;
  severity: ConflictSeverity;
  previousValue: string;
  latestValue: string;
  previousObservedAt?: string;
  latestObservedAt?: string;
  report1Id?: number;
  report2Id?: number;
  difference?: number;
  explanation: string;
}

// ============================================
// Source citation structure
// ============================================

/**
 * Source citation pointing to a medical_observation record
 */
export interface ConflictSource {
  sourceType: 'observation';
  reportId: number;
  observationKey: string;
  textPreview: string;
  observedAt?: string;
  confidence?: number;
}

// ============================================
// Agent input / output
// ============================================

/**
 * Input accepted by ConflictDetectorAgent
 */
export interface ConflictDetectorInput {
  question: string;
  patientId: number;
  observationKeys?: string[];
}

/**
 * Full output returned by ConflictDetectorAgent
 */
export interface ConflictDetectorOutput {
  ok: true;
  answer: string;
  conflicts: DetectedConflict[];
  sources: ConflictSource[];
  confidence: number;
  disclaimer: string;
  selectedAgent: 'conflict_detector';
}
