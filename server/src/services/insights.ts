import type { Transaction } from "../types/transaction.js";
import type {
  CategoryInsight,
  LargestExpenseInsight,
  SpendingInsights,
} from "../types/insights.js";
import { roundCurrency } from "./summary.js";

export function roundPercentage(value: number): number {
  return Math.round(value * 10) / 10;
}

export function getCurrentMonth(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function toLargestExpense(
  transaction: Transaction,
): LargestExpenseInsight {
  return {
    id: transaction.id,
    date: transaction.date,
    description: transaction.description,
    category: transaction.category,
    amount: roundCurrency(transaction.amount),
  };
}

function findLargestExpense(
  expenses: Transaction[],
): LargestExpenseInsight | null {
  if (expenses.length === 0) {
    return null;
  }

  const largest = [...expenses].sort((a, b) => {
    if (a.amount !== b.amount) {
      return b.amount - a.amount;
    }
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  })[0];

  return toLargestExpense(largest);
}

function buildCategoryInsights(
  nonHousingExpenses: Transaction[],
): { total: number; categories: CategoryInsight[] } {
  const totals = new Map<Transaction["category"], number>();

  for (const expense of nonHousingExpenses) {
    totals.set(
      expense.category,
      (totals.get(expense.category) ?? 0) + expense.amount,
    );
  }

  const total = roundCurrency(
    Array.from(totals.values()).reduce((sum, amount) => sum + amount, 0),
  );

  const categories = Array.from(totals.entries())
    .map(([category, amount]) => {
      const roundedAmount = roundCurrency(amount);
      return {
        category,
        amount: roundedAmount,
        percentage:
          total > 0 ? roundPercentage((roundedAmount / total) * 100) : 0,
      };
    })
    .sort((a, b) => {
      if (a.amount !== b.amount) {
        return b.amount - a.amount;
      }
      return a.category.localeCompare(b.category);
    });

  return { total, categories };
}

export function getSpendingInsights(
  transactions: Transaction[],
  month: string,
): SpendingInsights {
  const monthExpenses = transactions.filter(
    (transaction) =>
      transaction.type === "expense" && transaction.date.startsWith(`${month}-`),
  );

  const emptyBase: SpendingInsights = {
    month,
    status: "no-expenses",
    totalNonHousingSpending: 0,
    topCategory: null,
    categories: [],
    largestExpense: null,
  };

  if (monthExpenses.length === 0) {
    return emptyBase;
  }

  const largestExpense = findLargestExpense(monthExpenses);
  const nonHousingExpenses = monthExpenses.filter(
    (transaction) => transaction.category !== "Housing",
  );

  if (nonHousingExpenses.length === 0) {
    return {
      ...emptyBase,
      status: "no-non-housing-expenses",
      largestExpense,
    };
  }

  const { total, categories } = buildCategoryInsights(nonHousingExpenses);

  if (monthExpenses.length < 3) {
    return {
      month,
      status: "insufficient-data",
      totalNonHousingSpending: total,
      topCategory: null,
      categories: [],
      largestExpense,
    };
  }

  return {
    month,
    status: "ready",
    totalNonHousingSpending: total,
    topCategory: categories[0] ?? null,
    categories,
    largestExpense,
  };
}
