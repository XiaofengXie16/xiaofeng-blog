import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Singleton pattern for database connection
const globalForDb = globalThis as typeof globalThis & {
  db: ReturnType<typeof drizzle> | undefined;
  sql: ReturnType<typeof postgres> | undefined;
};

if (!globalForDb.sql) {
  globalForDb.sql = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

if (!globalForDb.db) {
  globalForDb.db = drizzle(globalForDb.sql, { schema });
}

export const db = globalForDb.db;
export const sql = globalForDb.sql;

// Initialize database tables
export async function initializeDatabase() {
  await globalForDb.sql!`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      name TEXT,
      review TEXT NOT NULL,
      stars INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  await globalForDb.sql!`
    CREATE INDEX IF NOT EXISTS idx_reviews_slug ON reviews(slug);
  `;
}
