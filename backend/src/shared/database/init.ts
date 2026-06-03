import { getPool } from "./pool.js";

let initialized = false;
let initPromise: Promise<void> | null = null;

const createReportsTableSql = `
  CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    original_name TEXT NOT NULL,
    stored_name TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    extracted_text TEXT NOT NULL,
    source_kind TEXT NOT NULL,
    embedding vector(3072),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

const createChunksTableSql = `
  CREATE TABLE IF NOT EXISTS document_chunks (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding vector(3072),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

export async function ensureDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  if (!initPromise) {
    initPromise = (async () => {
      // pgvector extension is already enabled in Supabase
      await getPool().query(createReportsTableSql);
      await getPool().query(createChunksTableSql);
      initialized = true;
    })();
  }

  await initPromise;
}