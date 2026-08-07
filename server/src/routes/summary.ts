import { Router } from "express";
import { getTransactions } from "../services/transactions.js";
import { getBudgetSummary } from "../services/summary.js";

const router: Router = Router();

router.get("/", async (_req, res) => {
  try {
    const transactions = await getTransactions();
    const summary = getBudgetSummary(transactions);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Failed to calculate budget summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
