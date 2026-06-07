/**
 * Types for TimelineMemoryAgent
 */

export type ChangeDirection = 'increased' | 'decreased' | 'stable' | 'unknown';

export interface Trend {
  observationKey: string;
  latestValue: string;
  previousValue?: string;
  changeDirection: ChangeDirection;
  latestObservedAt?: string;
  previousObservedAt?: string;
  explanation: string;
}

export interface ObservationSource {
  sourceType: 'observation';
  reportId: number;
  observationKey: string;
  textPreview: string;
  observedAt?: string;
  confidence?: number;
}

export interface TimelineMemoryInput {
  question: string;
  patientId: number;
  observationKeys?: string[];
}

export interface TimelineMemoryOutput {
  answer: string;
  trends: Trend[];
  sources: ObservationSource[];
  confidence: number;
  disclaimer: string;
}
