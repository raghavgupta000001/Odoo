import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import { getPendingExpenses, updateExpenseStatus } from "../controllers/approval.controller.js";

const router = express.Router();

// Only managers or admin can access
router.get("/pending", verifyJwt, getPendingExpenses);
router.put("/:id/status", verifyJwt, updateExpenseStatus);

export default router;