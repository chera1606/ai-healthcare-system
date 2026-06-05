import { getPool } from "../../../shared/database/pool.js";

export async function searchSimilarReports(query: string, limit: number = 5) {
  // Professional RAG: search chunks with vector similarity
  const result = await getPool().query(
    `
      SELECT 
        dc.id,
        dc.report_id,
        dc.chunk_text,
        dc.chunk_index,
        r.original_name,
        1 - (dc.embedding <=> $1::vector) as similarity
      FROM document_chunks dc
      JOIN reports r ON dc.report_id = r.id
      WHERE dc.embedding IS NOT NULL
      ORDER BY dc.embedding <=> $1::vector
      LIMIT $2;
    `,
    [`[${query}]`, limit]
  );

  return result.rows.map(row => ({
    chunkId: row.id,
    reportId: row.report_id,
    chunkText: row.chunk_text,
    chunkIndex: row.chunk_index,
    originalName: row.original_name,
    similarity: row.similarity,
  }));
}