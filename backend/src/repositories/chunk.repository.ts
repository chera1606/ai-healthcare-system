import { getPool } from "../db/pool.js";
import { ensureDatabase } from "../db/init.js";

export type CreateChunkInput = {
  reportId: number;
  chunkText: string;
  chunkIndex: number;
  embedding?: number[];
};

export async function createChunk(input: CreateChunkInput) {
  await ensureDatabase();

  const result = await getPool().query(
    `
      INSERT INTO document_chunks (report_id, chunk_text, chunk_index, embedding)
      VALUES ($1, $2, $3, $4::vector)
      RETURNING id, report_id, chunk_text, chunk_index, embedding;
    `,
    [input.reportId, input.chunkText, input.chunkIndex, input.embedding ? `[${input.embedding.join(',')}]` : null]
  );

  return result.rows[0];
}