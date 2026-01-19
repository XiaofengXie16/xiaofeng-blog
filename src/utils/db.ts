import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../../drizzle/schema";

const DB_PATH = process.env.DATABASE_URL ?? "./data/reviews.db";

// Singleton pattern for database connection
const globalForDb = globalThis as typeof globalThis & {
  db: ReturnType<typeof drizzle> | undefined;
  sqlite: Database.Database | undefined;
};

function createDatabase() {
  // Ensure the data directory exists
  const path = DB_PATH.replace("file:", "");
  const dir = path.substring(0, path.lastIndexOf("/"));
  if (dir) {
    const fs = require("fs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const sqlite = new Database(path);
  sqlite.pragma("journal_mode = WAL");

  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      name TEXT,
      review TEXT NOT NULL,
      stars INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reviews_slug ON reviews(slug);
  `);

  return { sqlite, db: drizzle(sqlite, { schema }) };
}

if (!globalForDb.db) {
  const { sqlite, db } = createDatabase();
  globalForDb.sqlite = sqlite;
  globalForDb.db = db;
}

export const db = globalForDb.db!;
export const sqlite = globalForDb.sqlite!;
