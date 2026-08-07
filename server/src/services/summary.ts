import type { Transaction } from "../types/transaction.js";

export interface BudgetSummary {
  income: number;
  expenses: number;
  balance: number;
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getBudgetSummary(transactions: Transaction[]): BudgetSummary {
  let income = 0;
  let expenses = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expenses += transaction.amount;
    }
  }

  income = roundCurrency(income);
  expenses = roundCurrency(expenses);

  return {
    income,
    expenses,
    balance: roundCurrency(income - expenses),
  };
}
