import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import type { Transaction, TransactionInput } from "../types/transaction.js";

export interface TransactionFilters {
  type?: Transaction["type"];
  category?: Transaction["category"];
  search?: string;
}

interface TransactionRow {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: Transaction["type"];
  category: Transaction["category"];
}

function mapRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    description: row.description,
    amount: row.amount,
    type: row.type,
    category: row.category,
  };
}

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<Transaction[]> {
  const db = getDatabase();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.type) {
    clauses.push("type = ?");
    params.push(filters.type);
  }
  if (filters.category) {
    clauses.push("category = ?");
    params.push(filters.category);
  }

  const search = filters.search?.trim();
  if (search) {
    // instr() keeps % / _ literal (unlike LIKE wildcards).
    clauses.push("instr(lower(description), lower(?)) > 0");
    params.push(search);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const sql = `
    SELECT id, date, description, amount, type, category
    FROM transactions
    ${where}
    ORDER BY date DESC, id ASC
  `;

  const rows = db.prepare(sql).all(...params) as TransactionRow[];
  return rows.map(mapRow);
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | undefined> {
  const db = getDatabase();
  const row = db
    .prepare(
      `SELECT id, date, description, amount, type, category
       FROM transactions
       WHERE id = ?`,
    )
    .get(id) as TransactionRow | undefined;

  return row ? mapRow(row) : undefined;
}

export async function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  const db = getDatabase();
  const created: Transaction = {
    id: randomUUID(),
    ...input,
  };

  db.prepare(
    `INSERT INTO transactions (id, date, description, amount, type, category)
     VALUES (@id, @date, @description, @amount, @type, @category)`,
  ).run(created);

  return created;
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction | undefined> {
  const db = getDatabase();
  const result = db
    .prepare(
      `UPDATE transactions
       SET date = @date,
           description = @description,
           amount = @amount,
           type = @type,
           category = @category
       WHERE id = @id`,
    )
    .run({
      id,
      date: input.date,
      description: input.description,
      amount: input.amount,
      type: input.type,
      category: input.category,
    });

  if (result.changes === 0) {
    return undefined;
  }

  return {
    id,
    ...input,
  };
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const db = getDatabase();
  const result = db.prepare(`DELETE FROM transactions WHERE id = ?`).run(id);
  return result.changes > 0;
}
