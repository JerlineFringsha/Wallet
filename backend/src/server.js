import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import transactionsRouter from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use("/api/transactions", transactionsRouter);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
