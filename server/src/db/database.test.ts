import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import {
  initializeDatabase,
  openDatabase,
} from "./database.js";
import { SEED_TRANSACTIONS } from "./seed.js";

const tempDirs: string[] = [];

function tempDbPath(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "penny-db-"));
  tempDirs.push(dir);
  return path.join(dir, "penny.db");
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

function countTransactions(db: Database.Database): number {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM transactions`).get() as {
    count: number;
  };
  return row.count;
}

describe("SQLite database initialization", () => {
  it("creates the schema and seeds exactly 17 canonical transactions on a fresh database", () => {
    const db = openDatabase(tempDbPath());

    expect(countTransactions(db)).toBe(17);
    expect(SEED_TRANSACTIONS).toHaveLength(17);

    const ids = db
      .prepare(`SELECT id FROM transactions ORDER BY id ASC`)
      .all() as Array<{ id: string }>;

    expect(ids.map((row) => row.id)).toEqual(
      [...SEED_TRANSACTIONS].map((row) => row.id).sort(),
    );

    db.close();
  });

  it("is idempotent — reopening an existing database does not reseed or duplicate rows", () => {
    const filePath = tempDbPath();
    const first = openDatabase(filePath);
    expect(countTransactions(first)).toBe(17);
    first.close();

    const second = openDatabase(filePath);
    const result = initializeDatabase(second);

    expect(result.createdTable).toBe(false);
    expect(result.seeded).toBe(false);
    expect(countTransactions(second)).toBe(17);

    second.close();
  });

  it("does not reseed an existing empty transactions table", () => {
    const filePath = tempDbPath();
    const first = openDatabase(filePath);
    expect(countTransactions(first)).toBe(17);

    first.prepare(`DELETE FROM transactions`).run();
    expect(countTransactions(first)).toBe(0);
    first.close();

    const second = openDatabase(filePath);
    const result = initializeDatabase(second);

    expect(result.createdTable).toBe(false);
    expect(result.seeded).toBe(false);
    expect(countTransactions(second)).toBe(0);

    second.close();
  });

  it("rolls back CREATE TABLE when first-run seeding fails, then retries cleanly", () => {
    const filePath = tempDbPath();
    const db = new Database(filePath);

    expect(() => {
      initializeDatabase(db, () => {
        throw new Error("forced seed failure");
      });
    }).toThrow("forced seed failure");

    const tableAfterFailure = db
      .prepare(
        `SELECT 1 AS ok
         FROM sqlite_master
         WHERE type = 'table' AND name = 'transactions'`,
      )
      .get() as { ok: number } | undefined;

    expect(tableAfterFailure).toBeUndefined();

    const result = initializeDatabase(db);
    expect(result).toEqual({ createdTable: true, seeded: true });
    expect(countTransactions(db)).toBe(17);

    db.close();
  });
});
