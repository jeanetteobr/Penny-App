import type { Category, Transaction, TransactionType } from "../types/transaction";

export interface BudgetSummary {
  income: number;
  expenses: number;
  balance: number;
}

export type SpendingInsightStatus =
  | "ready"
  | "no-expenses"
  | "no-non-housing-expenses"
  | "insufficient-data";

export interface CategoryInsight {
  category: Category;
  amount: number;
  percentage: number;
}

export interface LargestExpenseInsight {
  id: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
}

export interface SpendingInsightsResponse {
  month: string;
  status: SpendingInsightStatus;
  totalNonHousingSpending: number;
  topCategory: CategoryInsight | null;
  categories: CategoryInsight[];
  largestExpense: LargestExpenseInsight | null;
}

export type TransactionInput = Omit<Transaction, "id">;

export interface TransactionFilters {
  type?: TransactionType | "all";
  category?: Category | "all";
  search?: string;
  month?: string;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await parseJsonBody(response);

  if (!response.ok) {
    const errorBody = body as { error?: string; details?: unknown } | null;
    throw new ApiError(
      errorBody?.error ?? "Request failed",
      response.status,
      errorBody?.details,
    );
  }

  return body as T;
}

function buildTransactionQuery(filters: TransactionFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.month) {
    params.set("month", filters.month);
  }
  if (filters.type && filters.type !== "all") {
    params.set("type", filters.type);
  }
  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }
  const search = filters.search?.trim();
  if (search) {
    params.set("search", search);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getTransactions(
  filters: TransactionFilters = {},
  signal?: AbortSignal,
): Promise<Transaction[]> {
  return requestJson<Transaction[]>(
    `/api/transactions${buildTransactionQuery(filters)}`,
    { signal },
  );
}

export interface TransactionMonthsResponse {
  months: string[];
}

export function getTransactionMonths(): Promise<TransactionMonthsResponse> {
  return requestJson<TransactionMonthsResponse>("/api/transactions/months");
}

export function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  return requestJson<Transaction>("/api/transactions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction> {
  return requestJson<Transaction>(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteTransaction(id: string): Promise<void> {
  return requestJson<void>(`/api/transactions/${id}`, {
    method: "DELETE",
  });
}

export function getSummary(): Promise<BudgetSummary> {
  return requestJson<BudgetSummary>("/api/summary");
}

export function getInsights(month: string): Promise<SpendingInsightsResponse> {
  const params = new URLSearchParams({ month });
  return requestJson<SpendingInsightsResponse>(
    `/api/insights?${params.toString()}`,
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
