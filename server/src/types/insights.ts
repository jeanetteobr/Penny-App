import type { TransactionCategory } from "./transaction.js";

export type SpendingInsightStatus =
  | "ready"
  | "no-expenses"
  | "no-non-housing-expenses"
  | "insufficient-data";

export interface CategoryInsight {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}

export interface LargestExpenseInsight {
  id: string;
  date: string;
  description: string;
  category: TransactionCategory;
  amount: number;
}

export interface SpendingInsights {
  month: string;
  status: SpendingInsightStatus;
  totalNonHousingSpending: number;
  topCategory: CategoryInsight | null;
  categories: CategoryInsight[];
  largestExpense: LargestExpenseInsight | null;
}
