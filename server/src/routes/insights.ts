import { Router } from "express";
import { ZodError } from "zod";
import { insightsQuerySchema } from "../schemas/insights.js";
import {
  getCurrentMonth,
  getSpendingInsights,
} from "../services/insights.js";
import { getTransactions } from "../services/transactions.js";

const router: Router = Router();

function validationError(error: ZodError) {
  return {
    error: "Validation failed",
    details: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

router.get("/", async (req, res) => {
  try {
    const query = insightsQuerySchema.parse({
      month: typeof req.query.month === "string" ? req.query.month : undefined,
    });

    const month = query.month ?? getCurrentMonth();
    const transactions = await getTransactions();
    const insights = getSpendingInsights(transactions, month);

    res.status(200).json(insights);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(validationError(error));
      return;
    }

    console.error("Failed to calculate spending insights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
