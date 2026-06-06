import { ObservationExtractorAgent } from '../agents/observation-extractor/ObservationExtractorAgent.js';
import { ExtractedObservation } from '../agents/observation-extractor/observationExtractor.types.js';
import { createObservationsBatch, getObservationsByPatientId, getObservationsByReportId, deleteObservationsByReportId } from './observations.repository.js';
import { CreateObservationInput, MedicalObservation } from './observations.types.js';

// ============================================
// Observations Service
// ============================================

/**
 * Service layer for managing medical observations
 * Handles business logic between agent and repository
 */

/**
 * Extracts observations from a report and saves them to the database
 */
export async function extractAndSaveObservations(params: {
  reportText: string;
  reportId: number;
  patientId: number;
  hospitalName?: string;
  reportDate?: string;
}): Promise<{ observations: MedicalObservation[]; summary: any }> {
  const { reportText, reportId, patientId, hospitalName, reportDate } = params;

  console.log(`ObservationsService: Extracting observations for report ${reportId}`);

  // Step 1: Use ObservationExtractorAgent to extract observations
  const agent = new ObservationExtractorAgent();
  const extractionResult = await agent.extractObservations({
    reportText,
    reportId,
    patientId,
    hospitalName,
    reportDate
  });

  console.log(`ObservationsService: Extracted ${extractionResult.observations.length} observations`);

  // Step 2: Convert extracted observations to database format
  const createInputs: CreateObservationInput[] = extractionResult.observations.map(obs => ({
    patient_id: patientId,
    report_id: reportId,
    observation_type: obs.observationType,
    observation_key: obs.observationKey,
    value_text: obs.valueText,
    value_number: obs.valueNumber,
    value_json: obs.valueJson,
    unit: obs.unit,
    normal_range_text: obs.normalRangeText,
    report_interpretation: obs.reportInterpretation,
    source_text: obs.sourceText,
    source_chunk_id: obs.sourceChunkId,
    confidence: obs.confidence,
    observed_at: obs.observedAt ? new Date(obs.observedAt) : undefined,
    hospital_name: obs.hospitalName
  }));

  // Step 3: Save observations to database in batch
  const savedObservations = await createObservationsBatch(createInputs);
  console.log(`ObservationsService: Saved ${savedObservations.length} observations to database`);

  return {
    observations: savedObservations,
    summary: extractionResult.extractionSummary
  };
}

/**
 * Gets all observations for a patient
 */
export async function getPatientObservations(patientId: number, limit: number = 100): Promise<MedicalObservation[]> {
  console.log(`ObservationsService: Getting observations for patient ${patientId}`);
  return await getObservationsByPatientId(patientId, limit);
}

/**
 * Gets all observations for a specific report
 */
export async function getReportObservations(reportId: number): Promise<MedicalObservation[]> {
  console.log(`ObservationsService: Getting observations for report ${reportId}`);
  return await getObservationsByReportId(reportId);
}

/**
 * Deletes all observations for a report (used when report is deleted)
 */
export async function deleteReportObservations(reportId: number): Promise<void> {
  console.log(`ObservationsService: Deleting observations for report ${reportId}`);
  await deleteObservationsByReportId(reportId);
}
