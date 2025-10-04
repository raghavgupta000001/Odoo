import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { submitExpense, getMyExpenses } from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/submit", verifyJwt, submitExpense);
router.get("/my", verifyJwt, getMyExpenses);

export default router;
