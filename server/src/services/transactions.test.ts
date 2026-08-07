import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { closeDatabase } from "../db/database.js";
import { transactionListQuerySchema } from "../schemas/transaction.js";
import {
  createTransaction,
  deleteTransaction,
  getAvailableMonths,
  getTransactions,
} from "./transactions.js";

const tempDirs: string[] = [];

function tempDbPath(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "penny-tx-"));
  tempDirs.push(dir);
  return path.join(dir, "penny.db");
}

beforeEach(() => {
  closeDatabase();
  process.env.PENNY_DB_PATH = tempDbPath();
});

afterEach(() => {
  closeDatabase();
  delete process.env.PENNY_DB_PATH;
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("transaction month filtering", () => {
  it("returns only August rows for month=2026-08", async () => {
    const rows = await getTransactions({ month: "2026-08" });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.date.startsWith("2026-08-"))).toBe(true);
  });

  it("returns only July rows for month=2026-07", async () => {
    const rows = await getTransactions({ month: "2026-07" });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.date.startsWith("2026-07-"))).toBe(true);
  });

  it("composes month with category using AND semantics", async () => {
    const rows = await getTransactions({
      month: "2026-07",
      category: "Food",
    });
    expect(rows.length).toBeGreaterThan(0);
    expect(
      rows.every(
        (row) => row.date.startsWith("2026-07-") && row.category === "Food",
      ),
    ).toBe(true);
  });

  it("composes month with type using AND semantics", async () => {
    const rows = await getTransactions({
      month: "2026-07",
      type: "income",
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.description).toBe("Freelance project");
    expect(rows[0]?.type).toBe("income");
  });

  it("rejects invalid month values with the shared schema", () => {
    expect(() => transactionListQuerySchema.parse({ month: "2026-7" })).toThrow(
      ZodError,
    );
    expect(() =>
      transactionListQuerySchema.parse({ month: "2026-13" }),
    ).toThrow(ZodError);
    expect(() => transactionListQuerySchema.parse({ month: "July" })).toThrow(
      ZodError,
    );
  });

  it("keeps search as a literal substring within the selected month", async () => {
    const rows = await getTransactions({
      month: "2026-08",
      search: "trader",
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.description).toBe("Trader Joe's");

    const none = await getTransactions({
      month: "2026-07",
      search: "trader",
    });
    expect(none).toHaveLength(0);
  });

  it("lists available months from persisted data newest first", async () => {
    const months = await getAvailableMonths();
    expect(months).toEqual(["2026-08", "2026-07"]);
  });

  it("adds a new month after creating the first transaction in that month", async () => {
    expect(await getAvailableMonths()).toEqual(["2026-08", "2026-07"]);

    await createTransaction({
      date: "2026-06-15",
      description: "Test June",
      amount: 10,
      type: "expense",
      category: "Food",
    });

    expect(await getAvailableMonths()).toEqual([
      "2026-08",
      "2026-07",
      "2026-06",
    ]);
  });

  it("removes a month after deleting its last transaction", async () => {
    const created = await createTransaction({
      date: "2026-06-15",
      description: "Test June",
      amount: 10,
      type: "expense",
      category: "Food",
    });

    expect(await getAvailableMonths()).toContain("2026-06");
    await deleteTransaction(created.id);
    expect(await getAvailableMonths()).toEqual(["2026-08", "2026-07"]);
  });
});
