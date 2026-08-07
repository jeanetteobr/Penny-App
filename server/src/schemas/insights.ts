import { z } from "zod";
import { monthQuerySchema } from "./month.js";

export { monthQuerySchema };

export const insightsQuerySchema = z.object({
  month: monthQuerySchema.optional(),
});
