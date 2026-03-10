import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();    

const app = express();
const PORT = process.env.PORT || 3000;

async function initDB(){
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE         
        )`;
        console.log("Database initialized");
    }catch(error){
        console.error("Error initializing database:", error);
        process.exit(1);
    }

}
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/transactions", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
