import express from "express";
import transactionsRouter from "./routes/transactions.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/transactions", transactionsRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
