/**
 * ConflictDetectorAgent
 *
 * Compares medical observations stored from multiple uploaded reports
 * and detects conflicting or significantly different values for the same patient.
 *
 * Flow:
 *   1. Determine which observation keys to check (from question or input)
 *   2. Query medical_observations grouped by key (all history for patient)
 *   3. For each key, compare the earliest and latest observation using rules
 *   4. Build conflict list
 *   5. Use Gemini to explain conflicts in plain language
 *   6. Save conflicts to observation_conflicts table
 *   7. Return structured output with answer, conflicts, sources, confidence
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ConflictDetectorInput,
  ConflictDetectorOutput,
  DetectedConflict,
  ConflictSource,
} from './conflictDetector.types.js';
import { CONFLICT_EXPLANATION_PROMPT } from './conflictDetector.prompt.js';
import {
  detectConflictObservationKeys,
  formatConflictSummary,
  createConflictSources,
} from './conflictDetector.utils.js';
import {
  detectBloodPressureConflict,
  detectNumericConflict,
  detectMedicationDifference,
  CONFLICT_THRESHOLDS,
} from './conflictDetector.rules.js';
import { getObservationsGroupedByKey } from '../../observations/observations.repository.js';
import { getPool } from '../../../shared/database/pool.js';
import { ensureDatabase } from '../../../shared/database/init.js';

const DISCLAIMER =
  'This is informational and not medical advice. Please discuss any differences found with a qualified clinician.';

export class ConflictDetectorAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // ============================================
  // Main entry point
  // ============================================

  async detectConflicts(input: ConflictDetectorInput): Promise<ConflictDetectorOutput> {
    console.log(`ConflictDetectorAgent: Starting for patient ${input.patientId}`);
    console.log(`ConflictDetectorAgent: Question: "${input.question}"`);

    // Step 1: Determine observation keys to check
    const keys = input.observationKeys ?? detectConflictObservationKeys(input.question);
    console.log(`ConflictDetectorAgent: Checking keys: ${keys.join(', ')}`);

    // Step 2: Load all observations grouped by key
    const grouped = await getObservationsGroupedByKey(input.patientId, keys);
    console.log(`ConflictDetectorAgent: Loaded ${grouped.size} observation groups`);

    if (grouped.size === 0) {
      return this.createNoDataResponse();
    }

    // Step 3: Collect all observations for sources
    const allObservations: any[] = [];
    for (const obsList of grouped.values()) {
      allObservations.push(...obsList);
    }

    // Step 4: Run conflict rules for each key
    const conflicts = this.runConflictRules(grouped);
    console.log(`ConflictDetectorAgent: Detected ${conflicts.length} conflicts`);

    // Step 5: Build sources
    const sources = createConflictSources(allObservations);

    // Step 6: Generate explanation using Gemini
    const answer = await this.generateExplanation(input.question, conflicts);

    // Step 7: Calculate confidence
    const confidence = this.calculateConfidence(conflicts, grouped.size);

    // Step 8: Save conflicts to database (best-effort, do not fail if DB save fails)
    try {
      await this.saveConflicts(input.patientId, conflicts);
    } catch (err) {
      console.warn('ConflictDetectorAgent: Could not save conflicts to DB:', err);
    }

    return {
      ok: true,
      answer,
      conflicts,
      sources,
      confidence,
      disclaimer: DISCLAIMER,
      selectedAgent: 'conflict_detector',
    };
  }

  // ============================================
  // Rule engine
  // ============================================

  /**
   * Runs conflict detection rules for each observation key.
   * Compares the earliest observation (previous) to the latest observation.
   */
  private runConflictRules(grouped: Map<string, any[]>): DetectedConflict[] {
    const conflicts: DetectedConflict[] = [];

    for (const [key, obsList] of grouped) {
      // Need at least 2 observations to detect a conflict
      if (obsList.length < 2) {
        console.log(`ConflictDetectorAgent: Skipping ${key} — only ${obsList.length} observation(s)`);
        continue;
      }

      // obsList is already sorted ASC by observed_at (from repository)
      const previous = obsList[0]; // oldest
      const latest = obsList[obsList.length - 1]; // newest

      let conflict: DetectedConflict | null = null;

      if (key === 'blood_pressure') {
        conflict = detectBloodPressureConflict(previous, latest);
      } else if (key === 'medication') {
        conflict = detectMedicationDifference(previous, latest);
      } else if (CONFLICT_THRESHOLDS[key] !== undefined) {
        conflict = detectNumericConflict(previous, latest, key);
      }

      if (conflict) {
        console.log(`ConflictDetectorAgent: Conflict found for ${key} — severity: ${conflict.severity}`);
        conflicts.push(conflict);
      }
    }

    // Sort by severity (high first)
    const severityOrder = { high: 0, medium: 1, low: 2 };
    conflicts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return conflicts;
  }

  // ============================================
  // Gemini explanation
  // ============================================

  private async generateExplanation(
    question: string,
    conflicts: DetectedConflict[]
  ): Promise<string> {
    if (conflicts.length === 0) {
      return (
        'No significant differences or conflicts were found across your uploaded reports ' +
        'for the data that was available. If you believe there should be differences, make sure ' +
        'multiple reports have been uploaded. ' + DISCLAIMER
      );
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const conflictsSummary = formatConflictSummary(conflicts);
      const prompt = CONFLICT_EXPLANATION_PROMPT(question, conflictsSummary);

      console.log('ConflictDetectorAgent: Sending conflicts to Gemini for explanation');
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.warn('ConflictDetectorAgent: Gemini API error, using fallback explanation:', error);
      
      // Fallback explanation when Gemini is unavailable
      const conflictList = conflicts.map(c => 
        `${c.observationKey}: ${c.previousValue} vs ${c.latestValue} (${c.severity} severity)`
      ).join(', ');
      
      return (
        `I found ${conflicts.length} conflict(s) across your reports: ${conflictList}. ` +
        `Due to high demand on the AI service, I cannot provide a detailed explanation right now. ` +
        `Please try again later for a more detailed explanation. ` +
        `Discuss these differences with a qualified clinician. ` + DISCLAIMER
      );
    }
  }

  // ============================================
  // Confidence calculation
  // ============================================

  private calculateConfidence(conflicts: DetectedConflict[], totalKeys: number): number {
    // Base: 0.7 if we found any observations at all
    if (totalKeys === 0) return 0;

    if (conflicts.length === 0) {
      // We ran rules but found no conflicts — reasonably confident
      return 0.75;
    }

    // More high-severity conflicts → slightly higher confidence in the detection
    const highCount = conflicts.filter(c => c.severity === 'high').length;
    const medCount = conflicts.filter(c => c.severity === 'medium').length;

    const base = 0.7;
    const bonus = Math.min((highCount * 0.1 + medCount * 0.05), 0.2);
    return Math.min(base + bonus, 0.95);
  }

  // ============================================
  // No-data response
  // ============================================

  private createNoDataResponse(): ConflictDetectorOutput {
    return {
      ok: true,
      answer:
        'No medical observations were found for this patient. ' +
        'Please upload at least two medical reports first so conflicts can be detected. ' +
        DISCLAIMER,
      conflicts: [],
      sources: [],
      confidence: 0,
      disclaimer: DISCLAIMER,
      selectedAgent: 'conflict_detector',
    };
  }

  // ============================================
  // Persist conflicts to DB
  // ============================================

  /**
   * Saves detected conflicts to the observation_conflicts table.
   * This is best-effort — failures are caught and logged, not re-thrown.
   */
  private async saveConflicts(patientId: number, conflicts: DetectedConflict[]): Promise<void> {
    if (conflicts.length === 0) return;

    await ensureDatabase();
    const pool = getPool();

    for (const c of conflicts) {
      await pool.query(
        `
        INSERT INTO observation_conflicts (
          patient_id, observation_key, conflict_type, severity,
          observation_1_id, observation_2_id,
          report_1_id, report_2_id,
          value_1_text, value_2_text,
          difference, explanation
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT DO NOTHING
        `,
        [
          patientId,
          c.observationKey,
          c.conflictType,
          c.severity,
          null, // observation_1_id — could be stored if we track IDs in DetectedConflict
          null, // observation_2_id
          c.report1Id ?? null,
          c.report2Id ?? null,
          c.previousValue,
          c.latestValue,
          c.difference ?? null,
          c.explanation,
        ]
      );
    }

    console.log(`ConflictDetectorAgent: Saved ${conflicts.length} conflict(s) to DB`);
  }
}
