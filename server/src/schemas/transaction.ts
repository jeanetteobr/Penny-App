import { z } from "zod";
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../types/transaction.js";

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

function isValidCalendarDate(value: string): boolean {
  if (!YYYY_MM_DD.test(value)) {
    return false;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const transactionTypeSchema = z.enum(["income", "expense"]);

export const transactionCategorySchema = z.enum(ALL_CATEGORIES);

export const transactionInputSchema = z
  .object({
    date: z
      .string()
      .regex(YYYY_MM_DD, "Date must be in YYYY-MM-DD format")
      .refine(isValidCalendarDate, "Date must be a valid calendar date"),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(120, "Description must be at most 120 characters"),
    amount: z
      .number()
      .finite("Amount must be a finite number")
      .gt(0, "Amount must be greater than 0"),
    type: transactionTypeSchema,
    category: transactionCategorySchema,
  })
  .superRefine((data, ctx) => {
    const allowed =
      data.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    if (!(allowed as readonly string[]).includes(data.category)) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: `Category "${data.category}" is not valid for type "${data.type}"`,
      });
    }
  });

export type TransactionInputParsed = z.infer<typeof transactionInputSchema>;

export const transactionListQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
  category: transactionCategorySchema.optional(),
  search: z.string().optional(),
});
