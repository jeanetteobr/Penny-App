import { z } from "zod";

const YYYY_MM = /^\d{4}-(0[1-9]|1[0-2])$/;

export const monthQuerySchema = z
  .string()
  .regex(YYYY_MM, 'Month must be in YYYY-MM format (e.g. "2026-08")');

export const insightsQuerySchema = z.object({
  month: monthQuerySchema.optional(),
});
