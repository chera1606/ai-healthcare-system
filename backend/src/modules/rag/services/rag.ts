import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateEmbedding } from "./embeddings.js";
import { searchSimilarReports } from "../repositories/search.repository.js";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }
  return genAI;
}

export async function generateRAGAnswer(question: string): Promise<{ answer: string; sources: any[] }> {
  console.log(`RAG: Processing question: "${question}"`);
  
  // Step 1: Generate embedding for the question
  const questionEmbedding = await generateEmbedding(question);
  console.log(`RAG: Generated question embedding with ${questionEmbedding.length} dimensions`);
  
  // Step 2: Retrieve relevant chunks using vector similarity search
  const relevantChunks = await searchSimilarReports(questionEmbedding.join(','), 5);
  console.log(`RAG: Retrieved ${relevantChunks.length} relevant chunks`);
  
  if (relevantChunks.length === 0) {
    return {
      answer: "I don't have any relevant information in the uploaded reports to answer your question. Please upload medical reports first.",
      sources: []
    };
  }
  
  // Step 3: Build context from retrieved chunks
  const context = relevantChunks
    .map((chunk, index) => `[Document ${index + 1} - ${chunk.originalName}]:\n${chunk.chunkText}`)
    .join("\n\n");
  
  console.log(`RAG: Built context with ${context.length} characters`);
  
  // Step 4: Generate answer using Gemini with context (newer model from docs)
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `You are a helpful medical assistant. Use the following context from medical reports to answer the user's question. If the answer is not in the context, say so clearly.

Context:
${context}

Question: ${question}

Answer:`;

  console.log(`RAG: Sending prompt to Gemini for answer generation`);
  const result = await model.generateContent(prompt);
  const answer = result.response.text();
  
  console.log(`RAG: Generated answer with ${answer.length} characters`);
  
  // Step 5: Deduplicate sources by chunkId and normalized text
  const seenChunkIds = new Set<number>();
  const seenNormalizedText = new Set<string>();
  const uniqueSources: any[] = [];
  
  // Helper function to normalize text for comparison
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, 200); // Compare only first 200 characters
  };
  
  for (const chunk of relevantChunks) {
    // Skip if we've already seen this chunkId
    if (seenChunkIds.has(chunk.chunkId)) {
      console.log(`RAG: Skipping duplicate chunkId ${chunk.chunkId}`);
      continue;
    }
    
    // Normalize the chunk text for comparison
    const normalizedText = normalizeText(chunk.chunkText);
    
    // Skip if we've already seen this normalized text (prevents similar chunks)
    if (seenNormalizedText.has(normalizedText)) {
      console.log(`RAG: Skipping duplicate normalized text from chunkId ${chunk.chunkId}`);
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
  
  console.log(`RAG: Returning ${uniqueSources.length} unique sources out of ${relevantChunks.length} retrieved chunks`);
  
  return {
    answer,
    sources: uniqueSources
  };
}
