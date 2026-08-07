import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { SEED_TRANSACTIONS } from "./seed.js";

const SERVER_ROOT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const DEFAULT_DB_PATH = path.join(SERVER_ROOT, "data", "penny.db");

const CREATE_TRANSACTIONS_SQL = `
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL CHECK (
    category IN (
      'Food',
      'Housing',
      'Utilities',
      'Shopping',
      'Entertainment',
      'Transportation',
      'Salary',
      'Freelance'
    )
  ),
  CHECK (
    (
      type = 'expense'
      AND category IN (
        'Food',
        'Housing',
        'Utilities',
        'Shopping',
        'Entertainment',
        'Transportation'
      )
    )
    OR (
      type = 'income'
      AND category IN ('Salary', 'Freelance')
    )
  )
);
`;

let dbInstance: Database.Database | null = null;

export function resolveDbPath(overridePath?: string): string {
  return overridePath ?? process.env.PENNY_DB_PATH ?? DEFAULT_DB_PATH;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db
    .prepare(
      `SELECT 1 AS ok
       FROM sqlite_master
       WHERE type = 'table' AND name = ?`,
    )
    .get(tableName) as { ok: number } | undefined;
  return row !== undefined;
}

/** Insert canonical seed rows. Caller owns the surrounding transaction. */
export function insertSeedTransactions(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT INTO transactions (id, date, description, amount, type, category)
    VALUES (@id, @date, @description, @amount, @type, @category)
  `);

  for (const row of SEED_TRANSACTIONS) {
    insert.run(row);
  }
}

export type SeedFn = (db: Database.Database) => void;

/**
 * Ensure the transactions table exists.
 * Seeds the canonical demo dataset only when the table is newly created.
 * An existing empty table is intentionally left empty (no reseeding).
 *
 * First-run CREATE TABLE + seed run in one SQLite transaction so a failed
 * bootstrap cannot leave an empty committed table.
 */
export function initializeDatabase(
  db: Database.Database,
  seed: SeedFn = insertSeedTransactions,
): {
  createdTable: boolean;
  seeded: boolean;
} {
  if (tableExists(db, "transactions")) {
    return { createdTable: false, seeded: false };
  }

  const bootstrap = db.transaction(() => {
    db.exec(CREATE_TRANSACTIONS_SQL);
    seed(db);
  });

  bootstrap();
  return { createdTable: true, seeded: true };
}

export function openDatabase(filePath: string): Database.Database {
  if (filePath !== ":memory:") {
    mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const db = new Database(filePath);
  initializeDatabase(db);
  return db;
}

/** Application singleton used by the transaction service. */
export function getDatabase(): Database.Database {
  if (!dbInstance) {
    dbInstance = openDatabase(resolveDbPath());
  }
  return dbInstance;
}

/** Close the singleton connection (tests / process shutdown). */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
