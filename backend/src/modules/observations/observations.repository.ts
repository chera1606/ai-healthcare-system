import { getPool } from "../../shared/database/pool.js";
import { ensureDatabase } from "../../shared/database/init.js";
import { MedicalObservation, CreateObservationInput, QueryObservationsInput, QueryObservationsResult } from './observations.types.js';

// ============================================
// Observations Repository
// ============================================

/**
 * Creates a new medical observation in the database
 */
export async function createObservation(input: CreateObservationInput): Promise<MedicalObservation> {
  await ensureDatabase();

  const result = await getPool().query(
    `
      INSERT INTO medical_observations (
        patient_id, report_id, observation_type, observation_key,
        value_text, value_number, value_json, unit,
        normal_range_text, report_interpretation, source_text,
        source_chunk_id, confidence, observed_at, hospital_name
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `,
    [
      input.patient_id,
      input.report_id,
      input.observation_type,
      input.observation_key,
      input.value_text || null,
      input.value_number || null,
      input.value_json ? JSON.stringify(input.value_json) : null,
      input.unit || null,
      input.normal_range_text || null,
      input.report_interpretation || null,
      input.source_text,
      input.source_chunk_id || null,
      input.confidence,
      input.observed_at || null,
      input.hospital_name || null
    ]
  );

  return result.rows[0];
}

/**
 * Creates multiple observations in a single transaction
 */
export async function createObservationsBatch(inputs: CreateObservationInput[]): Promise<MedicalObservation[]> {
  await ensureDatabase();
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    const results: MedicalObservation[] = [];

    for (const input of inputs) {
      const result = await client.query(
        `
          INSERT INTO medical_observations (
            patient_id, report_id, observation_type, observation_key,
            value_text, value_number, value_json, unit,
            normal_range_text, report_interpretation, source_text,
            source_chunk_id, confidence, observed_at, hospital_name
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *;
        `,
        [
          input.patient_id,
          input.report_id,
          input.observation_type,
          input.observation_key,
          input.value_text || null,
          input.value_number || null,
          input.value_json ? JSON.stringify(input.value_json) : null,
          input.unit || null,
          input.normal_range_text || null,
          input.report_interpretation || null,
          input.source_text,
          input.source_chunk_id || null,
          input.confidence,
          input.observed_at || null,
          input.hospital_name || null
        ]
      );

      results.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Queries observations based on filter criteria
 */
export async function queryObservations(input: QueryObservationsInput): Promise<QueryObservationsResult> {
  await ensureDatabase();

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Build WHERE clause dynamically
  if (input.patient_id) {
    conditions.push(`patient_id = $${paramIndex}`);
    values.push(input.patient_id);
    paramIndex++;
  }

  if (input.report_id) {
    conditions.push(`report_id = $${paramIndex}`);
    values.push(input.report_id);
    paramIndex++;
  }

  if (input.observation_type) {
    conditions.push(`observation_type = $${paramIndex}`);
    values.push(input.observation_type);
    paramIndex++;
  }

  if (input.observation_key) {
    conditions.push(`observation_key = $${paramIndex}`);
    values.push(input.observation_key);
    paramIndex++;
  }

  if (input.observed_after) {
    conditions.push(`observed_at >= $${paramIndex}`);
    values.push(input.observed_after);
    paramIndex++;
  }

  if (input.observed_before) {
    conditions.push(`observed_at <= $${paramIndex}`);
    values.push(input.observed_before);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = input.limit || 100;
  const offset = input.offset || 0;

  // Get total count
  const countResult = await getPool().query(
    `SELECT COUNT(*) as total FROM medical_observations ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].total, 10);

  // Get observations
  const observationsResult = await getPool().query(
    `
      SELECT * FROM medical_observations
      ${whereClause}
      ORDER BY observed_at DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
    [...values, limit, offset]
  );

  return {
    observations: observationsResult.rows,
    total,
    limit,
    offset
  };
}

/**
 * Gets observations by patient ID
 */
export async function getObservationsByPatientId(patientId: number, limit: number = 100): Promise<MedicalObservation[]> {
  const result = await queryObservations({ patient_id: patientId, limit });
  return result.observations;
}

/**
 * Gets observations by report ID
 */
export async function getObservationsByReportId(reportId: number): Promise<MedicalObservation[]> {
  const result = await queryObservations({ report_id: reportId });
  return result.observations;
}

/**
 * Deletes observations by report ID
 */
export async function deleteObservationsByReportId(reportId: number): Promise<void> {
  await ensureDatabase();

  await getPool().query(
    `DELETE FROM medical_observations WHERE report_id = $1`,
    [reportId]
  );
}
