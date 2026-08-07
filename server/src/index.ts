import express from "express";
import { closeDatabase, getDatabase } from "./db/database.js";
import insightsRouter from "./routes/insights.js";
import summaryRouter from "./routes/summary.js";
import transactionsRouter from "./routes/transactions.js";

// Initialize SQLite (create schema + seed on first run) before serving requests.
getDatabase();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/transactions", transactionsRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/insights", insightsRouter);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function shutdown() {
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
