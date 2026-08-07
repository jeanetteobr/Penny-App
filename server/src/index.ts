import express from "express";
import insightsRouter from "./routes/insights.js";
import summaryRouter from "./routes/summary.js";
import transactionsRouter from "./routes/transactions.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/transactions", transactionsRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/insights", insightsRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
