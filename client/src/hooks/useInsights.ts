import { useCallback, useEffect, useState } from "react";
import {
  getErrorMessage,
  getInsights,
  type CategoryInsight,
  type LargestExpenseInsight,
  type SpendingInsightStatus,
} from "../lib/api";
import type { Category } from "../types/transaction";

/** Dashboard period represented by the current Penny UI. */
export const INSIGHTS_MONTH = "2026-08";

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
}

export type InsightsEmptyReason =
  | "no-expenses"
  | "insufficient-data"
  | "no-non-housing-expenses"
  | null;

export interface InsightsData {
  status: SpendingInsightStatus | null;
  hasEnoughData: boolean;
  emptyReason: InsightsEmptyReason;
  topCategory: Category | null;
  topCategoryAmount: number;
  topCategoryPercentage: number;
  categoryBreakdown: CategoryBreakdown[];
  largestExpense: LargestExpenseInsight | null;
  nonHousingTotal: number;
  month: string;
}

const EMPTY: InsightsData = {
  status: null,
  hasEnoughData: false,
  emptyReason: null,
  topCategory: null,
  topCategoryAmount: 0,
  topCategoryPercentage: 0,
  categoryBreakdown: [],
  largestExpense: null,
  nonHousingTotal: 0,
  month: INSIGHTS_MONTH,
};

function mapStatusToEmptyReason(
  status: SpendingInsightStatus,
): InsightsEmptyReason {
  if (status === "ready") return null;
  if (status === "no-expenses") return "no-expenses";
  if (status === "no-non-housing-expenses") return "no-non-housing-expenses";
  return "insufficient-data";
}

function mapInsights(
  response: Awaited<ReturnType<typeof getInsights>>,
): InsightsData {
  const top: CategoryInsight | null = response.topCategory;

  return {
    status: response.status,
    hasEnoughData: response.status === "ready",
    emptyReason: mapStatusToEmptyReason(response.status),
    topCategory: top?.category ?? null,
    topCategoryAmount: top?.amount ?? 0,
    topCategoryPercentage: top?.percentage ?? 0,
    categoryBreakdown: response.categories,
    largestExpense: response.largestExpense,
    nonHousingTotal: response.totalNonHousingSpending,
    month: response.month,
  };
}

export function useInsights(month: string = INSIGHTS_MONTH) {
  const [insights, setInsights] = useState<InsightsData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInsights(month);
      setInsights(mapInsights(response));
    } catch (err) {
      setError(getErrorMessage(err, "Spending insights couldn't be loaded."));
      setInsights(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    insights,
    loading,
    error,
    refresh,
  };
}
