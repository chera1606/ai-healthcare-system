import { config } from "dotenv";
import { getPool } from "../src/shared/database/pool.js";
import { ensureDatabase } from "../src/shared/database/init.js";
import fs from "fs";
import path from "path";

// Load environment variables
config();

async function runMigration() {
  try {
    await ensureDatabase();
    console.log("Database connected");

    const migrationPath = path.resolve("migrations/create_medical_observations_table.sql");
    const sql = fs.readFileSync(migrationPath, "utf8");
    
    console.log("Running migration: create_medical_observations_table.sql");
    
    const pool = getPool();
    await pool.query(sql);
    
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
