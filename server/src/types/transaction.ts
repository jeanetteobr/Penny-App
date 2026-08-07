export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Food"
  | "Housing"
  | "Utilities"
  | "Shopping"
  | "Entertainment"
  | "Transportation"
  | "Salary"
  | "Freelance";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Housing",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Transportation",
] as const;

export const INCOME_CATEGORIES = ["Salary", "Freelance"] as const;

export const ALL_CATEGORIES = [
  "Food",
  "Housing",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Transportation",
  "Salary",
  "Freelance",
] as const;

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

export type TransactionInput = Omit<Transaction, "id">;
