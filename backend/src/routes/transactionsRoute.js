import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
  getAllTransactions
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);
router.get("/all", getAllTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getSummaryByUserId);

export default router;
