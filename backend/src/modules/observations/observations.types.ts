// ============================================
// TypeScript Interfaces for Observations Repository
// ============================================

/**
 * Medical observation as stored in database
 */
export interface MedicalObservation {
  id: number;
  patient_id: number;
  report_id: number;
  observation_type: string;
  observation_key: string;
  value_text?: string;
  value_number?: number;
  value_json?: Record<string, any>;
  unit?: string;
  normal_range_text?: string;
  report_interpretation?: string;
  source_text: string;
  source_chunk_id?: number;
  confidence: number;
  observed_at?: Date;
  hospital_name?: string;
  extracted_at: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Input for creating a new medical observation
 */
export interface CreateObservationInput {
  patient_id: number;
  report_id: number;
  observation_type: string;
  observation_key: string;
  value_text?: string;
  value_number?: number;
  value_json?: Record<string, any>;
  unit?: string;
  normal_range_text?: string;
  report_interpretation?: string;
  source_text: string;
  source_chunk_id?: number;
  confidence: number;
  observed_at?: Date;
  hospital_name?: string;
}

/**
 * Input for querying observations
 */
export interface QueryObservationsInput {
  patient_id?: number;
  report_id?: number;
  observation_type?: string;
  observation_key?: string;
  observed_after?: Date;
  observed_before?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Query result with pagination
 */
export interface QueryObservationsResult {
  observations: MedicalObservation[];
  total: number;
  limit: number;
  offset: number;
}
