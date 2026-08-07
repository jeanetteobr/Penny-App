import { describe, expect, it } from "vitest";
import type { Transaction } from "../types/transaction.js";
import { getSpendingInsights, roundPercentage } from "./insights.js";

function tx(
  partial: Pick<Transaction, "amount" | "type" | "category" | "date"> &
    Partial<Omit<Transaction, "amount" | "type" | "category" | "date">>,
): Transaction {
  return {
    id: partial.id ?? "tx-id",
    date: partial.date,
    description: partial.description ?? "Test",
    amount: partial.amount,
    type: partial.type,
    category: partial.category,
  };
}

describe("getSpendingInsights", () => {
  it("returns a ready insight with sorted categories and largest expense", () => {
    const insights = getSpendingInsights(
      [
        tx({
          id: "food-1",
          date: "2026-08-07",
          description: "Groceries",
          amount: 100,
          type: "expense",
          category: "Food",
        }),
        tx({
          id: "shop-1",
          date: "2026-08-06",
          description: "Store",
          amount: 50,
          type: "expense",
          category: "Shopping",
        }),
        tx({
          id: "rent-1",
          date: "2026-08-01",
          description: "Rent",
          amount: 1000,
          type: "expense",
          category: "Housing",
        }),
        tx({
          id: "util-1",
          date: "2026-08-03",
          description: "Power",
          amount: 50,
          type: "expense",
          category: "Utilities",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("ready");
    expect(insights.totalNonHousingSpending).toBe(200);
    expect(insights.topCategory).toEqual({
      category: "Food",
      amount: 100,
      percentage: 50,
    });
    expect(insights.categories.map((c) => c.category)).toEqual([
      "Food",
      "Shopping",
      "Utilities",
    ]);
    expect(insights.categories.find((c) => c.category === "Shopping")).toEqual({
      category: "Shopping",
      amount: 50,
      percentage: 25,
    });
    expect(insights.largestExpense).toMatchObject({
      id: "rent-1",
      description: "Rent",
      category: "Housing",
      amount: 1000,
    });
  });

  it("scopes analysis to the requested month and excludes other months", () => {
    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-07",
          description: "August Food",
          amount: 174.08,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-07-31",
          description: "July Food A",
          amount: 46.82,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-07-31",
          description: "July Food B",
          amount: 71.4,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-02",
          description: "Shopping",
          amount: 141.04,
          type: "expense",
          category: "Shopping",
        }),
        tx({
          date: "2026-08-01",
          description: "Rent",
          amount: 1450,
          type: "expense",
          category: "Housing",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("ready");
    expect(insights.topCategory).toMatchObject({
      category: "Food",
      amount: 174.08,
    });
    expect(insights.topCategory?.amount).not.toBe(292.3);
    expect(
      insights.categories.find((c) => c.category === "Food")?.amount,
    ).toBe(174.08);
  });

  it("excludes income from spending insights", () => {
    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-05",
          description: "Paycheck",
          amount: 3210,
          type: "income",
          category: "Salary",
        }),
        tx({
          date: "2026-08-07",
          description: "Food",
          amount: 40,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-06",
          description: "Uber",
          amount: 20,
          type: "expense",
          category: "Transportation",
        }),
        tx({
          date: "2026-08-04",
          description: "Movie",
          amount: 15,
          type: "expense",
          category: "Entertainment",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("ready");
    expect(insights.totalNonHousingSpending).toBe(75);
    expect(insights.largestExpense?.description).toBe("Food");
    expect(insights.largestExpense?.amount).toBe(40);
  });

  it("excludes Housing from category analysis but keeps it for largest expense", () => {
    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-01",
          description: "Rent",
          amount: 1450,
          type: "expense",
          category: "Housing",
        }),
        tx({
          date: "2026-08-07",
          description: "Food",
          amount: 80,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-06",
          description: "Bus",
          amount: 20,
          type: "expense",
          category: "Transportation",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("ready");
    expect(insights.categories.map((c) => c.category)).not.toContain("Housing");
    expect(insights.totalNonHousingSpending).toBe(100);
    expect(insights.largestExpense).toMatchObject({
      description: "Rent",
      category: "Housing",
      amount: 1450,
    });
  });

  it("returns no-expenses when the month has only income", () => {
    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-05",
          description: "Paycheck",
          amount: 2000,
          type: "income",
          category: "Salary",
        }),
      ],
      "2026-08",
    );

    expect(insights).toEqual({
      month: "2026-08",
      status: "no-expenses",
      totalNonHousingSpending: 0,
      topCategory: null,
      categories: [],
      largestExpense: null,
    });
  });

  it("returns no-non-housing-expenses when every expense is Housing", () => {
    const insights = getSpendingInsights(
      [
        tx({
          id: "h1",
          date: "2026-08-01",
          description: "Rent",
          amount: 1450,
          type: "expense",
          category: "Housing",
        }),
        tx({
          id: "h2",
          date: "2026-08-02",
          description: "HOA",
          amount: 200,
          type: "expense",
          category: "Housing",
        }),
        tx({
          id: "h3",
          date: "2026-08-03",
          description: "Parking",
          amount: 50,
          type: "expense",
          category: "Housing",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("no-non-housing-expenses");
    expect(insights.topCategory).toBeNull();
    expect(insights.categories).toEqual([]);
    expect(insights.totalNonHousingSpending).toBe(0);
    expect(insights.largestExpense).toMatchObject({
      id: "h1",
      description: "Rent",
      amount: 1450,
    });
  });

  it("returns insufficient-data with largest expense when sample is too small", () => {
    const insights = getSpendingInsights(
      [
        tx({
          id: "f1",
          date: "2026-08-07",
          description: "Lunch",
          amount: 20,
          type: "expense",
          category: "Food",
        }),
        tx({
          id: "r1",
          date: "2026-08-01",
          description: "Rent",
          amount: 1450,
          type: "expense",
          category: "Housing",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("insufficient-data");
    expect(insights.topCategory).toBeNull();
    expect(insights.categories).toEqual([]);
    expect(insights.totalNonHousingSpending).toBe(20);
    expect(insights.largestExpense).toMatchObject({
      description: "Rent",
      amount: 1450,
    });
  });

  it("becomes ready at exactly three expense transactions", () => {
    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-07",
          amount: 30,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-06",
          amount: 20,
          type: "expense",
          category: "Shopping",
        }),
        tx({
          date: "2026-08-05",
          amount: 10,
          type: "expense",
          category: "Utilities",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("ready");
    expect(insights.topCategory?.category).toBe("Food");
    expect(insights.categories).toHaveLength(3);
  });

  it("breaks category amount ties by category name ascending", () => {
    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-07",
          amount: 50,
          type: "expense",
          category: "Shopping",
        }),
        tx({
          date: "2026-08-06",
          amount: 50,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-05",
          amount: 10,
          type: "expense",
          category: "Utilities",
        }),
      ],
      "2026-08",
    );

    expect(insights.status).toBe("ready");
    expect(insights.categories.map((c) => c.category)).toEqual([
      "Food",
      "Shopping",
      "Utilities",
    ]);
    expect(insights.topCategory?.category).toBe("Food");
  });

  it("breaks largest-expense amount ties by newest date then id ascending", () => {
    const byDate = getSpendingInsights(
      [
        tx({
          id: "older",
          date: "2026-08-01",
          description: "Older",
          amount: 100,
          type: "expense",
          category: "Food",
        }),
        tx({
          id: "newer",
          date: "2026-08-07",
          description: "Newer",
          amount: 100,
          type: "expense",
          category: "Shopping",
        }),
        tx({
          id: "small",
          date: "2026-08-05",
          description: "Small",
          amount: 10,
          type: "expense",
          category: "Utilities",
        }),
      ],
      "2026-08",
    );

    expect(byDate.largestExpense?.id).toBe("newer");

    const byId = getSpendingInsights(
      [
        tx({
          id: "b-id",
          date: "2026-08-07",
          description: "B",
          amount: 100,
          type: "expense",
          category: "Food",
        }),
        tx({
          id: "a-id",
          date: "2026-08-07",
          description: "A",
          amount: 100,
          type: "expense",
          category: "Shopping",
        }),
        tx({
          id: "small",
          date: "2026-08-05",
          description: "Small",
          amount: 10,
          type: "expense",
          category: "Utilities",
        }),
      ],
      "2026-08",
    );

    expect(byId.largestExpense?.id).toBe("a-id");
  });

  it("rounds percentages to one decimal place", () => {
    expect(roundPercentage(30.708)).toBe(30.7);
    expect(roundPercentage(24.883)).toBe(24.9);

    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-07",
          amount: 174.08,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-06",
          amount: 141.04,
          type: "expense",
          category: "Shopping",
        }),
        tx({
          date: "2026-08-05",
          amount: 127.42,
          type: "expense",
          category: "Utilities",
        }),
        tx({
          date: "2026-08-04",
          amount: 65.78,
          type: "expense",
          category: "Transportation",
        }),
        tx({
          date: "2026-08-03",
          amount: 58.48,
          type: "expense",
          category: "Entertainment",
        }),
      ],
      "2026-08",
    );

    expect(insights.topCategory?.percentage).toBe(30.7);
    expect(
      insights.categories.find((c) => c.category === "Shopping")?.percentage,
    ).toBe(24.9);
  });

  it("normalizes floating-point money totals", () => {
    const insights = getSpendingInsights(
      [
        tx({
          date: "2026-08-07",
          amount: 0.1,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-06",
          amount: 0.2,
          type: "expense",
          category: "Food",
        }),
        tx({
          date: "2026-08-05",
          amount: 0.1,
          type: "expense",
          category: "Shopping",
        }),
      ],
      "2026-08",
    );

    expect(insights.totalNonHousingSpending).toBe(0.4);
    expect(insights.topCategory?.amount).toBe(0.3);
    expect(insights.topCategory?.amount).not.toBe(0.1 + 0.2);
  });
});
