import { Router } from "express";
import { ZodError } from "zod";
import {
  transactionInputSchema,
  transactionListQuerySchema,
} from "../schemas/transaction.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/transactions.js";

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
    const query = transactionListQuerySchema.parse({
      type: typeof req.query.type === "string" ? req.query.type : undefined,
      category:
        typeof req.query.category === "string" ? req.query.category : undefined,
      search: typeof req.query.search === "string" ? req.query.search : undefined,
    });

    const search = query.search?.trim() ? query.search : undefined;
    const transactions = await getTransactions({
      type: query.type,
      category: query.category,
      search,
    });

    res.status(200).json(transactions);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(validationError(error));
      return;
    }

    console.error("Failed to list transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const input = transactionInputSchema.parse(req.body);
    const created = await createTransaction(input);
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(validationError(error));
      return;
    }

    console.error("Failed to create transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const input = transactionInputSchema.parse(req.body);
    const updated = await updateTransaction(req.params.id, input);

    if (!updated) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(validationError(error));
      return;
    }

    console.error("Failed to update transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteTransaction(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
