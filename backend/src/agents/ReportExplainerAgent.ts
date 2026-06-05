import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================
// TypeScript Interfaces
// ============================================

/**
 * Represents a retrieved chunk from a medical report
 */
export interface RetrievedChunk {
  chunkId: number;
  reportId: number;
  chunkText: string;
  chunkIndex: number;
  originalName: string;
  similarity: number;
}

/**
 * Represents a source citation for the answer
 */
export interface SourceCitation {
  chunkId: number;
  reportId: number;
  fileName: string;
  textPreview: string;
  similarity: number;
}

/**
 * Input for the ReportExplainerAgent
 */
export interface ReportExplainerInput {
  question: string;
  retrievedChunks: RetrievedChunk[];
  patientId?: string;
}

/**
 * Result from the ReportExplainerAgent
 */
export interface ReportExplainerResult {
  answer: string;
  sources: SourceCitation[];
}

// ============================================
// ReportExplainerAgent Class
// ============================================

/**
 * Agent that explains medical reports in simple, safe language
 * using retrieved PDF context from RAG (Retrieval-Augmented Generation)
 */
export class ReportExplainerAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Initialize Google Generative AI client
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  /**
   * Explains a medical report based on the user's question and retrieved chunks
   * 
   * @param input - Contains the question, retrieved chunks, and optional patient ID
   * @returns The explanation with source citations
   */
  async explainReport(input: ReportExplainerInput): Promise<ReportExplainerResult> {
    const { question, retrievedChunks, patientId } = input;

    console.log(`ReportExplainerAgent: Processing question: "${question}"`);
    console.log(`ReportExplainerAgent: Patient ID: ${patientId || 'not provided'}`);
    console.log(`ReportExplainerAgent: Retrieved ${retrievedChunks.length} chunks`);

    // If no chunks retrieved, return a message asking for reports
    if (retrievedChunks.length === 0) {
      return {
        answer: "I don't have any relevant information in the uploaded reports to answer your question. Please upload medical reports first.",
        sources: []
      };
    }

    // Step 1: Build context from retrieved chunks
    const context = this.buildContext(retrievedChunks);
    console.log(`ReportExplainerAgent: Built context with ${context.length} characters`);

    // Step 2: Generate explanation using the medical prompt
    const answer = await this.generateExplanation(question, context);
    console.log(`ReportExplainerAgent: Generated explanation with ${answer.length} characters`);

    // Step 3: Deduplicate sources and limit to top 3
    const sources = this.deduplicateSources(retrievedChunks);
    console.log(`ReportExplainerAgent: Returning ${sources.length} unique sources`);

    return {
      answer,
      sources
    };
  }

  /**
   * Builds context string from retrieved chunks for the AI prompt
   */
  private buildContext(chunks: RetrievedChunk[]): string {
    return chunks
      .map((chunk, index) => `[Document ${index + 1} - ${chunk.originalName}]:\n${chunk.chunkText}`)
      .join("\n\n");
  }

  /**
   * Generates a safe medical explanation using Gemini AI
   */
  private async generateExplanation(question: string, context: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Medical explanation prompt with safety rules
    const prompt = `You are a helpful medical assistant. Use the following context from medical reports to answer the user's question.

IMPORTANT RULES:
- Use ONLY the provided report context. Do not use outside information.
- Explain in simple, beginner-friendly language that anyone can understand.
- Do NOT diagnose medical conditions.
- Do NOT prescribe medications or recommend treatments.
- Do NOT invent information that is not in the context.
- If the answer is not in the context, say so clearly.
- Tell the user to discuss important findings with a qualified clinician.
- Always include: "This is informational and not medical advice."

Context:
${context}

Question: ${question}

Answer:`;

    console.log(`ReportExplainerAgent: Sending prompt to Gemini`);
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return answer;
  }

  /**
   * Deduplicates sources by chunkId and normalized text
   * Limits to top 3 unique sources
   */
  private deduplicateSources(chunks: RetrievedChunk[]): SourceCitation[] {
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
        console.log(`ReportExplainerAgent: Skipping duplicate chunkId ${chunk.chunkId}`);
        continue;
      }

      // Normalize the chunk text for comparison
      const normalizedText = normalizeText(chunk.chunkText);

      // Skip if we've already seen this normalized text (prevents similar chunks)
      if (seenNormalizedText.has(normalizedText)) {
        console.log(`ReportExplainerAgent: Skipping duplicate normalized text from chunkId ${chunk.chunkId}`);
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
}
