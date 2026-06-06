import { GoogleGenerativeAI } from "@google/generative-ai";
import { RiskAnalyzerInput, RiskAnalyzerOutput, SourceCitation } from './riskAnalyzer.types.js';
import { extractValuesFromText, assessRisks } from './riskRules.js';
import { generateRiskExplanationPrompt } from './riskAnalyzer.prompt.js';

// ============================================
// RiskAnalyzerAgent Class
// ============================================

/**
 * RiskAnalyzerAgent analyzes health risk signals from medical reports
 * using rule-based checks and explains results in beginner-friendly language
 */
export class RiskAnalyzerAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize Google Generative AI client
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  /**
   * Analyzes health risks from retrieved report chunks
   * 
   * @param input - Contains the question, retrieved chunks, and optional patient ID
   * @returns Risk analysis with answer, risks, sources, disclaimer, and confidence
   */
  async analyzeRisk(input: RiskAnalyzerInput): Promise<RiskAnalyzerOutput> {
    const { question, retrievedChunks, patientId } = input;

    console.log(`RiskAnalyzerAgent: Processing question: "${question}"`);
    console.log(`RiskAnalyzerAgent: Patient ID: ${patientId || 'not provided'}`);
    console.log(`RiskAnalyzerAgent: Retrieved ${retrievedChunks.length} chunks`);

    // If no chunks retrieved, return a message asking for reports
    if (retrievedChunks.length === 0) {
      return {
        answer: "I don't have any relevant information in the uploaded reports to analyze your health risks. Please upload medical reports first.",
        risks: [],
        sources: [],
        disclaimer: "Informational support only. This system does not diagnose, treat, or replace professional medical advice.",
        confidence: 0
      };
    }

    // Step 1: Extract health values from all chunks using regex
    const allExtractedValues: any[] = [];
    for (const chunk of retrievedChunks) {
      const extracted = extractValuesFromText(chunk.chunkText, chunk.chunkId);
      allExtractedValues.push(...extracted);
    }
    console.log(`RiskAnalyzerAgent: Extracted ${allExtractedValues.length} health values`);

    // Step 2: Apply rule-based risk assessment to extracted values
    const riskAssessments = assessRisks(allExtractedValues);
    console.log(`RiskAnalyzerAgent: Generated ${riskAssessments.length} risk assessments`);

    // If no values were extracted, provide a helpful message
    if (riskAssessments.length === 0) {
      return {
        answer: "I couldn't find specific health values (like blood pressure, cholesterol, or glucose) in your uploaded reports to analyze. Please upload reports that contain these measurements, or ask me to explain what's in your reports.",
        risks: [],
        sources: this.deduplicateSources(retrievedChunks),
        disclaimer: "Informational support only. This system does not diagnose, treat, or replace professional medical advice.",
        confidence: 0.3
      };
    }

    // Step 3: Generate explanation using Gemini with the risk assessment results
    const answer = await this.generateExplanation(question, riskAssessments);
    console.log(`RiskAnalyzerAgent: Generated explanation with ${answer.length} characters`);

    // Step 4: Deduplicate sources and limit to top 3
    const sources = this.deduplicateSources(retrievedChunks);
    console.log(`RiskAnalyzerAgent: Returning ${sources.length} unique sources`);

    // Step 5: Calculate confidence based on number of values found
    const confidence = this.calculateConfidence(riskAssessments.length);

    return {
      answer,
      risks: riskAssessments,
      sources,
      disclaimer: "Informational support only. This system does not diagnose, treat, or replace professional medical advice.",
      confidence
    };
  }

  /**
   * Generates a beginner-friendly explanation of risk assessment results using Gemini AI
   */
  private async generateExplanation(question: string, riskAssessments: any[]): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate prompt with risk assessment results
    const prompt = generateRiskExplanationPrompt(question, riskAssessments);

    console.log(`RiskAnalyzerAgent: Sending prompt to Gemini`);
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return answer;
  }

  /**
   * Deduplicates sources by chunkId and normalized text
   * Limits to top 3 unique sources
   */
  private deduplicateSources(chunks: any[]): SourceCitation[] {
    const seenChunkIds = new Set<number>();
    const seenNormalizedText = new Set<string>();
    const uniqueSources: SourceCitation[] = [];

    // Helper function to normalize text for comparison
    const normalizeText = (text: string): string => {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .substring(0, 200); // Compare only first 200 characters
    };

    for (const chunk of chunks) {
      // Skip if we've already seen this chunkId
      if (seenChunkIds.has(chunk.chunkId)) {
        console.log(`RiskAnalyzerAgent: Skipping duplicate chunkId ${chunk.chunkId}`);
        continue;
      }

      // Normalize the chunk text for comparison
      const normalizedText = normalizeText(chunk.chunkText);

      // Skip if we've already seen this normalized text (prevents similar chunks)
      if (seenNormalizedText.has(normalizedText)) {
        console.log(`RiskAnalyzerAgent: Skipping duplicate normalized text from chunkId ${chunk.chunkId}`);
        continue;
      }

      seenChunkIds.add(chunk.chunkId);
      seenNormalizedText.add(normalizedText);

      // Add to unique sources with text preview (150-250 characters)
      const previewLength = 200;
      const textPreview = chunk.chunkText.substring(0, previewLength) + 
                          (chunk.chunkText.length > previewLength ? '...' : '');

      uniqueSources.push({
        chunkId: chunk.chunkId,
        reportId: chunk.reportId,
        fileName: chunk.originalName,
        textPreview: textPreview,
        similarity: chunk.similarity
      });

      // Limit to top 3 unique sources
      if (uniqueSources.length >= 3) {
        break;
      }
    }

    return uniqueSources;
  }

  /**
   * Calculates confidence score based on number of risk assessments found
   */
  private calculateConfidence(assessmentCount: number): number {
    // Base confidence is 0.6 for 1 assessment
    // Increase confidence for more assessments
    const baseConfidence = 0.6;
    const bonusPerAssessment = 0.1;
    
    const confidence = Math.min(baseConfidence + (assessmentCount * bonusPerAssessment), 0.95);

    return confidence;
  }
}
