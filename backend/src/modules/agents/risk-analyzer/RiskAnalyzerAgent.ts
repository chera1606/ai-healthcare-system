import { GoogleGenerativeAI } from "@google/generative-ai";
import { RiskAnalyzerInput, RiskAnalyzerOutput, RiskAssessment, ObservationSource, ChunkSource, RiskLevel } from './riskAnalyzer.types.js';
import { 
  getLatestObservationByKey, 
  getObservationsByKeys, 
  getLatestObservationsForPatient 
} from '../../observations/observations.repository.js';

// ============================================
// RiskAnalyzerAgent Class
// ============================================

/**
 * RiskAnalyzerAgent analyzes health risk signals from medical observations
 * using rule-based checks and explains results in beginner-friendly language
 */
export class RiskAnalyzerAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize Google Generative AI client
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  /**
   * Analyzes health risks from medical observations (primary) or chunks (fallback)
   * 
   * @param input - Contains the question, patientId, reportId, and optional retrievedChunks
   * @returns Risk analysis with reply, risks, sources, disclaimer, and confidence
   */
  async analyzeRisk(input: RiskAnalyzerInput): Promise<RiskAnalyzerOutput> {
    const { question, patientId, reportId, retrievedChunks } = input;

    console.log(`RiskAnalyzerAgent: Processing question: "${question}"`);
    console.log(`RiskAnalyzerAgent: Patient ID: ${patientId || 'not provided'}`);
    console.log(`RiskAnalyzerAgent: Report ID: ${reportId || 'not provided'}`);

    // TODO: Replace hardcoded patientId with authenticated user/patient ID
    const effectivePatientId = patientId || 1;

    // Step 1: Understand what the user is asking and determine relevant observation keys
    const relevantKeys = this.determineRelevantKeys(question);
    console.log(`RiskAnalyzerAgent: Relevant observation keys: ${relevantKeys.join(', ')}`);

    // Step 2: Query medical_observations for those keys
    let observations: any[] = [];
    let usedObservations = false;

    if (effectivePatientId) {
      try {
        observations = await getObservationsByKeys(effectivePatientId, relevantKeys);
        console.log(`RiskAnalyzerAgent: Found ${observations.length} observations from database`);
        usedObservations = observations.length > 0;
      } catch (error) {
        console.error(`RiskAnalyzerAgent: Error querying observations:`, error);
      }
    }

    // Step 3: If observations exist, use them; otherwise fallback to chunks
    let riskAssessments: RiskAssessment[] = [];
    let sources: Array<ObservationSource | ChunkSource> = [];

    if (usedObservations) {
      // Use stored observations
      console.log(`RiskAnalyzerAgent: Using stored observations for risk analysis`);
      riskAssessments = this.assessRisksFromObservations(observations);
      sources = this.createSourcesFromObservations(observations);
    } else if (retrievedChunks && retrievedChunks.length > 0) {
      // Fallback to chunk-based extraction
      console.log(`RiskAnalyzerAgent: Falling back to chunk-based extraction`);
      console.log(`RiskAnalyzerAgent: Retrieved ${retrievedChunks.length} chunks`);
      riskAssessments = this.assessRisksFromChunks(retrievedChunks, relevantKeys);
      sources = this.createSourcesFromChunks(retrievedChunks);
    } else {
      // No data available
      return {
        ok: true,
        selectedAgent: "risk_analyzer",
        reply: "I don't have any relevant medical observations or report data to analyze your health risks. Please upload medical reports first.",
        risks: [],
        sources: [],
        confidence: 0,
        disclaimer: "This is informational and not medical advice."
      };
    }

    // Step 4: If no risks were assessed, provide a helpful message
    if (riskAssessments.length === 0) {
      return {
        ok: true,
        selectedAgent: "risk_analyzer",
        reply: "I couldn't find specific health values (like blood pressure, cholesterol, or glucose) in your medical data to analyze. Please upload reports that contain these measurements.",
        risks: [],
        sources,
        confidence: 0.3,
        disclaimer: "This is informational and not medical advice."
      };
    }

    // Step 5: Generate explanation using Gemini with the risk assessment results
    const reply = await this.generateExplanation(question, riskAssessments);
    console.log(`RiskAnalyzerAgent: Generated explanation with ${reply.length} characters`);

    // Step 6: Calculate confidence based on number of risks found
    const confidence = this.calculateConfidence(riskAssessments.length);

    return {
      ok: true,
      selectedAgent: "risk_analyzer",
      reply,
      risks: riskAssessments,
      sources,
      confidence,
      disclaimer: "This is informational and not medical advice."
    };
  }

  /**
   * Determines relevant observation keys based on the user's question
   */
  private determineRelevantKeys(question: string): string[] {
    const lowerQuestion = question.toLowerCase();
    const keys: string[] = [];

    if (lowerQuestion.includes('blood pressure') || lowerQuestion.includes('bp')) {
      keys.push('blood_pressure');
    }
    if (lowerQuestion.includes('cholesterol') || lowerQuestion.includes('ldl') || lowerQuestion.includes('hdl')) {
      keys.push('total_cholesterol', 'ldl_cholesterol', 'hdl_cholesterol');
    }
    if (lowerQuestion.includes('glucose') || lowerQuestion.includes('sugar') || lowerQuestion.includes('diabetes')) {
      keys.push('fasting_glucose', 'hba1c');
    }
    if (lowerQuestion.includes('hemoglobin') || lowerQuestion.includes('anemia')) {
      keys.push('hemoglobin');
    }
    if (lowerQuestion.includes('risk') || lowerQuestion.includes('health') || lowerQuestion.includes('overall')) {
      // General risk question - use all relevant keys
      keys.push('blood_pressure', 'total_cholesterol', 'ldl_cholesterol', 'hdl_cholesterol', 'fasting_glucose', 'hba1c', 'hemoglobin');
    }

    return keys;
  }

  /**
   * Extracts numeric value from observation with fallback parsing
   * Priority: value_number → value_text → source_text
   */
  private getNumericObservationValue(observation: any): number | null {
    // 1. Prefer value_number if valid
    if (observation.value_number !== null && observation.value_number !== undefined && !isNaN(observation.value_number)) {
      return observation.value_number;
    }

    // 2. Parse from value_text
    if (observation.value_text) {
      const match = observation.value_text.match(/(\d+\.?\d*)/);
      if (match) {
        const parsed = parseFloat(match[1]);
        if (!isNaN(parsed)) return parsed;
      }
    }

    // 3. Parse from source_text
    if (observation.source_text) {
      const match = observation.source_text.match(/(\d+\.?\d*)/);
      if (match) {
        const parsed = parseFloat(match[1]);
        if (!isNaN(parsed)) return parsed;
      }
    }

    // 4. Return null if no numeric value found
    return null;
  }

  /**
   * Assesses risks from stored medical observations using deterministic rules
   */
  private assessRisksFromObservations(observations: any[]): RiskAssessment[] {
    const assessments: RiskAssessment[] = [];

    for (const obs of observations) {
      // Log full observation data for debugging fasting_glucose
      if (obs.observation_key === 'fasting_glucose') {
        console.log(`RiskAnalyzerAgent: FASTING_GLUCOSE OBSERVATION DEBUG:`);
        console.log(`  id: ${obs.id}`);
        console.log(`  observation_key: ${obs.observation_key}`);
        console.log(`  value_text: ${obs.value_text}`);
        console.log(`  value_number: ${obs.value_number}`);
        console.log(`  value_json: ${obs.value_json}`);
        console.log(`  unit: ${obs.unit}`);
        console.log(`  source_text: ${obs.source_text}`);
        console.log(`  confidence: ${obs.confidence}`);
      }

      const riskLevel = this.calculateRiskLevel(obs.observation_key, obs);
      
      // Log the observation for debugging
      console.log(`RiskAnalyzerAgent: Assessing ${obs.observation_key}: valueText=${obs.value_text}, valueNumber=${obs.value_number}, riskLevel=${riskLevel}`);
      
      assessments.push({
        observationKey: obs.observation_key,
        valueText: obs.value_text,
        valueJson: obs.value_json ? JSON.parse(obs.value_json) : undefined,
        valueNumber: obs.value_number,
        unit: obs.unit,
        riskLevel,
        ruleApplied: this.getRuleApplied(obs.observation_key, riskLevel),
        sourceText: obs.source_text,
        reportId: obs.report_id,
        observedAt: obs.observed_at,
        confidence: obs.confidence
      });
    }

    return assessments;
  }

  /**
   * Assesses risks from chunks using extraction (fallback)
   */
  private assessRisksFromChunks(chunks: any[], relevantKeys: string[]): RiskAssessment[] {
    // This is a simplified fallback - in production, you'd want to extract values from chunks
    // For now, return empty to indicate this needs implementation
    console.log(`RiskAnalyzerAgent: Chunk-based extraction not fully implemented yet`);
    return [];
  }

  /**
   * Calculates risk level using deterministic rules
   */
  private calculateRiskLevel(observationKey: string, observation: any): RiskLevel {
    const valueNumber = this.getNumericObservationValue(observation);
    const valueJson = observation.value_json ? JSON.parse(observation.value_json) : null;

    // Debug logging for fasting glucose
    if (observationKey === 'fasting_glucose') {
      console.log(`RiskAnalyzerAgent: FASTING_GLUCOSE RISK CALCULATION:`);
      console.log(`  Parsed numeric value: ${valueNumber}`);
    }

    switch (observationKey) {
      case 'blood_pressure':
        if (valueJson && valueJson.systolic && valueJson.diastolic) {
          if (valueJson.systolic >= 180 || valueJson.diastolic >= 120) return 'critical';
          if (valueJson.systolic >= 140 || valueJson.diastolic >= 90) return 'high';
          if (valueJson.systolic >= 130 || valueJson.diastolic >= 80) return 'elevated';
        }
        return 'normal';

      case 'ldl_cholesterol':
        if (valueNumber !== null) {
          if (valueNumber >= 190) return 'very_high';
          if (valueNumber >= 160) return 'high';
          if (valueNumber >= 130) return 'borderline_high';
        }
        return 'normal';

      case 'total_cholesterol':
        if (valueNumber !== null) {
          if (valueNumber >= 240) return 'high';
          if (valueNumber >= 200) return 'borderline_high';
        }
        return 'normal';

      case 'fasting_glucose':
        if (valueNumber !== null) {
          if (valueNumber >= 126) {
            console.log(`RiskAnalyzerAgent: Fasting glucose ${valueNumber} >= 126 → high`);
            return 'high';
          }
          if (valueNumber >= 100) {
            console.log(`RiskAnalyzerAgent: Fasting glucose ${valueNumber} >= 100 → borderline_high`);
            return 'borderline_high';
          }
          console.log(`RiskAnalyzerAgent: Fasting glucose ${valueNumber} < 100 → normal`);
          return 'normal';
        }
        console.log(`RiskAnalyzerAgent: Fasting glucose value is null → unknown`);
        return 'unknown';

      case 'hba1c':
        if (valueNumber !== null) {
          if (valueNumber >= 6.5) return 'high';
          if (valueNumber >= 5.7) return 'borderline_high';
        }
        return 'normal';

      case 'hemoglobin':
        if (valueNumber !== null) {
          if (valueNumber >= 12 && valueNumber <= 17) return 'normal';
          return 'abnormal';
        }
        return 'normal';

      default:
        return 'normal';
    }
  }

  /**
   * Gets the rule applied description
   */
  private getRuleApplied(observationKey: string, riskLevel: RiskLevel): string {
    return `Deterministic rule for ${observationKey}: ${riskLevel}`;
  }

  /**
   * Creates source citations from observations
   */
  private createSourcesFromObservations(observations: any[]): ObservationSource[] {
    const sources: ObservationSource[] = [];
    const seenNormalizedText = new Set<string>();

    for (const obs of observations) {
      // Use normalized source text for deduplication to avoid duplicates
      const normalizedText = obs.source_text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
      
      // Deduplicate by normalized text only
      if (seenNormalizedText.has(normalizedText)) continue;
      seenNormalizedText.add(normalizedText);

      sources.push({
        sourceType: 'observation',
        reportId: obs.report_id,
        observationKey: obs.observation_key,
        textPreview: obs.source_text.substring(0, 200) + (obs.source_text.length > 200 ? '...' : ''),
        observedAt: obs.observed_at,
        confidence: obs.confidence
      });
    }

    return sources;
  }

  /**
   * Creates source citations from chunks (fallback)
   */
  private createSourcesFromChunks(chunks: any[]): ChunkSource[] {
    const sources: ChunkSource[] = [];
    const seenChunkIds = new Set<number>();

    for (const chunk of chunks) {
      if (seenChunkIds.has(chunk.chunkId)) continue;
      seenChunkIds.add(chunk.chunkId);

      const previewLength = 200;
      const textPreview = chunk.chunkText.substring(0, previewLength) + 
                          (chunk.chunkText.length > previewLength ? '...' : '');

      sources.push({
        sourceType: 'chunk',
        chunkId: chunk.chunkId,
        reportId: chunk.reportId,
        fileName: chunk.originalName,
        textPreview,
        similarity: chunk.similarity
      });

      if (sources.length >= 3) break;
    }

    return sources;
  }

  /**
   * Generates a beginner-friendly explanation of risk assessment results using Gemini AI
   */
  private async generateExplanation(question: string, riskAssessments: RiskAssessment[]): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build deterministic summary string for each assessment
    const deterministicSummaries = riskAssessments.map(r => 
      `${r.observationKey} was ${r.valueText} ${r.unit || ''}. Deterministic risk level: ${r.riskLevel}.`
    ).join('\n');

    // Build a simple explanation prompt
    const prompt = `
You are a health information assistant. Explain the following risk assessment results in simple, beginner-friendly language.

User question: "${question}"

DETERMINISTIC SUMMARY (you must repeat these exact values and risk levels):
${deterministicSummaries}

CRITICAL INSTRUCTIONS:
- You MUST repeat the provided exact values from the deterministic summary
- You MUST repeat the provided deterministic risk levels (do NOT change high to normal, etc.)
- Do NOT say a value is missing if it's shown in the deterministic summary
- Do NOT change the risk level that was calculated by deterministic rules
- Explain what the values mean in simple terms
- Explain the risk level (normal, elevated, high, etc.) based on the deterministic rule
- Do NOT diagnose or provide medical advice
- Recommend discussing with a qualified clinician
- Keep it concise and easy to understand
- This is informational only, not medical advice

Example format:
"Your [observation] was [value] [unit]. Based on the rule used by this app, this falls in the [risk level] range. Please discuss this with a qualified clinician. This is informational and not medical advice."

Provide a clear, helpful explanation:
`;

    console.log(`RiskAnalyzerAgent: Sending prompt to Gemini`);
    console.log(`RiskAnalyzerAgent: Deterministic summary: ${deterministicSummaries}`);
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return reply;
  }

  /**
   * Calculates confidence score based on number of risk assessments found
   */
  private calculateConfidence(assessmentCount: number): number {
    const baseConfidence = 0.6;
    const bonusPerAssessment = 0.1;
    return Math.min(baseConfidence + (assessmentCount * bonusPerAssessment), 0.95);
  }
}
