import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Transaction, TransactionInput } from "../types/transaction.js";

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data");
const DATA_FILE = path.join(DATA_DIR, "transactions.json");

export interface TransactionFilters {
  type?: Transaction["type"];
  category?: Transaction["category"];
  search?: string;
}

function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

async function readAllTransactions(): Promise<Transaction[]> {
  const raw = await readFile(DATA_FILE, "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("transactions.json must contain an array");
  }

  return parsed as Transaction[];
}

async function writeAllTransactions(transactions: Transaction[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });

  const payload = `${JSON.stringify(transactions, null, 2)}\n`;
  const tempFile = path.join(DATA_DIR, `.transactions.${randomUUID()}.tmp`);

  try {
    await writeFile(tempFile, payload, "utf8");
    await rename(tempFile, DATA_FILE);
  } catch (error) {
    await unlink(tempFile).catch(() => undefined);
    throw error;
  }
}

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<Transaction[]> {
  const transactions = await readAllTransactions();
  const search = filters.search?.trim().toLowerCase();

  const filtered = transactions.filter((transaction) => {
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    if (search && !transaction.description.toLowerCase().includes(search)) {
      return false;
    }
    return true;
  });

  return sortTransactions(filtered);
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | undefined> {
  const transactions = await readAllTransactions();
  return transactions.find((transaction) => transaction.id === id);
}

export async function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  const transactions = await readAllTransactions();
  const created: Transaction = {
    id: randomUUID(),
    ...input,
  };

  transactions.push(created);
  await writeAllTransactions(transactions);
  return created;
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction | undefined> {
  const transactions = await readAllTransactions();
  const index = transactions.findIndex((transaction) => transaction.id === id);

  if (index === -1) {
    return undefined;
  }

  const updated: Transaction = {
    id,
    ...input,
  };

  transactions[index] = updated;
  await writeAllTransactions(transactions);
  return updated;
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const transactions = await readAllTransactions();
  const next = transactions.filter((transaction) => transaction.id !== id);

  if (next.length === transactions.length) {
    return false;
  }

  await writeAllTransactions(next);
  return true;
}
