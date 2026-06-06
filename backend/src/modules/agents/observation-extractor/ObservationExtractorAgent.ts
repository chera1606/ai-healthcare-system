import { GoogleGenerativeAI } from "@google/generative-ai";
import { ObservationExtractorInput, ObservationExtractorOutput, ExtractedObservation } from './observationExtractor.types.js';
import { extractAllWithRegex } from './observationExtractor.utils.js';
import { generateExtractionPrompt } from './observationExtractor.prompt.js';

// ============================================
// ObservationExtractorAgent Class
// ============================================

/**
 * ObservationExtractorAgent extracts structured medical observations from medical reports
 * using a hybrid approach: regex for clear values, Gemini for complex fields
 */
export class ObservationExtractorAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize Google Generative AI client
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  /**
   * Extracts structured medical observations from report text
   * 
   * @param input - Contains report text, report ID, patient ID, and metadata
   * @returns Extracted observations and summary
   */
  async extractObservations(input: ObservationExtractorInput): Promise<ObservationExtractorOutput> {
    const { reportText, reportId, patientId, hospitalName, reportDate } = input;

    console.log(`ObservationExtractorAgent: Extracting observations from report ${reportId}`);
    console.log(`ObservationExtractorAgent: Patient ID: ${patientId}`);
    console.log(`ObservationExtractorAgent: Hospital: ${hospitalName || 'not specified'}`);

    // Step 1: Extract observations using regex (for clear, structured values)
    const regexObservations = this.extractWithRegex(reportText);
    console.log(`ObservationExtractorAgent: Extracted ${regexObservations.length} observations via regex`);

    // Extract hospital name from regex results if not provided
    const extractedHospital = regexObservations.find(obs => obs.observationKey === 'hospital')?.valueText;
    const finalHospitalName = hospitalName || extractedHospital;
    console.log(`ObservationExtractorAgent: Final hospital name: ${finalHospitalName || 'not specified'}`);

    // Step 2: Extract observations using Gemini (for complex fields like medications, assessments)
    const geminiObservations = await this.extractWithGemini(reportText);
    console.log(`ObservationExtractorAgent: Extracted ${geminiObservations.length} observations via Gemini`);

    // Step 3: Merge observations, removing duplicates
    const allObservations = this.mergeObservations(regexObservations, geminiObservations);
    console.log(`ObservationExtractorAgent: Total unique observations: ${allObservations.length}`);

    // Step 4: Add metadata to each observation
    const enrichedObservations = allObservations.map(obs => ({
      ...obs,
      hospitalName: finalHospitalName,
      observedAt: reportDate || this.extractDateFromText(reportText)
    }));

    // Step 5: Generate summary
    const summary = this.generateSummary(enrichedObservations);

    return {
      observations: enrichedObservations,
      extractionSummary: summary
    };
  }

  /**
   * Extracts observations using regex patterns (for clear, structured values)
   */
  private extractWithRegex(reportText: string): ExtractedObservation[] {
    const regexResults = extractAllWithRegex(reportText);
    
    return regexResults.map(result => ({
      observationType: result.observationType,
      observationKey: result.observationKey,
      valueText: result.valueText,
      valueNumber: result.valueNumber,
      valueJson: result.valueJson,
      unit: result.unit,
      sourceText: result.sourceText,
      confidence: result.confidence
    }));
  }

  /**
   * Extracts observations using Gemini AI (for complex fields)
   */
  private async extractWithGemini(reportText: string): Promise<ExtractedObservation[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = generateExtractionPrompt(reportText);

      console.log(`ObservationExtractorAgent: Sending extraction prompt to Gemini`);
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Parse JSON response from Gemini
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (!jsonMatch) {
        console.error(`ObservationExtractorAgent: Failed to parse Gemini response`);
        return [];
      }

      const jsonString = jsonMatch[1];
      const geminiData = JSON.parse(jsonString);

      // Convert Gemini data to ExtractedObservation format
      return geminiData.map((item: any) => ({
        observationType: item.observationType,
        observationKey: item.observationKey,
        valueText: item.valueText,
        valueNumber: item.valueNumber,
        valueJson: item.valueJson,
        unit: item.unit,
        sourceText: item.sourceText,
        confidence: item.confidence || 0.80
      }));
    } catch (error) {
      console.error(`ObservationExtractorAgent: Gemini extraction failed:`, error);
      return [];
    }
  }

  /**
   * Merges observations from regex and Gemini, removing duplicates
   */
  private mergeObservations(regexObs: ExtractedObservation[], geminiObs: ExtractedObservation[]): ExtractedObservation[] {
    const merged: ExtractedObservation[] = [];
    const seenKeys = new Set<string>();

    // Add regex observations first (higher confidence)
    for (const obs of regexObs) {
      const key = `${obs.observationType}-${obs.observationKey}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        merged.push(obs);
      }
    }

    // Add Gemini observations for keys not already seen
    for (const obs of geminiObs) {
      const key = `${obs.observationType}-${obs.observationKey}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        merged.push(obs);
      }
    }

    return merged;
  }

  /**
   * Extracts date from report text using simple heuristics
   */
  private extractDateFromText(reportText: string): string | undefined {
    // Try to find a date in common formats
    const datePatterns = [
      /(\d{4}-\d{2}-\d{2})/, // YYYY-MM-DD
      /(\d{1,2}\/\d{1,2}\/\d{4})/, // MM/DD/YYYY
      /([A-Za-z]+ \d{1,2}, \d{4})/ // June 1, 2026
    ];

    for (const pattern of datePatterns) {
      const match = reportText.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return undefined;
  }

  /**
   * Generates extraction summary
   */
  private generateSummary(observations: ExtractedObservation[]) {
    const byType: Record<string, number> = {};
    let totalConfidence = 0;

    for (const obs of observations) {
      byType[obs.observationType] = (byType[obs.observationType] || 0) + 1;
      totalConfidence += obs.confidence;
    }

    return {
      totalExtracted: observations.length,
      byType,
      averageConfidence: observations.length > 0 ? totalConfidence / observations.length : 0
    };
  }
}
