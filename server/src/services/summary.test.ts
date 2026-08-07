import { describe, expect, it } from "vitest";
import type { Transaction } from "../types/transaction.js";
import { getBudgetSummary, roundCurrency } from "./summary.js";

function tx(
  partial: Pick<Transaction, "amount" | "type"> &
    Partial<Omit<Transaction, "amount" | "type">>,
): Transaction {
  return {
    id: partial.id ?? "test-id",
    date: partial.date ?? "2026-08-01",
    description: partial.description ?? "Test",
    amount: partial.amount,
    type: partial.type,
    category: partial.category ?? (partial.type === "income" ? "Salary" : "Food"),
  };
}

describe("getBudgetSummary", () => {
  it("sums mixed income and expenses", () => {
    const summary = getBudgetSummary([
      tx({ amount: 1000, type: "income" }),
      tx({ amount: 500, type: "income" }),
      tx({ amount: 200, type: "expense" }),
      tx({ amount: 50, type: "expense" }),
    ]);

    expect(summary).toEqual({
      income: 1500,
      expenses: 250,
      balance: 1250,
    });
  });

  it("handles only income", () => {
    const summary = getBudgetSummary([
      tx({ amount: 1200, type: "income" }),
      tx({ amount: 300, type: "income" }),
    ]);

    expect(summary).toEqual({
      income: 1500,
      expenses: 0,
      balance: 1500,
    });
  });

  it("handles only expenses with a negative balance", () => {
    const summary = getBudgetSummary([tx({ amount: 250, type: "expense" })]);

    expect(summary).toEqual({
      income: 0,
      expenses: 250,
      balance: -250,
    });
  });

  it("returns zeros for an empty transaction list", () => {
    expect(getBudgetSummary([])).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
    });
  });

  it("normalizes floating-point currency artifacts to two decimals", () => {
    const summary = getBudgetSummary([
      tx({ amount: 0.1, type: "income" }),
      tx({ amount: 0.2, type: "income" }),
      tx({ amount: 0.1, type: "expense" }),
      tx({ amount: 0.2, type: "expense" }),
    ]);

    expect(summary.income).toBe(0.3);
    expect(summary.expenses).toBe(0.3);
    expect(summary.balance).toBe(0);
    expect(summary.income).not.toBe(0.1 + 0.2);
  });
});

describe("roundCurrency", () => {
  it("rounds to two decimal places", () => {
    expect(roundCurrency(2135.0199999999995)).toBe(2135.02);
    expect(roundCurrency(0.1 + 0.2)).toBe(0.3);
  });
});
