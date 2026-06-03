import { getPool } from "../db/pool.js";
import { ensureDatabase } from "../db/init.js";

export type ReportSourceKind = "pdf" | "text" | "image" | "unknown";

export type CreateReportInput = {
  originalName: string;
  storedName: string;
  mimetype: string;
  size: number;
  filePath: string;
  extractedText: string;
  sourceKind: ReportSourceKind;
  embedding?: number[];  // Add this line
};

export type ReportRecord = CreateReportInput & {
  id: number;
  createdAt: string;
};

export async function createReportRecord(
  input: CreateReportInput,
): Promise<ReportRecord> {
  await ensureDatabase();

  const result = await getPool().query<{
    id: number;
    original_name: string;
    stored_name: string;
    mimetype: string;
    size: number;
    file_path: string;
    extracted_text: string;
    source_kind: ReportSourceKind;
    embedding: number[];
    created_at: Date;
  }>(
    `
      INSERT INTO reports (
        original_name,
        stored_name,
        mimetype,
        size,
        file_path,
        extracted_text,
        source_kind,
        embedding
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)
      RETURNING
        id,
        original_name,
        stored_name,
        mimetype,
        size,
        file_path,
        extracted_text,
        source_kind,
        embedding,
        created_at;
    `,
    [
      input.originalName,
      input.storedName,
      input.mimetype,
      input.size,
      input.filePath,
      input.extractedText,
      input.sourceKind,
      input.embedding ? `[${input.embedding.join(',')}]` : null,
    ],
  );

  const row = result.rows[0];

  return {
    id: row.id,
    originalName: row.original_name,
    storedName: row.stored_name,
    mimetype: row.mimetype,
    size: row.size,
    filePath: row.file_path,
    extractedText: row.extracted_text,
    sourceKind: row.source_kind,
    embedding: row.embedding,
    createdAt: row.created_at.toISOString(),
  };
}