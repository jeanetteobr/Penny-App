import { useMemo } from 'react'
import type { Transaction, Category } from '../types/transaction'

export interface CategoryBreakdown {
  category: Category
  amount: number
  percentage: number
}

export type InsightsEmptyReason =
  | 'no-expenses'       // zero expense transactions this month
  | 'insufficient-data' // fewer than 3 expense transactions
  | 'all-housing'       // all expenses are Housing
  | null

export interface InsightsData {
  hasEnoughData: boolean
  emptyReason: InsightsEmptyReason
  topCategory: Category | null
  topCategoryAmount: number
  topCategoryPercentage: number
  categoryBreakdown: CategoryBreakdown[]
  largestExpense: Transaction | null
  nonHousingTotal: number
}

// Insights are scoped to August 2026 (current month in the prototype)
const INSIGHTS_MONTH = '2026-08'

const EMPTY: InsightsData = {
  hasEnoughData: false,
  emptyReason: null,
  topCategory: null,
  topCategoryAmount: 0,
  topCategoryPercentage: 0,
  categoryBreakdown: [],
  largestExpense: null,
  nonHousingTotal: 0,
}

export function useInsights(transactions: Transaction[]): InsightsData {
  return useMemo(() => {
    const currentMonthExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.date.startsWith(INSIGHTS_MONTH)
    )

    if (currentMonthExpenses.length === 0) {
      return { ...EMPTY, emptyReason: 'no-expenses' }
    }

    if (currentMonthExpenses.length < 3) {
      return { ...EMPTY, emptyReason: 'insufficient-data' }
    }

    const nonHousingExpenses = currentMonthExpenses.filter((t) => t.category !== 'Housing')

    if (nonHousingExpenses.length === 0) {
      return { ...EMPTY, emptyReason: 'all-housing' }
    }

    // Largest single expense in the current month (includes Housing)
    const largestExpense = currentMonthExpenses.reduce<Transaction | null>(
      (max, t) => (max === null || t.amount > max.amount ? t : max),
      null
    )

    const nonHousingTotal = nonHousingExpenses.reduce((sum, t) => sum + t.amount, 0)

    const byCategory = new Map<Category, number>()
    for (const t of nonHousingExpenses) {
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount)
    }

    const categoryBreakdown: CategoryBreakdown[] = Array.from(byCategory.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: nonHousingTotal > 0 ? (amount / nonHousingTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    const top = categoryBreakdown[0]

    return {
      hasEnoughData: true,
      emptyReason: null,
      topCategory: top.category,
      topCategoryAmount: top.amount,
      topCategoryPercentage: top.percentage,
      categoryBreakdown,
      largestExpense,
      nonHousingTotal,
    }
  }, [transactions])
}
