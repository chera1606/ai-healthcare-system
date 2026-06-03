import { Pool } from "pg";

let pool: Pool | null = null;

function shouldUseSsl(databaseUrl: string): boolean {
  try {
    const parsedUrl = new URL(databaseUrl);
    return parsedUrl.hostname.includes("supabase.co");
  } catch {
    return false;
  }
}

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required");
    }

    const useSsl = shouldUseSsl(databaseUrl);

    pool = new Pool({
      connectionString: databaseUrl,
      ...(useSsl
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {}),
    });
  }

  return pool;
}
